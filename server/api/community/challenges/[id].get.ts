import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Challenge ID required' })

    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null

    const challenge = await prisma.codingChallenge.findUnique({
        where: { id },
        include: {
            createdBy: { select: { id: true, name: true } },
            submissions: {
                orderBy: { voteCount: 'desc' },
                include: {
                    user: { select: { id: true, name: true } },
                    _count: { select: { votes: true } }
                }
            },
            _count: { select: { submissions: true } }
        }
    })

    if (!challenge) {
        throw createError({ statusCode: 404, statusMessage: 'Challenge not found' })
    }

    // Check if user already submitted
    let hasSubmitted = false
    let userVotes: string[] = []
    if (auth) {
        hasSubmitted = challenge.submissions.some(s => s.userId === auth.userId)
        const votes = await prisma.submissionVote.findMany({
            where: { userId: auth.userId, submissionId: { in: challenge.submissions.map(s => s.id) } },
            select: { submissionId: true }
        })
        userVotes = votes.map(v => v.submissionId)
    }

    return {
        ...challenge,
        hasSubmitted,
        userVotes
    }
})
