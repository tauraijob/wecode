import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  if (auth.role !== 'INSTRUCTOR') {
    throw createError({ statusCode: 403, statusMessage: 'Instructor access required' })
  }

  const courseId = getRouterParam(event, 'id')
  if (!courseId) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID required' })
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: { id: true, name: true, email: true }
      },
      topics: {
        include: {
          lessons: true
        },
        orderBy: { order: 'asc' }
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    }
  })

  if (!course) {
    throw createError({ statusCode: 404, statusMessage: 'Course not found' })
  }

  // Verify instructor owns the course
  if (course.instructorId !== auth.userId) {
    throw createError({ statusCode: 403, statusMessage: 'You can only view your own courses' })
  }

  return course
})



