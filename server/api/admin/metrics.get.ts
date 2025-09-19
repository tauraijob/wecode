import prisma from '@/server/utils/db'

export default defineEventHandler(async () => {
  const [revenueAgg, schools, clubsActive, users, quotes, invoices, paymentsSuccess, requestsPending] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amountUsd: true }, where: { status: 'SUCCESS' as any } }),
    prisma.school.count(),
    prisma.club.count({ where: { status: 'ACTIVE' as any } }),
    prisma.user.count(),
    prisma.quote.count(),
    prisma.invoice.count(),
    prisma.payment.count({ where: { status: 'SUCCESS' as any } }),
    prisma.request.count({ where: { status: 'PENDING' as any } })
  ])

  return {
    revenue: Number(revenueAgg._sum.amountUsd || 0),
    schools,
    clubs: clubsActive,
    users,
    quotes,
    invoices,
    payments: paymentsSuccess,
    pendingRequests: requestsPending
  }
})


