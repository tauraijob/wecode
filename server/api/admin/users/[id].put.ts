import { z } from 'zod'
import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  role: z.enum(['INDIVIDUAL', 'STUDENT', 'CORPORATE', 'ADMIN', 'INSTRUCTOR']).optional(),
  emailVerified: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  
  const userId = getRouterParam(event, 'id')
  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID required' })
  }
  
  const body = await readBody(event)
  const parsed = UpdateUserSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }
  
  const updateData: any = {}
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name
  if (parsed.data.email !== undefined) updateData.email = parsed.data.email
  if (parsed.data.phone !== undefined) updateData.phone = parsed.data.phone
  if (parsed.data.role !== undefined) updateData.role = parsed.data.role
  if (parsed.data.emailVerified !== undefined) updateData.emailVerified = parsed.data.emailVerified
  
  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      emailVerified: true
    }
  })
  
  return updated
})

