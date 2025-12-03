import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  const now = new Date()
  const months: string[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(monthKey(d))
  }

  const [payments, clubs, schools] = await Promise.all([
    prisma.payment.findMany({
      where: { status: 'SUCCESS' as any, createdAt: { gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } },
      select: { amountUsd: true, createdAt: true }
    }),
    prisma.club.findMany({
      where: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } },
      select: { createdAt: true }
    }),
    prisma.school.findMany({
      where: { createdAt: { gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } },
      select: { createdAt: true }
    })
  ])

  const revenueByMonth: Record<string, number> = Object.fromEntries(months.map(m => [m, 0]))
  for (const p of payments) {
    const m = monthKey(new Date(p.createdAt))
    if (revenueByMonth[m] !== undefined) revenueByMonth[m] += Number(p.amountUsd)
  }

  const clubsByMonth: Record<string, number> = Object.fromEntries(months.map(m => [m, 0]))
  for (const c of clubs) {
    const m = monthKey(new Date(c.createdAt))
    if (clubsByMonth[m] !== undefined) clubsByMonth[m] += 1
  }

  const schoolsByMonth: Record<string, number> = Object.fromEntries(months.map(m => [m, 0]))
  for (const s of schools) {
    const m = monthKey(new Date(s.createdAt))
    if (schoolsByMonth[m] !== undefined) schoolsByMonth[m] += 1
  }

  return {
    months,
    revenue: months.map(m => ({ m, v: revenueByMonth[m] })),
    clubs: months.map(m => ({ m, v: clubsByMonth[m] })),
    schools: months.map(m => ({ m, v: schoolsByMonth[m] }))
  }
})


