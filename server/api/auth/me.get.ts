import prisma from '@/server/utils/db'
import { verifySession } from '@/server/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const session = token ? verifySession<{ uid: string }>(token) : null
  if (!session?.uid) throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { id: true, email: true, name: true, role: true } })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  return user
})

