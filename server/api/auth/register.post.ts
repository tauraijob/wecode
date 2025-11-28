import prismaModule from '~~/server/utils/db'
import { hashPassword } from '~~/server/utils/password'
import { z } from 'zod'
import { sendMail } from '~~/server/utils/mailer'

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['INDIVIDUAL', 'STUDENT', 'CORPORATE']).optional()
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
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000'
  const verificationLink = `${siteUrl}/api/auth/verify-email?token=${verificationToken}`

  try {
    await sendMail({
      to: email,
      subject: 'Verify your email — WeCodeZW',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Welcome to WeCodeZW!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering with WeCodeZW. Please verify your email address to activate your account.</p>
          <p style="margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email Address
            </a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #6b7280; word-break: break-all;">${verificationLink}</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
      `,
      text: `Welcome to WeCodeZW!\n\nHi ${name},\n\nThank you for registering. Please verify your email by clicking this link:\n${verificationLink}\n\nThis link will expire in 24 hours.`
    })
  } catch (mailError) {
    console.error('Failed to send verification email:', mailError)
    // Don't fail registration if email fails, but log it
  }

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

