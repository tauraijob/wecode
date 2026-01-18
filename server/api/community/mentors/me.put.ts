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

    const body = await readBody(event)
    const { bio, skills, hourlyRate, available } = body

    try {
        const updatedProfile = await prisma.mentorProfile.update({
            where: { userId: auth.userId },
            data: {
                ...(bio !== undefined && { bio }),
                ...(skills !== undefined && { skills }),
                ...(hourlyRate !== undefined && { hourlyRate: parseInt(hourlyRate.toString()) }),
                ...(available !== undefined && { available: !!available })
            }
        })

        return {
            success: true,
            profile: updatedProfile
        }
    } catch (error: any) {
        console.error('Mentor profile update error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update mentor profile'
        })
    }
})
