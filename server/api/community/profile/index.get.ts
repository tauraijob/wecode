import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    // Get token from cookie (standard name is 'token')
    const token = getCookie(event, 'token')

    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
    }

    const decoded = verifyJwt(token)
    if (!decoded?.userId) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
    }

    try {

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                communityProfile: true
            }
        })

        if (!user) {
            throw createError({ statusCode: 404, statusMessage: 'User not found' })
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            credits: user.credits,
            profile: user.communityProfile ? {
                id: user.communityProfile.id,
                username: user.communityProfile.username,
                profession: user.communityProfile.profession,
                experienceLevel: user.communityProfile.experienceLevel,
                languages: user.communityProfile.languages,
                bio: user.communityProfile.bio,
                location: user.communityProfile.location,
                githubUrl: user.communityProfile.githubUrl,
                linkedinUrl: user.communityProfile.linkedinUrl,
                websiteUrl: user.communityProfile.websiteUrl,
                avatarUrl: user.communityProfile.avatarUrl
            } : null
        }
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
        }
        throw error
    }
})
