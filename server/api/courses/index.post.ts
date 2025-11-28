import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'

const CourseSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  currency: z.string().default('USD'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  previewVideoUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  prerequisites: z.string().optional(),
  examConfig: z.object({
    questionCount: z.number().int().positive(),
    duration: z.number().int().positive(), // in minutes
    passingScore: z.number().min(0).max(100) // percentage
  }).optional()
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

  const body = await readBody(event)
  const parsed = CourseSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const { examConfig, ...data } = parsed.data
  const course = await prisma.course.create({
    data: {
      ...data,
      examConfig: examConfig ? examConfig as any : null
    },
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

