/**
 * Admin API - Reject a payout request
 * This will refund the credits back to the mentor's balance
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
    const { reason } = body

    if (!reason) {
        throw createError({ statusCode: 400, statusMessage: 'Rejection reason required' })
    }

    // Find payout
    const payout = await prisma.payout.findUnique({
        where: { id: payoutId },
        include: {
            instructor: {
                select: { id: true, name: true, email: true }
            }
        }
    })

    if (!payout) {
        throw createError({ statusCode: 404, statusMessage: 'Payout not found' })
    }

    if (payout.status !== 'PENDING') {
        throw createError({ statusCode: 400, statusMessage: 'Payout is not pending' })
    }

    // Parse credits from notes (format: "Credits: XXX\nDetails: ...")
    let creditsToRefund = 0
    if (payout.notes) {
        const match = payout.notes.match(/Credits:\s*(\d+)/)
        if (match) {
            creditsToRefund = parseInt(match[1], 10)
        }
    }

    // Transaction: Update payout status + Refund credits
    const updatedPayout = await prisma.$transaction(async (tx) => {
        // 1. Update payout status to REJECTED
        const updated = await tx.payout.update({
            where: { id: payoutId },
            data: {
                status: 'FAILED',
                processedAt: new Date(),
                processedById: auth.userId,
                notes: `${payout.notes}\n\n--- REJECTED ---\nReason: ${reason}`
            }
        })

        // 2. Refund credits if we know the amount
        if (creditsToRefund > 0) {
            // Refund to user's general balance
            await tx.user.update({
                where: { id: payout.instructor.id },
                data: { credits: { increment: creditsToRefund } }
            })

            // Refund to withdrawable balance
            await tx.mentorProfile.update({
                where: { userId: payout.instructor.id },
                data: { withdrawableBalance: { increment: creditsToRefund } }
            })
        }

        return updated
    })

    // Send email notification to user
    try {
        const html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: sans-serif; background: #f5f7fa; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 30px; text-align: center;">
                    <h1 style="color: #fff; margin: 0;">Payout Request Declined</h1>
                </div>
                <div style="padding: 30px;">
                    <p>Hi ${payout.instructor.name},</p>
                    <p>Unfortunately, your payout request has been declined.</p>
                    <table style="width: 100%; margin: 20px 0; background: #fef2f2; border-radius: 8px;">
                        <tr><td style="padding: 12px; color: #6b7280;">Amount</td><td style="padding: 12px; font-weight: bold;">$${Number(payout.amount).toFixed(2)} USD</td></tr>
                        <tr><td style="padding: 12px; color: #6b7280;">Method</td><td style="padding: 12px;">${payout.method}</td></tr>
                        <tr><td style="padding: 12px; color: #6b7280;">Reason</td><td style="padding: 12px; color: #dc2626;">${reason}</td></tr>
                    </table>
                    ${creditsToRefund > 0 ? `<p style="background: #f0fdf4; padding: 12px; border-radius: 8px; color: #16a34a;"><strong>✓ ${creditsToRefund} credits have been refunded to your balance.</strong></p>` : ''}
                    <p>If you have any questions, please contact our support team.</p>
                    <p>Best regards,<br>The WeCode Team</p>
                </div>
            </div>
        </body>
        </html>
        `
        await sendMail({
            to: payout.instructor.email,
            subject: `Payout Request Declined - $${Number(payout.amount).toFixed(2)}`,
            html
        })
    } catch (emailError) {
        console.error('Failed to send payout rejection email:', emailError)
    }

    return {
        success: true,
        message: 'Payout rejected and credits refunded',
        payout: updatedPayout,
        creditsRefunded: creditsToRefund
    }
})
