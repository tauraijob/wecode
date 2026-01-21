import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { sendMail } from '~~/server/utils/mailer'
import { forumLikeNotification } from '~~/server/utils/email-templates'

/**
 * Like or dislike a forum post
 * POST /api/community/posts/[id]/like
 * Body: { type: 'LIKE' | 'DISLIKE' }
 * 
 * - If user already has same type vote, removes it (toggle off)
 * - If user has opposite type vote, switches it
 * - Notifies post author when someone likes their post (not for dislikes)
 */
export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    // Verify authentication
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'You must be logged in to like posts' })
    }

    const postId = getRouterParam(event, 'id')
    if (!postId) {
        throw createError({ statusCode: 400, statusMessage: 'Post ID is required' })
    }

    const body = await readBody(event)
    const type = body.type?.toUpperCase()

    if (!type || !['LIKE', 'DISLIKE'].includes(type)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid vote type. Must be LIKE or DISLIKE' })
    }

    // Get the post and check if it exists
    const post = await prisma.forumPost.findUnique({
        where: { id: postId },
        include: {
            author: {
                select: { id: true, name: true, email: true }
            }
        }
    })

    if (!post) {
        throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    }

    // Get current user
    const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { id: true, name: true }
    })

    // Check for existing vote
    const existingVote = await prisma.forumLike.findUnique({
        where: {
            userId_postId: {
                userId: auth.userId,
                postId
            }
        }
    })

    let action: 'created' | 'removed' | 'changed'
    let resultType: string | null = null

    if (existingVote) {
        if (existingVote.type === type) {
            // Same type - toggle off (remove vote)
            await prisma.forumLike.delete({
                where: { id: existingVote.id }
            })
            action = 'removed'
            resultType = null
        } else {
            // Different type - switch vote
            await prisma.forumLike.update({
                where: { id: existingVote.id },
                data: { type }
            })
            action = 'changed'
            resultType = type
        }
    } else {
        // New vote
        await prisma.forumLike.create({
            data: {
                type,
                userId: auth.userId,
                postId
            }
        })
        action = 'created'
        resultType = type

        // Send notification to post author for new LIKES only
        if (type === 'LIKE' && post.author.id !== auth.userId && post.author.email) {
            const isDevelopment = process.env.NODE_ENV === 'development'
            let baseUrl = process.env.SITE_URL || (isDevelopment ? 'http://localhost:3000' : 'https://wecode.co.zw')

            if (!isDevelopment && baseUrl.includes('localhost')) {
                baseUrl = 'https://wecode.co.zw'
            }

            const postUrl = `${baseUrl}/community/post/${postId}`

            try {
                await sendMail({
                    to: post.author.email,
                    subject: `${user?.name || 'Someone'} liked your post!`,
                    html: forumLikeNotification(
                        post.author.name,
                        user?.name || 'Someone',
                        post.title,
                        postUrl
                    )
                })
            } catch (emailError) {
                console.error('Failed to send like notification:', emailError)
            }
        }
    }

    // Get updated counts
    const [likes, dislikes] = await Promise.all([
        prisma.forumLike.count({ where: { postId, type: 'LIKE' } }),
        prisma.forumLike.count({ where: { postId, type: 'DISLIKE' } })
    ])

    return {
        success: true,
        action,
        userVote: resultType,
        likes,
        dislikes
    }
})
