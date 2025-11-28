import { z } from 'zod'
import prisma from '~~/server/utils/db'
import { sendMail } from '~~/server/utils/mailer'

const Schema = z.object({ email: z.string().email() })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid email address' })
  }

  const { email } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    // Don't reveal if user exists or not for security
    return { ok: true, message: 'If an account exists with this email, a verification link has been sent.' }
  }

  if (user.emailVerified) {
    return { ok: true, message: 'Your email is already verified. You can log in.' }
  }

  // Generate new verification token
  const verificationToken = crypto.randomUUID().replace(/-/g, '')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours

  // Invalidate old verification tokens for this user
  await prisma.magicLink.updateMany({
    where: {
      userId: user.id,
      usedAt: null
    },
    data: {
      usedAt: new Date() // Mark as used to invalidate
    }
  })

  // Create new verification token
  await prisma.magicLink.create({
    data: {
      token: verificationToken,
      userId: user.id,
      expiresAt: expiresAt
    }
  })

  // Send verification email
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000'
  const verificationLink = `${siteUrl}/api/auth/verify-email?token=${verificationToken}`

  try {
    await sendMail({
      to: email,
      subject: 'Verify your email — WeCodeZW',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Verify Your Email</h2>
          <p>Hi ${user.name},</p>
          <p>Please verify your email address to activate your account.</p>
          <p style="margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email Address
            </a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #6b7280; word-break: break-all;">${verificationLink}</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
      text: `Hi ${user.name},\n\nPlease verify your email by clicking this link:\n${verificationLink}\n\nThis link will expire in 24 hours.`
    })

    return { ok: true, message: 'Verification email sent! Please check your inbox.' }
  } catch (mailError) {
    console.error('Failed to send verification email:', mailError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to send verification email. Please try again later.' })
  }
})

