import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { sendMail } from '~~/server/utils/mailer'
import { forumReplyNotification, mentionNotification } from '~~/server/utils/email-templates'

/**
 * Add a comment to a forum post
 * Requires authentication
 * Sends email notification to post author
 * Detects and notifies @mentioned users
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
        throw createError({ statusCode: 401, statusMessage: 'You must be logged in to comment' })
    }

    const postId = getRouterParam(event, 'id')
    if (!postId) {
        throw createError({ statusCode: 400, statusMessage: 'Post ID is required' })
    }

    const body = await readBody(event)

    if (!body.content || body.content.trim().length < 2) {
        throw createError({ statusCode: 400, statusMessage: 'Comment content is required (min 2 characters)' })
    }

    // Verify post exists and get author info
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

    // Get commenter info
    const commenter = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { id: true, name: true }
    })

    const comment = await prisma.forumComment.create({
        data: {
            content: body.content.trim(),
            authorId: auth.userId,
            postId
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            }
        }
    })

    // Determine if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development'

    // Get site URL with production fallback
    let baseUrl = process.env.SITE_URL || (isDevelopment ? 'http://localhost:3000' : 'https://wecode.co.zw')

    // CRITICAL: In production, NEVER allow localhost URLs
    if (!isDevelopment && baseUrl.includes('localhost')) {
        console.warn(`Warning: SITE_URL contains localhost in production. Forcing https://wecode.co.zw`)
        baseUrl = 'https://wecode.co.zw'
    }

    const postUrl = `${baseUrl}/community/post/${postId}`

    // 1. Notify post author (if not the commenter)
    if (post.author.id !== auth.userId && post.author.email) {
        try {
            await sendMail({
                to: post.author.email,
                subject: `New reply to your post: "${post.title.substring(0, 50)}..."`,
                html: forumReplyNotification(
                    post.author.name,
                    post.title,
                    commenter?.name || 'Someone',
                    body.content.trim(),
                    postUrl
                )
            })
        } catch (emailError) {
            console.error('Failed to send comment notification:', emailError)
        }
    }

    // 2. Detect and notify @mentions
    const mentionRegex = /@(\w+)/g
    const mentions = body.content.match(mentionRegex)

    if (mentions && mentions.length > 0) {
        const usernames = mentions.map((m: string) => m.slice(1).toLowerCase())
        const uniqueUsernames = [...new Set(usernames)]

        // Find users by username in community profile
        const mentionedProfiles = await prisma.communityProfile.findMany({
            where: {
                username: { in: uniqueUsernames }
            },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                }
            }
        })

        // Send notification to each mentioned user (except the commenter)
        for (const profile of mentionedProfiles) {
            if (profile.user.id !== auth.userId && profile.user.email) {
                try {
                    await sendMail({
                        to: profile.user.email,
                        subject: `${commenter?.name || 'Someone'} mentioned you in a post`,
                        html: mentionNotification(
                            profile.user.name,
                            commenter?.name || 'Someone',
                            body.content.trim(),
                            postUrl
                        )
                    })
                } catch (emailError) {
                    console.error('Failed to send mention notification:', emailError)
                }
            }
        }
    }

    return comment
})

