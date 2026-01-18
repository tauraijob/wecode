
import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

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

    // Payouts are linked to 'instructorId' which matches user.id
    console.log('[PayoutHistory] Fetching payouts for userId:', auth.userId)

    const payouts = await prisma.payout.findMany({
        where: {
            instructorId: auth.userId
        },
        orderBy: {
            requestedAt: 'desc'
        },
        select: {
            id: true,
            amount: true,
            currency: true,
            status: true, // PENDING, PROCESSED, REJECTED
            method: true,
            notes: true,
            requestedAt: true,
            processedAt: true
        }
    })

    console.log('[PayoutHistory] Found payouts:', payouts.length)

    return { payouts }
})
