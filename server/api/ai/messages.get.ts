import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const { chatId } = getQuery(event)
    if (!chatId) throw createError({ statusCode: 400, statusMessage: 'Chat ID required' })

    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    const userId = auth?.userId || null
    const guestId = getCookie(event, 'tau_guest_id')

    const chat = await prisma.supportChat.findUnique({
        where: { id: chatId as string }
    })

    if (!chat) throw createError({ statusCode: 404, statusMessage: 'Chat not found' })

    // Security check: ensure the chat belongs to the user or guest
    if (chat.userId && chat.userId !== userId) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    if (chat.guestId && chat.guestId !== guestId) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

    const messages = await prisma.supportMessage.findMany({
        where: { chatId: chatId as string },
        orderBy: { createdAt: 'asc' }
    })

    return {
        messages,
        status: chat.status
    }
})
