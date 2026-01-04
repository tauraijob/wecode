import prismaModule from './db'
import { formatNotificationMessage } from './notification-templates'
import { sendMail } from './mailer'

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

    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title,
        message,
        metadata: data.metadata || null
      }
    })

    // Send email for user-facing events
    const userEmailTypes = ['COURSE_APPROVED', 'COURSE_REJECTED']
    if (userEmailTypes.includes(data.type)) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: data.userId },
          select: { email: true, name: true }
        })

        if (user?.email) {
          const { getAdminNotificationTemplate } = await import('~~/server/utils/email-templates')
          const { html, text } = getAdminNotificationTemplate(title, message, data.metadata)

          await sendMail({
            to: user.email,
            subject: `${title} — WeCodeZW`,
            html,
            text
          })
        }
      } catch (emailError) {
        console.error('Failed to send user email notification:', emailError)
      }
    }

    return notification
  } catch (error) {
    console.error('Failed to create notification:', error)
    return null
  }
}

/**
 * Create notifications for multiple users (e.g., all admins) with rich templates
 * Also sends email notifications for course-related events
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

    // Create in-app notifications for admins
    await Promise.all(
      admins.map((admin: any) =>
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

    // Send email notification for course-related events
    const courseNotificationTypes = [
      'ENROLLMENT_CREATED',
      'ENROLLMENT_CANCELLED',
      'PAYMENT_SUCCESS',
      'INVOICE_CREATED',
      'USER_REGISTERED',
      'COURSE_SUBMITTED',
      'INSTRUCTOR_REGISTERED'
    ]

    if (courseNotificationTypes.includes(data.type)) {
      try {
        const { getAdminNotificationTemplate } = await import('~~/server/utils/email-templates')
        const { html, text } = getAdminNotificationTemplate(title, message, data.metadata)
        const adminEmail = process.env.MAIL_TO || process.env.MAIL_FROM || 'info@wecode.co.zw'

        await sendMail({
          to: adminEmail,
          subject: `${title} — WeCodeZW`,
          html,
          text
        })
      } catch (emailError) {
        console.error('Failed to send admin email notification:', emailError)
        // Don't fail the entire notification if email fails
      }
    }
  } catch (error) {
    console.error('Failed to notify admins:', error)
  }
}



