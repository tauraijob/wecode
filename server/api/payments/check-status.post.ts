import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { Paynow } from 'paynow'

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
  const invoiceNumber = body.invoiceNumber as string
  const pollUrl = body.pollUrl as string | undefined

  if (!invoiceNumber) {
    throw createError({ statusCode: 400, statusMessage: 'Invoice number required' })
  }

  // Find invoice
  const invoice = await prisma.invoice.findUnique({
    where: { number: invoiceNumber },
    include: {
      enrollments: true,
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  })

  if (!invoice) {
    throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  }

  // Only allow users to check their own invoices
  if (invoice.userId !== auth.userId && auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  // If already paid, return immediately
  if (invoice.status === 'PAID') {
    return {
      paid: true,
      invoice: {
        id: invoice.id,
        number: invoice.number,
        status: invoice.status
      }
    }
  }

  // If pollUrl is provided, try to check payment status with Paynow
  if (pollUrl) {
    try {
      const integrationId = process.env.PAYNOW_INTEGRATION_ID
      const integrationKey = process.env.PAYNOW_INTEGRATION_KEY

      if (integrationId && integrationKey) {
        const paynow = new Paynow(integrationId, integrationKey)
        const status = await paynow.pollTransaction(pollUrl)

        if (status && status.paid) {
          // Payment is confirmed paid, update invoice and enrollments
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: 'PAID' }
          })

          // Check if payment record exists
          const existingPayment = await prisma.payment.findFirst({
            where: { invoiceId: invoice.id }
          })

          if (!existingPayment) {
            await prisma.payment.create({
              data: {
                invoiceId: invoice.id,
                amountUsd: invoice.amountUsd,
                currency: invoice.currency || 'USD',
                status: 'SUCCESS',
                method: 'PAYNOW'
              }
            })
          } else if (existingPayment.status === 'PENDING') {
            await prisma.payment.update({
              where: { id: existingPayment.id },
              data: { status: 'SUCCESS' }
            })
          }

          // Activate enrollments
          for (const enrollment of invoice.enrollments) {
            await prisma.enrollment.update({
              where: { id: enrollment.id },
              data: { status: 'ACTIVE' }
            })
          }

          return {
            paid: true,
            invoice: {
              id: invoice.id,
              number: invoice.number,
              status: 'PAID'
            }
          }
        }
      }
    } catch (pollError) {
      console.error('Error polling PayNow status:', pollError)
      // Continue to return database status if polling fails
    }
  }
  
  return {
    paid: invoice.status === 'PAID',
    invoice: {
      id: invoice.id,
      number: invoice.number,
      status: invoice.status
    }
  }
})

