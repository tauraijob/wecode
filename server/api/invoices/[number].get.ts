import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const invoiceNumber = getRouterParam(event, 'number')
  if (!invoiceNumber) {
    console.error('Invoice API: No invoice number provided in route params')
    throw createError({ statusCode: 400, statusMessage: 'Invoice number required' })
  }
  
  // Log the raw invoice number for debugging
  console.log('Invoice API called with number:', invoiceNumber, {
    type: typeof invoiceNumber,
    length: invoiceNumber?.length,
    url: event.node.req.url,
    userId: auth?.userId
  })
  
  // Debug: Check all invoices for this user
  const allUserInvoicesDebug = await prisma.invoice.findMany({
    where: { userId: auth.userId },
    select: { number: true, id: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  })
  console.log('All invoices for user (debug):', allUserInvoicesDebug.map(inv => ({ number: inv.number, status: inv.status, createdAt: inv.createdAt })))
  
  // Debug: Check all enrollments for this user
  const allUserEnrollmentsDebug = await prisma.enrollment.findMany({
    where: { userId: auth.userId },
    select: { id: true, status: true, invoiceId: true, enrolledAt: true },
    include: {
      invoice: {
        select: { number: true, status: true }
      }
    },
    orderBy: { enrolledAt: 'desc' },
    take: 10
  })
  console.log('All enrollments for user (debug):', allUserEnrollmentsDebug.map(e => ({ 
    id: e.id, 
    status: e.status, 
    invoiceId: e.invoiceId, 
    invoiceNumber: e.invoice?.number,
    enrolledAt: e.enrolledAt
  })))

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  // Trim and normalize the invoice number
  const normalizedInvoiceNumber = invoiceNumber.trim()
  
  console.log('Looking for invoice:', { 
    invoiceNumber: normalizedInvoiceNumber, 
    originalLength: invoiceNumber.length,
    normalizedLength: normalizedInvoiceNumber.length,
    userId: auth.userId, 
    userRole: auth.role,
    timestamp: new Date().toISOString()
  })
  
  // Add a delay to ensure any recent invoice creation is committed
  // This helps with race conditions when redirecting immediately after enrollment
  await new Promise(resolve => setTimeout(resolve, 200))

  // First, try direct lookup by invoice number (fastest and most reliable)
  let invoice = await prisma.invoice.findUnique({
    where: { number: normalizedInvoiceNumber },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      enrollments: {
        include: {
          course: {
            select: {
              id: true,
              name: true,
              description: true,
              thumbnailUrl: true,
              price: true,
              currency: true
            }
          }
        }
      }
    }
  })

  // If found, verify access
  if (invoice) {
    if (invoice.userId !== auth.userId && auth.role !== 'ADMIN') {
      throw createError({ 
        statusCode: 403, 
        statusMessage: 'This invoice belongs to a different account.' 
      })
    }
    console.log('Invoice found by number:', { id: invoice.id, number: invoice.number, userId: invoice.userId })
  }
  
  // If not found, try through enrollment (fallback) - check by invoiceId first
  if (!invoice) {
    // Try to find enrollment that might have this invoice number
    const enrollmentWithInvoice = await prisma.enrollment.findFirst({
      where: {
        userId: auth.userId,
        invoice: {
          number: normalizedInvoiceNumber
        }
      },
      include: {
        invoice: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            },
            enrollments: {
              include: {
                course: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    thumbnailUrl: true,
                    price: true,
                    currency: true
                  }
                }
              }
            }
          }
        }
      }
    })
    
    if (enrollmentWithInvoice?.invoice) {
      invoice = enrollmentWithInvoice.invoice
      console.log('Invoice found through enrollment:', { id: invoice.id, number: invoice.number, userId: invoice.userId })
    } else {
      // Also try finding any pending enrollment for this user and check if invoice number matches
      const pendingEnrollments = await prisma.enrollment.findMany({
        where: {
          userId: auth.userId,
          status: 'PENDING',
          invoiceId: { not: null }
        },
        include: {
          invoice: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              },
              enrollments: {
                include: {
                  course: {
                    select: {
                      id: true,
                      name: true,
                      description: true,
                      thumbnailUrl: true,
                      price: true,
                      currency: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { enrolledAt: 'desc' },
        take: 5
      })
      
      // Check if any of these invoices match the requested number
      for (const enrollment of pendingEnrollments) {
        if (enrollment.invoice && enrollment.invoice.number === normalizedInvoiceNumber) {
          invoice = enrollment.invoice
          console.log('Invoice found through pending enrollment search:', { id: invoice.id, number: invoice.number })
          break
        }
      }
    }
  }
  
  // If still not found, try with retry logic (for race conditions)
  if (!invoice) {
    let retries = 3
    let retryDelay = 200
    
    while (!invoice && retries > 0) {
      invoice = await prisma.invoice.findUnique({
        where: { number: normalizedInvoiceNumber },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          enrollments: {
            include: {
              course: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  thumbnailUrl: true,
                  price: true,
                  currency: true
                }
              }
            }
          }
        }
      })
      
      if (invoice) {
        if (invoice.userId !== auth.userId && auth.role !== 'ADMIN') {
          throw createError({ 
            statusCode: 403, 
            statusMessage: 'This invoice belongs to a different account.' 
          })
        }
        console.log('Invoice found on retry:', { id: invoice.id, number: invoice.number })
        break
      }
      
      if (retries > 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        retryDelay *= 2
      }
      retries--
    }
  }

  // If still not found, try findFirst as final fallback
  if (!invoice) {
    invoice = await prisma.invoice.findFirst({
      where: {
        userId: auth.userId,
        number: normalizedInvoiceNumber
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
                description: true,
                thumbnailUrl: true,
                price: true,
                currency: true
              }
            }
          }
        }
      }
    })
  }

  if (!invoice) {
    // Before throwing error, check if there's a pending enrollment that should have this invoice
    // This handles cases where invoice creation failed but enrollment exists
    const pendingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: auth.userId,
        status: 'PENDING',
        invoiceId: null // No invoice linked yet
      },
      include: {
        course: {
          select: {
            id: true,
            name: true,
            price: true,
            currency: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    })
    
    // If we found a pending enrollment without an invoice, and the invoice number format matches,
    // it's possible the invoice creation failed. Log this for debugging.
    if (pendingEnrollment && normalizedInvoiceNumber.startsWith('COURSE-')) {
      console.warn('Invoice not found but pending enrollment exists:', {
        enrollmentId: pendingEnrollment.id,
        courseId: pendingEnrollment.courseId,
        courseName: pendingEnrollment.course.name,
        requestedInvoice: normalizedInvoiceNumber,
        userId: auth.userId
      })
    }
    
    // Get user's recent invoices for helpful error message
    const userRecentInvoices = await prisma.invoice.findMany({
      where: { userId: auth.userId },
      select: { number: true, status: true, amountUsd: true, currency: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    
    // Also get enrollments with invoices to show what's available
    const enrollmentsWithInvoices = await prisma.enrollment.findMany({
      where: {
        userId: auth.userId,
        status: 'PENDING',
        invoiceId: { not: null }
      },
      include: {
        invoice: {
          select: {
            number: true,
            status: true,
            amountUsd: true,
            currency: true
          }
        },
        course: {
          select: {
            name: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' },
      take: 5
    })
    
    const invoiceList = userRecentInvoices.length > 0 
      ? userRecentInvoices.map(inv => `${inv.number} (${inv.status})`).join(', ')
      : 'No invoices found'
    
    const enrollmentInvoiceList = enrollmentsWithInvoices
      .filter(e => e.invoice)
      .map(e => `${e.invoice!.number} (${e.course.name})`)
      .join(', ')
    
    const errorMessage = enrollmentInvoiceList
      ? `Invoice "${normalizedInvoiceNumber}" not found. Available invoices: ${enrollmentInvoiceList || invoiceList}`
      : `Invoice "${normalizedInvoiceNumber}" not found. Your recent invoices: ${invoiceList}`
    
    throw createError({ 
      statusCode: 404, 
      statusMessage: errorMessage,
      data: {
        requestedInvoice: normalizedInvoiceNumber,
        userInvoices: userRecentInvoices.map(inv => ({
          number: inv.number,
          status: inv.status,
          amountUsd: inv.amountUsd,
          currency: inv.currency,
          createdAt: inv.createdAt
        })),
        pendingEnrollments: enrollmentsWithInvoices.map(e => ({
          courseName: e.course.name,
          invoiceNumber: e.invoice?.number,
          invoiceStatus: e.invoice?.status
        }))
      }
    })
  }
  
  console.log('Invoice found:', { id: invoice.id, number: invoice.number, userId: invoice.userId, invoiceNumberLength: invoice.number.length })

  // Only allow users to view their own invoices, unless admin
  if (invoice.userId !== auth.userId && auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  return invoice
})
