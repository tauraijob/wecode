import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const timeframe = query.timeframe as string || 'all'
    const limit = parseInt(query.limit as string) || 20

    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null

    try {
        // Get top users by XP
        const users = await prisma.user.findMany({
            where: { xp: { gt: 0 } },
            orderBy: { xp: 'desc' },
            take: limit,
            select: {
                id: true,
                name: true,
                xp: true,
                role: true,
                communityProfile: {
                    select: { username: true, avatarUrl: true, profession: true }
                },
                _count: {
                    select: {
                        forumPosts: true,
                        forumComments: true,
                        challengeSubmissions: true,
                        hostedSessions: true
                    }
                }
            }
        })

        // Get current user rank if authenticated
        let myRank = null
        if (auth) {
            const myUser = await prisma.user.findUnique({
                where: { id: auth.userId },
                select: { xp: true, name: true, communityProfile: { select: { username: true, avatarUrl: true } } }
            })
            if (myUser) {
                const rankCount = await prisma.user.count({ where: { xp: { gt: myUser.xp } } })
                myRank = {
                    rank: rankCount + 1,
                    xp: myUser.xp,
                    name: myUser.name,
                    profile: myUser.communityProfile
                }
            }
        }

        return {
            leaderboard: users.map((u, i) => ({
                rank: i + 1,
                id: u.id,
                name: u.name,
                xp: u.xp,
                role: u.role,
                profile: u.communityProfile,
                stats: {
                    posts: u._count.forumPosts,
                    comments: u._count.forumComments,
                    challenges: u._count.challengeSubmissions,
                    sessions: u._count.hostedSessions
                }
            })),
            myRank
        }
    } catch (error: any) {
        console.error('Error fetching leaderboard:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch leaderboard' })
    }
})
