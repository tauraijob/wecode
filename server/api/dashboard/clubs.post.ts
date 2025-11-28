import { z } from 'zod'
import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

const Schema = z.object({ name: z.string().min(2), level: z.string(), planId: z.string(), students: z.number().int().positive() })

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const body = await readBody(event)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })

  const school = await prisma.school.findFirst({ where: { ownerId: user.id } })
  if (!school) throw createError({ statusCode: 400, statusMessage: 'No school linked' })

  const club = await prisma.club.create({ data: { ...parsed.data, schoolId: school.id } })
  return { ok: true, id: club.id }
})


