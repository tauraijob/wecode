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
  
  // Determine site URL - prioritize SITE_URL env var, then check if we're in development
  // Default to production domain (wecode.co.zw) for safety
  let siteUrl = process.env.SITE_URL
  
  // If SITE_URL is not set, determine based on environment
  if (!siteUrl) {
    // Only use localhost if explicitly in development mode
    const isDevelopment = process.env.NODE_ENV === 'development'
    siteUrl = isDevelopment ? 'http://localhost:3000' : 'https://wecode.co.zw'
  }
  
  // Ensure URL has protocol
  if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
    // Default to https for production domains, http for localhost
    siteUrl = siteUrl.includes('localhost') ? `http://${siteUrl}` : `https://${siteUrl}`
  }
  
  // Force production domain if not localhost (safety check)
  if (!siteUrl.includes('localhost') && !siteUrl.includes('wecode.co.zw')) {
    console.warn(`Warning: SITE_URL (${siteUrl}) doesn't match production domain. Using https://wecode.co.zw`)
    siteUrl = 'https://wecode.co.zw'
  }

  if (!integrationId || !integrationKey) {
    throw createError({ statusCode: 500, statusMessage: 'Paynow not configured' })
  }

  const resultUrl = `${siteUrl.replace(/\/$/, '')}/api/paynow/result`
  // Use custom return URL if provided, otherwise default to dashboard/learn
  const returnUrl = customReturnUrl || `${siteUrl.replace(/\/$/, '')}/dashboard/learn`
  
  // Log for debugging - remove in production if needed
  console.log('PayNow Configuration:', {
    SITE_URL: process.env.SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
    computedSiteUrl: siteUrl,
    resultUrl,
    returnUrl,
    customReturnUrl
  })

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


