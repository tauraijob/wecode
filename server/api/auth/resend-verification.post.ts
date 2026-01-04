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
  const isDevelopment = process.env.NODE_ENV === 'development'
  let siteUrl = process.env.SITE_URL || (isDevelopment ? 'http://localhost:3000' : 'https://wecode.co.zw')

  // CRITICAL: In production, NEVER allow localhost URLs
  if (!isDevelopment && siteUrl.includes('localhost')) {
    siteUrl = 'https://wecode.co.zw'
  }

  const verificationLink = `${siteUrl}/api/auth/verify-email?token=${verificationToken}`

  try {
    const { getEmailVerificationTemplate } = await import('~~/server/utils/email-templates')
    const { html, text } = getEmailVerificationTemplate(user.name, verificationLink, user.role)

    await sendMail({
      to: email,
      subject: 'Verify your email — WeCodeZW',
      html,
      text
    })

    return { ok: true, message: 'Verification email sent! Please check your inbox.' }
  } catch (mailError) {
    console.error('Failed to send verification email:', mailError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to send verification email. Please try again later.' })
  }
})





