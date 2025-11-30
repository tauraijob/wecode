import { z } from 'zod'
import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

const Schema = z.object({
  invoiceNumber: z.string(),
  amount: z.number().positive(),
  courseName: z.string().optional(),
  courseId: z.string().optional()
})

const PAYPAL_EMAIL = 'taujob1111@gmail.com'

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const body = await readBody(event)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const { invoiceNumber, amount, courseName, courseId } = parsed.data

  // Verify invoice exists and belongs to user
  const invoice = await prisma.invoice.findUnique({
    where: { number: invoiceNumber },
    include: {
      user: {
        select: {
          email: true,
          name: true
        }
      },
      enrollments: {
        where: {
          status: { not: 'CANCELLED' }
        },
        include: {
          course: {
            select: {
              id: true
            }
          }
        },
        take: 1
      }
    }
  })

  if (!invoice) {
    throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  }

  if (invoice.userId !== auth.userId && auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  if (invoice.status === 'PAID') {
    throw createError({ statusCode: 400, statusMessage: 'Invoice already paid' })
  }

  // Determine site URL for return URL
  const isDevelopment = process.env.NODE_ENV === 'development'
  let siteUrl = process.env.SITE_URL
  
  if (!siteUrl) {
    siteUrl = isDevelopment ? 'http://localhost:3000' : 'https://wecode.co.zw'
  }
  
  if (!isDevelopment && siteUrl.includes('localhost')) {
    siteUrl = 'https://wecode.co.zw'
  }
  
  if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
    siteUrl = siteUrl.includes('localhost') ? `http://${siteUrl}` : `https://${siteUrl}`
  }

  // Create PayPal payment link
  // Using PayPal's payment link format: https://www.paypal.com/paypalme/{username}/{amount}
  // Or business payment link with item description
  const itemName = courseName || `Course Payment - Invoice ${invoiceNumber}`
  const returnUrl = `${siteUrl.replace(/\/$/, '')}/api/paypal/return?invoice=${encodeURIComponent(invoiceNumber)}`
  
  // Get course ID from parameter, enrollment, or use empty string
  const finalCourseId = courseId || 
    (invoice.enrollments && invoice.enrollments.length > 0 
      ? invoice.enrollments[0].course?.id || '' 
      : '')
  const cancelUrl = finalCourseId 
    ? `${siteUrl.replace(/\/$/, '')}/checkout/${finalCourseId}`
    : `${siteUrl.replace(/\/$/, '')}/dashboard/learn`
  
  // Create PayPal payment URL
  // Format: https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business={email}&amount={amount}&item_name={description}&return={returnUrl}&cancel_return={cancelUrl}
  const paypalParams = new URLSearchParams({
    cmd: '_xclick',
    business: PAYPAL_EMAIL,
    amount: amount.toFixed(2),
    item_name: itemName,
    currency_code: 'USD',
    return: returnUrl,
    cancel_return: cancelUrl,
    invoice: invoiceNumber,
    no_shipping: '1',
    no_note: '1'
  })

  const paymentUrl = `https://www.paypal.com/cgi-bin/webscr?${paypalParams.toString()}`

  // Log payment initiation
  console.log('PayPal payment initiated:', {
    invoiceNumber,
    amount,
    userId: auth.userId,
    paymentUrl
  })

  return {
    ok: true,
    paymentUrl,
    invoiceNumber
  }
})

