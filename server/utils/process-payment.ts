import prisma, { Decimal } from '~~/server/utils/db'
import { notifyAdmins, createNotification } from '~~/server/utils/notifications'

/**
 * Shared payment processing logic used by both Paynow and Smile&Pay webhooks.
 * Handles: invoice update → payment record → enrollment activation → notifications
 */
export async function processSuccessfulPayment(opts: {
    invoiceNumber: string
    method: 'PAYNOW' | 'SMILEPAY' | 'MANUAL'
    gatewayReference?: string
}) {
    if (!prisma) throw new Error('Database not available')

    const { invoiceNumber, method, gatewayReference } = opts

    // Find invoice
    const invoice = await prisma.invoice.findUnique({
        where: { number: invoiceNumber },
        include: {
            user: { select: { id: true, name: true, email: true } },
            enrollments: {
                include: {
                    course: { select: { id: true, name: true, instructorId: true } }
                }
            },
            payments: { orderBy: { createdAt: 'desc' as const }, take: 1 }
        }
    })

    if (!invoice) {
        console.error(`processSuccessfulPayment: Invoice not found: ${invoiceNumber}`)
        return { success: false, reason: 'Invoice not found' }
    }

    if (invoice.status === 'PAID') {
        console.log(`processSuccessfulPayment: Invoice ${invoiceNumber} already paid`)
        return { success: true, alreadyPaid: true }
    }

    // Update invoice status
    await prisma.invoice.update({
        where: { id: invoice.id },
        data: { status: 'PAID' }
    })

    // Create or update payment record
    const existingPayment = invoice.payments?.[0]
    if (!existingPayment) {
        await prisma.payment.create({
            data: {
                invoiceId: invoice.id,
                amountUsd: invoice.amountUsd,
                currency: invoice.currency || 'USD',
                status: 'SUCCESS',
                method
            }
        })
    } else if (existingPayment.status !== 'SUCCESS') {
        await prisma.payment.update({
            where: { id: existingPayment.id },
            data: { status: 'SUCCESS', method }
        })
    }

    // Activate enrollments
    for (const enrollment of invoice.enrollments) {
        if (enrollment.status === 'ACTIVE') continue

        await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { status: 'ACTIVE' }
        })
        console.log(`${method} payment: Activated enrollment ${enrollment.id} for course ${enrollment.courseId}`)

        // Create instructor earning
        try {
            const { createInstructorEarning } = await import('~~/server/utils/instructor-earnings')
            await createInstructorEarning(enrollment.id)
        } catch (e) {
            console.error('Failed to create instructor earning:', e)
        }

        // Notify admins
        await notifyAdmins({
            type: 'PAYMENT_SUCCESS',
            title: `Payment Received (${method})`,
            message: `Payment of ${Number(invoice.amountUsd).toFixed(2)} ${invoice.currency || 'USD'} received from ${invoice.user?.name || 'a user'} for course "${enrollment.course?.name || 'Unknown'}".`,
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
                method,
                gatewayReference
            }
        })

        // Notify user
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

        // Notify instructor
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

    return {
        success: true,
        invoiceId: invoice.id,
        enrollmentsActivated: invoice.enrollments.filter(e => e.status !== 'ACTIVE').length
    }
}
