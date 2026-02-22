import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
    }

    const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { role: true } })
    if (!user || !['ADMIN', 'COMMUNITY_ADMIN'].includes(user.role)) {
        throw createError({ statusCode: 403, statusMessage: 'Only admins can create challenges' })
    }

    const body = await readBody(event)
    if (!body.title || !body.description || !body.startsAt || !body.endsAt) {
        throw createError({ statusCode: 400, statusMessage: 'Title, description, start date, and end date are required' })
    }

    const challenge = await prisma.codingChallenge.create({
        data: {
            title: body.title.trim(),
            description: body.description.trim(),
            difficulty: body.difficulty || 'MEDIUM',
            startsAt: new Date(body.startsAt),
            endsAt: new Date(body.endsAt),
            tags: body.tags || null,
            createdById: auth.userId
        }
    })

    return challenge
})
