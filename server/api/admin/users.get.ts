import prisma from '@/server/utils/db'
import { getCurrentUser } from '@/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  
  const rows = await prisma.user.findMany({ 
    orderBy: { createdAt: 'desc' }, 
    select: { 
      id: true, 
      name: true, 
      email: true, 
      role: true, 
      createdAt: true,
      school: {
        select: {
          name: true
        }
      }
    } 
  })
  return rows
})

