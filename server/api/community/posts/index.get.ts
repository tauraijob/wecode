import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Get all forum posts with author info and comment count
 * Public access - anyone can view posts
 */
export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 20
    const skip = (page - 1) * limit

    try {
        const [posts, total] = await Promise.all([
            prisma.forumPost.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            role: true
                        }
                    },
                    _count: {
                        select: { comments: true }
                    }
                }
            }),
            prisma.forumPost.count()
        ])

        // Try to get community profiles separately if they exist
        const authorIds = posts.map(p => p.authorId)
        let profileMap: Record<string, any> = {}

        try {
            const profiles = await (prisma as any).communityProfile?.findMany({
                where: { userId: { in: authorIds } },
                select: { userId: true, username: true, avatarUrl: true }
            })
            if (profiles) {
                profileMap = profiles.reduce((acc: any, p: any) => {
                    acc[p.userId] = p
                    return acc
                }, {})
            }
        } catch (e) {
            // Community profiles not available yet, that's fine
        }

        return {
            posts: posts.map(post => ({
                ...post,
                commentCount: post._count.comments,
                author: {
                    ...post.author,
                    communityProfile: profileMap[post.authorId] || null
                }
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error: any) {
        console.error('Error fetching posts:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch posts'
        })
    }
})
