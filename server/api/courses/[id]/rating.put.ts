import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'

const RatingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const courseId = getRouterParam(event, 'id')
  if (!courseId) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID required' })
  }

  const body = await readBody(event)
  const parsed = RatingSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const { rating, review } = parsed.data

  // Find existing rating
  const existingRating = await prisma.courseRating.findUnique({
    where: {
      userId_courseId: {
        userId: auth.userId,
        courseId: courseId
      }
    }
  })

  if (!existingRating) {
    throw createError({ statusCode: 404, statusMessage: 'Rating not found' })
  }

  if (existingRating.userId !== auth.userId) {
    throw createError({ statusCode: 403, statusMessage: 'You can only update your own rating' })
  }

  // Update rating
  const updatedRating = await prisma.courseRating.update({
    where: { id: existingRating.id },
    data: {
      rating,
      review: review !== undefined ? review : existingRating.review
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })

  return updatedRating
})



