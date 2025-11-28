import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'

const LessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().min(1), // Accept any string - validation happens on frontend
  videoDuration: z.number().int().nonnegative().optional(),
  transcript: z.string().optional(),
  notes: z.string().optional(),
  order: z.number().int().nonnegative()
})

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth || auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  const topicId = getRouterParam(event, 'topicId')
  if (!topicId) {
    throw createError({ statusCode: 400, statusMessage: 'Topic ID required' })
  }

  const body = await readBody(event)
  const parsed = LessonSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const lesson = await prisma.lesson.create({
    data: {
      ...parsed.data,
      topicId
    }
  })

  return lesson
})

