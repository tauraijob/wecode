import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth || auth.role !== 'ADMIN') throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const [users, requests, invoices, paid] = await Promise.all([
    prisma.user.count(),
    prisma.request.count(),
    prisma.invoice.count(),
    prisma.invoice.count({ where: { status: 'PAID' as any } })
  ])

  return { users, requests, invoices, paid }
})

