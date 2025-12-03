import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  
  const userId = getRouterParam(event, 'id')
  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID required' })
  }
  
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      enrollments: {
        take: 10,
        orderBy: { enrolledAt: 'desc' },
        select: {
          id: true,
          enrolledAt: true,
          course: {
            select: {
              id: true,
              name: true,
              price: true
            }
          }
        }
      },
      courses: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          price: true,
          status: true
        }
      },
      invoices: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          number: true,
          amountUsd: true,
          currency: true,
          status: true,
          createdAt: true
        }
      },
      _count: {
        select: {
          enrollments: true,
          courses: true,
          invoices: true,
          orders: true,
          certificates: true
        }
      }
    }
  })
  
  if (!userData) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }
  
  return userData
})

