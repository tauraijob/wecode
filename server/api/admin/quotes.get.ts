import prisma from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  const { q = '', page = '1', pageSize = '10' } = getQuery(event)
  const where: any = {}
  if (q) where.OR = [
    { number: { contains: String(q), mode: 'insensitive' } },
    { school: { name: { contains: String(q), mode: 'insensitive' } } as any },
    { user: { email: { contains: String(q), mode: 'insensitive' } } as any }
  ]
  const take = Math.max(1, Number(pageSize))
  const skip = (Math.max(1, Number(page)) - 1) * take
  const [rows, total] = await Promise.all([
    prisma.quote.findMany({ where, orderBy: { createdAt: 'desc' }, select: { id: true, number: true, totalUsd: true, createdAt: true, school: { select: { name: true } }, user: { select: { email: true } } }, skip, take }),
    prisma.quote.count({ where })
  ])
  return { rows, total, page: Number(page), pageSize: take }
})


