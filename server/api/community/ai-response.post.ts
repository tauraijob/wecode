/**
 * Generate AI Response for Forum Post using Groq (Fast & Free)
 * Supports multi-turn conversation
 * POST /api/community/ai-response
 */
import Groq from 'groq-sdk'

interface Message {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { postId, title, content, messages } = body

    if (!postId || (!content && !messages?.length)) {
        throw createError({ statusCode: 400, statusMessage: 'Post ID and content are required' })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
        throw createError({ statusCode: 503, statusMessage: 'AI service not configured' })
    }

    try {
        const groq = new Groq({ apiKey })

        const systemPrompt = `You are a helpful coding mentor at WeCode, a Zimbabwean coding education platform. You're helping with a forum discussion.

**Original Post Title:** ${title}

**Original Post Content:**
${content}

Guidelines:
- Be encouraging, friendly, and supportive
- Explain concepts clearly for beginners
- Provide code examples when helpful (use markdown code blocks with language specifiers)
- If discussing code issues, suggest best practices
- Keep responses concise but comprehensive
- Use markdown formatting for better readability
- Remember the context of the conversation`

        // Build conversation history
        const chatMessages: Message[] = [
            { role: 'system', content: systemPrompt }
        ]

        // If we have conversation history, add it
        if (messages && messages.length > 0) {
            for (const msg of messages) {
                chatMessages.push({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content
                })
            }
        } else {
            // First message - ask AI to analyze the post
            chatMessages.push({
                role: 'user',
                content: 'Please analyze this post and provide helpful guidance, suggestions, or answers.'
            })
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: chatMessages,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1500
        })

        const aiResponse = chatCompletion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

        return {
            success: true,
            response: aiResponse,
            postId
        }
    } catch (error: any) {
        console.error('AI Response Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to generate AI response'
        })
    }
})
