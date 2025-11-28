import prisma, { Decimal } from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { generateCertificate } from '~~/server/utils/certificate'

const ExamSubmitSchema = z.object({
  attemptId: z.string(),
  enrollmentId: z.string(),
  answers: z.array(z.any())
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

  const courseId = getRouterParam(event, 'id')
  if (!courseId) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID required' })
  }

  const body = await readBody(event)
  const parsed = ExamSubmitSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const { attemptId, enrollmentId, answers } = parsed.data

  // Get exam attempt
  const attempt = await prisma.finalExamAttempt.findUnique({
    where: { id: attemptId },
    include: {
      enrollment: {
        include: {
          course: {
            include: {
              examTemplates: true
            }
          }
        }
      }
    }
  })

  if (!attempt || attempt.userId !== auth.userId || attempt.courseId !== courseId) {
    throw createError({ statusCode: 404, statusMessage: 'Exam attempt not found' })
  }

  if (attempt.completedAt) {
    throw createError({ statusCode: 400, statusMessage: 'Exam already submitted' })
  }

  // Calculate score
  const questions = attempt.questions as any[]
  let correct = 0

  questions.forEach((q: any, index: number) => {
    const userAnswer = answers[index]
    if (q.type === 'multiple-choice' && userAnswer === q.correctAnswer) {
      correct++
    } else if (q.type === 'true-false' && userAnswer === q.correctAnswer) {
      correct++
    }
  })

  const score = (correct / questions.length) * 100

  // Get passing score from template
  const template = attempt.enrollment.course.examTemplates[0]
  const passingScore = template?.passingScore ? Number(template.passingScore) : 70
  const passed = score >= passingScore

  // Update attempt
  const updated = await prisma.finalExamAttempt.update({
    where: { id: attemptId },
    data: {
      answers: answers as any,
      score: new Decimal(score.toFixed(2)),
      passed,
      completedAt: new Date()
    }
  })

  // If passed, generate certificate
  let certificate = null
  if (passed) {
    try {
      certificate = await generateCertificate(attempt.enrollment)
    } catch (error) {
      console.error('Failed to generate certificate:', error)
      // Don't fail the request if certificate generation fails
    }
  }

  return {
    attempt: updated,
    score,
    correct,
    total: questions.length,
    passed,
    passingScore,
    certificate
  }
})

