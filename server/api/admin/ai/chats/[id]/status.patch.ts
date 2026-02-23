import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const chatId = getRouterParam(event, 'id')
    const { status } = await readBody(event)

    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { role: true, name: true } })
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMMUNITY_ADMIN')) {
        console.warn(`Unauthorized takeover attempt by User: ${user?.name} (Role: ${user?.role}) on Chat: ${chatId}`)
        throw createError({ statusCode: 403, statusMessage: 'Forbidden: You do not have permission to join this chat' })
    }

    const chat = await prisma.supportChat.update({
        where: { id: chatId },
        data: {
            status: status || 'HUMAN_ACTIVE',
            adminId: status === 'CLOSED' ? null : auth.userId
        }
    })

    return chat
})
