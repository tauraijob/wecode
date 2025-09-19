import prisma from '@/server/utils/db'
import { getCurrentUser } from '@/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event).catch(() => null)
  const number = event.context.params?.number as string
  if (!number) throw createError({ statusCode: 400, statusMessage: 'Missing invoice number' })
  const invoice = await prisma.invoice.findUnique({ where: { number }, select: { id: true, number: true, amountUsd: true, status: true, userId: true } })
  if (!invoice) throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  if (user && invoice.userId !== user.id) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  return invoice
})


