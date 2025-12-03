import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { createNotification, notifyAdmins } from '~~/server/utils/notifications'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  if (auth.role !== 'INSTRUCTOR') {
    throw createError({ statusCode: 403, statusMessage: 'Instructor access required' })
  }

  const courseId = getRouterParam(event, 'id')
  if (!courseId) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID required' })
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

  // Verify instructor owns the course
  if (course.instructorId !== auth.userId) {
    throw createError({ statusCode: 403, statusMessage: 'You can only submit your own courses' })
  }

  // Check if already submitted or approved
  if (course.reviewStatus === 'APPROVED') {
    throw createError({ statusCode: 400, statusMessage: 'Course is already approved' })
  }

  if (course.reviewStatus === 'PENDING_REVIEW') {
    throw createError({ statusCode: 400, statusMessage: 'Course is already pending review' })
  }

  // Update course
  const updated = await prisma.course.update({
    where: { id: courseId },
    data: {
      reviewStatus: 'PENDING_REVIEW',
      submittedForReviewAt: new Date(),
      status: 'DRAFT' // Keep as draft until approved
    },
    include: {
      instructor: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  // Create review record
  await prisma.courseReview.create({
    data: {
      courseId: course.id,
      action: 'SUBMITTED',
      reviewerId: null
    }
  })

  // Notify admins
  await notifyAdmins({
    type: 'COURSE_SUBMITTED',
    title: 'New Course Submitted for Review',
    message: `Course "${course.name}" has been submitted for review by ${course.instructor?.name || 'an instructor'}.`,
    metadata: { courseId: course.id, instructorId: auth.userId }
  })

  // Notify instructor
  await createNotification({
    userId: auth.userId,
    type: 'COURSE_SUBMITTED',
    title: 'Course Submitted for Review',
    message: `Your course "${course.name}" has been submitted for review. You will be notified once it's reviewed.`,
    metadata: { courseId: course.id }
  })

  return updated
})



