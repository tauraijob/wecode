import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { getTauResponse } from '~~/server/utils/tau-ai'
import { randomUUID } from 'crypto'
import { sendMail } from '~~/server/utils/mailer'
import { adminNewSupportChatAlert } from '~~/server/utils/email-templates'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { message, chatId, guestName } = body

    if (!message) {
        throw createError({ statusCode: 400, statusMessage: 'Message is required' })
    }

    // 1. Resolve Identity
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    const userId = auth?.userId || null

    let guestId = getCookie(event, 'tau_guest_id')
    if (!userId && !guestId) {
        guestId = randomUUID()
        setCookie(event, 'tau_guest_id', guestId, { maxAge: 60 * 60 * 24 * 30 }) // 30 days
    }

    // 2. Resolve or Create Chat
    let chat
    let isNewChat = false
    if (chatId) {
        chat = await prisma.supportChat.findUnique({
            where: { id: chatId },
            include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } }
        })
    }

    if (!chat) {
        isNewChat = true
        chat = await prisma.supportChat.create({
            data: {
                userId,
                guestId: userId ? null : guestId,
                guestName: guestName || null,
                status: 'AI_ACTIVE'
            },
            include: { messages: true }
        })

        // Email Alert to Admin for new chat
        try {
            const adminEmail = process.env.MAIL_TO || process.env.MAIL_FROM || 'info@wecode.co.zw'
            const userName = guestName || (auth ? (await prisma.user.findUnique({ where: { id: auth.userId }, select: { name: true } }))?.name : 'Guest') || 'Guest'

            await sendMail({
                to: adminEmail,
                subject: `Tau AI: New Chat from ${userName}`,
                html: adminNewSupportChatAlert(chat.id, userName, message)
            }).catch(e => console.error('Admin Email Alert Failed:', e))
        } catch (e) {
            console.error('Email alert prep failed:', e)
        }
    }

    // 3. Save User Message
    await prisma.supportMessage.create({
        data: {
            chatId: chat.id,
            role: 'user',
            content: message
        }
    })

    // 4. Handle based on status
    if (chat.status === 'HUMAN_ACTIVE') {
        return {
            ok: true,
            chatId: chat.id,
            reply: "One of our human admins has been notified. They'll be with you shortly!",
            status: 'HUMAN_ACTIVE'
        }
    }

    // 5. Get AI Response
    const history = chat.messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user' as any,
        content: m.content
    }))

    const aiReply = await getTauResponse(message, history)

    // 6. Save AI Message
    await prisma.supportMessage.create({
        data: {
            chatId: chat.id,
            role: 'assistant',
            content: aiReply
        }
    })

    return {
        ok: true,
        chatId: chat.id,
        reply: aiReply,
        status: chat.status
    }
})
