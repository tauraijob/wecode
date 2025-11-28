import prisma, { Decimal } from '~~/server/utils/db'

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
    
    for (const enrollment of enrollments) {
      if (enrollment.status !== 'ACTIVE') {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { status: 'ACTIVE' }
        })
        console.log('Course webhook: Enrollment activated', { enrollmentId: enrollment.id })
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

