import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = event.context.user
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20 // Limit to recent 20
        })

        const unreadCount = await prisma.notification.count({
            where: {
                userId: user.id,
                read: false
            }
        })

        return {
            notifications,
            unreadCount
        }
    } catch (error) {
        console.error('Failed to fetch notifications:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch notifications'
        })
    }
})
