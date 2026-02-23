import prisma from '~~/server/utils/db'

export async function getTauResponse(userMessage: string, history: { role: 'user' | 'assistant', content: string }[] = []) {
    const config = useRuntimeConfig()
    const apiKey = config.groqApiKey || process.env.GROQ_API_KEY

    if (!apiKey) {
        console.error('CRITICAL: GROQ_API_KEY not found in runtimeConfig or process.env')
        throw new Error('AI configuration missing')
    }

    // 1. Get Knowledge Base context
    const words = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 3)

    let context = ''
    try {
        if (words.length > 0) {
            const kbEntries = await prisma.aIKnowledgeBase.findMany({
                where: {
                    OR: words.map(word => ({
                        content: { contains: word }
                    }))
                },
                take: 5
            })
            context = kbEntries.map(e => e.content).join('\n\n')
        }
    } catch (err) {
        console.error('KB Retrieval Error:', err)
        // Continue without context if KB fails
    }

    // 2. Prepare System Prompt
    const systemPrompt = `
You are Tau, the official AI assistant for WeCodeZW. 
WeCodeZW is Zimbabwe's leading technology hub, providing world-class coding bootcamps, IT certifications, corporate training, and software development services.

CHARACTERISTICS:
- Name: Tau
- Personality: Warm, helpful human team member. NOT an AI or bot.
- Tone: Friendly, conversational, and direct.
- Background: Expert in Zimbabwean tech and WeCodeZW services.

GUIDELINES:
- BE CONCISE: Keep responses short and to the point.
- NO LONG PARAGRAPHS: Use maximum 2-3 sentences per paragraph.
- BE CONVERSATIONAL: Talk like a human messaging on WhatsApp. Avoid formal or "assistant-like" phrasing.
- Never mention you are an AI, bot, or LLM.
- Use the context below for specific info. If unsure, suggest talking to an admin.
- Mention payment options (Paynow/Smile&Pay) only if relevant to the user's query.

CONTEXT FROM KNOWLEDGE BASE:
${context || 'Provide general helpful information about WeCodeZW services.'}
`.trim()

    // 3. Call Groq API via fetch
    try {
        const response = await $fetch<any>('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...history,
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 800
            }
        })

        if (!response?.choices?.[0]?.message?.content) {
            throw new Error('Invalid response format from Groq API')
        }

        return response.choices[0].message.content
    } catch (error: any) {
        console.error('Groq API Error:', error?.data || error)
        return "I'm having a bit of trouble connecting to my brain right now. Please try again or reach out to our team on WhatsApp!"
    }
}
