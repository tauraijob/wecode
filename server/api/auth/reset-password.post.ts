import prismaModule from '~~/server/utils/db'
import { hashPassword } from '~~/server/utils/password'
import { z } from 'zod'

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const body = await readBody(event)
  const parsed = ResetPasswordSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: parsed.error.errors[0]?.message || 'Invalid input' 
    })
  }

  const { token, password } = parsed.data

  // Find the magic link
  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true
        }
      }
    }
  })

  if (!magicLink) {
    throw createError({ statusCode: 404, statusMessage: 'Invalid or expired reset token' })
  }

  // Check if token is expired
  if (magicLink.expiresAt < new Date()) {
    throw createError({ statusCode: 400, statusMessage: 'Reset token has expired' })
  }

  // Check if token has been used
  if (magicLink.usedAt) {
    throw createError({ statusCode: 400, statusMessage: 'Reset token has already been used' })
  }

  // Hash new password
  const hashedPassword = await hashPassword(password)

  // Update user password
  await prisma.user.update({
    where: { id: magicLink.userId },
    data: { hashedPassword }
  })

  // Mark token as used
  await prisma.magicLink.update({
    where: { id: magicLink.id },
    data: { usedAt: new Date() }
  })

  return { 
    ok: true, 
    message: 'Password has been reset successfully. You can now log in with your new password.' 
  }
})

