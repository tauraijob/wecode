import { z } from 'zod'
import { Paynow } from 'paynow'

const Schema = z.object({
  invoiceNumber: z.string(),
  email: z.string().email().optional(),
  amount: z.number().positive(),
  reference: z.string().optional(),
  returnUrl: z.string().url().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })

  const { invoiceNumber, email, amount, returnUrl: customReturnUrl } = parsed.data

  const integrationId = process.env.PAYNOW_INTEGRATION_ID
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY
  // Ensure SITE_URL starts with http:// or https://
  let siteUrl = process.env.SITE_URL || 'http://localhost:3000'
  if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
    siteUrl = `http://${siteUrl}`
  }

  if (!integrationId || !integrationKey) {
    throw createError({ statusCode: 500, statusMessage: 'Paynow not configured' })
  }

  const resultUrl = `${siteUrl.replace(/\/$/, '')}/api/paynow/result`
  // Use custom return URL if provided, otherwise default to dashboard/learn
  const returnUrl = customReturnUrl || `${siteUrl.replace(/\/$/, '')}/dashboard/learn`

  // In production, use the provided email (user's email). 
  // In test mode, Paynow requires the email to match the merchant's registered email
  // For live payments, always use the user's actual email
  // Priority: PAYNOW_TEST_EMAIL (if set) > provided email > default
  const paymentEmail = process.env.PAYNOW_TEST_EMAIL || email || 'info@wecode.co.zw'

  // Paynow constructor requires resultUrl and returnUrl as parameters
  const paynow = new Paynow(integrationId, integrationKey, resultUrl, returnUrl)
  const payment = paynow.createPayment(invoiceNumber, paymentEmail)
  payment.add(invoiceNumber, amount)

  const response = await paynow.send(payment)
  if (!response.success) {
    throw createError({ statusCode: 502, statusMessage: 'Failed to initiate payment' })
  }

  return {
    ok: true,
    redirectUrl: response.redirectUrl,
    pollUrl: response.pollUrl
  }
})


