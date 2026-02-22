import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'Sign in to view your ticket' })
    }

    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Event ID required' })

    // Get RSVP with event details
    const rsvp = await prisma.groupSessionRSVP.findUnique({
        where: { sessionId_userId: { sessionId: id, userId: auth.userId } },
        include: {
            session: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    scheduledAt: true,
                    duration: true,
                    location: true,
                    coverImage: true,
                    meetingUrl: true,
                    host: { select: { name: true } }
                }
            },
            user: { select: { name: true, email: true } }
        }
    })

    if (!rsvp) {
        throw createError({ statusCode: 404, statusMessage: 'You have not RSVP\'d for this event' })
    }

    return {
        ticketCode: rsvp.ticketCode,
        attendeeName: rsvp.user.name,
        attendeeEmail: rsvp.user.email,
        eventTitle: rsvp.session.title,
        eventDescription: rsvp.session.description,
        eventDate: rsvp.session.scheduledAt,
        eventDuration: rsvp.session.duration,
        eventLocation: rsvp.session.location,
        eventImage: rsvp.session.coverImage,
        eventMeetingUrl: rsvp.session.meetingUrl,
        hostName: rsvp.session.host.name,
        registeredAt: rsvp.createdAt
    }
})
