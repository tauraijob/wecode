
import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { sendMail } from '~~/server/utils/mailer'

/**
 * Request Payout API
 * 
 * - Deducts credits from mentor's balance
 * - Creates Payout record
 * - Sends email notification to admin
 */
export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
    }

    const body = await readBody(event)
    const { creditsAmount, paymentMethod, paymentDetails } = body

    if (!creditsAmount || creditsAmount <= 0) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid amount' })
    }

    if (!paymentMethod || !paymentDetails) {
        throw createError({ statusCode: 400, statusMessage: 'Payment details required' })
    }

    // Get user and verify balance
    const mentorProfile = await prisma.mentorProfile.findUnique({
        where: { userId: auth.userId },
        select: { withdrawableBalance: true }
    })

    const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { id: true, name: true, email: true, credits: true, phone: true }
    })

    if (!user || !mentorProfile) {
        throw createError({ statusCode: 404, statusMessage: 'User or mentor profile not found' })
    }

    // Check both general credits AND withdrawable earned credits
    if (user.credits < creditsAmount) {
        throw createError({ statusCode: 400, statusMessage: 'Insufficient credit balance' })
    }

    if (mentorProfile.withdrawableBalance < creditsAmount) {
        throw createError({ statusCode: 400, statusMessage: 'Insufficient withdrawable earnings' })
    }

    // Conversion Rate: 1 Credit = $0.10 USD
    // User earns 60% of session value. (e.g. 100 credit session -> 60 credits earned -> $6 cashout)
    const CASH_OUT_RATE = 0.10
    const payoutAmountUsd = creditsAmount * CASH_OUT_RATE

    // Transaction: Deduct credits + Deduct withdrawable + Create Payout
    const payout = await prisma.$transaction(async (tx) => {
        // 1. Deduct from general balance (spending power)
        await tx.user.update({
            where: { id: user.id },
            data: { credits: { decrement: creditsAmount } }
        })

        // 2. Deduct from withdrawable balance (earning history)
        await tx.mentorProfile.update({
            where: { userId: user.id },
            data: { withdrawableBalance: { decrement: creditsAmount } }
        })

        // 3. Create Payout record
        return await tx.payout.create({
            data: {
                amount: payoutAmountUsd,
                currency: 'USD',
                status: 'PENDING',
                method: paymentMethod,
                notes: `Credits: ${creditsAmount}\nDetails: ${paymentDetails}`,
                instructorId: user.id, // Using instructorId for mentor linking
                requestedAt: new Date()
            }
        })
    })

    // Send Email to Admin
    try {
        const adminHtml = `
            <h2>New Payout Request</h2>
            <p><strong>Mentor:</strong> ${user.name} (${user.email})</p>
            <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
            <hr />
            <h3>Request Details</h3>
            <p><strong>Credits Cashed Out:</strong> ${creditsAmount}</p>
            <p><strong>Payout Amount:</strong> $${payoutAmountUsd.toFixed(2)} USD</p>
            <p><strong>Method:</strong> ${paymentMethod}</p>
            <p><strong>Payment Details:</strong><br />${paymentDetails.replace(/\n/g, '<br />')}</p>
            <hr />
            <p>Please process this payment and then mark it as PROCESSED in the admin panel.</p>
        `

        await sendMail({
            to: process.env.COMMUNITY_ADMIN_EMAIL || 'wecodezw@gmail.com',
            subject: `Payout Request: ${user.name} - $${payoutAmountUsd.toFixed(2)}`,
            html: adminHtml
        })
    } catch (emailErr) {
        console.error('Failed to send payout email:', emailErr)
        // Don't fail the request, just log it
    }

    return { success: true, payout }
})
