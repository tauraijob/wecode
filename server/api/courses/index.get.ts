import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Await the Prisma instance (it's a proxy that may need initialization)
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const query = getQuery(event)
  const status = query.status as string | undefined
  const userId = query.userId as string | undefined

  // Check if user is authenticated (optional for public catalog)
  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null

  const where: any = {}
  if (status) {
    where.status = status
  } else {
    // Public endpoint shows only published courses
    where.status = 'PUBLISHED'
  }

  const courses = await prisma.course.findMany({
    where,
    include: {
      topics: {
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              order: true,
              videoDuration: true
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // If userId is provided, include enrollment status
  if (userId && auth?.userId === userId) {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      select: { courseId: true, status: true, progressPercent: true }
    })
    const enrollmentMap = new Map(enrollments.map(e => [e.courseId, e]))
    
    return courses.map(course => ({
      ...course,
      enrollment: enrollmentMap.get(course.id) || null
    }))
  }

  return courses
})

