import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null

    try {
        const badges = await prisma.badge.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { users: true } }
            }
        })

        let myBadges: string[] = []
        if (auth) {
            const userBadges = await prisma.userBadge.findMany({
                where: { userId: auth.userId },
                select: { badgeId: true }
            })
            myBadges = userBadges.map(b => b.badgeId)
        }

        return {
            badges: badges.map(b => ({
                ...b,
                earnedCount: b._count.users,
                earned: myBadges.includes(b.id)
            }))
        }
    } catch (error: any) {
        console.error('Error fetching badges:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch badges' })
    }
})
