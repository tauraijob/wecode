/**
 * Save AI Chat Message for a Forum Post
 * POST /api/community/posts/[id]/ai-chat
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
}

export default defineEventHandler(async (event) => {
    const postId = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { messages } = body as { messages: ChatMessage[] }

    if (!postId) {
        throw createError({ statusCode: 400, statusMessage: 'Post ID is required' })
    }

    if (!messages || !Array.isArray(messages)) {
        throw createError({ statusCode: 400, statusMessage: 'Messages array is required' })
    }

    try {
        // Check if post exists
        const post = await prisma.forumPost.findUnique({
            where: { id: postId }
        })

        if (!post) {
            throw createError({ statusCode: 404, statusMessage: 'Post not found' })
        }

        // Upsert the AI chat
        const aiChat = await prisma.aIChat.upsert({
            where: { postId },
            create: {
                postId,
                messages: {
                    create: messages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                }
            },
            update: {
                // Delete existing messages and create new ones
                messages: {
                    deleteMany: {},
                    create: messages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                }
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        })

        return {
            success: true,
            id: aiChat.id,
            messagesCount: aiChat.messages.length
        }
    } catch (error: any) {
        console.error('Error saving AI chat:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to save AI chat'
        })
    }
})
