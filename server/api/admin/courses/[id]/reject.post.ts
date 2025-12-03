import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { createNotification } from '~~/server/utils/notifications'

const RejectSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required')
})

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth || auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  const courseId = getRouterParam(event, 'id')
  if (!courseId) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID required' })
  }

  const body = await readBody(event)
  const parsed = RejectSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  // Find course
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  if (!course) {
    throw createError({ statusCode: 404, statusMessage: 'Course not found' })
  }

  // Update course
  const updated = await prisma.course.update({
    where: { id: courseId },
    data: {
      reviewStatus: 'REJECTED',
      status: 'DRAFT',
      reviewedAt: new Date(),
      reviewedById: auth.userId,
      rejectionReason: parsed.data.reason
    },
    include: {
      instructor: {
        select: { id: true, name: true, email: true }
      },
      reviewer: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  // Create review record
  await prisma.courseReview.create({
    data: {
      courseId: course.id,
      action: 'REJECTED',
      comment: parsed.data.reason,
      reviewerId: auth.userId
    }
  })

  // Notify instructor
  if (course.instructorId) {
    await createNotification({
      userId: course.instructorId,
      type: 'COURSE_REJECTED',
      title: 'Course Rejected',
      message: `Your course "${course.name}" has been rejected. Reason: ${parsed.data.reason}`,
      metadata: { courseId: course.id, reason: parsed.data.reason }
    })
  }

  return updated
})



