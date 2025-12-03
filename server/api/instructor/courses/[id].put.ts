import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { Decimal } from '~~/server/utils/db'

const CourseUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.coerce.number().nonnegative().optional(),
  currency: z.string().optional(),
  prerequisites: z.string().optional().nullable(),
  previewVideoUrl: z.string().url().optional().nullable().or(z.literal('')),
  thumbnailUrl: z.string().url().optional().nullable().or(z.literal('')),
  // platformCommissionPercentage is NOT included - only admins can set this
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
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  if (auth.role !== 'INSTRUCTOR') {
    throw createError({ statusCode: 403, statusMessage: 'Instructor access required' })
  }

  const courseId = getRouterParam(event, 'id')
  if (!courseId) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID required' })
  }

  // Verify instructor owns the course
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
    select: { instructorId: true, reviewStatus: true }
  })

  if (!existingCourse) {
    throw createError({ statusCode: 404, statusMessage: 'Course not found' })
  }

  if (existingCourse.instructorId !== auth.userId) {
    throw createError({ statusCode: 403, statusMessage: 'You can only edit your own courses' })
  }

  // Don't allow editing if course is pending review or approved (unless admin)
  if (existingCourse.reviewStatus === 'PENDING_REVIEW') {
    throw createError({ statusCode: 400, statusMessage: 'Cannot edit course while it is pending review' })
  }

  const body = await readBody(event)
  const parsed = CourseUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const { examConfig, ...data } = parsed.data
  const updateData: any = { ...data }

  if (examConfig !== undefined) {
    updateData.examConfig = examConfig ? examConfig as any : null
  }

  const course = await prisma.course.update({
    where: { id: courseId },
    data: updateData,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      topics: {
        include: {
          lessons: true
        }
      }
    }
  })

  return course
})



