import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth || auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  const enrollments = await prisma.enrollment.findMany({
    include: {
      user: {
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
      }
    },
    orderBy: { enrolledAt: 'desc' }
  })

  return enrollments
})





