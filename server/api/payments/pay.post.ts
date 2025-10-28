import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { Decimal } from '@prisma/client/runtime/library'
import { z } from 'zod'

const PaySchema = z.object({
  invoiceId: z.string(),
  amountUsd: z.coerce.number().positive()
})

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  const parsed = PaySchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })

  const invoice = await prisma.invoice.findUnique({ where: { id: parsed.data.invoiceId } })
  if (!invoice || invoice.userId !== auth.userId) throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })

  await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      amountUsd: new Decimal(parsed.data.amountUsd.toFixed(2)),
      currency: 'USD',
      status: 'SUCCESS',
      method: 'MANUAL'
    }
  })
  await prisma.invoice.update({ where: { id: invoice.id }, data: { status: 'PAID' } })
  return { ok: true }
})

