import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
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





