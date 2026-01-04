/**
 * Email Templates for WeCodeZW
 * Beautiful, modern, responsive email templates
 */

const BRAND_COLORS = {
  primary: '#1e3a8a',
  primaryLight: '#3b82f6',
  gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#1e293b',
  textLight: '#64748b',
  bg: '#f8fafc',
  white: '#ffffff'
}

/**
 * Base email template wrapper
 */
function getBaseTemplate(content: string, title?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title || 'WeCodeZW'}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND_COLORS.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${BRAND_COLORS.bg};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: ${BRAND_COLORS.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          ${content}
        </table>
        
        <!-- Footer -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin-top: 24px;">
          <tr>
            <td align="center" style="padding: 24px 20px;">
              <p style="margin: 0 0 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; line-height: 1.5;">
                <strong style="color: ${BRAND_COLORS.text};">WeCodeZW</strong><br>
                194 Baines Ave, Harare, Zimbabwe<br>
                Phone: +263 778 456 168 | Email: info@wecode.co.zw
              </p>
              <p style="margin: 16px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 12px; line-height: 1.5;">
                This email was sent from WeCodeZW. If you have any questions, please contact us at info@wecode.co.zw
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * Header section
 */
function getHeader(title: string, subtitle?: string): string {
  return `
  <tr>
    <td style="background: ${BRAND_COLORS.gradient}; padding: 48px 40px; text-align: center;">
      <h1 style="margin: 0 0 8px 0; color: ${BRAND_COLORS.white}; font-size: 28px; font-weight: 700; line-height: 1.2;">
        ${title}
      </h1>
      ${subtitle ? `<p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.5;">${subtitle}</p>` : ''}
    </td>
  </tr>
  `.trim()
}

/**
 * Button component
 */
function getButton(href: string, text: string, variant: 'primary' | 'success' | 'warning' = 'primary'): string {
  const colors = {
    primary: BRAND_COLORS.primaryLight,
    success: BRAND_COLORS.success,
    warning: BRAND_COLORS.warning
  }

  return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 32px 0;">
    <tr>
      <td align="center">
        <a href="${href}" style="display: inline-block; background-color: ${colors[variant]}; color: ${BRAND_COLORS.white}; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; line-height: 1.5; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          ${text}
        </a>
      </td>
    </tr>
  </table>
  `.trim()
}

/**
 * Content section
 */
function getContent(html: string): string {
  return `
  <tr>
    <td style="padding: 40px;">
      <div style="color: ${BRAND_COLORS.text}; font-size: 16px; line-height: 1.7;">
        ${html}
      </div>
    </td>
  </tr>
  `.trim()
}

/**
 * Info box component
 */
function getInfoBox(content: string, type: 'info' | 'success' | 'warning' = 'info'): string {
  const bgColors = {
    info: '#eff6ff',
    success: '#f0fdf4',
    warning: '#fffbeb'
  }
  const borderColors = {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b'
  }

  return `
  <div style="background-color: ${bgColors[type]}; border-left: 4px solid ${borderColors[type]}; padding: 20px; border-radius: 6px; margin: 24px 0;">
    <div style="color: ${BRAND_COLORS.text}; font-size: 15px; line-height: 1.6;">
      ${content}
    </div>
  </div>
  `.trim()
}

/**
 * Email Verification Template
 */
export function getEmailVerificationTemplate(name: string, verificationLink: string, role?: string): { html: string; text: string } {
  // Show role-appropriate welcome message
  const communityText = role === 'INSTRUCTOR'
    ? 'community of instructors'
    : 'community of learners'

  const content = `
    ${getHeader('Welcome to WeCodeZW!', 'Verify Your Email Address')}
    ${getContent(`
      <p style="margin: 0 0 16px 0;">Hi <strong>${name}</strong>,</p>
      <p style="margin: 0 0 24px 0;">Thank you for registering with WeCodeZW! We're excited to have you join our ${communityText}.</p>
      <p style="margin: 0 0 24px 0;">To get started, please verify your email address by clicking the button below:</p>
      ${getButton(verificationLink, 'Verify Email Address', 'primary')}
      <p style="margin: 24px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">Or copy and paste this link into your browser:</p>
      <p style="margin: 8px 0 24px 0; color: ${BRAND_COLORS.primaryLight}; font-size: 14px; word-break: break-all;">${verificationLink}</p>
      ${getInfoBox('This verification link will expire in 24 hours. If you didn\'t create an account, please ignore this email.', 'info')}
    `)}
  `

  const html = getBaseTemplate(content, 'Verify Your Email — WeCodeZW')
  const text = `Welcome to WeCodeZW!\n\nHi ${name},\n\nThank you for registering with WeCodeZW. Please verify your email address by clicking this link:\n${verificationLink}\n\nThis link will expire in 24 hours. If you didn't create an account, please ignore this email.`

  return { html, text }
}

/**
 * Password Reset Template
 */
export function getPasswordResetTemplate(name: string, resetLink: string): { html: string; text: string } {
  const content = `
    ${getHeader('Reset Your Password', 'WeCodeZW Account Security')}
    ${getContent(`
      <p style="margin: 0 0 16px 0;">Hi <strong>${name}</strong>,</p>
      <p style="margin: 0 0 24px 0;">We received a request to reset your password. Click the button below to create a new password:</p>
      ${getButton(resetLink, 'Reset Password', 'primary')}
      <p style="margin: 24px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">Or copy and paste this link into your browser:</p>
      <p style="margin: 8px 0 24px 0; color: ${BRAND_COLORS.primaryLight}; font-size: 14px; word-break: break-all;">${resetLink}</p>
      ${getInfoBox('This link will expire in 1 hour. If you didn\'t request a password reset, please ignore this email and your password will remain unchanged.', 'warning')}
    `)}
  `

  const html = getBaseTemplate(content, 'Reset Your Password — WeCodeZW')
  const text = `Password Reset Request\n\nHi ${name},\n\nWe received a request to reset your password. Click this link to create a new password:\n${resetLink}\n\nThis link will expire in 1 hour. If you didn't request a password reset, please ignore this email.`

  return { html, text }
}

/**
 * Magic Link Template
 */
export function getMagicLinkTemplate(name: string, magicLink: string): { html: string; text: string } {
  const content = `
    ${getHeader('Secure Sign-In Link', 'WeCodeZW Authentication')}
    ${getContent(`
      <p style="margin: 0 0 16px 0;">Hi <strong>${name}</strong>,</p>
      <p style="margin: 0 0 24px 0;">Click the button below to securely sign in to your WeCodeZW account:</p>
      ${getButton(magicLink, 'Sign In to WeCodeZW', 'primary')}
      <p style="margin: 24px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">Or copy and paste this link into your browser:</p>
      <p style="margin: 8px 0 24px 0; color: ${BRAND_COLORS.primaryLight}; font-size: 14px; word-break: break-all;">${magicLink}</p>
      ${getInfoBox('This link will expire in 30 minutes. If you didn\'t request this sign-in link, please ignore this email.', 'warning')}
    `)}
  `

  const html = getBaseTemplate(content, 'Your Secure Sign-In Link — WeCodeZW')
  const text = `Secure Sign-In Link\n\nHi ${name},\n\nClick this link to sign in to your WeCodeZW account:\n${magicLink}\n\nThis link will expire in 30 minutes.`

  return { html, text }
}

/**
 * Contact Form Template (Admin)
 */
export function getContactFormTemplate(data: {
  fullName: string
  email: string
  clientType: string
  phone?: string
  message?: string
}): { html: string; text: string } {
  const content = `
    ${getHeader('New Contact Inquiry', 'WeCodeZW Contact Form')}
    ${getContent(`
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 20px; font-weight: 600;">Contact Details</h2>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-weight: 500; width: 120px;">Name:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.text}; font-weight: 600;">${data.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-weight: 500;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: none; font-weight: 500;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-weight: 500;">Type:</td>
            <td style="padding: 8px 0;">
              <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 4px; font-size: 14px; font-weight: 500; text-transform: capitalize;">
                ${data.clientType}
              </span>
            </td>
          </tr>
          ${data.phone ? `
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-weight: 500;">Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: none; font-weight: 500;">${data.phone}</a></td>
          </tr>
          ` : ''}
        </table>
      </div>
      ${data.message ? `
      <div style="background-color: #f8fafc; border-left: 4px solid ${BRAND_COLORS.primaryLight}; padding: 20px; border-radius: 0 6px 6px 0; margin-top: 24px;">
        <h3 style="margin: 0 0 12px 0; color: ${BRAND_COLORS.text}; font-size: 18px; font-weight: 600;">Message</h3>
        <p style="margin: 0; color: ${BRAND_COLORS.text}; line-height: 1.7; white-space: pre-wrap;">${data.message}</p>
      </div>
      ` : ''}
      <p style="margin: 24px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">Reply directly to this email to respond to ${data.fullName}.</p>
    `)}
  `

  const html = getBaseTemplate(content, 'New Contact Inquiry — WeCodeZW')
  const text = `New Contact Inquiry\n\nName: ${data.fullName}\nEmail: ${data.email}\nClient Type: ${data.clientType}\n${data.phone ? `Phone: ${data.phone}\n` : ''}${data.message ? `\nMessage:\n${data.message}` : ''}`

  return { html, text }
}

/**
 * Quote Request Template (Admin)
 */
export function getQuoteRequestAdminTemplate(data: {
  invoiceNumber: string
  schoolName: string
  level: string
  contactName: string
  email: string
  phone?: string
  total: number
  currency: string
  dashLink?: string
}): { html: string; text: string } {
  const content = `
    ${getHeader('New Quote Request', `Invoice ${data.invoiceNumber}`)}
    ${getContent(`
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 20px 0; color: ${BRAND_COLORS.text}; font-size: 20px; font-weight: 600;">School Information</h2>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-weight: 500; width: 140px;">School:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.text}; font-weight: 600;">${data.schoolName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-weight: 500;">Level:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.text}; font-weight: 600;">${data.level}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-weight: 500;">Contact:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.text}; font-weight: 600;">${data.contactName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-weight: 500;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: none; font-weight: 500;">${data.email}</a></td>
          </tr>
          ${data.phone ? `
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textLight}; font-weight: 500;">Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: ${BRAND_COLORS.primaryLight}; text-decoration: none; font-weight: 500;">${data.phone}</a></td>
          </tr>
          ` : ''}
        </table>
      </div>
      
      <div style="background-color: #eff6ff; border-left: 4px solid ${BRAND_COLORS.primaryLight}; padding: 20px; border-radius: 0 6px 6px 0; margin: 24px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <p style="margin: 0 0 4px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 500;">Total Amount</p>
            <p style="margin: 0; color: ${BRAND_COLORS.text}; font-size: 32px; font-weight: 700;">${data.currency} ${data.total.toFixed(2)}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0 0 4px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 500;">Invoice Number</p>
            <p style="margin: 0; color: ${BRAND_COLORS.text}; font-size: 18px; font-weight: 600;">${data.invoiceNumber}</p>
          </div>
        </div>
      </div>
      
      <p style="margin: 24px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">Reply directly to this email to contact ${data.contactName}.</p>
    `)}
  `

  const html = getBaseTemplate(content, `Quote Request — ${data.invoiceNumber} — WeCodeZW`)
  const text = `New Quote Request\n\nInvoice: ${data.invoiceNumber}\nSchool: ${data.schoolName}\nLevel: ${data.level}\nContact: ${data.contactName}\nEmail: ${data.email}\n${data.phone ? `Phone: ${data.phone}\n` : ''}Total: ${data.currency} ${data.total.toFixed(2)}`

  return { html, text }
}

/**
 * Quote Request Template (User)
 */
export function getQuoteRequestUserTemplate(data: {
  invoiceNumber: string
  schoolName: string
  total: number
  currency: string
  dashLink: string
}): { html: string; text: string } {
  const content = `
    ${getHeader('Your Quote is Ready!', `Invoice ${data.invoiceNumber}`)}
    ${getContent(`
      <p style="margin: 0 0 24px 0;">Thank you for your quote request for <strong>${data.schoolName}</strong>.</p>
      
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <div style="text-align: center;">
          <p style="margin: 0 0 8px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 500;">Total Amount</p>
          <p style="margin: 0; color: ${BRAND_COLORS.text}; font-size: 36px; font-weight: 700;">${data.currency} ${data.total.toFixed(2)}</p>
          <p style="margin: 8px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 14px;">Invoice: ${data.invoiceNumber}</p>
        </div>
      </div>
      
      ${getButton(data.dashLink, 'Access Your Dashboard', 'primary')}
      
      ${getInfoBox('You can access your dashboard anytime to view your quote, make payments, and track your progress.', 'info')}
    `)}
  `

  const html = getBaseTemplate(content, `Your Quote — ${data.invoiceNumber} — WeCodeZW`)
  const text = `Your Quote is Ready!\n\nThank you for your quote request for ${data.schoolName}.\n\nTotal: ${data.currency} ${data.total.toFixed(2)}\nInvoice: ${data.invoiceNumber}\n\nAccess your dashboard: ${data.dashLink}`

  return { html, text }
}

/**
 * Admin Notification Template
 */
export function getAdminNotificationTemplate(title: string, message: string, metadata?: any): { html: string; text: string } {
  // Format message - convert markdown-style formatting to HTML
  const formattedMessage = message
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')

  const content = `
    ${getHeader(title, 'WeCodeZW Notification')}
    ${getContent(`
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px;">
        <div style="color: ${BRAND_COLORS.text}; line-height: 1.7;">
          ${formattedMessage}
        </div>
      </div>
      ${metadata && Object.keys(metadata).length > 0 ? `
      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 12px 0; color: ${BRAND_COLORS.textLight}; font-size: 14px; font-weight: 500;">Additional Details:</p>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 14px;">
          ${Object.entries(metadata).map(([key, value]) => `
          <tr>
            <td style="padding: 4px 0; color: ${BRAND_COLORS.textLight}; font-weight: 500; width: 140px;">${key}:</td>
            <td style="padding: 4px 0; color: ${BRAND_COLORS.text};">${value}</td>
          </tr>
          `).join('')}
        </table>
      </div>
      ` : ''}
    `)}
  `

  const html = getBaseTemplate(content, `${title} — WeCodeZW`)
  const text = `${title}\n\n${message.replace(/\*\*/g, '')}`

  return { html, text }
}

