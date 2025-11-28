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

  const enrollmentId = getRouterParam(event, 'id')
  if (!enrollmentId) {
    throw createError({ statusCode: 400, statusMessage: 'Enrollment ID required' })
  }

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
      },
      progress: true
    }
  })

  if (!enrollment) {
    throw createError({ statusCode: 404, statusMessage: 'Enrollment not found' })
  }

  // Only allow users to update their own enrollments, unless they're admin
  if (enrollment.userId !== auth.userId && auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  const body = await readBody(event).catch(() => ({}))
  const statusOverride = body.status as string | undefined

  // If admin is setting status directly, use that
  if (auth.role === 'ADMIN' && statusOverride) {
    const updated = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: statusOverride as any,
        completedAt: statusOverride === 'COMPLETED' ? new Date() : null
      }
    })
    return updated
  }

  // Otherwise, calculate based on progress
  const totalLessons = enrollment.course.topics.reduce((sum, topic) => sum + topic.lessons.length, 0)
  const completedLessons = enrollment.progress.filter(p => p.completed).length

  // Update progress percentage
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  // Mark as completed if all lessons are done
  const isCompleted = completedLessons === totalLessons && totalLessons > 0

  const updated = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progressPercent: new Decimal(progressPercent.toFixed(2)),
      status: isCompleted ? 'COMPLETED' : 'ACTIVE',
      completedAt: isCompleted ? new Date() : null
    }
  })

  return updated
})

