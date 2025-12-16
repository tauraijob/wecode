import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

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
    throw createError({ statusCode: 403, statusMessage: 'You can only delete your own rating' })
  }

  // Delete rating
  await prisma.courseRating.delete({
    where: { id: existingRating.id }
  })

  return { ok: true, message: 'Rating deleted successfully' }
})



