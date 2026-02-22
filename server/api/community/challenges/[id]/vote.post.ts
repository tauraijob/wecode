import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) throw createError({ statusCode: 401, statusMessage: 'Sign in to vote' })

    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Challenge ID required' })

    const body = await readBody(event)
    if (!body.submissionId) throw createError({ statusCode: 400, statusMessage: 'Submission ID required' })

    const submission = await prisma.challengeSubmission.findUnique({ where: { id: body.submissionId } })
    if (!submission) throw createError({ statusCode: 404, statusMessage: 'Submission not found' })

    // Can't vote on own submission
    if (submission.userId === auth.userId) {
        throw createError({ statusCode: 400, statusMessage: "You can't vote on your own submission" })
    }

    // Toggle vote
    const existing = await prisma.submissionVote.findUnique({
        where: { submissionId_userId: { submissionId: body.submissionId, userId: auth.userId } }
    })

    if (existing) {
        await prisma.submissionVote.delete({ where: { id: existing.id } })
        await prisma.challengeSubmission.update({
            where: { id: body.submissionId },
            data: { voteCount: { decrement: 1 } }
        })
        return { voted: false }
    }

    await prisma.submissionVote.create({
        data: { submissionId: body.submissionId, userId: auth.userId }
    })
    await prisma.challengeSubmission.update({
        where: { id: body.submissionId },
        data: { voteCount: { increment: 1 } }
    })

    return { voted: true }
})
