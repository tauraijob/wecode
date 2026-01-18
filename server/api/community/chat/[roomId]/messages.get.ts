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

    const roomId = getRouterParam(event, 'roomId')

    // Verify user is part of this chat room
    const room = await prisma.chatRoom.findUnique({
        where: { id: roomId }
    })

    if (!room) {
        throw createError({ statusCode: 404, statusMessage: 'Chat room not found' })
    }

    if (room.mentorId !== auth.userId && room.menteeId !== auth.userId) {
        throw createError({ statusCode: 403, statusMessage: 'Not authorized to view this chat' })
    }

    const messages = await prisma.chatMessage.findMany({
        where: { chatRoomId: roomId },
        orderBy: { createdAt: 'asc' },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    return messages
})
