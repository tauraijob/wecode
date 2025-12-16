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

  // Check if course exists
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  })

  if (!course) {
    throw createError({ statusCode: 404, statusMessage: 'Course not found' })
  }

  // Check if user is enrolled in the course
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: auth.userId,
        courseId: courseId
      }
    }
  })

  if (!enrollment) {
    throw createError({ statusCode: 403, statusMessage: 'You must be enrolled in the course to rate it' })
  }

  // Check if rating already exists
  const existingRating = await prisma.courseRating.findUnique({
    where: {
      userId_courseId: {
        userId: auth.userId,
        courseId: courseId
      }
    }
  })

  if (existingRating) {
    throw createError({ statusCode: 409, statusMessage: 'You have already rated this course. Use update instead.' })
  }

  // Create rating
  const courseRating = await prisma.courseRating.create({
    data: {
      rating,
      review: review || null,
      userId: auth.userId,
      courseId: courseId
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

  return courseRating
})



