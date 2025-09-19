import prisma from '@/server/utils/db'
import { getCurrentUser } from '@/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const schools = await prisma.school.findMany({ where: { ownerId: user.id }, select: { id: true } })
  const schoolIds = schools.map(s => s.id)
  if (schoolIds.length === 0) return []

  const clubs = await prisma.club.findMany({
    where: { schoolId: { in: schoolIds } },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, level: true, students: true, status: true, schoolId: true }
  })
  return clubs
})


