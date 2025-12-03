import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { createNotification } from '~~/server/utils/notifications'

const ApproveSchema = z.object({
  publish: z.boolean().optional().default(true) // Whether to publish immediately
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
  const parsed = ApproveSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
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
      reviewStatus: 'APPROVED',
      status: parsed.data.publish ? 'PUBLISHED' : 'DRAFT',
      reviewedAt: new Date(),
      reviewedById: auth.userId,
      rejectionReason: null
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
      action: 'APPROVED',
      comment: parsed.data.publish ? 'Course approved and published' : 'Course approved',
      reviewerId: auth.userId
    }
  })

  // Notify instructor
  if (course.instructorId) {
    await createNotification({
      userId: course.instructorId,
      type: 'COURSE_APPROVED',
      title: 'Course Approved',
      message: `Your course "${course.name}" has been approved${parsed.data.publish ? ' and published' : ''}.`,
      metadata: { courseId: course.id }
    })
  }

  return updated
})



