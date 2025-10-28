import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const query = getQuery(event)
  const isAdmin = auth.role === 'ADMIN'
  const all = query.all === 'true'

  if (isAdmin && all) {
    return prisma.invoice.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true, payments: true } })
  }
  return prisma.invoice.findMany({ where: { userId: auth.userId }, orderBy: { createdAt: 'desc' }, include: { payments: true } })
})

