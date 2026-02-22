import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { role: true } })
    if (!user || (user.role !== 'ADMIN' && user.role !== 'COMMUNITY_ADMIN')) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    await prisma.aIKnowledgeBase.delete({
        where: { id }
    })

    return { ok: true }
})
