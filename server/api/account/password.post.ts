import { prisma } from '~~/server/utils/prisma'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { hashPassword } from '~~/server/utils/password'

const Schema = z.object({ password: z.string().min(6) })

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const body = await readBody(event)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  const hashedPassword = await hashPassword(parsed.data.password)
  await prisma.user.update({ where: { id: auth.userId }, data: { hashedPassword } })
  return { ok: true }
})

