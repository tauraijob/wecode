import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { randomBytes } from 'crypto'
import { notifyAdmins } from '~~/server/utils/notifications'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'Sign in to RSVP' })
    }

    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Event ID required' })

    const session = await prisma.groupSession.findUnique({
        where: { id },
        select: { id: true, title: true, maxAttendees: true, hostId: true, _count: { select: { rsvps: true } } }
    })
    if (!session) throw createError({ statusCode: 404, statusMessage: 'Event not found' })

    // Toggle RSVP
    const existing = await prisma.groupSessionRSVP.findUnique({
        where: { sessionId_userId: { sessionId: id, userId: auth.userId } }
    })

    if (existing) {
        await prisma.groupSessionRSVP.delete({ where: { id: existing.id } })
        return { rsvpd: false, message: 'RSVP cancelled' }
    }

    // Check capacity
    if (session.maxAttendees && session._count.rsvps >= session.maxAttendees) {
        throw createError({ statusCode: 400, statusMessage: 'Event is at full capacity' })
    }

    // Generate unique ticket code
    const ticketCode = `WC-EVT-${randomBytes(3).toString('hex').toUpperCase()}`

    // Get user name for notification
    const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { name: true, email: true }
    })

    const rsvp = await prisma.groupSessionRSVP.create({
        data: { sessionId: id, userId: auth.userId, ticketCode }
    })

    // Award XP for RSVPing
    await prisma.user.update({
        where: { id: auth.userId },
        data: { xp: { increment: 5 } }
    })

    // Notify admins + event host about the signup
    try {
        await notifyAdmins({
            type: 'EVENT_RSVP',
            title: 'New Event Signup',
            message: `${user?.name || 'A user'} signed up for "${session.title}"`,
            metadata: {
                userName: user?.name,
                userEmail: user?.email,
                eventTitle: session.title,
                eventId: session.id,
                ticketCode
            }
        })
    } catch (e) {
        // Don't fail RSVP if notification fails
        console.error('Failed to send event signup notification:', e)
    }

    return { rsvpd: true, message: 'RSVP confirmed!', ticketCode }
})
