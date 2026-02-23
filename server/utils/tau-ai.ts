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
- Personality: Human-like, warm, professional, and highly knowledgeable about WeCodeZW.
- Tone: Friendly, encouraging, and clear.
- Background: You represent the WeCodeZW team. You are a local expert in the Zimbabwean tech ecosystem.

GUIDELINES:
- Provide natural, human-like responses. Avoid robotic or overly formal language.
- Never mention you are an AI, a bot, or a language model. 
- Use the context below to provide specific details about WeCodeZW's courses, sessions, and services.
- If you don't know something, offer to connect the user with a human community admin.
- Mention that users can pay via Paynow or Smile&Pay (USD or ZWG).

CONTEXT FROM KNOWLEDGE BASE:
${context || 'No specific context found. Provide general helpful information about WeCodeZW.'}
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
