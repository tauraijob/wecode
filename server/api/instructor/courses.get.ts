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

  const courses = await prisma.course.findMany({
    where: {
      instructorId: auth.userId
    },
    include: {
      topics: {
        include: {
          lessons: true
        }
      },
      enrollments: {
        select: {
          id: true,
          status: true
        }
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return courses
})



