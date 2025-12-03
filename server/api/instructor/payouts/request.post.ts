import prismaModule, { Decimal } from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { notifyAdmins } from '~~/server/utils/notifications'

const PayoutRequestSchema = z.object({
  amount: z.coerce.number().positive(),
  method: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  // Check if user is an instructor
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { role: true }
  })

  if (!user || user.role !== 'INSTRUCTOR') {
    throw createError({ statusCode: 403, statusMessage: 'Instructor access required' })
  }

  const body = await readBody(event)
  const parsed = PayoutRequestSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const { amount, method } = parsed.data

  // Get pending earnings
  const pendingEarnings = await prisma.instructorEarning.findMany({
    where: {
      instructorId: auth.userId,
      status: 'PENDING',
      payoutId: null
    }
  })

  const availableAmount = pendingEarnings.reduce((sum, e) => sum + Number(e.amount), 0)

  if (amount > availableAmount) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: `Requested amount (${amount}) exceeds available earnings (${availableAmount.toFixed(2)})` 
    })
  }

  // Create payout request
  const payout = await prisma.payout.create({
    data: {
      amount: new Decimal(amount.toFixed(2)),
      currency: 'USD',
      status: 'PENDING',
      method: method || 'BANK_TRANSFER',
      instructorId: auth.userId
    }
  })

  // Link earnings to payout (select earnings up to requested amount)
  let remainingAmount = amount
  const earningsToLink: string[] = []

  for (const earning of pendingEarnings) {
    if (remainingAmount <= 0) break
    
    const earningAmount = Number(earning.amount)
    if (earningAmount <= remainingAmount) {
      earningsToLink.push(earning.id)
      remainingAmount -= earningAmount
    }
  }

  // Update earnings to link them to payout
  await prisma.instructorEarning.updateMany({
    where: {
      id: { in: earningsToLink }
    },
    data: {
      payoutId: payout.id,
      status: 'PAID'
    }
  })

  // Get instructor info for notification
  const instructor = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { name: true, email: true }
  })

  // Notify all admins about the payout request
  await notifyAdmins({
    type: 'PAYOUT_REQUESTED',
    metadata: { 
      payoutId: payout.id, 
      instructorId: auth.userId,
      instructorName: instructor?.name,
      amount: amount,
      currency: payout.currency,
      method: payout.method
    }
  })

  return {
    payout,
    linkedEarnings: earningsToLink.length,
    message: 'Payout request created successfully'
  }
})

