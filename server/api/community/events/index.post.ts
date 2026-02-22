import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
    }

    // Only mentors and admins can create events
    const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { role: true } })
    if (!user || !['MENTOR', 'ADMIN', 'COMMUNITY_ADMIN'].includes(user.role)) {
        throw createError({ statusCode: 403, statusMessage: 'Only mentors and admins can create events' })
    }

    const body = await readBody(event)
    if (!body.title || !body.description || !body.scheduledAt) {
        throw createError({ statusCode: 400, statusMessage: 'Title, description, and scheduled time are required' })
    }

    const session = await prisma.groupSession.create({
        data: {
            title: body.title.trim(),
            description: body.description.trim(),
            scheduledAt: new Date(body.scheduledAt),
            duration: body.duration || 60,
            maxAttendees: body.maxAttendees || null,
            meetingUrl: body.meetingUrl || null,
            tags: body.tags || null,
            hostId: auth.userId
        },
        include: {
            host: { select: { id: true, name: true, role: true } },
            _count: { select: { rsvps: true } }
        }
    })

    return session
})
