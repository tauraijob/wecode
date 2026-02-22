import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

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
        select: { id: true, maxAttendees: true, _count: { select: { rsvps: true } } }
    })
    if (!session) throw createError({ statusCode: 404, statusMessage: 'Event not found' })

    // Check capacity
    if (session.maxAttendees && session._count.rsvps >= session.maxAttendees) {
        throw createError({ statusCode: 400, statusMessage: 'Event is at full capacity' })
    }

    // Toggle RSVP
    const existing = await prisma.groupSessionRSVP.findUnique({
        where: { sessionId_userId: { sessionId: id, userId: auth.userId } }
    })

    if (existing) {
        await prisma.groupSessionRSVP.delete({ where: { id: existing.id } })
        return { rsvpd: false, message: 'RSVP cancelled' }
    }

    await prisma.groupSessionRSVP.create({
        data: { sessionId: id, userId: auth.userId }
    })

    // Award XP for RSVPing
    await prisma.user.update({
        where: { id: auth.userId },
        data: { xp: { increment: 5 } }
    })

    return { rsvpd: true, message: 'RSVP confirmed!' }
})
