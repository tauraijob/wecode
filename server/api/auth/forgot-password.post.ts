import prismaModule from '~~/server/utils/db'
import { sendMail } from '~~/server/utils/mailer'
import { z } from 'zod'

const ForgotPasswordSchema = z.object({
  email: z.string().email()
})

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const body = await readBody(event)
  const parsed = ForgotPasswordSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email address' })
  }

  const { email } = parsed.data

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } })
  
  // Don't reveal if user exists or not for security
  if (!user) {
    return { 
      ok: true, 
      message: 'If an account exists with this email, a password reset link has been sent.' 
    }
  }

  // Generate reset token
  const resetToken = crypto.randomUUID().replace(/-/g, '')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

  // Invalidate old reset tokens for this user
  await prisma.magicLink.updateMany({
    where: {
      userId: user.id,
      usedAt: null,
      expiresAt: {
        gt: new Date() // Only invalidate non-expired tokens
      }
    },
    data: {
      usedAt: new Date() // Mark as used to invalidate
    }
  })

  // Create new reset token
  await prisma.magicLink.create({
    data: {
      token: resetToken,
      userId: user.id,
      expiresAt: expiresAt
    }
  })

  // Send reset email
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000'
  const resetLink = `${siteUrl}/auth/reset-password?token=${resetToken}`

  try {
    await sendMail({
      to: email,
      subject: 'Reset your password — WeCodeZW',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <p style="margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #6b7280; word-break: break-all;">${resetLink}</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
          </p>
        </div>
      `,
      text: `Password Reset Request\n\nHi ${user.name},\n\nWe received a request to reset your password. Click this link to create a new password:\n${resetLink}\n\nThis link will expire in 1 hour. If you didn't request a password reset, please ignore this email.`
    })
  } catch (mailError) {
    console.error('Failed to send password reset email:', mailError)
    // Don't fail the request if email fails, but log it
  }

  return { 
    ok: true, 
    message: 'If an account exists with this email, a password reset link has been sent.' 
  }
})

