import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) throw createError({ statusCode: 401, statusMessage: 'Sign in to share resources' })

    const body = await readBody(event)
    if (!body.title || !body.url || !body.category) {
        throw createError({ statusCode: 400, statusMessage: 'Title, URL, and category are required' })
    }

    const resource = await prisma.resource.create({
        data: {
            title: body.title.trim(),
            url: body.url.trim(),
            description: body.description?.trim() || null,
            category: body.category,
            authorId: auth.userId
        },
        include: {
            author: { select: { id: true, name: true } }
        }
    })

    // Award XP for sharing
    await prisma.user.update({
        where: { id: auth.userId },
        data: { xp: { increment: 10 } }
    })

    return resource
})
