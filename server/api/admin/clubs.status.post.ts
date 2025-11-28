import { z } from 'zod'
import prisma from '~~/server/utils/db'

const Schema = z.object({ clubId: z.string(), status: z.enum(['DRAFT','ACTIVE','PAUSED']) })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  const club = await prisma.club.update({ where: { id: parsed.data.clubId }, data: { status: parsed.data.status } })
  return { ok: true, id: club.id, status: club.status }
})


