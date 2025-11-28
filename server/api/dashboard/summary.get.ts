import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const [quotes, invoices, invoicesPaid, clubs] = await Promise.all([
    prisma.quote.count({ where: { userId: user.id } }),
    prisma.invoice.count({ where: { userId: user.id } }),
    prisma.invoice.count({ where: { userId: user.id, status: 'PAID' as any } }),
    prisma.club.count({ where: { school: { ownerId: user.id } } })
  ])

  return { quotes, invoices, invoicesPaid, clubs }
})


