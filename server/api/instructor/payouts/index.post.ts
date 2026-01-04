import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { Decimal } from '~~/server/utils/db'
import { notifyAdmins, createNotification } from '~~/server/utils/notifications'

const PayoutRequestSchema = z.object({
    amount: z.number().positive().min(1),
    method: z.enum(['ECOCASH', 'BANK_TRANSFER', 'PAYPAL', 'INNBUCKS', 'OTHER']),
    notes: z.string().optional().nullable(),
    paymentDetails: z.object({
        phoneNumber: z.string().optional(),
        accountName: z.string().optional(),
        bankName: z.string().optional(),
        accountNumber: z.string().optional(),
        branchCode: z.string().optional(),
        paypalEmail: z.string().email().optional(),
        otherMethodName: z.string().optional(),
        otherDetails: z.string().optional()
    })
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

    if (auth.role !== 'INSTRUCTOR') {
        throw createError({ statusCode: 403, statusMessage: 'Instructor access required' })
    }

    const body = await readBody(event)
    const parsed = PayoutRequestSchema.safeParse(body)
    if (!parsed.success) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
    }

    const { amount, method, notes, paymentDetails } = parsed.data

    // Get available balance (pending earnings)
    const pendingEarnings = await prisma.instructorEarning.findMany({
        where: {
            instructorId: auth.userId,
            status: 'PENDING',
            payoutId: null
        }
    })

    const totalPending = pendingEarnings.reduce(
        (sum, earning) => sum + Number(earning.amount),
        0
    )

    if (amount > totalPending) {
        throw createError({
            statusCode: 400,
            statusMessage: `Insufficient balance. Available: $${totalPending.toFixed(2)}`
        })
    }

    // Format payment details for notes
    let paymentInfo = `Method: ${method}\n`
    switch (method) {
        case 'ECOCASH':
        case 'INNBUCKS':
            paymentInfo += `Phone: ${paymentDetails.phoneNumber}\nName: ${paymentDetails.accountName}`
            break
        case 'BANK_TRANSFER':
            paymentInfo += `Bank: ${paymentDetails.bankName}\nAccount: ${paymentDetails.accountNumber}\nName: ${paymentDetails.accountName}`
            if (paymentDetails.branchCode) paymentInfo += `\nBranch: ${paymentDetails.branchCode}`
            break
        case 'PAYPAL':
            paymentInfo += `PayPal Email: ${paymentDetails.paypalEmail}`
            break
        case 'OTHER':
            paymentInfo += `Method: ${paymentDetails.otherMethodName}\nDetails: ${paymentDetails.otherDetails}`
            break
    }

    const fullNotes = notes ? `${paymentInfo}\n\nAdditional Notes: ${notes}` : paymentInfo

    // Create payout request
    const payout = await prisma.payout.create({
        data: {
            amount: new Decimal(amount),
            currency: 'USD',
            status: 'PENDING',
            method,
            notes: fullNotes,
            instructorId: auth.userId
        },
        include: {
            instructor: {
                select: { id: true, name: true, email: true }
            }
        }
    })

    // Link earnings to this payout (up to the requested amount)
    let remainingAmount = amount
    for (const earning of pendingEarnings) {
        if (remainingAmount <= 0) break

        const earningAmount = Number(earning.amount)
        if (earningAmount <= remainingAmount) {
            await prisma.instructorEarning.update({
                where: { id: earning.id },
                data: { payoutId: payout.id }
            })
            remainingAmount -= earningAmount
        }
    }

    // Notify admins
    await notifyAdmins({
        type: 'PAYOUT_REQUESTED',
        title: 'New Payout Request',
        message: `${payout.instructor?.name || 'An instructor'} has requested a payout of $${amount.toFixed(2)} via ${method}.`,
        metadata: {
            payoutId: payout.id,
            instructorId: auth.userId,
            amount,
            method
        }
    })

    // Notify instructor
    await createNotification({
        userId: auth.userId,
        type: 'PAYOUT_REQUESTED',
        title: 'Payout Request Submitted',
        message: `Your payout request of $${amount.toFixed(2)} has been submitted. You'll be notified once it's processed.`,
        metadata: { payoutId: payout.id }
    })

    return payout
})
