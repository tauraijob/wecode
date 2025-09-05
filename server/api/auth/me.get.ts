import { verifyJwt } from '~~/server/utils/jwt'
import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  if (!token) return null
  const payload = verifyJwt(token)
  if (!payload) return null
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) return null
  return { id: user.id, email: user.email, name: user.name, role: user.role }
})

