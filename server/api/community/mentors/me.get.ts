import { PrismaClient } from '@prisma/client'
import { verifyJwt } from '~/server/utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // Verify authentication
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null

    if (!auth) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    // Get mentor profile for the authenticated user
    const mentorProfile = await prisma.mentorProfile.findUnique({
        where: { userId: auth.userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    credits: true
                }
            }
        }
    })

    if (!mentorProfile) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Mentor profile not found'
        })
    }

    return {
        id: mentorProfile.id,
        userId: mentorProfile.userId,
        name: mentorProfile.user.name,
        email: mentorProfile.user.email,
        bio: mentorProfile.bio,
        skills: mentorProfile.skills,
        hourlyRate: mentorProfile.hourlyRate,
        available: mentorProfile.available,
        verified: mentorProfile.verified,
        sessionsCount: mentorProfile.sessionsCount,
        credits: mentorProfile.user.credits,
        totalEarnings: mentorProfile.totalEarnings,
        withdrawableBalance: mentorProfile.withdrawableBalance,
        createdAt: mentorProfile.createdAt
    }
})
