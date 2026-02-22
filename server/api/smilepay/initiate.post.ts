import { z } from 'zod'

const SMILEPAY_BASE = 'https://zbnet.zb.co.zw/wallet_gateway/payments-gateway'

const Schema = z.object({
    invoiceNumber: z.string(),
    email: z.string().email().optional(),
    amount: z.number().positive(),
    currency: z.enum(['USD', 'ZWG']).default('USD'),
    returnUrl: z.string().url().optional()
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const parsed = Schema.safeParse(body)
    if (!parsed.success) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
    }

    const { invoiceNumber, email, amount, currency, returnUrl: customReturnUrl } = parsed.data

    const apiKey = process.env.SMILEPAY_API_KEY
    const apiSecret = process.env.SMILEPAY_API_SECRET

    if (!apiKey || !apiSecret) {
        throw createError({ statusCode: 503, statusMessage: 'Smile&Pay not configured' })
    }

    // Determine site URL
    const isDevelopment = process.env.NODE_ENV === 'development'
    let siteUrl = process.env.SITE_URL || process.env.NUXT_PUBLIC_SITE_URL || (isDevelopment ? 'http://localhost:3000' : 'https://wecode.co.zw')

    if (!isDevelopment && siteUrl.includes('localhost')) {
        siteUrl = 'https://wecode.co.zw'
    }

    const resultUrl = `${siteUrl.replace(/\/$/, '')}/api/smilepay/webhook`
    const returnUrl = customReturnUrl || `${siteUrl.replace(/\/$/, '')}/dashboard/learn`

    // Currency code mapping for Smile&Pay
    const currencyCode = currency === 'ZWG' ? '924' : '840'

    console.log('SmilePay Initiate:', { invoiceNumber, amount, currency, currencyCode, resultUrl, returnUrl })

    try {
        const response = await $fetch<any>(`${SMILEPAY_BASE}/payments/initiate-transaction`, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'x-api-secret': apiSecret,
                'Content-Type': 'application/json'
            },
            body: {
                amount: amount,
                currencyCode: currencyCode,
                orderReference: invoiceNumber,
                itemName: `Invoice ${invoiceNumber}`,
                customerEmail: email || 'info@wecode.co.zw',
                returnUrl: returnUrl,
                resultUrl: resultUrl
            }
        })

        console.log('SmilePay Response:', response)

        if (response.paymentUrl || response.redirectUrl) {
            return {
                ok: true,
                paymentUrl: response.paymentUrl || response.redirectUrl,
                orderReference: response.orderReference || response.reference || invoiceNumber
            }
        }

        throw createError({
            statusCode: 502,
            statusMessage: response.message || 'Failed to initiate Smile&Pay payment'
        })
    } catch (error: any) {
        console.error('SmilePay initiation error:', error)

        if (error.statusCode) throw error

        throw createError({
            statusCode: 502,
            statusMessage: error.data?.message || error.message || 'Failed to connect to Smile&Pay'
        })
    }
})
