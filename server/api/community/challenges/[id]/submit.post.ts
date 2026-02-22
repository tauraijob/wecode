import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) throw createError({ statusCode: 401, statusMessage: 'Sign in to submit' })

    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Challenge ID required' })

    const challenge = await prisma.codingChallenge.findUnique({ where: { id } })
    if (!challenge) throw createError({ statusCode: 404, statusMessage: 'Challenge not found' })

    const now = new Date()
    if (now < challenge.startsAt || now > challenge.endsAt) {
        throw createError({ statusCode: 400, statusMessage: 'Challenge is not currently active' })
    }

    const body = await readBody(event)
    if (!body.code || !body.language) {
        throw createError({ statusCode: 400, statusMessage: 'Code and language are required' })
    }

    // Upsert submission (one per user per challenge)
    const submission = await prisma.challengeSubmission.upsert({
        where: { challengeId_userId: { challengeId: id, userId: auth.userId } },
        update: {
            code: body.code,
            language: body.language,
            description: body.description || null
        },
        create: {
            challengeId: id,
            userId: auth.userId,
            code: body.code,
            language: body.language,
            description: body.description || null
        }
    })

    // Award XP for first submission
    await prisma.user.update({
        where: { id: auth.userId },
        data: { xp: { increment: 15 } }
    })

    return submission
})
