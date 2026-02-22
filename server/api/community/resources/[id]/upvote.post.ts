import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) throw createError({ statusCode: 401, statusMessage: 'Sign in to upvote' })

    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Resource ID required' })

    const resource = await prisma.resource.findUnique({ where: { id } })
    if (!resource) throw createError({ statusCode: 404, statusMessage: 'Resource not found' })

    // Toggle upvote
    const existing = await prisma.resourceUpvote.findUnique({
        where: { resourceId_userId: { resourceId: id, userId: auth.userId } }
    })

    if (existing) {
        await prisma.resourceUpvote.delete({ where: { id: existing.id } })
        await prisma.resource.update({ where: { id }, data: { upvoteCount: { decrement: 1 } } })
        return { upvoted: false }
    }

    await prisma.resourceUpvote.create({ data: { resourceId: id, userId: auth.userId } })
    await prisma.resource.update({ where: { id }, data: { upvoteCount: { increment: 1 } } })

    return { upvoted: true }
})
