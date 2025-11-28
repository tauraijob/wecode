import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const invoiceNumber = getRouterParam(event, 'number')
  if (!invoiceNumber) {
    throw createError({ statusCode: 400, statusMessage: 'Invoice number required' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const normalizedInvoiceNumber = invoiceNumber.trim()
  
  // Add a small delay to ensure any recent invoice creation is committed
  await new Promise(resolve => setTimeout(resolve, 50))
  
  // Try to find invoice with retry logic
  let invoice = null
  let retries = 3
  let retryDelay = 100
  
  while (!invoice && retries > 0) {
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
                name: true,
                description: true,
                price: true,
                currency: true
              }
            }
          }
        }
      }
    })
    
    if (!invoice && retries > 1) {
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      retryDelay *= 2 // Exponential backoff
    }
    retries--
  }
  
  // Fallback: try findUnique
  if (!invoice) {
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
                name: true,
                description: true,
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
    throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  }

  // Only allow users to view their own invoices, unless admin
  if (invoice.userId !== auth.userId && auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  // Generate PDF
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792]) // Letter size (8.5 x 11 inches)

  // Load fonts
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  // Colors
  const navyBlue = rgb(0.1, 0.23, 0.36) // #1a3a5c
  const darkGray = rgb(0.3, 0.3, 0.3)
  const lightGray = rgb(0.7, 0.7, 0.7)

  let yPosition = 750

  // Header - Company Info
  page.drawText('WeCodeZW', {
    x: 50,
    y: yPosition,
    size: 28,
    font: boldFont,
    color: navyBlue
  })

  yPosition -= 25
  page.drawText('Bridging knowledge, technology, and innovation', {
    x: 50,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: darkGray
  })

  yPosition -= 15
  page.drawText('Email: info@wecode.co.zw | Phone: +263 778 456 168', {
    x: 50,
    y: yPosition,
    size: 9,
    font: regularFont,
    color: lightGray
  })

  // Invoice Title
  yPosition -= 40
  page.drawText('INVOICE', {
    x: 50,
    y: yPosition,
    size: 24,
    font: boldFont,
    color: navyBlue
  })

  // Invoice Details Section
  yPosition -= 50
  const leftColumn = 50
  const rightColumn = 350

  // Invoice Number
  page.drawText('Invoice Number:', {
    x: leftColumn,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: darkGray
  })
  page.drawText(invoice.number, {
    x: rightColumn,
    y: yPosition,
    size: 10,
    font: boldFont,
    color: navyBlue
  })

  yPosition -= 20
  // Invoice Date
  const invoiceDate = invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
  page.drawText('Invoice Date:', {
    x: leftColumn,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: darkGray
  })
  page.drawText(invoiceDate, {
    x: rightColumn,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: darkGray
  })

  yPosition -= 20
  // Status
  page.drawText('Status:', {
    x: leftColumn,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: darkGray
  })
  const statusColor = invoice.status === 'PAID' ? rgb(0, 0.6, 0.3) : rgb(0.9, 0.6, 0)
  page.drawText(invoice.status, {
    x: rightColumn,
    y: yPosition,
    size: 10,
    font: boldFont,
    color: statusColor
  })

  // Bill To Section
  yPosition -= 50
  page.drawText('Bill To:', {
    x: leftColumn,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: navyBlue
  })

  yPosition -= 20
  if (invoice.user) {
    page.drawText(invoice.user.name || 'Customer', {
      x: leftColumn,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: darkGray
    })

    yPosition -= 15
    if (invoice.user.email) {
      page.drawText(invoice.user.email, {
        x: leftColumn,
        y: yPosition,
        size: 10,
        font: regularFont,
        color: darkGray
      })
      yPosition -= 15
    }
  }

  // Items Section
  yPosition -= 30
  page.drawText('Items:', {
    x: leftColumn,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: navyBlue
  })

  yPosition -= 25
  // Table Header
  page.drawRectangle({
    x: leftColumn,
    y: yPosition - 15,
    width: 512,
    height: 20,
    color: rgb(0.95, 0.95, 0.95)
  })

  page.drawText('Description', {
    x: leftColumn + 5,
    y: yPosition,
    size: 10,
    font: boldFont,
    color: navyBlue
  })

  page.drawText('Amount', {
    x: rightColumn + 200,
    y: yPosition,
    size: 10,
    font: boldFont,
    color: navyBlue
  })

  yPosition -= 30

  // Course Items
  if (invoice.enrollments && invoice.enrollments.length > 0) {
    for (const enrollment of invoice.enrollments) {
      const courseName = enrollment.course.name
      const amount = Number(enrollment.course.price).toFixed(2)
      const currency = enrollment.course.currency || 'USD'

      // Wrap long course names
      const maxWidth = 300
      const courseNameLines = wrapText(courseName, maxWidth, regularFont, 10)
      
      for (const line of courseNameLines) {
        page.drawText(line, {
          x: leftColumn + 5,
          y: yPosition,
          size: 10,
          font: regularFont,
          color: darkGray
        })
        yPosition -= 15
      }

      page.drawText(`${currency} ${amount}`, {
        x: rightColumn + 200,
        y: yPosition + (courseNameLines.length - 1) * 15,
        size: 10,
        font: regularFont,
        color: darkGray
      })

      yPosition -= 10
    }
  } else {
    // Fallback if no enrollments
    page.drawText('Course Enrollment', {
      x: leftColumn + 5,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: darkGray
    })
    page.drawText(`${invoice.currency || 'USD'} ${Number(invoice.amountUsd).toFixed(2)}`, {
      x: rightColumn + 200,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: darkGray
    })
    yPosition -= 25
  }

  // Total Section
  yPosition -= 20
  page.drawLine({
    start: { x: leftColumn, y: yPosition },
    end: { x: leftColumn + 512, y: yPosition },
    thickness: 1,
    color: lightGray
  })

  yPosition -= 30
  page.drawText('Total Amount:', {
    x: rightColumn + 100,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: navyBlue
  })

  const totalAmount = `${invoice.currency || 'USD'} ${Number(invoice.amountUsd).toFixed(2)}`
  const totalWidth = boldFont.widthOfTextAtSize(totalAmount, 14)
  page.drawText(totalAmount, {
    x: rightColumn + 300 - totalWidth,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: navyBlue
  })

  // Footer
  yPosition = 100
  page.drawText('Thank you for your business!', {
    x: leftColumn,
    y: yPosition,
    size: 10,
    font: regularFont,
    color: lightGray
  })

  yPosition -= 20
  page.drawText('For payment inquiries, contact us at info@wecode.co.zw or +263 778 456 168', {
    x: leftColumn,
    y: yPosition,
    size: 9,
    font: regularFont,
    color: lightGray
  })

  // Generate PDF bytes
  const pdfBytes = await pdfDoc.save()

  // Set response headers
  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `inline; filename="invoice-${invoice.number}.pdf"`)

  return pdfBytes
})

// Helper function to wrap text
function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const width = font.widthOfTextAtSize(testLine, fontSize)

    if (width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

