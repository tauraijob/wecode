/**
 * Admin API - Create a new coupon
 */
import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import crypto from 'crypto'

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

    const body = await readBody(event)

    // Validate required fields
    if (!body.credits || body.credits < 1) {
        throw createError({ statusCode: 400, statusMessage: 'Credits amount is required (minimum 1)' })
    }

    // Generate code if not provided
    let code = body.code?.toUpperCase().trim()
    if (!code) {
        // Generate a random code like "WECODE-XXXX"
        code = `WECODE-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
    }

    // Check if code already exists
    const existing = await prisma.coupon.findUnique({
        where: { code }
    })

    if (existing) {
        throw createError({ statusCode: 409, statusMessage: 'A coupon with this code already exists' })
    }

    // Parse expiry date if provided
    let expiresAt = null
    if (body.expiresAt) {
        expiresAt = new Date(body.expiresAt)
        if (isNaN(expiresAt.getTime())) {
            throw createError({ statusCode: 400, statusMessage: 'Invalid expiry date' })
        }
    }

    const coupon = await prisma.coupon.create({
        data: {
            code,
            credits: parseInt(body.credits),
            maxUses: body.maxUses ? parseInt(body.maxUses) : null,
            expiresAt,
            description: body.description?.trim() || null,
            createdBy: auth.userId,
            active: true
        }
    })

    return {
        success: true,
        coupon
    }
})
