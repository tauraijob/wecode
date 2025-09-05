import { prisma } from '~~/server/utils/prisma'
import { verifyJwt } from '~~/server/utils/jwt'
import { Decimal } from '@prisma/client/runtime/library'
import { z } from 'zod'

const Schema = z.object({
  requestId: z.string(),
  amountUsd: z.coerce.number().positive(),
  dueDate: z.string().datetime().optional()
})

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth || auth.role !== 'ADMIN') throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })

  const req = await prisma.request.update({
    where: { id: parsed.data.requestId },
    data: { status: 'APPROVED' }
  })

  const count = await prisma.invoice.count()
  const number = `INV-${String(count + 1).padStart(5, '0')}`
  const invoice = await prisma.invoice.create({
    data: {
      number,
      userId: req.userId,
      requestId: req.id,
      amountUsd: new Decimal(parsed.data.amountUsd.toFixed(2)),
      currency: 'USD',
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      status: 'SENT'
    }
  })

  return { ok: true, request: req, invoice }
})

