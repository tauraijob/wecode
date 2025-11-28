import prisma from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { status, q = '', page = '1', pageSize = '10' } = getQuery(event)
  const where: any = {}
  if (status) where.status = String(status) as any
  if (q) where.OR = [
    { number: { contains: String(q), mode: 'insensitive' } },
    { user: { email: { contains: String(q), mode: 'insensitive' } } as any }
  ]
  const take = Math.max(1, Number(pageSize))
  const skip = (Math.max(1, Number(page)) - 1) * take
  const [rows, total] = await Promise.all([
    prisma.invoice.findMany({ where, orderBy: { createdAt: 'desc' }, select: { id: true, number: true, amountUsd: true, status: true, createdAt: true, user: { select: { name: true, email: true } } }, skip, take }),
    prisma.invoice.count({ where })
  ])
  return { rows, total, page: Number(page), pageSize: take }
})


