import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth || auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  const [
    totalCourses,
    totalEnrollments,
    activeEnrollments,
    completedEnrollments,
    totalCertificates,
    courseCompletionRate,
    examPassRate
  ] = await Promise.all([
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
    prisma.enrollment.count({ where: { status: 'COMPLETED' } }),
    prisma.certificate.count(),
    prisma.enrollment.aggregate({
      _avg: { progressPercent: true }
    }),
    prisma.finalExamAttempt.aggregate({
      _avg: { score: true },
      _count: { passed: true }
    })
  ])

  const totalExamAttempts = await prisma.finalExamAttempt.count()
  const passedExams = await prisma.finalExamAttempt.count({ where: { passed: true } })

  return {
    totalCourses,
    totalEnrollments,
    activeEnrollments,
    completedEnrollments,
    totalCertificates,
    averageProgress: courseCompletionRate._avg.progressPercent ? Number(courseCompletionRate._avg.progressPercent) : 0,
    examPassRate: totalExamAttempts > 0 ? (passedExams / totalExamAttempts) * 100 : 0,
    averageExamScore: examPassRate._avg.score ? Number(examPassRate._avg.score) : 0
  }
})

