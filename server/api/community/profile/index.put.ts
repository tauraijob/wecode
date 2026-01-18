import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    // Standard auth uses 'token' cookie
    const token = getCookie(event, 'token')

    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
    }

    const decoded = verifyJwt(token)
    if (!decoded?.userId) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
    }

    const body = await readBody(event)
    const {
        username,
        profession,
        experienceLevel,
        languages,
        bio,
        location,
        githubUrl,
        linkedinUrl,
        websiteUrl,
        avatarUrl
    } = body

    try {

        // Check if username is already taken by another user
        if (username) {
            const existingProfile = await prisma.communityProfile.findFirst({
                where: {
                    username: username.toLowerCase(),
                    NOT: { userId: decoded.userId }
                }
            })

            if (existingProfile) {
                throw createError({
                    statusCode: 409,
                    statusMessage: 'This username is already taken'
                })
            }
        }

        // Upsert profile (create if doesn't exist, update if it does)
        const profile = await prisma.communityProfile.upsert({
            where: { userId: decoded.userId },
            create: {
                userId: decoded.userId,
                username: username?.toLowerCase() || `user_${Date.now()}`,
                profession,
                experienceLevel: experienceLevel || 'BEGINNER',
                languages,
                bio,
                location,
                githubUrl,
                linkedinUrl,
                websiteUrl,
                avatarUrl
            },
            update: {
                ...(username && { username: username.toLowerCase() }),
                ...(profession !== undefined && { profession }),
                ...(experienceLevel && { experienceLevel }),
                ...(languages !== undefined && { languages }),
                ...(bio !== undefined && { bio }),
                ...(location !== undefined && { location }),
                ...(githubUrl !== undefined && { githubUrl }),
                ...(linkedinUrl !== undefined && { linkedinUrl }),
                ...(websiteUrl !== undefined && { websiteUrl }),
                ...(avatarUrl !== undefined && { avatarUrl })
            }
        })

        return {
            success: true,
            profile
        }
    } catch (error: any) {
        if (error.statusCode) throw error
        if (error.name === 'JsonWebTokenError') {
            throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
        }
        console.error('Profile update error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update profile'
        })
    }
})
