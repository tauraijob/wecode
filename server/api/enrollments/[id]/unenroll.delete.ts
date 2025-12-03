import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { notifyAdmins, createNotification } from '~~/server/utils/notifications'

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const enrollmentId = getRouterParam(event, 'id')
  if (!enrollmentId) {
    throw createError({ statusCode: 400, statusMessage: 'Enrollment ID required' })
  }

  // Get enrollment to verify ownership and check invoice
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: {
        select: {
          id: true,
          name: true,
          instructorId: true
        }
      },
      invoice: {
        include: {
          enrollments: {
            select: {
              id: true,
              status: true
            }
          },
          payments: {
            select: {
              id: true,
              status: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })

  if (!enrollment) {
    throw createError({ statusCode: 404, statusMessage: 'Enrollment not found' })
  }

  // Only allow users to unenroll from their own enrollments, unless admin
  if (enrollment.userId !== auth.userId && auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  // Don't allow unenrolling from completed courses (optional - you can remove this if needed)
  if (enrollment.status === 'COMPLETED' && auth.role !== 'ADMIN') {
    throw createError({ statusCode: 400, statusMessage: 'Cannot unenroll from completed courses' })
  }

  // Handle associated invoice before updating enrollment
  let shouldDeleteInvoice = false
  if (enrollment.invoice) {
    const invoice = enrollment.invoice
    const isPaid = invoice.status === 'PAID'
    const hasSuccessfulPayment = invoice.payments.some(p => p.status === 'SUCCESS')
    const otherActiveEnrollments = invoice.enrollments.filter(
      e => e.id !== enrollmentId && e.status !== 'CANCELLED'
    )

    // If invoice is unpaid and this is the only enrollment, delete the invoice
    if (!isPaid && !hasSuccessfulPayment && otherActiveEnrollments.length === 0) {
      shouldDeleteInvoice = true
      console.log(`Will delete unpaid invoice ${invoice.number} for cancelled enrollment ${enrollmentId}`)
    } else {
      // Invoice is paid or has other enrollments - keep it for records
      console.log(`Keeping invoice ${invoice.number} (paid: ${isPaid}, other enrollments: ${otherActiveEnrollments.length})`)
    }
  }

  // Update enrollment status to CANCELLED and optionally clear invoiceId
  const updateData: any = {
    status: 'CANCELLED'
  }
  
  if (shouldDeleteInvoice) {
    updateData.invoiceId = null
  }
  
  const updated = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: updateData
  })

  // Delete invoice if needed (after clearing the reference)
  if (shouldDeleteInvoice && enrollment.invoice) {
    await prisma.invoice.delete({
      where: { id: enrollment.invoice.id }
    })
    console.log(`Invoice ${enrollment.invoice.number} deleted successfully`)
  }

  // Notify admins about enrollment cancellation
  await notifyAdmins({
    type: 'ENROLLMENT_CANCELLED',
    title: 'Enrollment Cancelled',
    message: `${enrollment.user?.name || 'A user'} has cancelled their enrollment in course "${enrollment.course.name}".`,
    metadata: { 
      enrollmentId: enrollment.id, 
      courseId: enrollment.course.id, 
      courseName: enrollment.course.name,
      userId: enrollment.userId,
      userName: enrollment.user?.name
    }
  })

  // Notify user about cancellation
  await createNotification({
    userId: enrollment.userId,
    type: 'ENROLLMENT_CANCELLED',
    title: 'Enrollment Cancelled',
    message: `Your enrollment in "${enrollment.course.name}" has been cancelled.`,
    metadata: { 
      enrollmentId: enrollment.id, 
      courseId: enrollment.course.id, 
      courseName: enrollment.course.name
    }
  })

  // Notify instructor if course has one
  if (enrollment.course.instructorId) {
    await createNotification({
      userId: enrollment.course.instructorId,
      type: 'ENROLLMENT_CANCELLED',
      title: 'Student Cancelled Enrollment',
      message: `${enrollment.user?.name || 'A student'} has cancelled their enrollment in your course "${enrollment.course.name}".`,
      metadata: { 
        enrollmentId: enrollment.id, 
        courseId: enrollment.course.id, 
        courseName: enrollment.course.name,
        userId: enrollment.userId,
        userName: enrollment.user?.name
      }
    })
  }

  return {
    success: true,
    enrollment: updated
  }
})



