import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const courseId = getRouterParam(event, 'id')
  if (!courseId) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID required' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null

  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const skip = (page - 1) * limit

  // Get ratings with pagination
  const [ratings, total] = await Promise.all([
    prisma.courseRating.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.courseRating.count({
      where: { courseId }
    })
  ])

  // Calculate average rating
  const avgRating = await prisma.courseRating.aggregate({
    where: { courseId },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  })

  // Get user's rating if authenticated
  let userRating = null
  if (auth) {
    userRating = await prisma.courseRating.findUnique({
      where: {
        userId_courseId: {
          userId: auth.userId,
          courseId: courseId
        }
      }
    })
  }

  return {
    ratings,
    userRating,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    stats: {
      averageRating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(2)) : 0,
      totalRatings: avgRating._count.rating
    }
  }
})

