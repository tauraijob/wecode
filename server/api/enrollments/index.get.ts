import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const query = getQuery(event)
  const userId = (query.userId as string) || auth.userId

  // Only admins can view other users' enrollments
  if (userId !== auth.userId && auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { 
      userId,
      status: {
        not: 'CANCELLED' // Only exclude cancelled enrollments - show PENDING so users can cancel them
      }
    },
    include: {
      course: {
        select: {
          id: true,
          name: true,
          description: true,
          thumbnailUrl: true,
          price: true,
          currency: true
        }
      },
      invoice: {
        select: {
          id: true,
          number: true,
          status: true
        }
      },
      progress: {
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              order: true
            }
          }
        }
      },
      _count: {
        select: {
          progress: true
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  })

  return enrollments
})

