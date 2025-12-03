import prisma, { Decimal } from '~~/server/utils/db'
import { notifyAdmins, createNotification } from '~~/server/utils/notifications'

/**
 * Webhook handler for course payment confirmation
 * This should be called by the payment gateway (PayNow) when payment is successful
 * Can also be called manually for testing (localhost)
 */
export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const body = await readBody(event)
  const invoiceNumber = body.invoiceNumber as string
  const status = body.status as string

  if (!invoiceNumber) {
    throw createError({ statusCode: 400, statusMessage: 'Invoice number required' })
  }

  console.log('Course webhook called:', { invoiceNumber, status })

  // Find invoice with enrollments
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
    console.error('Course webhook: Invoice not found', { invoiceNumber })
    throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  }

  console.log('Course webhook: Invoice found', { 
    invoiceId: invoice.id, 
    currentStatus: invoice.status,
    enrollmentsCount: invoice.enrollments.length 
  })

  // If payment successful, activate enrollment
  if (status === 'SUCCESS' || status === 'PAID') {
    // Update invoice status
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: 'PAID' }
    })
    console.log('Course webhook: Invoice status updated to PAID', { invoiceId: invoice.id })

    // Check if payment record already exists
    const existingPayment = invoice.payments?.[0]
    if (!existingPayment || existingPayment.status !== 'SUCCESS') {
      // Create or update payment record
      if (existingPayment) {
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: { status: 'SUCCESS', method: 'PAYNOW' }
        })
        console.log('Course webhook: Payment record updated', { paymentId: existingPayment.id })
      } else {
        const newPayment = await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            amountUsd: invoice.amountUsd,
            currency: invoice.currency || 'USD',
            status: 'SUCCESS',
            method: 'PAYNOW'
          }
        })
        console.log('Course webhook: Payment record created', { paymentId: newPayment.id })
      }
    }

    // Activate enrollments linked to this invoice
    const enrollments = invoice.enrollments || []
    console.log('Course webhook: Activating enrollments', { count: enrollments.length })
    
    // Get user and course info for notifications
    const user = await prisma.user.findUnique({
      where: { id: invoice.userId },
      select: { id: true, name: true, email: true }
    })

    for (const enrollment of enrollments) {
      if (enrollment.status !== 'ACTIVE') {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { status: 'ACTIVE' }
        })
        console.log('Course webhook: Enrollment activated', { enrollmentId: enrollment.id })

        // Get course info for notifications
        const course = await prisma.course.findUnique({
          where: { id: enrollment.courseId },
          select: { id: true, name: true, instructorId: true }
        })

        // Notify admins about successful payment
        await notifyAdmins({
          type: 'PAYMENT_SUCCESS',
          title: 'Payment Received',
          message: `Payment of ${Number(invoice.amountUsd).toFixed(2)} ${invoice.currency || 'USD'} received from ${user?.name || 'a user'} for course "${course?.name || 'Unknown'}".`,
          metadata: { 
            invoiceId: invoice.id, 
            invoiceNumber: invoice.number,
            enrollmentId: enrollment.id,
            courseId: enrollment.courseId,
            courseName: course?.name,
            userId: invoice.userId,
            userName: user?.name,
            amount: Number(invoice.amountUsd),
            currency: invoice.currency || 'USD'
          }
        })

        // Notify user about successful payment
        if (user) {
          await createNotification({
            userId: user.id,
            type: 'PAYMENT_SUCCESS',
            title: 'Payment Successful',
            message: `Your payment of ${Number(invoice.amountUsd).toFixed(2)} ${invoice.currency || 'USD'} for "${course?.name || 'course'}" has been processed. You now have access to the course!`,
            metadata: { 
              invoiceId: invoice.id, 
              invoiceNumber: invoice.number,
              enrollmentId: enrollment.id,
              courseId: enrollment.courseId,
              courseName: course?.name,
              amount: Number(invoice.amountUsd),
              currency: invoice.currency || 'USD'
            }
          })
        }

        // Notify instructor about payment
        if (course?.instructorId) {
          await createNotification({
            userId: course.instructorId,
            type: 'PAYMENT_SUCCESS',
            title: 'Student Payment Received',
            message: `${user?.name || 'A student'} has completed payment for your course "${course.name}".`,
            metadata: { 
              invoiceId: invoice.id, 
              enrollmentId: enrollment.id,
              courseId: enrollment.courseId,
              courseName: course.name,
              userId: invoice.userId,
              userName: user?.name,
              amount: Number(invoice.amountUsd),
              currency: invoice.currency || 'USD'
            }
          })
        }
      } else {
        console.log('Course webhook: Enrollment already active', { enrollmentId: enrollment.id })
      }
    }

    console.log('Course webhook: Successfully processed payment', { 
      invoiceId: invoice.id, 
      enrollmentsUpdated: enrollments.length 
    })
  }

  return { ok: true, invoiceId: invoice.id, enrollmentsUpdated: invoice.enrollments.length }
})

