import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { Decimal } from '@prisma/client/runtime/library'
import { z } from 'zod'

const InvoiceSchema = z.object({
  requestId: z.string().optional(),
  amountUsd: z.coerce.number().positive(),
  dueDate: z.string().datetime().optional()
})

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  const parsed = InvoiceSchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })

  const count = await prisma.invoice.count()
  const number = `INV-${String(count + 1).padStart(5, '0')}`

  const created = await prisma.invoice.create({
    data: {
      number,
      userId: auth.userId,
      requestId: parsed.data.requestId,
      amountUsd: new Decimal(parsed.data.amountUsd.toFixed(2)),
      currency: 'USD',
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      status: 'SENT'
    }
  })
  return created
})

