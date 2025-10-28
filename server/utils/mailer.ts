// @ts-ignore - types resolved at runtime after install
import nodemailer from 'nodemailer'

// Brevo (Sendinblue) SMTP settings
// Host: smtp-relay.brevo.com, Port: 587 (TLS)

const smtpUser = ((globalThis as any).process?.env?.BREVO_SMTP_USER) || ''
const smtpKey = ((globalThis as any).process?.env?.BREVO_SMTP_KEY) || ''

export const mailer = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: smtpUser,
    pass: smtpKey
  }
})

export async function sendMail(options: {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  replyTo?: string
  attachments?: any[]
}) {
  const from = ((globalThis as any).process?.env?.MAIL_FROM) as string | undefined
  if (!from) throw new Error('MAIL_FROM env not set')
  if (!((globalThis as any).process?.env?.BREVO_SMTP_KEY)) throw new Error('BREVO_SMTP_KEY env not set')

  return mailer.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
    attachments: options.attachments
  })
}

