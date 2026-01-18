import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

/**
 * Get user's bookings (for My Bookings page)
 * Requires authentication
 */
export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
    }

    const query = getQuery(event)
    const type = query.type as string || 'booked' // 'booked' or 'mentor' (sessions as mentor)

    if (type === 'mentor') {
        // Get sessions where user is the mentor
        const sessions = await prisma.mentorBooking.findMany({
            where: { mentorId: auth.userId },
            orderBy: { scheduledAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        return sessions.map(s => ({
            id: s.id,
            clientName: s.user.name,
            clientEmail: s.user.email,
            scheduledAt: s.scheduledAt,
            duration: s.duration,
            creditsCost: s.creditsCost,
            status: s.status,
            notes: s.notes,
            meetingUrl: s.meetingUrl,
            chatRoomId: s.chatRoomId
        }))
    } else {
        // Get bookings where user is the client
        const bookings = await prisma.mentorBooking.findMany({
            where: { userId: auth.userId },
            orderBy: { scheduledAt: 'desc' },
            include: {
                mentor: {
                    select: {
                        id: true,
                        name: true,
                        mentorProfile: {
                            select: {
                                verified: true,
                                skills: true
                            }
                        }
                    }
                }
            }
        })

        return bookings.map(b => ({
            id: b.id,
            mentorName: b.mentor.name,
            mentorVerified: b.mentor.mentorProfile?.verified || false,
            skills: b.mentor.mentorProfile?.skills?.split(',').slice(0, 3) || [],
            scheduledAt: b.scheduledAt,
            duration: b.duration,
            creditsCost: b.creditsCost,
            status: b.status,
            notes: b.notes,
            meetingUrl: b.meetingUrl,
            chatRoomId: b.chatRoomId
        }))
    }
})
