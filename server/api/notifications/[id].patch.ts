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

    const id = event.context.params?.id

    try {
        const notification = await prisma.notification.updateMany({
            where: {
                id: id,
                userId: user.id // Ensure ownership
            },
            data: {
                read: true,
                readAt: new Date()
            }
        })

        return { success: true }
    } catch (error) {
        console.error('Failed to update notification:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update notification'
        })
    }
})
