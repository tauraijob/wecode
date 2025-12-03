import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { Decimal } from '~~/server/utils/db'
import { createNotification, notifyAdmins } from '~~/server/utils/notifications'

const CourseSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  currency: z.string().default('USD'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  previewVideoUrl: z.string().url().optional().or(z.literal('')),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  prerequisites: z.string().optional(),
  platformCommissionPercentage: z.coerce.number().min(0).max(100).optional(),
  examConfig: z.object({
    questionCount: z.number().int().positive(),
    duration: z.number().int().positive(), // in minutes
    passingScore: z.number().min(0).max(100) // percentage
  }).optional(),
  submitForReview: z.boolean().optional() // If true, submit for review
})

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  // Allow ADMIN and INSTRUCTOR to create courses
  if (auth.role !== 'ADMIN' && auth.role !== 'INSTRUCTOR') {
    throw createError({ statusCode: 403, statusMessage: 'Admin or Instructor access required' })
  }

  const body = await readBody(event)
  const parsed = CourseSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const { examConfig, submitForReview, platformCommissionPercentage, ...data } = parsed.data

  // Only ADMIN can set platform commission percentage
  // Instructors cannot modify this - it's set by admin
  let finalCommissionPercentage = new Decimal(30) // Default 30%
  if (auth.role === 'ADMIN' && platformCommissionPercentage !== undefined) {
    finalCommissionPercentage = new Decimal(platformCommissionPercentage)
  } else if (auth.role === 'INSTRUCTOR' && platformCommissionPercentage !== undefined) {
    // Instructors cannot set commission - ignore their input
    console.warn('Instructor attempted to set commission percentage - ignoring')
  }

  // Determine course status and review status
  let courseStatus = data.status || 'DRAFT'
  let reviewStatus: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' = 'PENDING_REVIEW'
  let submittedForReviewAt: Date | null = null

  // If instructor submits for review, set status accordingly
  if (auth.role === 'INSTRUCTOR') {
    if (submitForReview) {
      courseStatus = 'DRAFT' // Keep as draft until approved
      reviewStatus = 'PENDING_REVIEW'
      submittedForReviewAt = new Date()
    } else {
      // Instructor creating draft - no review needed yet
      reviewStatus = 'PENDING_REVIEW'
    }
  } else if (auth.role === 'ADMIN') {
    // Admin can publish directly
    reviewStatus = 'APPROVED'
    if (courseStatus === 'PUBLISHED') {
      submittedForReviewAt = new Date()
    }
  }

  const course = await prisma.course.create({
    data: {
      ...data,
      status: courseStatus as any,
      reviewStatus: reviewStatus as any,
      instructorId: auth.role === 'INSTRUCTOR' ? auth.userId : null,
      platformCommissionPercentage: finalCommissionPercentage,
      examConfig: examConfig ? examConfig as any : null,
      submittedForReviewAt: submittedForReviewAt
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      topics: {
        include: {
          lessons: true
        }
      }
    }
  })

  // Create review record
  await prisma.courseReview.create({
    data: {
      courseId: course.id,
      action: submitForReview ? 'SUBMITTED' : 'CREATED',
      reviewerId: auth.role === 'ADMIN' ? auth.userId : null
    }
  })

  // Send notifications
  if (submitForReview && auth.role === 'INSTRUCTOR') {
    // Notify admins
    await notifyAdmins({
      type: 'COURSE_SUBMITTED',
      metadata: { courseId: course.id, courseName: course.name, instructorId: auth.userId }
    })

    // Notify instructor
    await createNotification({
      userId: auth.userId,
      type: 'COURSE_SUBMITTED',
      metadata: { courseId: course.id, courseName: course.name }
    })
  } else if (auth.role === 'ADMIN') {
    // Notify admins when admin creates a course directly
    await notifyAdmins({
      type: 'COURSE_CREATED',
      metadata: { courseId: course.id, courseName: course.name, createdBy: auth.userId }
    })
  }

  return course
})

