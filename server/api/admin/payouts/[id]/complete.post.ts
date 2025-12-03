import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { createNotification } from '~~/server/utils/notifications'

const CompletePayoutSchema = z.object({
  reference: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth || auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  const payoutId = getRouterParam(event, 'id')
  if (!payoutId) {
    throw createError({ statusCode: 400, statusMessage: 'Payout ID required' })
  }

  const body = await readBody(event)
  const parsed = CompletePayoutSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: {
      earnings: true,
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })

  if (!payout) {
    throw createError({ statusCode: 404, statusMessage: 'Payout not found' })
  }

  if (payout.status === 'COMPLETED') {
    throw createError({ statusCode: 400, statusMessage: 'Payout is already completed' })
  }

  // Update payout to COMPLETED
  const updated = await prisma.payout.update({
    where: { id: payoutId },
    data: {
      status: 'COMPLETED',
      processedAt: new Date(),
      processedById: auth.userId,
      reference: parsed.data.reference || payout.reference,
      notes: parsed.data.notes || payout.notes
    }
  })

  // Update all linked earnings to mark paidAt
  await prisma.instructorEarning.updateMany({
    where: {
      payoutId: payoutId,
      paidAt: null
    },
    data: {
      paidAt: new Date()
    }
  })

  // Notify instructor that payout has been completed
  if (payout.instructorId) {
    await createNotification({
      userId: payout.instructorId,
      type: 'PAYOUT_COMPLETED',
      metadata: { 
        payoutId: payout.id,
        amount: Number(payout.amount),
        currency: payout.currency,
        reference: updated.reference
      }
    })
  }

  return {
    payout: updated,
    message: 'Payout marked as completed'
  }
})

