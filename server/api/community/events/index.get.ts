import prisma from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const status = query.status as string || 'all'
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const skip = (page - 1) * limit

    try {
        const where: any = {}
        if (status === 'upcoming') {
            where.scheduledAt = { gte: new Date() }
            where.status = 'UPCOMING'
        } else if (status === 'past') {
            where.OR = [
                { status: 'COMPLETED' },
                { scheduledAt: { lt: new Date() } }
            ]
        }

        const [sessions, total] = await Promise.all([
            prisma.groupSession.findMany({
                where,
                skip,
                take: limit,
                orderBy: { scheduledAt: status === 'past' ? 'desc' : 'asc' },
                include: {
                    host: {
                        select: { id: true, name: true, role: true }
                    },
                    _count: { select: { rsvps: true } }
                }
            }),
            prisma.groupSession.count({ where })
        ])

        return {
            sessions: sessions.map(s => ({
                ...s,
                attendeeCount: s._count.rsvps
            })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }
    } catch (error: any) {
        console.error('Error fetching events:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch events' })
    }
})
