import { QuoteRequestSchema, calculateQuote, renderInvoiceHtml } from '~~/server/utils/pricing'
import { sendMail } from '~~/server/utils/mailer'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import prisma from '~~/server/utils/db'
import { getQuoteRequestAdminTemplate, getQuoteRequestUserTemplate } from '~~/server/utils/email-templates'

export default defineEventHandler(async (event) => {
  // Check if database is available
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const body = await readBody(event)
  const parsed = QuoteRequestSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const data = parsed.data
  const quote = calculateQuote(data)

  const invoiceNumber = `WCZW-${Date.now()}`
  const company = { name: 'WeCodeZW', email: process.env.MAIL_FROM || 'info@wecode.co.zw', phone: '+263778456168' }
  const invoiceHtml = renderInvoiceHtml({ quote, request: data, invoiceNumber, company })

  // Upsert user and school, persist quote+invoice
  const user = await prisma.user.upsert({
    where: { email: data.email },
    update: { name: data.contactName, phone: data.phone || undefined },
    create: { email: data.email, name: data.contactName, hashedPassword: '' }
  })

  // Find or create school by owner
  let school = await prisma.school.findFirst({
    where: { ownerId: user.id }
  })

  if (school) {
    school = await prisma.school.update({
      where: { id: school.id },
      data: { name: data.schoolName, contactName: data.contactName, phone: data.phone || undefined }
    })
  } else {
    school = await prisma.school.create({
      data: { name: data.schoolName, contactEmail: data.email, contactName: data.contactName, phone: data.phone || undefined, ownerId: user.id }
    })
  }

  const quoteRecord = await prisma.quote.create({
    data: {
      number: invoiceNumber,
      currency: quote.currency,
      totalUsd: quote.total,
      data: quote as any,
      userId: user.id,
      schoolId: school.id,
      items: {
        create: quote.items.map(i => ({ name: i.name, unitUsd: i.unitPrice, quantity: i.quantity, lineUsd: i.total }))
      }
    }
  })

  // Also create a pending request and an invoice record for admin visibility
  const requestRecord = await prisma.request.create({
    data: {
      category: 'SCHOOL_CLUB' as any,
      description: `Quote ${invoiceNumber} for ${data.schoolName}`,
      status: 'PENDING' as any,
      userId: user.id
    }
  })

  const invoiceRecord = await prisma.invoice.create({
    data: {
      number: invoiceNumber,
      currency: quote.currency,
      amountUsd: quote.total,
      status: 'SENT' as any,
      userId: user.id,
      requestId: requestRecord.id,
      schoolId: school.id
    }
  })

  // Create a magic-link for immediate access
  const token = crypto.randomUUID().replace(/-/g, '')
  const expires = new Date(Date.now() + 1000 * 60 * 30)
  await prisma.magicLink.create({ data: { token, userId: user.id, expiresAt: expires } })
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000'
  const dashLink = `${siteUrl}/api/auth/magic-link/verify?token=${token}`

  const adminTo = process.env.MAIL_TO || process.env.MAIL_FROM || 'info@wecode.co.zw'
  if (!adminTo) throw createError({ statusCode: 500, statusMessage: 'MAIL_TO not configured' })

  // Optional PDF attachment if requested
  let attachments: any[] | undefined
  if ((data as any)?.attachPdf) {
    try {
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([612, 792]) // Letter
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const title = `Invoice ${invoiceNumber}`
      page.drawText('WeCodeZW', { x: 50, y: 740, size: 18, font, color: rgb(0.13, 0.24, 0.43) })
      page.drawText(title, { x: 50, y: 720, size: 14, font })
      page.drawText(`School: ${data.schoolName}`, { x: 50, y: 700, size: 12, font })
      page.drawText(`Contact: ${data.contactName} • ${data.email}`, { x: 50, y: 684, size: 12, font })
      page.drawText(`Total: ${quote.currency} ${quote.total.toFixed(2)}`, { x: 50, y: 668, size: 12, font })
      const pdfBytes = await pdfDoc.save()
      attachments = [{ filename: `${invoiceNumber}.pdf`, content: Buffer.from(pdfBytes), contentType: 'application/pdf' }]
    } catch (error) {
      console.warn('Failed to create PDF attachment:', error)
      // Continue without PDF attachment
    }
  }

  try {
    // Extract body content from invoice HTML
    const invoiceBodyMatch = invoiceHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    const invoiceContent = invoiceBodyMatch ? invoiceBodyMatch[1] : invoiceHtml

    // Admin email with new template
    const { html: adminHtml, text: adminText } = getQuoteRequestAdminTemplate({
      invoiceNumber,
      schoolName: data.schoolName,
      level: data.level,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      total: quote.total,
      currency: quote.currency,
      dashLink
    })

    // Embed invoice HTML in admin email (insert before closing main table)
    const adminEmailHtml = adminHtml.replace(
      '</table>\n        \n        <!-- Footer -->',
      `</table>\n        \n        <!-- Invoice Details -->\n        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin-top: 0;">\n          <tr>\n            <td style="padding: 0 40px 40px 40px;">\n              <div style="margin-top: 24px; padding: 24px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">\n                ${invoiceContent}\n              </div>\n            </td>\n          </tr>\n        </table>\n        \n        <!-- Footer -->`
    )

    await sendMail({
      to: adminTo,
      subject: `Quote Request — ${data.schoolName} (${data.level}) — ${invoiceNumber}`,
      html: adminEmailHtml,
      text: adminText,
      replyTo: data.email,
      ...(attachments ? { attachments } : {}) as any
    })

    // User email with new template
    const { html: userHtml, text: userText } = getQuoteRequestUserTemplate({
      invoiceNumber,
      schoolName: data.schoolName,
      total: quote.total,
      currency: quote.currency,
      dashLink
    })

    // Embed invoice HTML in user email (insert before closing main table)
    const userEmailHtml = userHtml.replace(
      '</table>\n        \n        <!-- Footer -->',
      `</table>\n        \n        <!-- Invoice Details -->\n        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin-top: 0;">\n          <tr>\n            <td style="padding: 0 40px 40px 40px;">\n              <div style="margin-top: 24px; padding: 24px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">\n                ${invoiceContent}\n              </div>\n            </td>\n          </tr>\n        </table>\n        \n        <!-- Footer -->`
    )

    await sendMail({
      to: data.email,
      subject: `Your Quote — WeCodeZW — ${invoiceNumber}`,
      html: userEmailHtml,
      text: userText,
      ...(attachments ? { attachments } : {}) as any
    })
  } catch (error) {
    console.error('Failed to send emails:', error)
    // Don't fail the entire request if email fails
    // The quote was still created successfully
  }

  return { ok: true, invoiceNumber, total: quote.total, currency: quote.currency, quoteId: quoteRecord.id, invoiceId: invoiceRecord.id, requestId: requestRecord.id }
})


