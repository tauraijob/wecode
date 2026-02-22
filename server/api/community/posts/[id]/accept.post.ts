import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) throw createError({ statusCode: 401, statusMessage: 'Sign in to accept answers' })

    const postId = getRouterParam(event, 'id')
    if (!postId) throw createError({ statusCode: 400, statusMessage: 'Post ID required' })

    const body = await readBody(event)
    if (!body.commentId) throw createError({ statusCode: 400, statusMessage: 'Comment ID required' })

    // Verify the user is the post author
    const post = await prisma.forumPost.findUnique({ where: { id: postId } })
    if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    if (post.authorId !== auth.userId) {
        throw createError({ statusCode: 403, statusMessage: 'Only the post author can accept answers' })
    }

    // Verify the comment exists on this post
    const comment = await prisma.forumComment.findFirst({
        where: { id: body.commentId, postId }
    })
    if (!comment) throw createError({ statusCode: 404, statusMessage: 'Comment not found' })

    // Unaccept previous answer if any
    await prisma.forumComment.updateMany({
        where: { postId, isAccepted: true },
        data: { isAccepted: false }
    })

    // Accept the new answer
    await prisma.forumComment.update({
        where: { id: body.commentId },
        data: { isAccepted: true }
    })

    await prisma.forumPost.update({
        where: { id: postId },
        data: { acceptedAnswerId: body.commentId }
    })

    // Award XP to the answer author
    await prisma.user.update({
        where: { id: comment.authorId },
        data: { xp: { increment: 25 } }
    })

    return { success: true, acceptedCommentId: body.commentId }
})
