import prismaModule from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const query = getQuery(event)
  const invoiceNumber = query.invoice as string

  if (!invoiceNumber) {
    // Redirect to dashboard if no invoice number
    return sendRedirect(event, '/dashboard/learn')
  }

  // Find the invoice and its enrollments to get course ID
  const invoice = await prisma.invoice.findUnique({
    where: { number: invoiceNumber },
    include: {
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
        }
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  })

  if (!invoice) {
    return sendRedirect(event, '/dashboard/learn')
  }

  // Check if payment was successful (PayPal sends 'tx' parameter for successful payments)
  const tx = query.tx as string
  const paymentStatus = query.st as string

  if (tx && paymentStatus === 'Completed') {
    // Payment was successful - update invoice and enrollment
    try {
      // Update invoice status
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: 'PAID'
        }
      })

      // Check if payment record already exists
      const existingPayment = invoice.payments?.[0]
      if (!existingPayment || existingPayment.status !== 'SUCCESS') {
        // Create or update payment record
        if (existingPayment) {
          await prisma.payment.update({
            where: { id: existingPayment.id },
            data: { 
              status: 'SUCCESS', 
              method: 'PAYPAL'
            }
          })
          console.log('PayPal return: Payment record updated', { paymentId: existingPayment.id, transactionId: tx })
        } else {
          const newPayment = await prisma.payment.create({
            data: {
              invoiceId: invoice.id,
              amountUsd: invoice.amountUsd,
              currency: invoice.currency || 'USD',
              status: 'SUCCESS',
              method: 'PAYPAL'
            }
          })
          console.log('PayPal return: Payment record created', { paymentId: newPayment.id, transactionId: tx })
        }
      }

      // Activate enrollments linked to this invoice
      for (const enrollment of invoice.enrollments) {
        if (enrollment.status !== 'ACTIVE') {
          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { status: 'ACTIVE' }
          })
          console.log('PayPal return: Activated enrollment', { enrollmentId: enrollment.id, courseId: enrollment.courseId })
          
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

      console.log('PayPal payment processed successfully:', {
        invoiceNumber,
        transactionId: tx,
        invoiceId: invoice.id
      })
    } catch (error) {
      console.error('Error processing PayPal payment:', error)
    }
  }

  // Redirect to course if available, otherwise dashboard
  if (invoice.enrollments.length > 0 && invoice.enrollments[0].course) {
    return sendRedirect(event, `/dashboard/learn/${invoice.enrollments[0].course.id}`)
  }

  return sendRedirect(event, '/dashboard/learn')
})

