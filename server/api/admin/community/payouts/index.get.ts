/**
 * Admin API - Get all payouts
 */
import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    // Verify admin auth
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    const allowedRoles = ['ADMIN', 'COMMUNITY_ADMIN']
    if (!auth || !allowedRoles.includes(auth.role)) {
        throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const query = getQuery(event)
    const status = query.status as string | undefined

    let whereClause: any = {}
    if (status && ['PENDING', 'PROCESSED', 'REJECTED'].includes(status)) {
        whereClause.status = status
    }

    const payouts = await prisma.payout.findMany({
        where: whereClause,
        orderBy: { requestedAt: 'desc' },
        include: {
            instructor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                }
            }
        }
    })

    // Get stats
    const stats = {
        total: await prisma.payout.count(),
        pending: await prisma.payout.count({ where: { status: 'PENDING' } }),
        processed: await prisma.payout.count({ where: { status: 'PROCESSED' } })
    }

    return { payouts, stats }
})
