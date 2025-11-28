import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID required' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      topics: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              description: true,
              videoUrl: true,
              videoDuration: true,
              order: true
            }
          }
        },
        orderBy: { order: 'asc' }
      },
      _count: {
        select: {
          enrollments: true
        }
      }
    }
  })

  if (!course) {
    throw createError({ statusCode: 404, statusMessage: 'Course not found' })
  }

  // Only show published courses to non-admins
  if (course.status !== 'PUBLISHED' && (!auth || auth.role !== 'ADMIN')) {
    throw createError({ statusCode: 404, statusMessage: 'Course not found' })
  }

  // Include enrollment status if user is authenticated (exclude cancelled enrollments)
  let enrollment = null
  if (auth) {
    const foundEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: auth.userId,
          courseId: id
        }
      },
      select: {
        id: true,
        status: true,
        progressPercent: true,
        enrolledAt: true,
        completedAt: true,
        invoiceId: true,
        progress: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    })
    
    // Return enrollment if it exists (including PENDING for payment link)
    if (foundEnrollment && foundEnrollment.status !== 'CANCELLED') {
      // Always include invoice info if invoiceId exists
      if (foundEnrollment.invoiceId) {
        const invoice = await prisma.invoice.findUnique({
          where: { id: foundEnrollment.invoiceId },
          select: { 
            id: true,
            number: true,
            status: true
          }
        })
        if (invoice) {
          enrollment = {
            ...foundEnrollment,
            invoice: invoice
          }
        } else {
          enrollment = foundEnrollment
        }
      } else if (foundEnrollment.status !== 'PENDING') {
        enrollment = foundEnrollment
      } else {
        // PENDING enrollment without invoice - shouldn't happen but handle gracefully
        enrollment = foundEnrollment
      }
    }
  }

  return {
    ...course,
    enrollment
  }
})

