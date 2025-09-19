import { z } from 'zod'
import { Paynow } from 'paynow'

const Schema = z.object({
  invoiceNumber: z.string(),
  email: z.string().email().optional(),
  amount: z.number().positive(),
  reference: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })

  const { invoiceNumber, email, amount } = parsed.data

  const integrationId = process.env.PAYNOW_INTEGRATION_ID
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY
  const siteUrl = process.env.SITE_URL || 'https://wecode.co.zw'

  if (!integrationId || !integrationKey) {
    throw createError({ statusCode: 500, statusMessage: 'Paynow not configured' })
  }

  const resultUrl = `${siteUrl}/api/paynow/result` // implement if needed
  const returnUrl = `${siteUrl}/pay/${encodeURIComponent(invoiceNumber)}`

  const paynow = new Paynow(integrationId, integrationKey)
  ;(paynow as any).resultUrl = resultUrl
  ;(paynow as any).returnUrl = returnUrl
  const payment = paynow.createPayment(invoiceNumber, email || 'info@wecode.co.zw')
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


