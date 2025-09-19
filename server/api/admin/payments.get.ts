import prisma from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  const { status, q = '', page = '1', pageSize = '10' } = getQuery(event)
  const where: any = {}
  if (status) where.status = String(status) as any
  if (q) where.OR = [
    { invoice: { number: { contains: String(q), mode: 'insensitive' } } as any },
    { method: { contains: String(q), mode: 'insensitive' } }
  ]
  const take = Math.max(1, Number(pageSize))
  const skip = (Math.max(1, Number(page)) - 1) * take
  const [rows, total] = await Promise.all([
    prisma.payment.findMany({ where, orderBy: { createdAt: 'desc' }, select: { id: true, amountUsd: true, status: true, method: true, createdAt: true, invoice: { select: { number: true } } }, skip, take }),
    prisma.payment.count({ where })
  ])
  return { rows, total, page: Number(page), pageSize: take }
})


