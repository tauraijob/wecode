import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth || auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  const query = getQuery(event)
  const status = query.status as string | undefined

  const where: any = {}
  if (status) {
    where.status = status
  }

  const payouts = await prisma.payout.findMany({
    where,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      earnings: {
        include: {
          course: {
            select: {
              name: true
            }
          }
        }
      },
      processedBy: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: { requestedAt: 'desc' }
  })

  return payouts
})



