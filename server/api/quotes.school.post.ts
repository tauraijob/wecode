import { QuoteRequestSchema, calculateQuote, renderInvoiceHtml } from '@/server/utils/pricing'
import { sendMail } from '@/server/utils/mailer'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = QuoteRequestSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }

  const data = parsed.data
  const quote = calculateQuote(data)

  const invoiceNumber = `WCZW-${Date.now()}`
  const company = { name: 'WeCodeZW', email: process.env.MAIL_FROM || 'info@wecode.co.zw', phone: '+263778456168' }
  const html = renderInvoiceHtml({ quote, request: data, invoiceNumber, company })

  const adminTo = process.env.MAIL_TO || process.env.MAIL_FROM
  if (!adminTo) throw createError({ statusCode: 500, statusMessage: 'MAIL_TO not configured' })

  const subject = `Quote Request — ${data.schoolName} (${data.level}) — ${invoiceNumber}`

  // Optional PDF attachment if requested
  let attachments: any[] | undefined
  if ((data as any)?.attachPdf) {
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
  }

  await sendMail({
    to: adminTo,
    subject,
    text: `Quote total: ${quote.currency} ${quote.total.toFixed(2)} | From: ${data.contactName} <${data.email}>`,
    html,
    replyTo: data.email,
    ...(attachments ? { attachments } : {}) as any
  })

  // Send a copy to the requester
  await sendMail({
    to: data.email,
    subject: `Your Quote — WeCodeZW — ${invoiceNumber}`,
    text: `Thank you for your request. Total: ${quote.currency} ${quote.total.toFixed(2)}.`,
    html,
    ...(attachments ? { attachments } : {}) as any
  })

  return { ok: true, invoiceNumber, total: quote.total, currency: quote.currency }
})


