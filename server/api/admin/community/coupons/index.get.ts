/**
 * Admin API - List all coupons
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

    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { redemptions: true }
            }
        }
    })

    // Get stats
    const [totalCoupons, activeCoupons, totalRedemptions] = await Promise.all([
        prisma.coupon.count(),
        prisma.coupon.count({ where: { active: true } }),
        prisma.couponRedemption.count()
    ])

    return {
        coupons: coupons.map(c => ({
            ...c,
            redemptionCount: c._count.redemptions
        })),
        stats: {
            total: totalCoupons,
            active: activeCoupons,
            totalRedemptions
        }
    }
})
