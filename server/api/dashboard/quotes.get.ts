import prisma from '~~/server/utils/db'
import { verifySession } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const session = token ? verifySession<{ uid: string }>(token) : null
  if (!session) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const rows = await prisma.quote.findMany({
    where: { userId: session.uid },
    orderBy: { createdAt: 'desc' },
    select: { id: true, number: true, totalUsd: true }
  })

  return rows
})


