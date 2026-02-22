import { processSuccessfulPayment } from '~~/server/utils/process-payment'

/**
 * Smile&Pay webhook handler
 * Called by Smile&Pay at resultUrl when payment status changes.
 * 
 * Expected body:
 * {
 *   "merchantId": "",
 *   "reference": "",
 *   "orderReference": "",
 *   "itemName": "",
 *   "amount": null,
 *   "currency": "",
 *   "paymentOption": "",
 *   "status": "",  // PAID, FAILED, CANCELED
 *   "createdDate": "",
 *   "returnUrl": "",
 *   "resultUrl": "",
 *   "clientFee": null,
 *   "merchantFee": null
 * }
 */
export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    console.log('SmilePay webhook received:', JSON.stringify(body, null, 2))

    const { orderReference, reference, status, amount, currency, paymentOption } = body || {}

    // The orderReference is our invoice number
    const invoiceNumber = orderReference || reference

    if (!invoiceNumber) {
        console.error('SmilePay webhook: No order reference found', body)
        throw createError({ statusCode: 400, statusMessage: 'Missing order reference' })
    }

    if (!status) {
        console.error('SmilePay webhook: No status found', body)
        throw createError({ statusCode: 400, statusMessage: 'Missing payment status' })
    }

    console.log('SmilePay webhook processing:', { invoiceNumber, status, amount, paymentOption })

    if (status === 'PAID' || status === 'SUCCESS') {
        const result = await processSuccessfulPayment({
            invoiceNumber,
            method: 'SMILEPAY',
            gatewayReference: reference
        })

        console.log('SmilePay webhook result:', result)
        return { ok: true, ...result }
    }

    if (status === 'FAILED' || status === 'CANCELED') {
        console.log(`SmilePay webhook: Payment ${status} for ${invoiceNumber}`)
        return { ok: true, status, message: `Payment ${status.toLowerCase()}` }
    }

    // PENDING or other status
    console.log(`SmilePay webhook: Payment status ${status} for ${invoiceNumber}`)
    return { ok: true, status }
})
