import prisma, { Decimal } from '~~/server/utils/db'
import { Paynow } from 'paynow'
import { notifyAdmins, createNotification } from '~~/server/utils/notifications'

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

      // Get user info for notifications
      const user = await prisma.user.findUnique({
        where: { id: invoice.userId },
        select: { id: true, name: true, email: true }
      })

      console.log('PayNow webhook: Looking for enrollments with invoiceId:', invoice.id)

      // Activate enrollments linked to this invoice
      const enrollments = await prisma.enrollment.findMany({
        where: { invoiceId: invoice.id },
        include: {
          course: {
            select: {
              id: true,
              name: true,
              instructorId: true
            }
          }
        }
      })

      console.log('PayNow webhook: Found enrollments:', {
        count: enrollments.length,
        enrollments: enrollments.map(e => ({
          id: e.id,
          courseId: e.courseId,
          status: e.status,
          invoiceId: e.invoiceId
        }))
      })

      if (enrollments.length === 0) {
        console.error('PayNow webhook: WARNING - No enrollments found for invoice!', {
          invoiceId: invoice.id,
          invoiceNumber: invoice.number,
          userId: invoice.userId
        })
      }

      for (const enrollment of enrollments) {
        if (enrollment.status !== 'ACTIVE') {
          console.log('PayNow webhook: Updating enrollment to ACTIVE', {
            enrollmentId: enrollment.id,
            currentStatus: enrollment.status
          })

          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { status: 'ACTIVE' }
          })

          console.log('PayNow webhook: Successfully activated enrollment', {
            enrollmentId: enrollment.id,
            courseId: enrollment.courseId
          })

          // Create instructor earning
          try {
            const { createInstructorEarning } = await import('~~/server/utils/instructor-earnings')
            await createInstructorEarning(enrollment.id)
          } catch (earningError) {
            console.error('Failed to create instructor earning:', earningError)
            // Don't fail the payment if earning creation fails
          }

          // Notify admins about successful payment
          await notifyAdmins({
            type: 'PAYMENT_SUCCESS',
            title: 'Payment Received (PayNow)',
            message: `Payment of ${Number(invoice.amountUsd).toFixed(2)} ${invoice.currency || 'USD'} received from ${user?.name || 'a user'} for course "${enrollment.course?.name || 'Unknown'}".`,
            metadata: {
              invoiceId: invoice.id,
              invoiceNumber: invoice.number,
              enrollmentId: enrollment.id,
              courseId: enrollment.courseId,
              courseName: enrollment.course?.name,
              userId: invoice.userId,
              userName: user?.name,
              amount: Number(invoice.amountUsd),
              currency: invoice.currency || 'USD',
              method: 'PAYNOW'
            }
          })

          // Notify user about successful payment
          if (user) {
            await createNotification({
              userId: user.id,
              type: 'PAYMENT_SUCCESS',
              title: 'Payment Successful',
              message: `Your payment of ${Number(invoice.amountUsd).toFixed(2)} ${invoice.currency || 'USD'} for "${enrollment.course?.name || 'course'}" has been processed. You now have access to the course!`,
              metadata: {
                invoiceId: invoice.id,
                invoiceNumber: invoice.number,
                enrollmentId: enrollment.id,
                courseId: enrollment.courseId,
                courseName: enrollment.course?.name,
                amount: Number(invoice.amountUsd),
                currency: invoice.currency || 'USD'
              }
            })
          }

          // Notify instructor about payment
          if (enrollment.course?.instructorId) {
            await createNotification({
              userId: enrollment.course.instructorId,
              type: 'PAYMENT_SUCCESS',
              title: 'Student Payment Received',
              message: `${user?.name || 'A student'} has completed payment for your course "${enrollment.course.name}".`,
              metadata: {
                invoiceId: invoice.id,
                enrollmentId: enrollment.id,
                courseId: enrollment.courseId,
                courseName: enrollment.course.name,
                userId: invoice.userId,
                userName: user?.name,
                amount: Number(invoice.amountUsd),
                currency: invoice.currency || 'USD'
              }
            })
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



