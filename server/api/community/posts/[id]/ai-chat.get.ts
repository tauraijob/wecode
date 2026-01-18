/**
 * Get AI Chat for a Forum Post
 * GET /api/community/posts/[id]/ai-chat
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const postId = getRouterParam(event, 'id')

    if (!postId) {
        throw createError({ statusCode: 400, statusMessage: 'Post ID is required' })
    }

    try {
        // Get the AI chat with messages for this post
        const aiChat = await prisma.aIChat.findUnique({
            where: { postId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        })

        if (!aiChat) {
            return { messages: [] }
        }

        return {
            id: aiChat.id,
            messages: aiChat.messages.map(m => ({
                role: m.role,
                content: m.content
            }))
        }
    } catch (error: any) {
        console.error('Error fetching AI chat:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch AI chat'
        })
    }
})
