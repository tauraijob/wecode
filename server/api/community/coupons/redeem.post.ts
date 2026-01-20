/**
 * User API - Redeem a coupon code
 */
import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    // Verify authentication
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'You must be logged in to redeem a coupon' })
    }

    const body = await readBody(event)

    if (!body.code) {
        throw createError({ statusCode: 400, statusMessage: 'Coupon code is required' })
    }

    const code = body.code.toUpperCase().trim()

    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
        where: { code }
    })

    if (!coupon) {
        throw createError({ statusCode: 404, statusMessage: 'Invalid coupon code' })
    }

    if (!coupon.active) {
        throw createError({ statusCode: 400, statusMessage: 'This coupon is no longer active' })
    }

    // Check expiry
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw createError({ statusCode: 400, statusMessage: 'This coupon has expired' })
    }

    // Check max uses
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
        throw createError({ statusCode: 400, statusMessage: 'This coupon has reached its usage limit' })
    }

    // Check if user already redeemed this coupon
    const existingRedemption = await prisma.couponRedemption.findUnique({
        where: {
            couponId_userId: {
                couponId: coupon.id,
                userId: auth.userId
            }
        }
    })

    if (existingRedemption) {
        throw createError({ statusCode: 400, statusMessage: 'You have already redeemed this coupon' })
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
        // Add credits to user
        const updatedUser = await tx.user.update({
            where: { id: auth.userId },
            data: {
                credits: { increment: coupon.credits }
            },
            select: { credits: true }
        })

        // Record redemption
        await tx.couponRedemption.create({
            data: {
                couponId: coupon.id,
                userId: auth.userId,
                credits: coupon.credits
            }
        })

        // Increment usage count
        await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } }
        })

        return updatedUser
    })

    return {
        success: true,
        message: `You've received ${coupon.credits} credits!`,
        creditsAwarded: coupon.credits,
        newBalance: result.credits
    }
})
