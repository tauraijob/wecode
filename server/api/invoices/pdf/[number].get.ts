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
  
  await new Promise(resolve => setTimeout(resolve, 50))
  
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
      retryDelay *= 2
    }
    retries--
  }
  
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

  if (invoice.userId !== auth.userId && auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  // Simple Invoice
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792])

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const black = rgb(0, 0, 0)
  const darkGray = rgb(0.3, 0.3, 0.3)
  const gray = rgb(0.5, 0.5, 0.5)

  const margin = 50
  let yPos = 750

  // Company Info
  page.drawText('WeCodeZW', {
    x: margin,
    y: yPos,
    size: 24,
    font: boldFont,
    color: black
  })

  yPos -= 20
  page.drawText('194 Baines Ave, Harare', {
    x: margin,
    y: yPos,
    size: 10,
    font: regularFont,
    color: darkGray
  })

  yPos -= 15
  page.drawText('Phone: +263 778 456 168', {
    x: margin,
    y: yPos,
    size: 10,
    font: regularFont,
    color: darkGray
  })

  yPos -= 15
  page.drawText('Email: info@wecode.co.zw', {
    x: margin,
    y: yPos,
    size: 10,
    font: regularFont,
    color: darkGray
  })

  // Invoice Title
  yPos -= 40
  page.drawText('INVOICE', {
    x: margin,
    y: yPos,
    size: 20,
    font: boldFont,
    color: black
  })

  // Invoice Details
  yPos -= 40
  page.drawText('Invoice Number:', {
    x: margin,
    y: yPos,
    size: 10,
    font: regularFont,
    color: darkGray
  })
  page.drawText(invoice.number, {
    x: margin + 100,
    y: yPos,
    size: 10,
    font: regularFont,
    color: black
  })

  yPos -= 20
  const invoiceDate = invoice.createdAt 
    ? new Date(invoice.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : new Date().toLocaleDateString()
  page.drawText('Date:', {
    x: margin,
    y: yPos,
    size: 10,
    font: regularFont,
    color: darkGray
  })
  page.drawText(invoiceDate, {
    x: margin + 100,
    y: yPos,
    size: 10,
    font: regularFont,
    color: black
  })

  yPos -= 20
  page.drawText('Status:', {
    x: margin,
    y: yPos,
    size: 10,
    font: regularFont,
    color: darkGray
  })
  page.drawText(invoice.status, {
    x: margin + 100,
    y: yPos,
    size: 10,
    font: boldFont,
    color: black
  })

  // Bill To
  yPos -= 40
  page.drawText('Bill To:', {
    x: margin,
    y: yPos,
    size: 11,
    font: boldFont,
    color: black
  })

  yPos -= 20
  if (invoice.user) {
    page.drawText(invoice.user.name || 'Customer', {
      x: margin,
      y: yPos,
      size: 10,
      font: regularFont,
      color: black
    })

    yPos -= 15
    if (invoice.user.email) {
      page.drawText(invoice.user.email, {
        x: margin,
        y: yPos,
        size: 10,
        font: regularFont,
        color: darkGray
      })
      yPos -= 30
    }
  }

  // Items
  yPos -= 10
  page.drawText('Items:', {
    x: margin,
    y: yPos,
    size: 11,
    font: boldFont,
    color: black
  })

  yPos -= 25
  // Simple table header
  page.drawText('Description', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: black
  })
  page.drawText('Amount', {
    x: 450,
    y: yPos,
    size: 10,
    font: boldFont,
    color: black
  })

  yPos -= 20
  page.drawLine({
    start: { x: margin, y: yPos },
    end: { x: 550, y: yPos },
    thickness: 0.5,
    color: gray
  })

  yPos -= 20

  // Items list
  let subtotal = 0
  const currency = invoice.currency || 'USD'
  
  if (invoice.enrollments && invoice.enrollments.length > 0) {
    for (const enrollment of invoice.enrollments) {
      const courseName = enrollment.course.name
      const price = Number(enrollment.course.price)
      subtotal += price

      const maxWidth = 350
      const courseLines = wrapText(courseName, maxWidth, regularFont, 10)
      
      for (const line of courseLines) {
        page.drawText(line, {
          x: margin,
          y: yPos,
          size: 10,
          font: regularFont,
          color: black
        })
        yPos -= 15
      }

      const amountText = `${currency} ${price.toFixed(2)}`
      const amountWidth = regularFont.widthOfTextAtSize(amountText, 10)
      page.drawText(amountText, {
        x: 550 - amountWidth,
        y: yPos + (courseLines.length - 1) * 15,
        size: 10,
        font: regularFont,
        color: black
      })

      yPos -= 10
    }
  } else {
    const price = Number(invoice.amountUsd)
    subtotal = price
    page.drawText('Course Enrollment', {
      x: margin,
      y: yPos,
      size: 10,
      font: regularFont,
      color: black
    })
    const amountText = `${currency} ${price.toFixed(2)}`
    const amountWidth = regularFont.widthOfTextAtSize(amountText, 10)
    page.drawText(amountText, {
      x: 550 - amountWidth,
      y: yPos,
      size: 10,
      font: regularFont,
      color: black
    })
    yPos -= 20
  }

  // Total
  yPos -= 20
  page.drawLine({
    start: { x: margin, y: yPos },
    end: { x: 550, y: yPos },
    thickness: 0.5,
    color: gray
  })

  yPos -= 25
  page.drawText('Total:', {
    x: margin,
    y: yPos,
    size: 12,
    font: boldFont,
    color: black
  })

  const totalText = `${currency} ${subtotal.toFixed(2)}`
  const totalWidth = boldFont.widthOfTextAtSize(totalText, 12)
  page.drawText(totalText, {
    x: 550 - totalWidth,
    y: yPos,
    size: 12,
    font: boldFont,
    color: black
  })

  // Payment Options (if unpaid)
  if (invoice.status !== 'PAID') {
    yPos -= 50
    page.drawText('Payment Options:', {
      x: margin,
      y: yPos,
      size: 11,
      font: boldFont,
      color: black
    })

    yPos -= 25
    const isDevelopment = process.env.NODE_ENV === 'development'
    let siteUrl = process.env.SITE_URL || (isDevelopment ? 'http://localhost:3000' : 'https://wecode.co.zw')
    if (!isDevelopment && siteUrl.includes('localhost')) {
      siteUrl = 'https://wecode.co.zw'
    }
    const paymentUrl = `${siteUrl}/pay/${invoice.number}`

    page.drawText('1. Pay Online: ' + paymentUrl, {
      x: margin,
      y: yPos,
      size: 9,
      font: regularFont,
      color: black
    })

    yPos -= 20
    page.drawText('2. Bank Transfer: Account 1234567890', {
      x: margin,
      y: yPos,
      size: 9,
      font: regularFont,
      color: black
    })

    yPos -= 20
    page.drawText('3. Mobile Money: Ecocash 0778456168', {
      x: margin,
      y: yPos,
      size: 9,
      font: regularFont,
      color: black
    })
  }

  // Footer
  yPos = 80
  page.drawText('Thank you for your business!', {
    x: margin,
    y: yPos,
    size: 9,
    font: regularFont,
    color: gray
  })

  const pdfBytes = await pdfDoc.save()

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `inline; filename="invoice-${invoice.number}.pdf"`)

  return pdfBytes
})

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
