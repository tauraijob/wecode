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

  const topicId = getRouterParam(event, 'topicId')
  if (!topicId) {
    throw createError({ statusCode: 400, statusMessage: 'Topic ID required' })
  }

  await prisma.topic.delete({
    where: { id: topicId }
  })

  return { success: true }
})



