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

