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

  // Check if user is an instructor
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { role: true }
  })

  if (!user || user.role !== 'INSTRUCTOR') {
    throw createError({ statusCode: 403, statusMessage: 'Instructor access required' })
  }

  const query = getQuery(event)
  const status = query.status as string | undefined
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 20
  const skip = (page - 1) * limit

  const where: any = { instructorId: auth.userId }
  if (status) {
    where.status = status
  }

  const [earnings, total] = await Promise.all([
    prisma.instructorEarning.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            name: true
          }
        },
        enrollment: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        payout: {
          select: {
            id: true,
            status: true,
            processedAt: true
          }
        }
      },
      orderBy: { earnedAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.instructorEarning.count({ where })
  ])

  return {
    earnings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
})

