import prisma from '~~/server/utils/db'
import { signSession, setSessionCookie } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getQuery(event).token as string
  if (!token) throw createError({ statusCode: 400, statusMessage: 'Missing token' })

  const magic = await prisma.magicLink.findUnique({ where: { token }, include: { user: true } })
  if (!magic || magic.usedAt || magic.expiresAt < new Date()) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid or expired link' })
  }

  await prisma.magicLink.update({ where: { token }, data: { usedAt: new Date() } })

  const jwt = signSession({ uid: magic.userId, email: magic.user.email, role: magic.user.role })
  setSessionCookie(event, jwt)

  const redirectTo = magic.user.role === 'ADMIN' ? '/admin' : '/dashboard'
  return sendRedirect(event, redirectTo)
})


