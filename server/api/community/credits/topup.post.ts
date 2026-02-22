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
    const gateway = (body.gateway || 'paynow').toLowerCase() as 'paynow' | 'smilepay'

    // Validate currency
    if (!['USD', 'ZWG'].includes(currency)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid currency. Choose: USD or ZWG' })
    }

    // Validate gateway
    if (!['paynow', 'smilepay'].includes(gateway)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid gateway. Choose: paynow or smilepay' })
    }

    // Exchange rate from environment
    const zwgRate = parseFloat(process.env.ZWG_USD_RATE || '30.5')

    // Credit packages with USD base pricing
    const creditPackages: Record<string, { credits: number; priceUsd: number }> = {
        'starter': { credits: 100, priceUsd: 10 },
        'standard': { credits: 220, priceUsd: 20 },
        'premium': { credits: 500, priceUsd: 45 }
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

    // Get user info
    const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { email: true, name: true, phone: true }
    })

    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    // Determine if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development'

    // Get site URL with production fallback
    let baseUrl = process.env.NUXT_PUBLIC_SITE_URL || process.env.SITE_URL || (isDevelopment ? 'http://localhost:3000' : 'https://wecode.co.zw')

    if (!isDevelopment && baseUrl.includes('localhost')) {
        baseUrl = 'https://wecode.co.zw'
    }

    // Create unique payment reference
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

    try {
        if (gateway === 'smilepay') {
            // ─── Smile&Pay Gateway ───
            const apiKey = process.env.SMILEPAY_API_KEY
            const apiSecret = process.env.SMILEPAY_API_SECRET
            if (!apiKey || !apiSecret) {
                throw createError({ statusCode: 503, statusMessage: 'Smile&Pay not configured' })
            }

            const SMILEPAY_BASE = 'https://zbnet.zb.co.zw/wallet_gateway/payments-gateway'
            const currencyCode = currency === 'ZWG' ? '924' : '840'

            const response = await $fetch<any>(`${SMILEPAY_BASE}/payments/initiate-transaction`, {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'x-api-secret': apiSecret,
                    'Content-Type': 'application/json'
                },
                body: {
                    amount: price,
                    currencyCode: currencyCode,
                    orderReference: reference,
                    itemName: `${selectedPackage.credits} Credits Package`,
                    customerEmail: user.email,
                    returnUrl: `${baseUrl}/community?credits=success`,
                    resultUrl: `${baseUrl}/api/smilepay/credits-webhook`
                }
            })

            if (response.paymentUrl || response.redirectUrl) {
                return {
                    success: true,
                    redirectUrl: response.paymentUrl || response.redirectUrl,
                    reference,
                    credits: selectedPackage.credits,
                    price,
                    currency,
                    purchaseId: creditPurchase.id,
                    gateway: 'smilepay'
                }
            }

            throw new Error(response.message || 'Failed to initiate Smile&Pay payment')
        } else {
            // ─── Paynow Gateway ───
            const integrationId = process.env.PAYNOW_INTEGRATION_ID
            const integrationKey = process.env.PAYNOW_INTEGRATION_KEY
            if (!integrationId || !integrationKey) {
                throw createError({ statusCode: 503, statusMessage: 'Paynow not configured' })
            }

            const paynow = new Paynow(integrationId, integrationKey)
            paynow.resultUrl = `${baseUrl}/api/community/credits/webhook`
            paynow.returnUrl = `${baseUrl}/community?credits=success`

            const payment = paynow.createPayment(reference, user.email)
            payment.add(`${selectedPackage.credits} Credits Package`, price)

            const response = await paynow.send(payment)

            if (response.success) {
                return {
                    success: true,
                    redirectUrl: response.redirectUrl,
                    pollUrl: response.pollUrl,
                    reference,
                    credits: selectedPackage.credits,
                    price,
                    currency,
                    purchaseId: creditPurchase.id,
                    gateway: 'paynow'
                }
            }

            throw new Error(response.error || 'Failed to initiate Paynow payment')
        }
    } catch (error: any) {
        // Mark purchase as failed
        if (creditPurchase?.id) {
            await prisma.creditPurchase.update({
                where: { id: creditPurchase.id },
                data: { status: 'FAILED' }
            }).catch(() => { })
        }

        console.error(`${gateway} credit topup error:`, error)
        if (error.statusCode) throw error
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to process payment request'
        })
    }
})
