/**
 * Check Smile&Pay payment status by polling the gateway.
 * Used as fallback when webhook doesn't arrive.
 */
const SMILEPAY_BASE = 'https://zbnet.zb.co.zw/wallet_gateway/payments-gateway'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const orderReference = query.orderReference as string

    if (!orderReference) {
        throw createError({ statusCode: 400, statusMessage: 'orderReference is required' })
    }

    const apiKey = process.env.SMILEPAY_API_KEY
    const apiSecret = process.env.SMILEPAY_API_SECRET

    if (!apiKey || !apiSecret) {
        throw createError({ statusCode: 503, statusMessage: 'Smile&Pay not configured' })
    }

    try {
        const response = await $fetch<any>(
            `${SMILEPAY_BASE}/payments/transaction/${orderReference}/status/check`,
            {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey,
                    'x-api-secret': apiSecret
                }
            }
        )

        console.log('SmilePay status check:', { orderReference, response })

        return {
            ok: true,
            status: response.status || response.paymentStatus,
            paid: response.status === 'PAID' || response.paymentStatus === 'PAID',
            data: response
        }
    } catch (error: any) {
        console.error('SmilePay status check error:', error)
        throw createError({
            statusCode: 502,
            statusMessage: error.data?.message || 'Failed to check payment status'
        })
    }
})
