/**
 * Email Template System
 * Beautiful, responsive email templates for all notifications
 */

const BRAND_COLOR = '#1e3a5f'  // Navy blue
const BRAND_NAME = 'WeCode Community'
const LOGO_URL = 'https://wecode.co.zw/images/logo.png'
const SITE_URL = 'https://wecode.co.zw'

// Base wrapper for all emails
function baseTemplate(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND_NAME}</title>
  ${preheader ? `<meta name="description" content="${preheader}">` : ''}
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, ${BRAND_COLOR} 0%, #2d4a6f 100%); padding: 30px 40px; text-align: center; }
    .header img { max-height: 50px; }
    .header h1 { color: #ffffff; margin: 15px 0 0 0; font-size: 24px; font-weight: 600; }
    .content { padding: 40px; color: #333333; line-height: 1.6; }
    .content h2 { color: ${BRAND_COLOR}; margin-top: 0; font-size: 22px; }
    .content p { margin: 0 0 15px 0; font-size: 15px; }
    .button { display: inline-block; background: ${BRAND_COLOR}; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; margin: 20px 0; }
    .button:hover { background: #15304f; }
    .button-success { background: #059669; }
    .button-warning { background: #d97706; }
    .info-box { background: #f0f7ff; border-left: 4px solid ${BRAND_COLOR}; padding: 15px 20px; margin: 20px 0; border-radius: 0 6px 6px 0; }
    .info-box p { margin: 0; font-size: 14px; }
    .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details-table td { padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
    .details-table td:first-child { color: #6b7280; width: 40%; }
    .details-table td:last-child { color: #111827; font-weight: 500; }
    .footer { background: #f9fafb; padding: 25px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
    .footer p { margin: 0 0 10px 0; font-size: 13px; color: #6b7280; }
    .footer a { color: ${BRAND_COLOR}; text-decoration: none; }
    .social-links { margin: 15px 0; }
    .social-links a { display: inline-block; margin: 0 8px; color: #9ca3af; text-decoration: none; }
    @media (max-width: 600px) {
      .content { padding: 25px; }
      .header { padding: 20px 25px; }
    }
  </style>
</head>
<body>
  <div style="padding: 20px; background: #f5f7fa;">
    <div class="container">
      <div class="header">
        <img src="${LOGO_URL}" alt="${BRAND_NAME}" />
        <h1>${BRAND_NAME}</h1>
      </div>
      ${content}
      <div class="footer">
        <p>© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
        <p><a href="${SITE_URL}">Visit our website</a> | <a href="${SITE_URL}/community">Community Hub</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`
}

// ==================== USER EMAILS ====================

export function welcomeEmail(name: string, verificationLink: string): string {
  const content = `
    <div class="content">
      <h2>Welcome to ${BRAND_NAME}! 🎉</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for joining our community of developers, mentors, and tech enthusiasts. We're excited to have you!</p>
      <p>Please verify your email address to get started:</p>
      <center>
        <a href="${verificationLink}" class="button">Verify Email Address</a>
      </center>
      <div class="info-box">
        <p><strong>What can you do?</strong></p>
        <p>✓ Book sessions with expert mentors<br>
           ✓ Join discussions in our forum<br>
           ✓ Share knowledge and earn credits</p>
      </div>
      <p>If you didn't create this account, you can safely ignore this email.</p>
      <p>Best regards,<br><strong>The ${BRAND_NAME} Team</strong></p>
    </div>
  `
  return baseTemplate(content, `Welcome to ${BRAND_NAME} - Verify your email`)
}

export function emailVerificationEmail(name: string, verificationLink: string): string {
  const content = `
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Please click the button below to verify your email address:</p>
      <center>
        <a href="${verificationLink}" class="button">Verify Email</a>
      </center>
      <p style="font-size: 13px; color: #6b7280;">This link will expire in 24 hours.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `
  return baseTemplate(content, 'Verify your email address')
}

// Alias function for resend verification that returns {html, text}
export function getEmailVerificationTemplate(name: string, verificationLink: string, role?: string): { html: string; text: string } {
  const html = emailVerificationEmail(name, verificationLink)
  const text = `
Hi ${name},

Please verify your email address by clicking the link below:
${verificationLink}

This link will expire in 24 hours.

If you didn't request this, please ignore this email.

Best regards,
The ${BRAND_NAME} Team
  `.trim()

  return { html, text }
}


export function mentorPendingApprovalEmail(name: string): string {
  const content = `
    <div class="content">
      <h2>Mentor Application Received 📋</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for applying to become a mentor on ${BRAND_NAME}!</p>
      <p>Your application is now under review by our admin team. We'll notify you once a decision has been made.</p>
      <div class="info-box">
        <p><strong>What happens next?</strong></p>
        <p>Our team will review your profile, skills, and experience. This usually takes 1-2 business days.</p>
      </div>
      <p>In the meantime, feel free to explore our community forum and connect with other members.</p>
      <p>Best regards,<br><strong>The ${BRAND_NAME} Team</strong></p>
    </div>
  `
  return baseTemplate(content, 'Your mentor application is under review')
}

export function mentorApprovedEmail(name: string): string {
  const content = `
    <div class="content">
      <h2>Congratulations! You're Approved 🎊</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Great news! Your mentor application has been <strong style="color: #059669;">approved</strong>.</p>
      <p>You can now:</p>
      <div class="info-box">
        <p>✓ Set your availability and hourly rate<br>
           ✓ Accept session bookings from mentees<br>
           ✓ Earn credits for completed sessions<br>
           ✓ Request payouts for your earnings</p>
      </div>
      <center>
        <a href="${SITE_URL}/mentor" class="button button-success">Go to Mentor Dashboard</a>
      </center>
      <p>Welcome to the mentor team!</p>
      <p>Best regards,<br><strong>The ${BRAND_NAME} Team</strong></p>
    </div>
  `
  return baseTemplate(content, 'Your mentor application has been approved!')
}

export function mentorRejectedEmail(name: string, reason?: string): string {
  const content = `
    <div class="content">
      <h2>Mentor Application Update</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for your interest in becoming a mentor on ${BRAND_NAME}.</p>
      <p>After careful review, we're unable to approve your application at this time.</p>
      ${reason ? `<div class="info-box"><p><strong>Reason:</strong> ${reason}</p></div>` : ''}
      <p>This decision doesn't prevent you from participating in our community. You can still:</p>
      <p>• Join discussions in our forum<br>
         • Book sessions with mentors<br>
         • Reapply in the future</p>
      <p>If you have questions, please reach out to our support team.</p>
      <p>Best regards,<br><strong>The ${BRAND_NAME} Team</strong></p>
    </div>
  `
  return baseTemplate(content, 'Update on your mentor application')
}

export function forumReplyNotification(postAuthor: string, postTitle: string, commenterName: string, commentPreview: string, postUrl: string): string {
  const content = `
    <div class="content">
      <h2>New Reply to Your Post 💬</h2>
      <p>Hi <strong>${postAuthor}</strong>,</p>
      <p><strong>${commenterName}</strong> replied to your post:</p>
      <div class="info-box">
        <p><strong>${postTitle}</strong></p>
        <p style="color: #374151; margin-top: 8px;">"${commentPreview.substring(0, 150)}${commentPreview.length > 150 ? '...' : ''}"</p>
      </div>
      <center>
        <a href="${postUrl}" class="button">View Reply</a>
      </center>
      <p style="font-size: 13px; color: #6b7280;">You received this because you're the author of this post.</p>
    </div>
  `
  return baseTemplate(content, `${commenterName} replied to your post`)
}

export function mentionNotification(userName: string, mentionerName: string, context: string, contextUrl: string): string {
  const content = `
    <div class="content">
      <h2>You Were Mentioned 👋</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p><strong>${mentionerName}</strong> mentioned you in a post:</p>
      <div class="info-box">
        <p>"${context.substring(0, 200)}${context.length > 200 ? '...' : ''}"</p>
      </div>
      <center>
        <a href="${contextUrl}" class="button">View Post</a>
      </center>
    </div>
  `
  return baseTemplate(content, `${mentionerName} mentioned you`)
}

export function forumLikeNotification(postAuthor: string, likerName: string, postTitle: string, postUrl: string): string {
  const content = `
    <div class="content">
      <h2>Someone Liked Your Post! ❤️</h2>
      <p>Hi <strong>${postAuthor}</strong>,</p>
      <p><strong>${likerName}</strong> liked your post:</p>
      <div class="info-box">
        <p><strong>${postTitle.substring(0, 100)}${postTitle.length > 100 ? '...' : ''}</strong></p>
      </div>
      <center>
        <a href="${postUrl}" class="button">View Post</a>
      </center>
      <p style="font-size: 13px; color: #6b7280;">Keep sharing great content with the community!</p>
    </div>
  `
  return baseTemplate(content, `${likerName} liked your post`)
}


export function payoutRequestConfirmation(name: string, amount: number, method: string): string {
  const content = `
    <div class="content">
      <h2>Payout Request Received 💰</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>We've received your payout request. Here are the details:</p>
      <table class="details-table">
        <tr><td>Amount</td><td>$${amount.toFixed(2)} USD</td></tr>
        <tr><td>Method</td><td>${method}</td></tr>
        <tr><td>Status</td><td><span style="color: #d97706;">Pending</span></td></tr>
      </table>
      <div class="info-box">
        <p>Processing usually takes 24-48 hours. We'll notify you once your payment is processed.</p>
      </div>
      <center>
        <a href="${SITE_URL}/mentor/payouts" class="button">View Payout History</a>
      </center>
    </div>
  `
  return baseTemplate(content, 'Your payout request has been received')
}

// ==================== ADMIN EMAILS ====================

export function adminNewUserAlert(userName: string, userEmail: string): string {
  const content = `
    <div class="content">
      <h2>New User Registration 👤</h2>
      <p>A new user has registered on ${BRAND_NAME}:</p>
      <table class="details-table">
        <tr><td>Name</td><td>${userName}</td></tr>
        <tr><td>Email</td><td>${userEmail}</td></tr>
        <tr><td>Registered</td><td>${new Date().toLocaleString()}</td></tr>
      </table>
      <center>
        <a href="${SITE_URL}/admin/community/users" class="button">View in Admin Panel</a>
      </center>
    </div>
  `
  return baseTemplate(content, `New user: ${userName}`)
}

export function adminMentorApplicationAlert(userName: string, userEmail: string, skills: string): string {
  const content = `
    <div class="content">
      <h2>New Mentor Application 🎓</h2>
      <p>A user has applied to become a mentor:</p>
      <table class="details-table">
        <tr><td>Name</td><td>${userName}</td></tr>
        <tr><td>Email</td><td>${userEmail}</td></tr>
        <tr><td>Skills</td><td>${skills}</td></tr>
        <tr><td>Applied</td><td>${new Date().toLocaleString()}</td></tr>
      </table>
      <p><strong>Action Required:</strong> Please review and approve/reject this application.</p>
      <center>
        <a href="${SITE_URL}/admin/community/mentors" class="button button-warning">Review Application</a>
      </center>
    </div>
  `
  return baseTemplate(content, `New mentor application: ${userName}`)
}

export function adminPayoutRequestAlert(userName: string, amount: number, method: string, details: string): string {
  const content = `
    <div class="content">
      <h2>New Payout Request 💸</h2>
      <p>A mentor has requested a payout:</p>
      <table class="details-table">
        <tr><td>Mentor</td><td>${userName}</td></tr>
        <tr><td>Amount</td><td><strong>$${amount.toFixed(2)} USD</strong></td></tr>
        <tr><td>Method</td><td>${method}</td></tr>
        <tr><td>Details</td><td>${details}</td></tr>
        <tr><td>Requested</td><td>${new Date().toLocaleString()}</td></tr>
      </table>
      <p><strong>Action Required:</strong> Process this payout and mark as completed.</p>
      <center>
        <a href="${SITE_URL}/admin/community/payouts" class="button button-warning">Process Payout</a>
      </center>
    </div>
  `
  return baseTemplate(content, `Payout request: $${amount.toFixed(2)} from ${userName}`)
}

// ==================== CONTACT FORM ====================

interface ContactFormData {
  fullName: string
  email: string
  clientType: string
  phone?: string
  message?: string
}

export function getContactFormTemplate(data: ContactFormData): { html: string; text: string } {
  const clientTypeLabels: Record<string, string> = {
    individual: 'Individual',
    corporate: 'Corporate / Business',
    school: 'School / Institution'
  }

  const content = `
    <div class="content">
      <h2>New Contact Form Inquiry 📬</h2>
      <p>You have received a new inquiry from the website:</p>
      <table class="details-table">
        <tr><td>Name</td><td>${data.fullName}</td></tr>
        <tr><td>Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td>Client Type</td><td>${clientTypeLabels[data.clientType] || data.clientType}</td></tr>
        ${data.phone ? `<tr><td>Phone</td><td>${data.phone}</td></tr>` : ''}
      </table>
      ${data.message ? `
      <div class="info-box">
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      </div>
      ` : ''}
      <p style="font-size: 13px; color: #6b7280;">Reply directly to this email to respond to the inquiry.</p>
    </div>
  `

  const text = `
New Contact Form Inquiry

Name: ${data.fullName}
Email: ${data.email}
Client Type: ${clientTypeLabels[data.clientType] || data.clientType}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.message ? `\nMessage:\n${data.message}` : ''}
  `.trim()

  return {
    html: baseTemplate(content, `New inquiry from ${data.fullName}`),
    text
  }
}

// ==================== QUOTE REQUEST TEMPLATES ====================

interface QuoteAdminData {
  invoiceNumber: string
  schoolName: string
  level: string
  contactName: string
  email: string
  phone?: string
  total: number
  currency: string
  dashLink: string
}

export function getQuoteRequestAdminTemplate(data: QuoteAdminData): { html: string; text: string } {
  const content = `
    <div class="content">
      <h2>New Quote Request 📋</h2>
      <p>A new school quote request has been submitted:</p>
      <table class="details-table">
        <tr><td>Invoice #</td><td><strong>${data.invoiceNumber}</strong></td></tr>
        <tr><td>School</td><td>${data.schoolName}</td></tr>
        <tr><td>Level</td><td>${data.level}</td></tr>
        <tr><td>Contact</td><td>${data.contactName}</td></tr>
        <tr><td>Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td>Phone</td><td>${data.phone}</td></tr>` : ''}
        <tr><td>Total</td><td><strong>${data.currency} ${data.total.toFixed(2)}</strong></td></tr>
      </table>
      <center>
        <a href="${data.dashLink}" class="button">View in Dashboard</a>
      </center>
    </div>
  `

  const text = `
New Quote Request

Invoice: ${data.invoiceNumber}
School: ${data.schoolName}
Level: ${data.level}
Contact: ${data.contactName}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
Total: ${data.currency} ${data.total.toFixed(2)}

View: ${data.dashLink}
  `.trim()

  return {
    html: baseTemplate(content, `Quote Request: ${data.schoolName}`),
    text
  }
}

interface QuoteUserData {
  invoiceNumber: string
  schoolName: string
  total: number
  currency: string
  dashLink: string
}

export function getQuoteRequestUserTemplate(data: QuoteUserData): { html: string; text: string } {
  const content = `
    <div class="content">
      <h2>Your Quote is Ready! 📄</h2>
      <p>Thank you for your interest in WeCode's Coding & Robotics Club program!</p>
      <p>We've prepared a quote for <strong>${data.schoolName}</strong>:</p>
      <div class="info-box">
        <p><strong>Invoice #:</strong> ${data.invoiceNumber}</p>
        <p><strong>Total:</strong> ${data.currency} ${data.total.toFixed(2)}</p>
      </div>
      <p>You can view your quote and manage your account using the secure link below:</p>
      <center>
        <a href="${data.dashLink}" class="button">View Quote & Dashboard</a>
      </center>
      <p style="font-size: 13px; color: #6b7280;">This link is valid for 30 minutes. If you need a new link, please contact us.</p>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br><strong>The WeCode Team</strong></p>
    </div>
  `

  const text = `
Your Quote is Ready!

Thank you for your interest in WeCode's Coding & Robotics Club program!

Invoice #: ${data.invoiceNumber}
School: ${data.schoolName}
Total: ${data.currency} ${data.total.toFixed(2)}

View your quote: ${data.dashLink}

This link is valid for 30 minutes.

Best regards,
The WeCode Team
  `.trim()

  return {
    html: baseTemplate(content, `Your Quote: ${data.invoiceNumber}`),
    text
  }
}

