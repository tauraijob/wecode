import prismaModule from '~~/server/utils/db'

/**
 * PayNow Webhook for Credit Top-up Confirmation
 * 
 * TOKEN LOGIC:
 * - Called by PayNow when payment status changes
 * - Looks up CreditPurchase record by reference
 * - If payment successful (status = 'Paid'), adds credits to user
 * - Updates CreditPurchase status to COMPLETED with timestamp
 */
export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    const body = await readBody(event)

    // PayNow webhook payload
    const { reference, status, paynowreference, amount } = body

    console.log('Credit webhook received:', { reference, status, paynowreference, amount })

    if (!reference || !status) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid webhook payload' })
    }

    // Only process successful payments
    const statusLower = status.toLowerCase()
    if (statusLower !== 'paid' && statusLower !== 'success') {
        console.log(`Payment status not successful: ${status}`)
        return { success: false, message: 'Payment not completed', status }
    }

    // Look up the CreditPurchase record by reference
    const creditPurchase = await prisma.creditPurchase.findUnique({
        where: { reference },
        include: { user: { select: { id: true, name: true, email: true } } }
    })

    if (!creditPurchase) {
        console.error('Credit webhook: Purchase not found for reference:', reference)

        // Fallback: Try to parse reference for legacy format
        // Format: CREDITS-{userId8chars}-{packageKey}-{timestamp}
        const parts = reference.split('-')
        if (parts.length >= 3 && parts[0] === 'CREDITS') {
            const userIdPrefix = parts[1]
            const packageKey = parts[2] || 'starter'

            // Credit packages (matches $0.10/credit pricing)
            const creditPackages: Record<string, number> = {
                'starter': 100,
                'standard': 220,
                'premium': 500
            }

            const creditsToAdd = creditPackages[packageKey] || 50

            // Find user by ID prefix
            const user = await prisma.user.findFirst({
                where: { id: { startsWith: userIdPrefix } }
            })

            if (user) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { credits: { increment: creditsToAdd } }
                })

                console.log(`[Fallback] Added ${creditsToAdd} credits to user ${user.id}`)
                return {
                    success: true,
                    message: `Added ${creditsToAdd} credits (fallback)`,
                    paynowReference: paynowreference
                }
            }
        }

        return { success: false, message: 'Purchase record not found' }
    }

    // Check if already completed (prevent double-crediting)
    if (creditPurchase.status === 'COMPLETED') {
        console.log('Purchase already completed:', reference)
        return {
            success: true,
            message: 'Purchase already processed',
            credits: creditPurchase.credits
        }
    }

    // Update CreditPurchase to COMPLETED and add credits in transaction
    const [updatedPurchase, updatedUser] = await prisma.$transaction([
        prisma.creditPurchase.update({
            where: { id: creditPurchase.id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date()
            }
        }),
        prisma.user.update({
            where: { id: creditPurchase.userId },
            data: {
                credits: { increment: creditPurchase.credits }
            }
        })
    ])

    console.log(`✅ Added ${creditPurchase.credits} credits to user ${creditPurchase.userId}`)
    console.log(`   Currency: ${creditPurchase.currency} | Amount: ${creditPurchase.amount}`)
    console.log(`   Package: ${creditPurchase.packageId} | PayNow Ref: ${paynowreference}`)

    return {
        success: true,
        message: `Added ${creditPurchase.credits} credits`,
        credits: creditPurchase.credits,
        currency: creditPurchase.currency,
        amount: creditPurchase.amount,
        paynowReference: paynowreference,
        userId: creditPurchase.userId
    }
})
