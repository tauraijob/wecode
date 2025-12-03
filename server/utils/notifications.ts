import prismaModule from './db'
import { formatNotificationMessage } from './notification-templates'

/**
 * Create a notification for a user with rich templates
 */
export async function createNotification(data: {
  userId: string
  type: string
  title?: string
  message?: string
  metadata?: any
}) {
  const prisma = await prismaModule
  if (!prisma) return null

  try {
    // Use template if title/message not provided, otherwise use provided values
    const { title, message } = data.title && data.message
      ? { title: data.title, message: data.message }
      : formatNotificationMessage(data.type, data.metadata || {}, data.title || '', data.message || '')

    return await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title,
        message,
        metadata: data.metadata || null
      }
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
    return null
  }
}

/**
 * Create notifications for multiple users (e.g., all admins) with rich templates
 */
export async function notifyAdmins(data: {
  type: string
  title?: string
  message?: string
  metadata?: any
}) {
  const prisma = await prismaModule
  if (!prisma) return

  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    })

    // Use template if title/message not provided
    const { title, message } = data.title && data.message
      ? { title: data.title, message: data.message }
      : formatNotificationMessage(data.type, data.metadata || {}, data.title || '', data.message || '')

    await Promise.all(
      admins.map(admin =>
        prisma.notification.create({
          data: {
            userId: admin.id,
            type: data.type,
            title,
            message,
            metadata: data.metadata || null
          }
        })
      )
    )
  } catch (error) {
    console.error('Failed to notify admins:', error)
  }
}



