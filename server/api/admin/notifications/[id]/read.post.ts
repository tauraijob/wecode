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

  const notificationId = getRouterParam(event, 'id')
  if (!notificationId) {
    throw createError({ statusCode: 400, statusMessage: 'Notification ID required' })
  }

  // Verify notification belongs to admin
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId }
  })

  if (!notification) {
    throw createError({ statusCode: 404, statusMessage: 'Notification not found' })
  }

  if (notification.userId !== auth.userId) {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      read: true,
      readAt: new Date()
    }
  })

  return updated
})



