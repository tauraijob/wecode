import { z } from 'zod'
import { sendMail } from '~~/server/utils/mailer'
import { getContactFormTemplate } from '~~/server/utils/email-templates'

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
  const to = process.env.MAIL_TO || process.env.MAIL_FROM || 'info@wecode.co.zw'
  if (!to) throw createError({ statusCode: 500, statusMessage: 'MAIL_TO not configured' })

  const { html, text } = getContactFormTemplate(data)
  const subject = `New inquiry from ${data.fullName} — WeCodeZW`

  await sendMail({ to, subject, text, html, replyTo: data.email })

  return { ok: true }
})

