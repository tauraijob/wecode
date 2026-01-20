/**
 * Admin API - Process a payout (mark as completed)
 */
import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { sendMail } from '~~/server/utils/mailer'

export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    // Verify admin auth
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    const allowedRoles = ['ADMIN', 'COMMUNITY_ADMIN']
    if (!auth || !allowedRoles.includes(auth.role)) {
        throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const payoutId = getRouterParam(event, 'id')
    if (!payoutId) {
        throw createError({ statusCode: 400, statusMessage: 'Payout ID required' })
    }

    const body = await readBody(event)
    const { reference } = body

    // Find payout
    const payout = await prisma.payout.findUnique({
        where: { id: payoutId },
        include: {
            instructor: {
                select: { name: true, email: true }
            }
        }
    })

    if (!payout) {
        throw createError({ statusCode: 404, statusMessage: 'Payout not found' })
    }

    if (payout.status !== 'PENDING') {
        throw createError({ statusCode: 400, statusMessage: 'Payout is not pending' })
    }

    // Update payout status
    const updatedPayout = await prisma.payout.update({
        where: { id: payoutId },
        data: {
            status: 'PROCESSED',
            processedAt: new Date(),
            processedById: auth.userId,
            reference: reference || null
        }
    })

    // Send email notification to user
    try {
        const baseUrl = 'https://wecode.co.zw'
        const html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: sans-serif; background: #f5f7fa; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #1e3a5f, #2d4a6f); padding: 30px; text-align: center;">
                    <h1 style="color: #fff; margin: 0;">Payout Processed! 🎉</h1>
                </div>
                <div style="padding: 30px;">
                    <p>Hi ${payout.instructor.name},</p>
                    <p>Great news! Your payout has been processed.</p>
                    <table style="width: 100%; margin: 20px 0;">
                        <tr><td style="padding: 8px; color: #6b7280;">Amount</td><td style="padding: 8px; font-weight: bold;">$${Number(payout.amount).toFixed(2)} USD</td></tr>
                        <tr><td style="padding: 8px; color: #6b7280;">Method</td><td style="padding: 8px;">${payout.method}</td></tr>
                        ${reference ? `<tr><td style="padding: 8px; color: #6b7280;">Reference</td><td style="padding: 8px;">${reference}</td></tr>` : ''}
                    </table>
                    <p>Thank you for being a mentor on WeCode Community!</p>
                </div>
            </div>
        </body>
        </html>
        `
        await sendMail({
            to: payout.instructor.email,
            subject: `Your Payout Has Been Processed - $${Number(payout.amount).toFixed(2)}`,
            html
        })
    } catch (emailError) {
        console.error('Failed to send payout processed email:', emailError)
    }

    return {
        success: true,
        message: 'Payout processed successfully',
        payout: updatedPayout
    }
})
