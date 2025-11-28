import prisma, { Decimal } from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const lessonId = getRouterParam(event, 'id')
  if (!lessonId) {
    throw createError({ statusCode: 400, statusMessage: 'Lesson ID required' })
  }

  const body = await readBody(event)
  const enrollmentId = body.enrollmentId as string

  if (!enrollmentId) {
    throw createError({ statusCode: 400, statusMessage: 'Enrollment ID required' })
  }

  // Verify enrollment belongs to user
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: {
          topics: {
            include: {
              lessons: true
            }
          }
        }
      }
    }
  })

  if (!enrollment || enrollment.userId !== auth.userId) {
    throw createError({ statusCode: 404, statusMessage: 'Enrollment not found' })
  }

  // Mark lesson as completed
  const progress = await prisma.lessonProgress.upsert({
    where: {
      enrollmentId_lessonId: {
        enrollmentId,
        lessonId
      }
    },
    update: {
      completed: true,
      completedAt: new Date(),
      watchedAt: new Date()
    },
    create: {
      enrollmentId,
      lessonId,
      completed: true,
      completedAt: new Date(),
      watchedAt: new Date()
    }
  })

  // Recalculate course progress
  const totalLessons = enrollment.course.topics.reduce((sum, topic) => sum + topic.lessons.length, 0)
  const completedProgress = await prisma.lessonProgress.findMany({
    where: {
      enrollmentId,
      completed: true
    }
  })
  const completedLessons = completedProgress.length
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  // Update enrollment progress
  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progressPercent: new Decimal(progressPercent.toFixed(2)),
      status: completedLessons === totalLessons && totalLessons > 0 ? 'COMPLETED' : 'ACTIVE',
      completedAt: completedLessons === totalLessons && totalLessons > 0 ? new Date() : null
    }
  })

  return progress
})

