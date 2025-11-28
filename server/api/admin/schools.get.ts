import prisma from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { q = '', page = '1', pageSize = '10' } = getQuery(event)
  const where = q ? { OR: [{ name: { contains: String(q), mode: 'insensitive' } }, { contactEmail: { contains: String(q), mode: 'insensitive' } }] } : {}
  const take = Math.max(1, Number(pageSize))
  const skip = (Math.max(1, Number(page)) - 1) * take
  const [rows, total] = await Promise.all([
    prisma.school.findMany({ where, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, contactEmail: true }, skip, take }),
    prisma.school.count({ where })
  ])
  return { rows, total, page: Number(page), pageSize: take }
})


