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
  const instructorId = query.instructorId as string | undefined

  const where: any = {}
  if (instructorId) {
    where.instructorId = instructorId
  }

  const earnings = await prisma.instructorEarning.findMany({
    where,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
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
              name: true,
              email: true
            }
          }
        }
      },
      payout: {
        select: {
          id: true,
          status: true
        }
      }
    },
    orderBy: { earnedAt: 'desc' },
    take: 100
  })

  // Group by instructor for summary
  const summary = earnings.reduce((acc, earning) => {
    const instructorId = earning.instructorId
    if (!acc[instructorId]) {
      acc[instructorId] = {
        instructor: earning.instructor,
        totalEarnings: 0,
        pendingEarnings: 0,
        paidEarnings: 0,
        count: 0
      }
    }
    
    acc[instructorId].totalEarnings += Number(earning.amount)
    acc[instructorId].count++
    
    if (earning.status === 'PENDING') {
      acc[instructorId].pendingEarnings += Number(earning.amount)
    } else if (earning.status === 'PAID') {
      acc[instructorId].paidEarnings += Number(earning.amount)
    }
    
    return acc
  }, {} as Record<string, any>)

  return {
    earnings,
    summary: Object.values(summary)
  }
})

