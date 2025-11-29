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

  const courseId = getRouterParam(event, 'id')
  if (!courseId) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID required' })
  }

  const body = await readBody(event)
  const enrollmentId = body.enrollmentId as string

  if (!enrollmentId) {
    throw createError({ statusCode: 400, statusMessage: 'Enrollment ID required' })
  }

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        include: {
          topics: {
            include: {
              lessons: true
            }
          },
          examTemplates: true
        }
      },
      progress: true
    }
  })

  if (!enrollment || enrollment.userId !== auth.userId) {
    throw createError({ statusCode: 404, statusMessage: 'Enrollment not found' })
  }

  // Check if all lessons are completed
  const totalLessons = enrollment.course.topics.reduce((sum, topic) => sum + topic.lessons.length, 0)
  const completedLessons = enrollment.progress.filter(p => p.completed).length

  if (completedLessons < totalLessons) {
    throw createError({ statusCode: 400, statusMessage: 'All lessons must be completed before taking the final exam' })
  }

  // Check if exam already passed
  const existingPass = await prisma.finalExamAttempt.findFirst({
    where: {
      enrollmentId,
      passed: true
    }
  })

  if (existingPass) {
    throw createError({ statusCode: 400, statusMessage: 'Final exam already passed' })
  }

  // Get or create exam template
  let template = enrollment.course.examTemplates[0]
  if (!template) {
    const examConfig = enrollment.course.examConfig as any || {
      questionCount: 20,
      duration: 60,
      passingScore: 70
    }

    template = await prisma.finalExamTemplate.create({
      data: {
        courseId,
        questionCount: examConfig.questionCount || 20,
        duration: examConfig.duration || 60,
        passingScore: examConfig.passingScore || 70
      }
    })
  }

  // Generate exam questions from all course content
  const allLessons = enrollment.course.topics.flatMap(topic => topic.lessons)
  const allContent = allLessons
    .map(lesson => lesson.transcript || lesson.notes || lesson.description || '')
    .filter(content => content.length > 0)
    .join('\n\n')

  if (!allContent) {
    throw createError({ statusCode: 400, statusMessage: 'Course content not available for exam generation' })
  }

  const questions = await generateQuizQuestions(
    allContent, 
    template.questionCount, 
    'hard',
    enrollment.course.name
  )

  // Create exam attempt
  const attempt = await prisma.finalExamAttempt.create({
    data: {
      enrollmentId,
      userId: auth.userId,
      courseId,
      questions: questions as any,
      answers: [],
      score: new Decimal(0),
      passed: false
    }
  })

  return {
    attemptId: attempt.id,
    questions,
    duration: template.duration,
    passingScore: template.passingScore
  }
})

