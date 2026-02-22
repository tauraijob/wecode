import prisma from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const category = query.category as string || 'all'
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const skip = (page - 1) * limit

    try {
        const where: any = {}
        if (category !== 'all') {
            where.category = category
        }

        const [resources, total] = await Promise.all([
            prisma.resource.findMany({
                where,
                skip,
                take: limit,
                orderBy: { upvoteCount: 'desc' },
                include: {
                    author: { select: { id: true, name: true } }
                }
            }),
            prisma.resource.count({ where })
        ])

        // Get unique categories
        const categories = await prisma.resource.findMany({
            select: { category: true },
            distinct: ['category']
        })

        return {
            resources,
            categories: categories.map(c => c.category),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        }
    } catch (error: any) {
        console.error('Error fetching resources:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch resources' })
    }
})
