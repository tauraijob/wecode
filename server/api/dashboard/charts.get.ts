import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  // Get payments over time (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  // Get invoices with payments to determine when they were paid
  const invoices = await prisma.invoice.findMany({
    where: {
      userId: user.id,
      status: 'PAID',
      payments: {
        some: {
          status: 'SUCCESS',
          createdAt: { gte: sixMonthsAgo }
        }
      }
    },
    select: {
      amountUsd: true,
      payments: {
        where: {
          status: 'SUCCESS'
        },
        select: {
          createdAt: true
        },
        orderBy: {
          createdAt: 'asc'
        },
        take: 1
      }
    }
  })

  // Group payments by month
  const monthlyPayments = invoices.reduce((acc, invoice) => {
    const firstPayment = invoice.payments[0]
    if (!firstPayment) return acc
    const month = firstPayment.createdAt.toISOString().slice(0, 7) // YYYY-MM
    if (!acc[month]) acc[month] = 0
    acc[month] += Number(invoice.amountUsd)
    return acc
  }, {} as Record<string, number>)

  // Get club growth over time
  const clubs = await prisma.club.findMany({
    where: {
      school: { ownerId: user.id }
    },
    select: {
      createdAt: true,
      status: true
    },
    orderBy: { createdAt: 'asc' }
  })

  // Group clubs by month
  const monthlyClubs = clubs.reduce((acc, club) => {
    const month = club.createdAt.toISOString().slice(0, 7) // YYYY-MM
    if (!acc[month]) acc[month] = { total: 0, active: 0 }
    acc[month].total += 1
    if (club.status === 'ACTIVE') acc[month].active += 1
    return acc
  }, {} as Record<string, { total: number; active: number }>)

  // Generate last 6 months data
  const months = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    months.push(date.toISOString().slice(0, 7))
  }

  const paymentsData = months.map(month => ({
    month,
    amount: monthlyPayments[month] || 0
  }))

  const clubsData = months.map(month => ({
    month,
    total: monthlyClubs[month]?.total || 0,
    active: monthlyClubs[month]?.active || 0
  }))

  return {
    payments: paymentsData,
    clubs: clubsData
  }
})
