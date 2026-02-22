import prisma from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const status = query.status as string || 'active'
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const skip = (page - 1) * limit

    try {
        const now = new Date()
        const where: any = {}

        if (status === 'active') {
            where.startsAt = { lte: now }
            where.endsAt = { gte: now }
        } else if (status === 'upcoming') {
            where.startsAt = { gt: now }
        } else if (status === 'past') {
            where.endsAt = { lt: now }
        }

        const [challenges, total] = await Promise.all([
            prisma.codingChallenge.findMany({
                where,
                skip,
                take: limit,
                orderBy: { startsAt: status === 'past' ? 'desc' : 'asc' },
                include: {
                    createdBy: { select: { id: true, name: true } },
                    _count: { select: { submissions: true } }
                }
            }),
            prisma.codingChallenge.count({ where })
        ])

        return {
            challenges: challenges.map(c => ({
                ...c,
                submissionCount: c._count.submissions
            })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }
    } catch (error: any) {
        console.error('Error fetching challenges:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch challenges' })
    }
})
