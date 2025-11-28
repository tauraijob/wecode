import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { Decimal } from '~~/server/utils/db'
import { z } from 'zod'

const QuizSubmitSchema = z.object({
  enrollmentId: z.string(),
  templateId: z.string(),
  questions: z.array(z.any()),
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

  const lessonId = getRouterParam(event, 'id')
  if (!lessonId) {
    throw createError({ statusCode: 400, statusMessage: 'Lesson ID required' })
  }

  const body = await readBody(event)
  const parsed = QuizSubmitSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const { enrollmentId, templateId, questions, answers } = parsed.data

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId }
  })

  if (!enrollment || enrollment.userId !== auth.userId) {
    throw createError({ statusCode: 404, statusMessage: 'Enrollment not found' })
  }

  // Calculate score
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

  // Save quiz attempt
  const attempt = await prisma.practiceQuizAttempt.create({
    data: {
      userId: auth.userId,
      lessonId,
      score: new Decimal(score.toFixed(2)),
      questions: questions as any,
      answers: answers as any
    }
  })

  return {
    attempt,
    score,
    correct,
    total: questions.length
  }
})

