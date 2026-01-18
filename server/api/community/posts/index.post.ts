import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

/**
 * Create a new forum post
 * Requires authentication
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
        throw createError({ statusCode: 401, statusMessage: 'You must be logged in to post' })
    }

    const body = await readBody(event)

    if (!body.title || !body.content) {
        throw createError({ statusCode: 400, statusMessage: 'Title and content are required' })
    }

    if (body.title.length < 5 || body.title.length > 200) {
        throw createError({ statusCode: 400, statusMessage: 'Title must be between 5 and 200 characters' })
    }

    if (body.content.length < 10) {
        throw createError({ statusCode: 400, statusMessage: 'Content must be at least 10 characters' })
    }

    const post = await prisma.forumPost.create({
        data: {
            title: body.title.trim(),
            content: body.content.trim(),
            authorId: auth.userId
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

    return post
})
