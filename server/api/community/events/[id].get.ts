import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Event ID required' })

    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null

    const session = await prisma.groupSession.findUnique({
        where: { id },
        include: {
            host: { select: { id: true, name: true, role: true } },
            rsvps: {
                include: {
                    user: { select: { id: true, name: true } }
                }
            },
            _count: { select: { rsvps: true } }
        }
    })

    if (!session) {
        throw createError({ statusCode: 404, statusMessage: 'Event not found' })
    }

    const hasRSVPd = auth ? session.rsvps.some(r => r.userId === auth.userId) : false

    return {
        ...session,
        attendeeCount: session._count.rsvps,
        hasRSVPd
    }
})
