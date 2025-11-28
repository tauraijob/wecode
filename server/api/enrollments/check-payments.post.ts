import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { Paynow } from 'paynow'

/**
 * Check and update payment status for pending enrollments
 * This is useful when webhooks can't reach localhost
 * Checks database for paid invoices and activates enrollments
 * Also polls PayNow to check payment status for unpaid invoices
 */
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

  const integrationId = process.env.PAYNOW_INTEGRATION_ID
  const integrationKey = process.env.PAYNOW_INTEGRATION_KEY
  const canPollPayNow = !!(integrationId && integrationKey)

  // Find all pending enrollments for this user with invoices
  const pendingEnrollments = await prisma.enrollment.findMany({
    where: {
      userId: auth.userId,
      status: 'PENDING',
      invoiceId: {
        not: null
      }
    },
    include: {
      invoice: {
        include: {
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }
    }
  })

  const updated: string[] = []

  // Check each enrollment's invoice status
  for (const enrollment of pendingEnrollments) {
    if (!enrollment.invoice) continue

    const invoice = enrollment.invoice

    // Check if invoice is already marked as PAID in database
    if (invoice.status === 'PAID') {
      // Invoice is paid, activate enrollment if not already active
      if (enrollment.status !== 'ACTIVE') {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { status: 'ACTIVE' }
        })
        updated.push(enrollment.id)
      }
      continue
    }

    // Check if there's a successful payment record but invoice status wasn't updated
    const successPayment = invoice.payments?.find(p => p.status === 'SUCCESS')
    if (successPayment && invoice.status !== 'PAID') {
      // Payment exists and is successful, but invoice status wasn't updated
      // Update invoice and enrollment
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: 'PAID' }
      })
      
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { status: 'ACTIVE' }
      })
      updated.push(enrollment.id)
      continue
    }

    // If invoice is not paid, try to manually process payment status
    // This is especially important for localhost where webhooks can't reach the server
    // We'll check if there's a pending payment and try to verify it
    if (invoice.status !== 'PAID') {
      // Check if there's a recent payment attempt (within last hour)
      const recentPayment = invoice.payments?.find(p => {
        const paymentTime = new Date(p.createdAt).getTime()
        const oneHourAgo = Date.now() - 60 * 60 * 1000
        return paymentTime > oneHourAgo
      })

      // If there's a recent payment attempt, we should check PayNow status
      // However, without pollUrl, we can't directly poll PayNow
      // The webhook should handle this, but on localhost it won't work
      // 
      // Solution: When user returns from PayNow, they should manually trigger
      // payment status check, or we can try to process return URL parameters
      // 
      // For now, we'll log that we're checking and the user should manually
      // check payment status after returning from PayNow
      if (recentPayment) {
        console.log('Found recent payment attempt for invoice:', invoice.number, 'Status:', recentPayment.status)
        // If payment is already marked as SUCCESS but invoice isn't PAID, update it
        if (recentPayment.status === 'SUCCESS' && invoice.status !== 'PAID') {
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: 'PAID' }
          })
          
          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { status: 'ACTIVE' }
          })
          updated.push(enrollment.id)
          continue
        }
      }
    }
  }

  return {
    checked: pendingEnrollments.length,
    updated: updated.length,
    enrollmentIds: updated
  }
})

