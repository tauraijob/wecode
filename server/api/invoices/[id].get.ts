import { prisma } from '~~/server/utils/prisma'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = event.context.params?.id as string
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { user: true, payments: true, request: true }
  })
  if (!invoice) throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })
  const isOwner = invoice.userId === auth.userId
  const isAdmin = auth.role === 'ADMIN'
  if (!isOwner && !isAdmin) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  return invoice
})

