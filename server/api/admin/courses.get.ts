import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  try {
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

    return courses || []
  } catch (error) {
    console.error('[admin/courses] Database error:', error)
    // Return empty array instead of throwing 500 to prevent frontend crash
    return []
  }
})
