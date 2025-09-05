import { prisma } from '~~/server/utils/prisma'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'

const RequestSchema = z.object({
  category: z.enum(['TRAINING', 'WORKSHOP', 'SCHOOL_CLUB', 'SERVICES']),
  description: z.string().optional(),
  scheduledAt: z.string().datetime().optional()
})

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  const parsed = RequestSchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })

  const created = await prisma.request.create({
    data: {
      userId: auth.userId,
      category: parsed.data.category,
      description: parsed.data.description,
      scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : undefined
    }
  })
  return created
})

