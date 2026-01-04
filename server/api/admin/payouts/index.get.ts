import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    const user = await getCurrentUser(event)
    if (!user || user.role !== 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const payouts = await prisma.payout.findMany({
        orderBy: { requestedAt: 'desc' },
        include: {
            instructor: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            processedBy: {
                select: {
                    id: true,
                    name: true
                }
            },
            earnings: {
                include: {
                    course: {
                        select: { id: true, name: true }
                    }
                }
            }
        }
    })

    return payouts
})
