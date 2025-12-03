import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth || auth.role !== 'INSTRUCTOR') {
    throw createError({ statusCode: 403, statusMessage: 'Instructor access required' })
  }

  const query = getQuery(event)
  const unreadOnly = query.unreadOnly === 'true'

  const where: any = {
    userId: auth.userId
  }

  if (unreadOnly) {
    where.read = false
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    },
    take: query.limit ? parseInt(query.limit as string) : 50
  })

  const unreadCount = await prisma.notification.count({
    where: {
      userId: auth.userId,
      read: false
    }
  })

  return {
    notifications,
    unreadCount
  }
})



