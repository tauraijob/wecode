import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { generateQuizQuestions } from '~~/server/utils/ai-quiz'

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
  const enrollmentId = body.enrollmentId as string

  if (!enrollmentId) {
    throw createError({ statusCode: 400, statusMessage: 'Enrollment ID required' })
  }

  // Verify enrollment and lesson completion
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId }
  })

  if (!enrollment || enrollment.userId !== auth.userId) {
    throw createError({ statusCode: 404, statusMessage: 'Enrollment not found' })
  }

  // Check if lesson is completed
  const progress = await prisma.lessonProgress.findUnique({
    where: {
      enrollmentId_lessonId: {
        enrollmentId,
        lessonId
      }
    }
  })

  if (!progress || !progress.completed) {
    throw createError({ statusCode: 400, statusMessage: 'Lesson must be completed before taking quiz' })
  }

  // Get lesson with transcript/notes
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      quizTemplates: true
    }
  })

  if (!lesson) {
    throw createError({ statusCode: 404, statusMessage: 'Lesson not found' })
  }

  // Get or create quiz template
  let template = lesson.quizTemplates[0]
  if (!template) {
    template = await prisma.practiceQuizTemplate.create({
      data: {
        lessonId,
        questionCount: 10,
        difficulty: 'medium'
      }
    })
  }

  // Generate quiz questions using AI
  const sourceMaterial = lesson.transcript || lesson.notes || lesson.description || ''
  if (!sourceMaterial) {
    throw createError({ statusCode: 400, statusMessage: 'Lesson content not available for quiz generation' })
  }

  const questions = await generateQuizQuestions(sourceMaterial, template.questionCount, template.difficulty || 'medium')

  return {
    questions,
    templateId: template.id
  }
})

