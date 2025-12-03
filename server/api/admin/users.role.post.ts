import { z } from 'zod'
import prisma from '~~/server/utils/db'

const Schema = z.object({ userId: z.string(), role: z.enum(['INDIVIDUAL','STUDENT','INSTRUCTOR','CORPORATE','ADMIN']) })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  await prisma.user.update({ where: { id: parsed.data.userId }, data: { role: parsed.data.role as any } })
  return { ok: true }
})


