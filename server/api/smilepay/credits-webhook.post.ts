import prismaModule from '~~/server/utils/db'

/**
 * Smile&Pay webhook for credit purchases.
 * Same logic as credits/webhook.post.ts but handles Smile&Pay callback format.
 */
export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    const body = await readBody(event)
    console.log('SmilePay credits webhook received:', JSON.stringify(body, null, 2))

    const { orderReference, reference, status, amount } = body || {}
    const creditReference = orderReference || reference

    if (!creditReference || !status) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid webhook payload' })
    }

    // Only process successful payments
    if (status !== 'PAID' && status !== 'SUCCESS') {
        console.log(`SmilePay credits: Payment status not successful: ${status}`)
        return { success: false, message: 'Payment not completed', status }
    }

    // Look up credit purchase
    const creditPurchase = await prisma.creditPurchase.findUnique({
        where: { reference: creditReference },
        include: { user: { select: { id: true, name: true, email: true } } }
    })

    if (!creditPurchase) {
        // Fallback: parse reference format CREDITS-{userId8chars}-{packageKey}-{timestamp}
        const parts = creditReference.split('-')
        if (parts.length >= 3 && parts[0] === 'CREDITS') {
            const userIdPrefix = parts[1]
            const packageKey = parts[2] || 'starter'
            const creditPackages: Record<string, number> = { starter: 100, standard: 220, premium: 500 }
            const creditsToAdd = creditPackages[packageKey] || 100

            const user = await prisma.user.findFirst({ where: { id: { startsWith: userIdPrefix } } })
            if (user) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { credits: { increment: creditsToAdd } }
                })
                console.log(`[SmilePay Fallback] Added ${creditsToAdd} credits to user ${user.id}`)
                return { success: true, message: `Added ${creditsToAdd} credits (fallback)` }
            }
        }
        return { success: false, message: 'Purchase record not found' }
    }

    // Prevent double-crediting
    if (creditPurchase.status === 'COMPLETED') {
        return { success: true, message: 'Purchase already processed', credits: creditPurchase.credits }
    }

    // Update purchase + add credits in transaction
    await prisma.$transaction([
        prisma.creditPurchase.update({
            where: { id: creditPurchase.id },
            data: { status: 'COMPLETED', completedAt: new Date() }
        }),
        prisma.user.update({
            where: { id: creditPurchase.userId },
            data: { credits: { increment: creditPurchase.credits } }
        })
    ])

    console.log(`✅ SmilePay: Added ${creditPurchase.credits} credits to user ${creditPurchase.userId}`)

    return {
        success: true,
        message: `Added ${creditPurchase.credits} credits`,
        credits: creditPurchase.credits,
        currency: creditPurchase.currency,
        amount: creditPurchase.amount,
        userId: creditPurchase.userId
    }
})
