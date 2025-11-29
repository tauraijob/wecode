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
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      enrollments: {
        include: {
          course: {
            select: {
              name: true,
              id: true
            }
          }
        }
      }
    }
  })
  
  // Filter out invoices that only have cancelled enrollments (unless paid - keep paid invoices for records)
  const activeInvoices = invoices.filter(invoice => {
    // Keep paid invoices for record-keeping
    if (invoice.status === 'PAID') {
      return true
    }
    
    // For unpaid invoices, only show if there are active enrollments
    const activeEnrollments = invoice.enrollments.filter(
      e => e.status !== 'CANCELLED'
    )
    
    return activeEnrollments.length > 0
  })
  
  // Format invoices with course names and IDs (only from active enrollments)
  const formattedInvoices = activeInvoices.map(invoice => {
    const activeEnrollments = invoice.enrollments.filter(
      e => e.status !== 'CANCELLED'
    )
    
    return {
      id: invoice.id,
      number: invoice.number,
      amountUsd: invoice.amountUsd,
      currency: invoice.currency,
      status: invoice.status,
      createdAt: invoice.createdAt,
      courses: activeEnrollments.map(e => e.course.name),
      courseIds: activeEnrollments.map(e => e.course.id),
      // Get first course ID for checkout link (most invoices have one course)
      firstCourseId: activeEnrollments.length > 0 ? activeEnrollments[0].course.id : null
    }
  })
  
  console.log(`Found ${formattedInvoices.length} active invoices for user ${auth.userId} (filtered from ${invoices.length} total)`, formattedInvoices.map(inv => inv.number))
  
  return formattedInvoices
})


