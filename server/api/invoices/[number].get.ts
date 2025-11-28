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
    url: event.node.req.url
  })

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
  
  // First, let's check all invoices for this user to see what we have
  const allUserInvoices = await prisma.invoice.findMany({
    where: { userId: auth.userId },
    select: { number: true, id: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  })
  console.log('All invoices for user:', allUserInvoices.map(inv => inv.number))
  console.log('Looking for invoice number:', normalizedInvoiceNumber)
  console.log('Invoice exists in user list?', allUserInvoices.some(inv => inv.number === normalizedInvoiceNumber))
  
  // Check if invoice exists at all (any user) for debugging
  const anyInvoiceCheck = await prisma.invoice.findUnique({
    where: { number: normalizedInvoiceNumber },
    select: { id: true, number: true, userId: true }
  })
  console.log('Invoice exists in database?', anyInvoiceCheck ? { 
    id: anyInvoiceCheck.id, 
    number: anyInvoiceCheck.number, 
    userId: anyInvoiceCheck.userId, 
    matchesRequestingUser: anyInvoiceCheck.userId === auth.userId 
  } : 'not found')

  // First, try to find invoice through enrollment (most reliable for course enrollments)
  // This is the primary method since enrollments are directly linked to invoices
  // BUT: Also check cancelled enrollments to find invoices even if enrollment was cancelled
  let invoice = null
  const enrollmentWithInvoice = await prisma.enrollment.findFirst({
    where: {
      userId: auth.userId,
      invoice: {
        number: normalizedInvoiceNumber
      }
      // Don't filter by status - include cancelled enrollments too so we can find the invoice
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
    console.log('Invoice found through enrollment (primary method):', { id: invoice.id, number: invoice.number, userId: invoice.userId, enrollmentStatus: enrollmentWithInvoice.status })
  }
  
  // If not found through enrollment, try direct lookup with retry logic
  let retries = 5
  let retryDelay = 300
  
  while (!invoice && retries > 0) {
    // Try findUnique first (most efficient and uses index)
    const foundInvoice = await prisma.invoice.findUnique({
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
    if (foundInvoice) {
      if (foundInvoice.userId !== auth.userId && auth.role !== 'ADMIN') {
        console.log('Invoice found but belongs to different user:', { invoiceUserId: foundInvoice.userId, requestingUserId: auth.userId })
        throw createError({ 
          statusCode: 403, 
          statusMessage: 'This invoice belongs to a different account.' 
        })
      }
      // Invoice found and access verified - assign and break out of retry loop
      invoice = foundInvoice
      console.log('Invoice found and verified:', { id: invoice.id, number: invoice.number, userId: invoice.userId })
      break
    }
    
    if (retries > 1) {
      console.log(`Invoice not found, retrying in ${retryDelay}ms... (${retries - 1} retries left)`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      retryDelay *= 2 // Exponential backoff
    }
    retries--
  }

  console.log('Invoice lookup result (by number):', invoice ? { id: invoice.id, number: invoice.number, userId: invoice.userId } : 'not found')
  
  // If still not found, try a more aggressive search through all user invoices
  if (!invoice) {
    console.log('Trying to find invoice in all user invoices...')
    const allInvoices = await prisma.invoice.findMany({
      where: { userId: auth.userId },
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
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    
    // Try exact match first
    invoice = allInvoices.find(inv => inv.number === normalizedInvoiceNumber)
    
    // If still not found, try partial match (in case of encoding issues)
    if (!invoice) {
      invoice = allInvoices.find(inv => 
        inv.number.includes(normalizedInvoiceNumber.replace('COURSE-', '')) ||
        normalizedInvoiceNumber.includes(inv.number.replace('COURSE-', ''))
      )
    }
    
    console.log('Invoice lookup result (from all user invoices):', invoice ? { id: invoice.id, number: invoice.number, userId: invoice.userId } : 'not found')
  }
  
  // If still not found, try findFirst with user filter as final fallback
  if (!invoice) {
    console.log('Trying findFirst with user filter as final fallback...')
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
    console.log('Invoice lookup result (by number - any user):', invoice ? { id: invoice.id, number: invoice.number, userId: invoice.userId } : 'not found')
  }

  // If not found, try to find by ID (in case number format changed)
  if (!invoice) {
    console.log('Trying to find invoice by ID...')
    invoice = await prisma.invoice.findUnique({
      where: { id: normalizedInvoiceNumber },
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
    console.log('Invoice lookup result (by ID):', invoice ? { id: invoice.id, number: invoice.number, userId: invoice.userId } : 'not found')
  }

  // If still not found, try to find by searching enrollments (fallback)
  if (!invoice) {
    console.log('Trying to find invoice through enrollments...')
    // Find enrollment that might have this invoice
    const enrollment = await prisma.enrollment.findFirst({
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

    if (enrollment?.invoice) {
      console.log('Found invoice through enrollment:', { id: enrollment.invoice.id, number: enrollment.invoice.number })
      invoice = enrollment.invoice
    } else {
      console.log('No enrollment found with this invoice')
    }
  }

  // Last resort: search all invoices for this user
  if (!invoice) {
    const allInvoices = await prisma.invoice.findMany({
      where: {
        userId: auth.userId
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    })

    // Try to find by partial match
    const matchingInvoice = allInvoices.find(inv => 
      inv.number.includes(normalizedInvoiceNumber.replace('COURSE-', '')) ||
      normalizedInvoiceNumber.includes(inv.number.replace('COURSE-', '')) ||
      inv.number === normalizedInvoiceNumber
    )

    if (matchingInvoice) {
      invoice = matchingInvoice
    } else if (allInvoices.length > 0) {
      // Return the most recent invoice as fallback
      console.warn(`Invoice ${invoiceNumber} not found, returning most recent invoice for user`)
      invoice = allInvoices[0]
    }
  }

  if (!invoice) {
    // Get recent invoices for debugging
    const recentInvoices = await prisma.invoice.findMany({
      where: { userId: auth.userId },
      select: { number: true, createdAt: true, userId: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    
    // Also check if invoice exists for any user (raw query to check exact match)
    const anyInvoice = await prisma.invoice.findUnique({
      where: { number: normalizedInvoiceNumber },
      select: { id: true, number: true, userId: true }
    })
    
    // Try to find with findFirst in case of encoding issues
    const invoiceByFindFirst = await prisma.invoice.findFirst({
      where: {
        number: {
          equals: normalizedInvoiceNumber
        }
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
    
    if (invoiceByFindFirst) {
      console.log('Found invoice using findFirst:', { id: invoiceByFindFirst.id, number: invoiceByFindFirst.number, userId: invoiceByFindFirst.userId })
      invoice = invoiceByFindFirst
    }
    
    if (!invoice) {
      console.error(`Invoice not found: ${normalizedInvoiceNumber}`, {
        userId: auth.userId,
        userRole: auth.role,
        searchedNumber: normalizedInvoiceNumber,
        searchedNumberLength: normalizedInvoiceNumber.length,
        searchedNumberBytes: Buffer.from(normalizedInvoiceNumber).toString('hex'),
        allUserInvoices: allUserInvoices.map(inv => inv.number),
        recentInvoices: recentInvoices.map(inv => ({ 
          number: inv.number, 
          numberLength: inv.number.length,
          numberBytes: Buffer.from(inv.number).toString('hex'),
          userId: inv.userId 
        })),
        invoiceExistsForOtherUser: anyInvoice ? { 
          userId: anyInvoice.userId,
          number: anyInvoice.number,
          numberLength: anyInvoice.number.length
        } : null,
        searchedBy: ['number', 'id', 'enrollment', 'contains', 'findFirst']
      })
      
      // If invoice exists but for different user, provide helpful message
      if (anyInvoice && anyInvoice.userId !== auth.userId) {
        throw createError({ 
          statusCode: 403, 
          statusMessage: 'This invoice belongs to a different account.' 
        })
      }
      
      // Get user's recent invoices for helpful error message
      const userRecentInvoices = await prisma.invoice.findMany({
        where: { userId: auth.userId },
        select: { number: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
      
      const invoiceList = userRecentInvoices.length > 0 
        ? userRecentInvoices.map(inv => `${inv.number} (${inv.status})`).join(', ')
        : 'No invoices found'
      
      throw createError({ 
        statusCode: 404, 
        statusMessage: `Invoice "${normalizedInvoiceNumber}" not found. Your recent invoices: ${invoiceList}`,
        data: {
          requestedInvoice: normalizedInvoiceNumber,
          userInvoices: userRecentInvoices.map(inv => ({
            number: inv.number,
            status: inv.status,
            createdAt: inv.createdAt
          }))
        }
      })
    }
  }
  
  console.log('Invoice found:', { id: invoice.id, number: invoice.number, userId: invoice.userId, invoiceNumberLength: invoice.number.length })

  // Only allow users to view their own invoices, unless admin
  if (invoice.userId !== auth.userId && auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  return invoice
})
