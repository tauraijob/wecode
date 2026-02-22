import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) throw createError({ statusCode: 401, statusMessage: 'Sign in to view referral info' })

    try {
        const user = await prisma.user.findUnique({
            where: { id: auth.userId },
            select: { id: true, referralCode: true, name: true }
        })

        if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

        // Generate referral code if not exists
        let referralCode = user.referralCode
        if (!referralCode) {
            referralCode = crypto.randomBytes(4).toString('hex').toUpperCase()
            await prisma.user.update({
                where: { id: auth.userId },
                data: { referralCode }
            })
        }

        // Get referral stats
        const referrals = await prisma.referral.findMany({
            where: { referrerId: auth.userId },
            include: {
                referred: { select: { name: true, createdAt: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        const totalCreditsEarned = referrals.reduce((sum, r) => sum + r.creditsAwarded, 0)

        return {
            referralCode,
            totalReferrals: referrals.length,
            completedReferrals: referrals.filter(r => r.status === 'COMPLETED').length,
            totalCreditsEarned,
            referrals: referrals.map(r => ({
                name: r.referred.name,
                status: r.status,
                creditsAwarded: r.creditsAwarded,
                date: r.createdAt
            }))
        }
    } catch (error: any) {
        if (error.statusCode) throw error
        console.error('Error fetching referral info:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to fetch referral info' })
    }
})
