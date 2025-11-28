import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'

const CourseUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.coerce.number().nonnegative().optional(),
  currency: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  previewVideoUrl: z.string().url().optional().nullable(),
  thumbnailUrl: z.string().url().optional().nullable(),
  prerequisites: z.string().optional().nullable(),
  examConfig: z.object({
    questionCount: z.number().int().positive(),
    duration: z.number().int().positive(),
    passingScore: z.number().min(0).max(100)
  }).optional().nullable()
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

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID required' })
  }

  const body = await readBody(event)
  const parsed = CourseUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const { examConfig, ...data } = parsed.data
  const updateData: any = { ...data }
  if (examConfig !== undefined) {
    updateData.examConfig = examConfig as any
  }

  const course = await prisma.course.update({
    where: { id },
    data: updateData,
    include: {
      topics: {
        include: {
          lessons: true
        }
      }
    }
  })

  return course
})

