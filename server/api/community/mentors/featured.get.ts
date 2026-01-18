import prismaModule from '~~/server/utils/db'

/**
 * Get 3 random featured (verified) mentors for the sidebar widget
 * Public access
 */
export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    // Get verified mentors first, then fill with others if needed
    const verifiedMentors = await prisma.mentorProfile.findMany({
        where: {
            available: true,
            verified: true
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    role: true
                }
            }
        },
        orderBy: { sessionsCount: 'desc' },
        take: 10 // Get more than needed for randomization
    })

    // If not enough verified, get some unverified too
    let candidates = verifiedMentors
    if (candidates.length < 3) {
        const unverifiedMentors = await prisma.mentorProfile.findMany({
            where: {
                available: true,
                verified: false
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                }
            },
            orderBy: { sessionsCount: 'desc' },
            take: 10 - candidates.length
        })
        candidates = [...candidates, ...unverifiedMentors]
    }

    // Shuffle and take 3
    const shuffled = candidates.sort(() => 0.5 - Math.random())
    const featured = shuffled.slice(0, 3)

    return featured.map(profile => ({
        id: profile.id,
        userId: profile.userId,
        name: profile.user.name,
        bio: profile.bio.substring(0, 100) + (profile.bio.length > 100 ? '...' : ''),
        skills: profile.skills.split(',').map(s => s.trim()).slice(0, 3),
        hourlyRate: profile.hourlyRate,
        verified: profile.verified,
        sessionsCount: profile.sessionsCount
    }))
})
