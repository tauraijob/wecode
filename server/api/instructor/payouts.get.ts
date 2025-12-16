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

  const payouts = await prisma.payout.findMany({
    where: { instructorId: auth.userId },
    include: {
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



