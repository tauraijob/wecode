import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

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

  // Only allow users to clean up their own invoices
  const userInvoices = await prisma.invoice.findMany({
    where: { userId: auth.userId },
    include: {
      enrollments: {
        select: {
          id: true,
          status: true
        }
      },
      payments: {
        select: {
          id: true,
          status: true
        }
      }
    }
  })

  const deletedInvoices: string[] = []
  const keptInvoices: string[] = []

  for (const invoice of userInvoices) {
    const isPaid = invoice.status === 'PAID'
    const hasSuccessfulPayment = invoice.payments.some(p => p.status === 'SUCCESS')
    const activeEnrollments = invoice.enrollments.filter(e => e.status !== 'CANCELLED')

    // Delete if unpaid, no successful payments, and no active enrollments
    if (!isPaid && !hasSuccessfulPayment && activeEnrollments.length === 0) {
      // First, clear invoiceId from any cancelled enrollments
      await prisma.enrollment.updateMany({
        where: {
          invoiceId: invoice.id,
          status: 'CANCELLED'
        },
        data: {
          invoiceId: null
        }
      })

      // Then delete the invoice
      await prisma.invoice.delete({
        where: { id: invoice.id }
      })

      deletedInvoices.push(invoice.number)
      console.log(`Deleted orphaned invoice: ${invoice.number}`)
    } else {
      keptInvoices.push(invoice.number)
    }
  }

  return {
    success: true,
    deleted: deletedInvoices.length,
    kept: keptInvoices.length,
    deletedInvoices,
    message: `Cleaned up ${deletedInvoices.length} orphaned invoice(s). ${keptInvoices.length} invoice(s) kept.`
  }
})



