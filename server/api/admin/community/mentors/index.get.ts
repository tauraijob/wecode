/**
 * Admin API - Get all mentor applications (pending and approved)
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
    const status = query.status as string | undefined // 'pending' | 'approved' | 'all'

    // Build where clause based on status filter
    let whereClause: any = {}
    if (status === 'pending') {
        whereClause.isApproved = false
    } else if (status === 'approved') {
        whereClause.isApproved = true
    }

    const mentors = await prisma.mentorProfile.findMany({
        where: whereClause,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    emailVerified: true,
                    createdAt: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Get stats
    const stats = {
        total: await prisma.mentorProfile.count(),
        pending: await prisma.mentorProfile.count({ where: { isApproved: false } }),
        approved: await prisma.mentorProfile.count({ where: { isApproved: true } })
    }

    return { mentors, stats }
})
