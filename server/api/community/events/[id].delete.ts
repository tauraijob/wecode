import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Event ID is required' })
    }

    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
    }

    // Only community admins and platform admins can delete events
    const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { role: true }
    })

    if (!user || !['ADMIN', 'COMMUNITY_ADMIN'].includes(user.role)) {
        throw createError({ statusCode: 403, statusMessage: 'Only community admins can delete events' })
    }

    // Optional: Check if the event exists
    const groupSession = await prisma.groupSession.findUnique({
        where: { id }
    })

    if (!groupSession) {
        throw createError({ statusCode: 404, statusMessage: 'Event not found' })
    }

    // Delete the event (Prisma will handle cascading RSVP deletions if configured, or we do it manually if not)
    // In the schema, GroupSessionRSVP has onDelete: Cascade for the session relation.
    await prisma.groupSession.delete({
        where: { id }
    })

    return { message: 'Event deleted successfully' }
})
