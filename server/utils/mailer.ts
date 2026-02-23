// @ts-ignore - types resolved at runtime after install
import nodemailer from 'nodemailer'

// Brevo (Sendinblue) SMTP settings
// Host: smtp-relay.brevo.com, Port: 587 (TLS)

// Create transport lazily or ensure config is available
let transporter: any = null

function getTransporter() {
  if (transporter) return transporter

  const config = useRuntimeConfig()
  const smtpUser = config.brevoSmtpUser || process.env.BREVO_SMTP_USER || ''
  const smtpKey = config.brevoSmtpKey || process.env.BREVO_SMTP_KEY || ''

  transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpKey
    }
  })
  return transporter
}

export async function sendMail(options: {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  replyTo?: string
  attachments?: any[]
  cc?: string | string[]
}) {
  const config = useRuntimeConfig()
  const from = config.mailFrom || process.env.MAIL_FROM as string | undefined
  const apiKey = config.brevoSmtpKey || process.env.BREVO_SMTP_KEY

  if (!from) throw new Error('MAIL_FROM env not set')
  if (!apiKey) throw new Error('BREVO_SMTP_KEY env not set')

  // Get admin email addresses
  const mailTo = config.mailTo || process.env.MAIL_TO as string | undefined
  const adminEmail = mailTo || from || 'info@wecode.co.zw'
  const ccEmail = 'taujob1111@gmail.com'

  // Determine if this is an admin notification
  const toArray = Array.isArray(options.to) ? options.to : [options.to]
  const isAdminNotification = toArray.some(email =>
    email === adminEmail || email === 'info@wecode.co.zw'
  )

  // Automatically CC taujob1111@gmail.com on all admin notifications
  let cc: string | string[] | undefined = options.cc
  if (isAdminNotification) {
    if (cc) {
      // Merge with existing CC
      cc = Array.isArray(cc) ? [...cc, ccEmail] : [cc, ccEmail]
    } else {
      cc = ccEmail
    }
  }

  return getTransporter().sendMail({
    from,
    to: options.to,
    cc,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
    attachments: options.attachments
  })
}

