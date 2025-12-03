import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: {
          enrollments: true,
          topics: true
        }
      },
      topics: {
        include: {
          _count: {
            select: {
              lessons: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return courses
})

