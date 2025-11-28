import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'

const TemplateSchema = z.object({
  name: z.string().min(1),
  courseId: z.string().optional(),
  design: z.object({
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    titleFont: z.string().optional(),
    titleSize: z.number().optional(),
    bodyFont: z.string().optional(),
    bodySize: z.number().optional(),
    logoUrl: z.string().url().optional().nullable(),
    borderColor: z.string().optional(),
    borderWidth: z.number().optional()
  }),
  variables: z.object({
    studentName: z.string().optional(),
    courseTitle: z.string().optional(),
    dateOfCompletion: z.string().optional(),
    certificateNumber: z.string().optional()
  })
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
  const parsed = TemplateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const template = await prisma.certificateTemplate.create({
    data: {
      name: parsed.data.name,
      courseId: parsed.data.courseId || null,
      design: parsed.data.design as any,
      variables: parsed.data.variables as any
    },
    include: {
      course: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return template
})

