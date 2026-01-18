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
    const body = await readBody(event)

    if (!body.content) {
        throw createError({ statusCode: 400, statusMessage: 'Message content is required' })
    }

    // Verify user is part of this chat room
    const room = await prisma.chatRoom.findUnique({
        where: { id: roomId }
    })

    if (!room) {
        throw createError({ statusCode: 404, statusMessage: 'Chat room not found' })
    }

    if (room.mentorId !== auth.userId && room.menteeId !== auth.userId) {
        throw createError({ statusCode: 403, statusMessage: 'Not authorized to post in this chat' })
    }

    const message = await prisma.chatMessage.create({
        data: {
            content: body.content,
            chatRoomId: roomId,
            senderId: auth.userId
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    // Determine recipient
    const recipientId = room.mentorId === auth.userId ? room.menteeId : room.mentorId

    // Create notification for recipient
    await prisma.notification.create({
        data: {
            userId: recipientId,
            type: 'MESSAGE_RECEIVED',
            title: 'New Message',
            message: `You have a new message from ${message.sender.name}`,
            metadata: {
                chatRoomId: roomId,
                senderId: auth.userId
            }
        }
    })

    // Update room's updatedAt
    await prisma.chatRoom.update({
        where: { id: roomId },
        data: { updatedAt: new Date() }
    })

    return message
})
