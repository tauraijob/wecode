/**
 * Admin API - Get all users
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
    const search = query.search as string | undefined
    const verified = query.verified as string | undefined

    // Community roles filter - only show community-related users
    const communityRoles = ['INDIVIDUAL', 'MENTOR', 'COMMUNITY_ADMIN']

    let whereClause: any = {
        role: { in: communityRoles }
    }

    if (search) {
        whereClause.AND = [
            { role: { in: communityRoles } },
            {
                OR: [
                    { name: { contains: search } },
                    { email: { contains: search } }
                ]
            }
        ]
        delete whereClause.role // Remove since it's in AND now
    }

    if (verified === 'true') {
        whereClause.emailVerified = true
    } else if (verified === 'false') {
        whereClause.emailVerified = false
    }

    const users = await prisma.user.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            emailVerified: true,
            credits: true,
            createdAt: true,
            communityProfile: {
                select: {
                    username: true,
                    profession: true
                }
            },
            mentorProfile: {
                select: {
                    id: true,
                    isApproved: true
                }
            }
        }
    })

    return { users }
})
