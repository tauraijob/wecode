import prismaModule from '~~/server/utils/db'
import { hashPassword } from '~~/server/utils/password'
import { z } from 'zod'
import { sendMail } from '~~/server/utils/mailer'
import { notifyAdmins } from '~~/server/utils/notifications'

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['INDIVIDUAL', 'STUDENT', 'CORPORATE', 'INSTRUCTOR']).optional()
})

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const body = await readBody(event)
  const parsed = RegisterSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }
  const { name, email, password, role } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }
  const hashedPassword = await hashPassword(password)

  // Create user with emailVerified = false
  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      role: role || 'INDIVIDUAL',
      emailVerified: false
    }
  })

  // Generate verification token
  const verificationToken = crypto.randomUUID().replace(/-/g, '')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours

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
    const { html, text } = getEmailVerificationTemplate(name, verificationLink, user.role)

    await sendMail({
      to: email,
      subject: 'Verify your email — WeCodeZW',
      html,
      text
    })
  } catch (mailError) {
    console.error('Failed to send verification email:', mailError)
    // Don't fail registration if email fails, but log it
  }

  // Notify admins about new user registration
  const notificationType = user.role === 'INSTRUCTOR' ? 'INSTRUCTOR_REGISTERED' : 'USER_REGISTERED'
  await notifyAdmins({
    type: notificationType,
    metadata: {
      userId: user.id,
      email: user.email,
      userName: user.name,
      role: user.role
    }
  })

  // Don't auto-login - user must verify email first
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: false,
    message: 'Registration successful! Please check your email to verify your account.'
  }
})

