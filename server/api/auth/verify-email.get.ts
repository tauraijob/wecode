import prisma from '~~/server/utils/db'
import { signJwt } from '~~/server/utils/jwt'
import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const token = getQuery(event).token as string
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Verification token is required' })
  }

  // Find the magic link (verification token)
  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
    include: { user: true }
  })

  if (!magicLink) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid verification token' })
  }

  if (magicLink.usedAt) {
    throw createError({ statusCode: 400, statusMessage: 'This verification link has already been used' })
  }

  if (magicLink.expiresAt < new Date()) {
    throw createError({ statusCode: 400, statusMessage: 'This verification link has expired' })
  }

  // Mark the token as used
  await prisma.magicLink.update({
    where: { token },
    data: { usedAt: new Date() }
  })

  // Update user's emailVerified status
  await prisma.user.update({
    where: { id: magicLink.userId },
    data: { emailVerified: true }
  })

  // Auto-login the user after verification
  const jwt = signJwt({ userId: magicLink.userId, role: magicLink.user.role })
  setCookie(event, 'token', jwt, { 
    httpOnly: true, 
    path: '/', 
    sameSite: 'lax', 
    maxAge: 60 * 60 * 24 * 7 
  })

  // Redirect to dashboard
  const redirectTo = magicLink.user.role === 'ADMIN' ? '/admin' : '/dashboard'
  return sendRedirect(event, redirectTo)
})



