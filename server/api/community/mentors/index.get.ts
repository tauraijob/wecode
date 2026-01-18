import prismaModule from '~~/server/utils/db'

/**
 * Get all available mentors with their profiles
 * Public access
 */
export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 12
    const skip = (page - 1) * limit
    const skill = query.skill as string | undefined

    const where: any = {
        available: true
    }

    // Filter by skill if provided
    if (skill) {
        where.skills = {
            contains: skill
        }
    }

    const [mentorProfiles, total] = await Promise.all([
        prisma.mentorProfile.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                { verified: 'desc' },      // Verified mentors first
                { sessionsCount: 'desc' }, // Then by session count
                { createdAt: 'desc' }
            ],
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        }),
        prisma.mentorProfile.count({ where })
    ])

    return {
        mentors: mentorProfiles.map(profile => ({
            id: profile.id,
            userId: profile.userId,
            name: profile.user.name,
            bio: profile.bio,
            skills: profile.skills.split(',').map(s => s.trim()),
            hourlyRate: profile.hourlyRate,
            available: profile.available,
            verified: profile.verified,
            sessionsCount: profile.sessionsCount
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }
})
