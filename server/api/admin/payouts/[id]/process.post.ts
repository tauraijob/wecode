import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'

const ProcessPayoutSchema = z.object({
  method: z.string().optional(),
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
  const parsed = ProcessPayoutSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: {
      earnings: true
    }
  })

  if (!payout) {
    throw createError({ statusCode: 404, statusMessage: 'Payout not found' })
  }

  if (payout.status !== 'PENDING') {
    throw createError({ statusCode: 400, statusMessage: 'Payout is not pending' })
  }

  // Update payout to PROCESSING
  const updated = await prisma.payout.update({
    where: { id: payoutId },
    data: {
      status: 'PROCESSING',
      method: parsed.data.method || payout.method,
      reference: parsed.data.reference,
      notes: parsed.data.notes
    }
  })

  return {
    payout: updated,
    message: 'Payout marked as processing'
  }
})



