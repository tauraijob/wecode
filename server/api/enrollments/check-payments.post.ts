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

  // Get pollUrl from request body if provided (stored in localStorage on frontend)
  const body = await readBody(event).catch(() => ({}))
  const pollUrlMap = (body as any)?.pollUrls as Record<string, string> | undefined

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

    // If invoice is not paid, try to poll PayNow using pollUrl
    if (invoice.status !== 'PAID' && canPollPayNow) {
      // Try to get pollUrl from provided map (keyed by invoice number)
      const pollUrl = pollUrlMap?.[invoice.number]
      
      if (pollUrl) {
        try {
          const paynow = new Paynow(integrationId, integrationKey)
          const status = await paynow.pollTransaction(pollUrl)
          
          if (status && status.paid) {
            console.log('PayNow poll: Payment confirmed for invoice:', invoice.number)
            
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
            } else {
              // Update existing payment to ensure it's marked as SUCCESS
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
            
            // Activate enrollment
            await prisma.enrollment.update({
              where: { id: enrollment.id },
              data: { status: 'ACTIVE' }
            })
            
            updated.push(enrollment.id)
            continue
          }
        } catch (pollError) {
          console.error('Error polling PayNow for invoice:', invoice.number, pollError)
          // Continue to check other enrollments even if polling fails
        }
      }
      
      // If no pollUrl but there's a recent payment attempt, check if payment was already successful
      const recentPayment = invoice.payments?.find(p => {
        const paymentTime = new Date(p.createdAt).getTime()
        const oneHourAgo = Date.now() - 60 * 60 * 1000
        return paymentTime > oneHourAgo
      })

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

