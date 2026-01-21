import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

/**
 * Get a single forum post with its comments
 * Public access
 * Also increments view count
 */
export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Post ID is required' })
    }

    // Increment view count
    await prisma.forumPost.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
    }).catch(() => {
        // Ignore error if post doesn't exist (will be caught below)
    })

    // Get current user (optional)
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null

    const post = await prisma.forumPost.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                    communityProfile: {
                        select: { avatarUrl: true, username: true }
                    }
                }
            },
            comments: {
                orderBy: { createdAt: 'asc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            role: true,
                            communityProfile: {
                                select: { avatarUrl: true, username: true }
                            }
                        }
                    }
                }
            },
            _count: {
                select: {
                    likes: true
                }
            }
        }
    })

    if (!post) {
        throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    }

    // Get like/dislike counts
    const [likes, dislikes] = await Promise.all([
        prisma.forumLike.count({ where: { postId: id, type: 'LIKE' } }),
        prisma.forumLike.count({ where: { postId: id, type: 'DISLIKE' } })
    ])

    // Get current user's vote if authenticated
    let userVote: string | null = null
    if (auth) {
        const vote = await prisma.forumLike.findUnique({
            where: {
                userId_postId: {
                    userId: auth.userId,
                    postId: id
                }
            }
        })
        userVote = vote?.type || null
    }

    return {
        ...post,
        likes,
        dislikes,
        userVote
    }
})
