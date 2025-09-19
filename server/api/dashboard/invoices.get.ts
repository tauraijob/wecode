import prisma from '@/server/utils/db'
import { getCurrentUser } from '@/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, number: true, amountUsd: true, status: true, createdAt: true }
  })
  return invoices
})


