/**
 * Admin API - Get community statistics for dashboard
 */
import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    // Verify admin auth
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth || auth.role !== 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    // Get date for "today" and "this week" filters
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    // Gather all stats
    const [
        totalUsers,
        usersToday,
        usersThisWeek,
        verifiedUsers,
        totalMentors,
        pendingMentors,
        approvedMentors,
        totalPayouts,
        pendingPayouts,
        totalPayoutAmount,
        totalBookings,
        completedBookings,
        totalPosts,
        totalComments
    ] = await Promise.all([
        // Users
        prisma.user.count(),
        prisma.user.count({ where: { createdAt: { gte: today } } }),
        prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.user.count({ where: { emailVerified: true } }),

        // Mentors
        prisma.mentorProfile.count(),
        prisma.mentorProfile.count({ where: { isApproved: false } }),
        prisma.mentorProfile.count({ where: { isApproved: true } }),

        // Payouts
        prisma.payout.count(),
        prisma.payout.count({ where: { status: 'PENDING' } }),
        prisma.payout.aggregate({ _sum: { amount: true } }),

        // Bookings
        prisma.mentorBooking.count(),
        prisma.mentorBooking.count({ where: { status: 'COMPLETED' } }),

        // Forum
        prisma.forumPost.count(),
        prisma.forumComment.count()
    ])

    // Recent activity (last 5 users)
    const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            createdAt: true
        }
    })

    // Recent pending mentors
    const recentPendingMentors = await prisma.mentorProfile.findMany({
        where: { isApproved: false },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { name: true, email: true }
            }
        }
    })

    return {
        users: {
            total: totalUsers,
            today: usersToday,
            thisWeek: usersThisWeek,
            verified: verifiedUsers,
            unverified: totalUsers - verifiedUsers
        },
        mentors: {
            total: totalMentors,
            pending: pendingMentors,
            approved: approvedMentors
        },
        payouts: {
            total: totalPayouts,
            pending: pendingPayouts,
            totalAmount: Number(totalPayoutAmount._sum.amount || 0)
        },
        bookings: {
            total: totalBookings,
            completed: completedBookings
        },
        forum: {
            posts: totalPosts,
            comments: totalComments
        },
        recentUsers,
        recentPendingMentors
    }
})
