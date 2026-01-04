import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'
import { z } from 'zod'
import { createNotification } from '~~/server/utils/notifications'

const ProcessPayoutSchema = z.object({
  status: z.enum(['PROCESSING', 'COMPLETED', 'FAILED']),
  reference: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const user = await getCurrentUser(event)
  if (!user || user.role !== 'ADMIN') {
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

  const { status, reference, notes } = parsed.data

  // Find payout
  const payout = await prisma.payout.findUnique({
    where: { id: payoutId },
    include: {
      instructor: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  if (!payout) {
    throw createError({ statusCode: 404, statusMessage: 'Payout not found' })
  }

  // Update payout
  const updateData: any = {
    status,
    processedById: user.id
  }

  if (status === 'COMPLETED') {
    updateData.processedAt = new Date()
    if (reference) updateData.reference = reference

    // Mark linked earnings as paid
    await prisma.instructorEarning.updateMany({
      where: { payoutId },
      data: {
        status: 'PAID',
        paidAt: new Date()
      }
    })
  }

  if (status === 'FAILED') {
    updateData.processedAt = new Date()
    if (notes) {
      updateData.notes = payout.notes
        ? `${payout.notes}\n\n--- FAILED ---\n${notes}`
        : `--- FAILED ---\n${notes}`
    }

    // Release earnings back to pending
    await prisma.instructorEarning.updateMany({
      where: { payoutId },
      data: { payoutId: null }
    })
  }

  const updated = await prisma.payout.update({
    where: { id: payoutId },
    data: updateData,
    include: {
      instructor: {
        select: { id: true, name: true, email: true }
      }
    }
  })

  // Notify instructor
  if (status === 'COMPLETED') {
    await createNotification({
      userId: payout.instructorId,
      type: 'PAYOUT_COMPLETED',
      title: 'Payout Completed',
      message: `Your payout of $${Number(payout.amount).toFixed(2)} has been processed. Reference: ${reference || 'N/A'}`,
      metadata: { payoutId: payout.id, reference }
    })
  } else if (status === 'FAILED') {
    await createNotification({
      userId: payout.instructorId,
      type: 'PAYOUT_FAILED',
      title: 'Payout Failed',
      message: `Your payout of $${Number(payout.amount).toFixed(2)} could not be processed. Reason: ${notes || 'Not specified'}`,
      metadata: { payoutId: payout.id, reason: notes }
    })
  } else if (status === 'PROCESSING') {
    await createNotification({
      userId: payout.instructorId,
      type: 'PAYOUT_PROCESSING',
      title: 'Payout Being Processed',
      message: `Your payout of $${Number(payout.amount).toFixed(2)} is now being processed.`,
      metadata: { payoutId: payout.id }
    })
  }

  return updated
})
