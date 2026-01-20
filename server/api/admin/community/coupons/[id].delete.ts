/**
 * Admin API - Deactivate/delete a coupon
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

    const couponId = getRouterParam(event, 'id')
    if (!couponId) {
        throw createError({ statusCode: 400, statusMessage: 'Coupon ID is required' })
    }

    const coupon = await prisma.coupon.findUnique({
        where: { id: couponId }
    })

    if (!coupon) {
        throw createError({ statusCode: 404, statusMessage: 'Coupon not found' })
    }

    // Toggle active status (soft delete)
    await prisma.coupon.update({
        where: { id: couponId },
        data: { active: !coupon.active }
    })

    return {
        success: true,
        message: coupon.active ? 'Coupon deactivated' : 'Coupon reactivated'
    }
})
