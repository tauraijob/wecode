import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { generateQuizQuestions } from '~~/server/utils/ai-quiz'

export default defineEventHandler(async (event) => {
  const prismaClient = await prisma
  if (!prismaClient) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  // Check if user is admin
  const user = await prismaClient.user.findUnique({
    where: { id: auth.userId },
    select: { role: true }
  })

  if (!user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  const lessonId = getRouterParam(event, 'id')
  if (!lessonId) {
    throw createError({ statusCode: 400, statusMessage: 'Lesson ID required' })
  }

  const body = await readBody(event).catch(() => ({}))
  const questionCount = body.questionCount || 10
  const difficulty = body.difficulty || 'medium'

  // Get lesson with course and topic context
  const lesson = await prismaClient.lesson.findUnique({
    where: { id: lessonId },
    include: {
      topic: {
        include: {
          course: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  if (!lesson) {
    throw createError({ statusCode: 404, statusMessage: 'Lesson not found' })
  }

  // Generate quiz questions using AI
  const sourceMaterial = lesson.transcript || lesson.notes || lesson.description || ''
  if (!sourceMaterial) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Lesson content not available for quiz generation. Please add transcript, notes, or description.' 
    })
  }

  try {
    const questions = await generateQuizQuestions(
      sourceMaterial,
      questionCount,
      difficulty,
      lesson.topic?.course?.name,
      lesson.topic?.name
    )

    return {
      success: true,
      questions,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        courseName: lesson.topic?.course?.name,
        topicName: lesson.topic?.name
      }
    }
  } catch (error: any) {
    console.error('Error generating quiz:', error)
    throw createError({ 
      statusCode: 500, 
      statusMessage: error.message || 'Failed to generate quiz. Please check your GEMINI_API_KEY environment variable.' 
    })
  }
})



