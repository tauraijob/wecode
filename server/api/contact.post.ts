import { z } from 'zod'
import { sendMail } from '~~/server/utils/mailer'

const ContactSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  clientType: z.enum(['individual', 'corporate', 'school']),
  phone: z.string().optional(),
  message: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })

  const data = parsed.data
  const to = process.env.MAIL_TO || process.env.MAIL_FROM
  if (!to) throw createError({ statusCode: 500, statusMessage: 'MAIL_TO not configured' })

  const subject = `New inquiry from ${data.fullName}`
  const text = `Name: ${data.fullName}
Email: ${data.email}
Client type: ${data.clientType}
Phone: ${data.phone || '-'}
Message:\n${data.message || '-'}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Inquiry</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">New Contact Inquiry</h1>
          <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px;">WeCodeZW Contact Form</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px 24px;">
          <div style="background-color: #f1f5f9; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Contact Details</h2>
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: center;">
                <span style="color: #64748b; font-weight: 500; min-width: 80px;">Name:</span>
                <span style="color: #1e293b; font-weight: 600;">${data.fullName}</span>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="color: #64748b; font-weight: 500; min-width: 80px;">Email:</span>
                <a href="mailto:${data.email}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${data.email}</a>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="color: #64748b; font-weight: 500; min-width: 80px;">Type:</span>
                <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 14px; font-weight: 500; text-transform: capitalize;">${data.clientType}</span>
              </div>
              ${data.phone ? `
              <div style="display: flex; align-items: center;">
                <span style="color: #64748b; font-weight: 500; min-width: 80px;">Phone:</span>
                <a href="tel:${data.phone}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${data.phone}</a>
              </div>
              ` : ''}
            </div>
          </div>
          
          ${data.message ? `
          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 6px 6px 0;">
            <h3 style="color: #1e293b; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">Message</h3>
            <p style="color: #475569; margin: 0; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
          ` : ''}
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">This message was sent from the WeCodeZW contact form</p>
          <p style="color: #94a3b8; margin: 0; font-size: 12px;">Reply directly to this email to respond to ${data.fullName}</p>
        </div>
      </div>
    </body>
    </html>
  `

  await sendMail({ to, subject, text, html, replyTo: data.email })

  return { ok: true }
})

