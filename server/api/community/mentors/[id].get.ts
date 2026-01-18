import prismaModule from '~~/server/utils/db'

/**
 * Get a specific mentor's full profile
 * Public access
 */
export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Mentor profile ID is required' })
    }

    const profile = await prisma.mentorProfile.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            }
        }
    })

    if (!profile) {
        throw createError({ statusCode: 404, statusMessage: 'Mentor not found' })
    }

    return {
        id: profile.id,
        userId: profile.userId,
        name: profile.user.name,
        email: profile.user.email,
        bio: profile.bio,
        skills: profile.skills.split(',').map(s => s.trim()),
        hourlyRate: profile.hourlyRate,
        available: profile.available,
        verified: profile.verified,
        sessionsCount: profile.sessionsCount,
        memberSince: profile.user.createdAt,
        createdAt: profile.createdAt
    }
})
