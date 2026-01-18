import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { Paynow } from 'paynow'

/**
 * Multi-Currency Credit Top-up API
 * 
 * TOKEN/CREDIT LOGIC:
 * - Credits are the universal currency for booking mentorship sessions
 * - 1 credit = 1 hour of mentorship at base rate
 * - Mentors set their hourly rate in credits
 * - Users can purchase credits in either USD or ZWG
 * 
 * PACKAGES:
 * - Starter: 50 credits
 * - Standard: 120 credits (20% bonus)
 * - Premium: 300 credits (33% bonus)
 * 
 * CURRENCIES:
 * - USD: Base pricing
 * - ZWG: Calculated using ZWG_USD_RATE from env
 */
export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    // Verify authentication
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'You must be logged in to purchase credits' })
    }

    const body = await readBody(event)
    const currency = (body.currency || 'USD').toUpperCase()

    // Validate currency
    if (!['USD', 'ZWG'].includes(currency)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid currency. Choose: USD or ZWG' })
    }

    // Exchange rate from environment
    const zwgRate = parseFloat(process.env.ZWG_USD_RATE || '30.5')

    // Credit packages with USD base pricing
    // Base rate: $0.10 per credit
    // Larger packages include bonus credits for better value
    const creditPackages: Record<string, { credits: number; priceUsd: number }> = {
        'starter': { credits: 100, priceUsd: 10 },      // $0.10/credit (base rate)
        'standard': { credits: 220, priceUsd: 20 },     // $0.09/credit (10% bonus)
        'premium': { credits: 500, priceUsd: 45 }       // $0.09/credit (11% bonus)
    }

    const packageKey = body.package as string
    if (!packageKey || !creditPackages[packageKey]) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid credit package. Choose: starter, standard, or premium'
        })
    }

    const selectedPackage = creditPackages[packageKey]

    // Calculate price based on selected currency
    const price = currency === 'ZWG'
        ? Math.ceil(selectedPackage.priceUsd * zwgRate)
        : selectedPackage.priceUsd

    // Get user info for PayNow
    const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { email: true, name: true, phone: true }
    })

    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    const integrationId = process.env.PAYNOW_INTEGRATION_ID
    const integrationKey = process.env.PAYNOW_INTEGRATION_KEY

    if (!integrationId || !integrationKey) {
        throw createError({ statusCode: 503, statusMessage: 'Payment gateway not configured' })
    }

    const paynow = new Paynow(integrationId, integrationKey)

    const baseUrl = process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000'
    paynow.resultUrl = `${baseUrl}/api/community/credits/webhook`
    paynow.returnUrl = `${baseUrl}/community?credits=success`

    // Create unique payment reference that encodes package info
    // Format: CREDITS-{userId8chars}-{packageKey}-{timestamp}
    const reference = `CREDITS-${auth.userId.substring(0, 8)}-${packageKey}-${Date.now()}`

    // Create pending CreditPurchase record
    const creditPurchase = await prisma.creditPurchase.create({
        data: {
            userId: auth.userId,
            packageId: packageKey,
            credits: selectedPackage.credits,
            currency: currency,
            amount: price,
            reference: reference,
            status: 'PENDING'
        }
    })

    const payment = paynow.createPayment(reference, user.email)
    payment.add(`${selectedPackage.credits} Credits Package`, price)

    try {
        const response = await paynow.send(payment)

        if (response.success) {
            return {
                success: true,
                redirectUrl: response.redirectUrl,
                pollUrl: response.pollUrl,
                reference,
                credits: selectedPackage.credits,
                price: price,
                currency: currency,
                purchaseId: creditPurchase.id
            }
        } else {
            // Mark purchase as failed
            await prisma.creditPurchase.update({
                where: { id: creditPurchase.id },
                data: { status: 'FAILED' }
            })

            throw createError({
                statusCode: 400,
                statusMessage: response.error || 'Failed to initiate payment'
            })
        }
    } catch (error: any) {
        // Mark purchase as failed if payment initiation failed
        if (creditPurchase?.id) {
            await prisma.creditPurchase.update({
                where: { id: creditPurchase.id },
                data: { status: 'FAILED' }
            }).catch(() => { }) // Ignore if this fails
        }

        console.error('PayNow initiation error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to process payment request'
        })
    }
})
