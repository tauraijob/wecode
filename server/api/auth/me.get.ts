import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  const session = verifyJwt(token)
  if (!session?.userId) throw createError({ statusCode: 401, statusMessage: 'Unauthenticated' })
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, email: true, name: true, role: true } })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  return user
})

