import prisma, { Decimal } from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { notifyAdmins, createNotification } from '~~/server/utils/notifications'

const PaySchema = z.object({
  invoiceId: z.string(),
  amountUsd: z.coerce.number().positive()
})

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  const parsed = PaySchema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })

  const invoice = await prisma.invoice.findUnique({ 
    where: { id: parsed.data.invoiceId },
    include: {
      enrollments: {
        include: {
          course: {
            select: {
              id: true,
              name: true,
              instructorId: true
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
  if (!invoice || invoice.userId !== auth.userId) throw createError({ statusCode: 404, statusMessage: 'Invoice not found' })

  await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      amountUsd: new Decimal(parsed.data.amountUsd.toFixed(2)),
      currency: 'USD',
      status: 'SUCCESS',
      method: 'MANUAL'
    }
  })
  
  // Update invoice status to PAID
  await prisma.invoice.update({ where: { id: invoice.id }, data: { status: 'PAID' } })
  
  // Activate enrollments linked to this invoice
  for (const enrollment of invoice.enrollments) {
    if (enrollment.status !== 'ACTIVE') {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { status: 'ACTIVE' }
      })
      console.log('Manual payment: Activated enrollment', { enrollmentId: enrollment.id, courseId: enrollment.courseId })
      
      // Create instructor earning
      try {
        const { createInstructorEarning } = await import('~~/server/utils/instructor-earnings')
        await createInstructorEarning(enrollment.id)
      } catch (earningError) {
        console.error('Failed to create instructor earning:', earningError)
        // Don't fail the payment if earning creation fails
      }

      // Notify admins about successful payment
      await notifyAdmins({
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Received (Manual)',
        message: `Manual payment of ${Number(invoice.amountUsd).toFixed(2)} ${invoice.currency || 'USD'} received from ${invoice.user?.name || 'a user'} for course "${enrollment.course?.name || 'Unknown'}".`,
        metadata: { 
          invoiceId: invoice.id, 
          invoiceNumber: invoice.number,
          enrollmentId: enrollment.id,
          courseId: enrollment.courseId,
          courseName: enrollment.course?.name,
          userId: invoice.userId,
          userName: invoice.user?.name,
          amount: Number(invoice.amountUsd),
          currency: invoice.currency || 'USD',
          method: 'MANUAL'
        }
      })

      // Notify user about successful payment
      if (invoice.user) {
        await createNotification({
          userId: invoice.user.id,
          type: 'PAYMENT_SUCCESS',
          title: 'Payment Successful',
          message: `Your payment of ${Number(invoice.amountUsd).toFixed(2)} ${invoice.currency || 'USD'} for "${enrollment.course?.name || 'course'}" has been processed. You now have access to the course!`,
          metadata: { 
            invoiceId: invoice.id, 
            invoiceNumber: invoice.number,
            enrollmentId: enrollment.id,
            courseId: enrollment.courseId,
            courseName: enrollment.course?.name,
            amount: Number(invoice.amountUsd),
            currency: invoice.currency || 'USD'
          }
        })
      }

      // Notify instructor about payment
      if (enrollment.course?.instructorId) {
        await createNotification({
          userId: enrollment.course.instructorId,
          type: 'PAYMENT_SUCCESS',
          title: 'Student Payment Received',
          message: `${invoice.user?.name || 'A student'} has completed payment for your course "${enrollment.course.name}".`,
          metadata: { 
            invoiceId: invoice.id, 
            enrollmentId: enrollment.id,
            courseId: enrollment.courseId,
            courseName: enrollment.course.name,
            userId: invoice.userId,
            userName: invoice.user?.name,
            amount: Number(invoice.amountUsd),
            currency: invoice.currency || 'USD'
          }
        })
      }
    }
  }
  
  return { ok: true }
})

