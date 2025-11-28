import { z } from 'zod'
import prisma from '~~/server/utils/db'
import { signSession, setSessionCookie } from '~~/server/utils/auth'

const Schema = z.object({ userId: z.string() })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  const user = await prisma.user.findUnique({ where: { id: parsed.data.userId }, select: { id: true, email: true, role: true } })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  const token = signSession({ uid: user.id, email: user.email, role: user.role })
  setSessionCookie(event, token)
  return { ok: true }
})


