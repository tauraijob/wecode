import prisma from '~~/server/utils/db'
import { Paynow } from 'paynow'
import { verifyJwt } from '~~/server/utils/jwt'

/**
 * Manually process PayNow return parameters
 * This is useful when webhooks can't reach localhost
 * Called from frontend when user returns from PayNow with payment status in URL
 */
export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const integrationId = process.env.PAYNOW_INTEGRATION_ID
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY

  if (!integrationId || !integrationKey) {
    throw createError({ statusCode: 500, statusMessage: 'Paynow not configured' })
  }

  const body = await readBody(event)
  const queryParams = body.queryParams as Record<string, string> | string

  if (!queryParams) {
    throw createError({ statusCode: 400, statusMessage: 'Query parameters required' })
  }

  try {
    const paynow = new Paynow(integrationId, integrationKey)
    
    // Parse query parameters
    let queryString: string
    if (typeof queryParams === 'string') {
      queryString = queryParams
    } else {
      queryString = new URLSearchParams(queryParams).toString()
    }

    const statusData = paynow.parseStatus(queryString)
    
    if (!statusData) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid payment status' })
    }

    const invoiceNumber = statusData.reference
    if (!invoiceNumber) {
      throw createError({ statusCode: 400, statusMessage: 'Invoice reference not found' })
    }

    console.log('PayNow return processed:', { invoiceNumber, paid: statusData.paid, status: statusData.status })

    // Find invoice
    const invoice = await prisma.invoice.findUnique({
      where: { number: invoiceNumber },
      include: {
        enrollments: true
      }
    })

    if (!invoice) {
      throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
    }

    // Only allow users to process their own invoices
    if (invoice.userId !== auth.userId && auth.role !== 'ADMIN') {
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
    }

    // If payment successful, activate enrollment (same logic as webhook)
    if (statusData.paid) {
      console.log('PayNow return: Payment successful, updating invoice and enrollments', { invoiceId: invoice.id })
      
      // Update invoice status
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: 'PAID' }
      })

      // Check if payment record already exists
      const existingPayment = await prisma.payment.findFirst({
        where: { invoiceId: invoice.id }
      })

      if (!existingPayment) {
        // Create payment record
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            amountUsd: invoice.amountUsd,
            currency: invoice.currency || 'USD',
            status: 'SUCCESS',
            method: 'PAYNOW'
          }
        })
      } else {
        // Update existing payment if it was pending
        if (existingPayment.status === 'PENDING') {
          await prisma.payment.update({
            where: { id: existingPayment.id },
            data: { status: 'SUCCESS' }
          })
        }
      }

      // Activate enrollments linked to this invoice
      for (const enrollment of invoice.enrollments) {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { status: 'ACTIVE' }
        })
      }

      console.log('PayNow return: Successfully processed payment', { invoiceId: invoice.id, enrollmentsUpdated: invoice.enrollments.length })
      
      return {
        ok: true,
        paid: true,
        invoice: {
          id: invoice.id,
          number: invoice.number,
          status: 'PAID'
        }
      }
    } else {
      console.log('PayNow return: Payment not yet paid', { invoiceNumber, status: statusData.status })
      return {
        ok: true,
        paid: false,
        invoice: {
          id: invoice.id,
          number: invoice.number,
          status: invoice.status
        }
      }
    }
  } catch (error: any) {
    console.error('PayNow return processing error:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({ statusCode: 500, statusMessage: error.message || 'Internal server error' })
  }
})

