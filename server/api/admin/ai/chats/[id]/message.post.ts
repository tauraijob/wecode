import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const chatId = getRouterParam(event, 'id')
    const { content } = await readBody(event)

    if (!content) throw createError({ statusCode: 400, statusMessage: 'Message content is required' })

    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { role: true } })
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMMUNITY_ADMIN')) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const message = await prisma.supportMessage.create({
        data: {
            chatId: chatId!,
            role: 'assistant', // Admin replies count as the "assistant" role for the UI
            content
        }
    })

    // Update chat timestamp
    await prisma.supportChat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() }
    })

    return message
})
