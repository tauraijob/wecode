import prisma, { Decimal } from '~~/server/utils/db'
import { Paynow } from 'paynow'

/**
 * Paynow webhook handler for payment status updates
 * This endpoint is called by Paynow when payment status changes
 * Paynow sends webhooks as GET requests with query parameters or POST with form data
 * Handles both GET and POST requests
 */
export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const integrationId = process.env.PAYNOW_INTEGRATION_ID
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY

  if (!integrationId || !integrationKey) {
    throw createError({ statusCode: 500, statusMessage: 'Paynow not configured' })
  }

  try {
    const paynow = new Paynow(integrationId, integrationKey)
    
    // Paynow sends webhooks as GET with query params or POST with form data
    // Get query parameters (for GET requests) or body (for POST requests)
    const query = getQuery(event)
    const method = getMethod(event)
    
    let statusData: any
    
    if (method === 'GET' && Object.keys(query).length > 0) {
      // GET request with query parameters
      // Convert query object to query string for parseStatus
      const queryString = new URLSearchParams(query as Record<string, string>).toString()
      statusData = paynow.parseStatus(queryString)
    } else {
      // POST request - try to read body
      try {
        const body = await readBody(event)
        
        // If body is an object, convert to query string
        if (typeof body === 'object' && body !== null) {
          const queryString = new URLSearchParams(body as Record<string, string>).toString()
          statusData = paynow.parseStatus(queryString)
        } else if (typeof body === 'string') {
          statusData = paynow.parseStatus(body)
        } else {
          // Try query params as fallback
          const queryString = new URLSearchParams(query as Record<string, string>).toString()
          statusData = paynow.parseStatus(queryString)
        }
      } catch (bodyError) {
        // If reading body fails, try query params
        const queryString = new URLSearchParams(query as Record<string, string>).toString()
        statusData = paynow.parseStatus(queryString)
      }
    }
    
    if (!statusData) {
      console.error('PayNow webhook: Failed to parse status', { method, query, body: method === 'POST' ? 'attempted' : 'N/A' })
      throw createError({ statusCode: 400, statusMessage: 'Invalid payment status' })
    }

    const invoiceNumber = statusData.reference
    if (!invoiceNumber) {
      console.error('PayNow webhook: No invoice reference found', { statusData })
      throw createError({ statusCode: 400, statusMessage: 'Invoice reference not found' })
    }

    console.log('PayNow webhook received:', { invoiceNumber, paid: statusData.paid, status: statusData.status })

    // Find invoice
    const invoice = await prisma.invoice.findUnique({
      where: { number: invoiceNumber }
    })

    if (!invoice) {
      console.error('PayNow webhook: Invoice not found', { invoiceNumber })
      throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
    }

    // If payment successful, activate enrollment
    if (statusData.paid) {
      console.log('PayNow webhook: Payment successful, updating invoice and enrollments', { invoiceId: invoice.id })
      
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
        // Update existing payment to ensure it's marked as SUCCESS with correct method
        if (existingPayment.status !== 'SUCCESS' || !existingPayment.method) {
          await prisma.payment.update({
            where: { id: existingPayment.id },
            data: { 
              status: 'SUCCESS',
              method: existingPayment.method || 'PAYNOW'
            }
          })
        }
      }

      // Activate enrollments linked to this invoice
      const enrollments = await prisma.enrollment.findMany({
        where: { invoiceId: invoice.id }
      })

      for (const enrollment of enrollments) {
        if (enrollment.status !== 'ACTIVE') {
          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { status: 'ACTIVE' }
          })
          console.log('PayNow webhook: Activated enrollment', { enrollmentId: enrollment.id, courseId: enrollment.courseId })
          
          // Create instructor earning
          try {
            const { createInstructorEarning } = await import('~~/server/utils/instructor-earnings')
            await createInstructorEarning(enrollment.id)
          } catch (earningError) {
            console.error('Failed to create instructor earning:', earningError)
            // Don't fail the payment if earning creation fails
          }
        }
      }

      console.log('PayNow webhook: Successfully processed payment', { 
        invoiceId: invoice.id, 
        enrollmentsUpdated: enrollments.length,
        enrollments: enrollments.map(e => ({ id: e.id, status: e.status }))
      })
    } else {
      console.log('PayNow webhook: Payment not yet paid', { invoiceNumber, status: statusData.status })
    }

    return { ok: true }
  } catch (error: any) {
    console.error('PayNow webhook error:', error)
    // Still return 200 to PayNow to prevent retries for invalid requests
    // But log the error for debugging
    if (error.statusCode) {
      throw error
    }
    throw createError({ statusCode: 500, statusMessage: error.message || 'Internal server error' })
  }
})



