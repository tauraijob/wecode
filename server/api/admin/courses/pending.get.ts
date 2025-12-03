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
    where: {
      reviewStatus: 'PENDING_REVIEW'
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      topics: {
        include: {
          lessons: true
        }
      },
      reviews: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    },
    orderBy: {
      submittedForReviewAt: 'desc'
    }
  })

  return courses
})



