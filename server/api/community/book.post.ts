import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

/**
 * Book a mentorship session
 * Requires authentication
 * Uses Prisma transaction to:
 * 1. Verify user has sufficient credits
 * 2. Deduct credits from user
 * 3. Create booking record
 * 4. Increment mentor's session count (on completion)
 */
export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    // Verify authentication
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'You must be logged in to book a session' })
    }

    const body = await readBody(event)

    if (!body.mentorProfileId) {
        throw createError({ statusCode: 400, statusMessage: 'Mentor profile ID is required' })
    }

    if (!body.scheduledAt) {
        throw createError({ statusCode: 400, statusMessage: 'Scheduled date/time is required' })
    }

    const scheduledAt = new Date(body.scheduledAt)
    if (isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid or past scheduled date' })
    }

    const duration = body.duration || 60 // Default 60 minutes

    // Get mentor profile
    const mentorProfile = await prisma.mentorProfile.findUnique({
        where: { id: body.mentorProfileId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    if (!mentorProfile) {
        throw createError({ statusCode: 404, statusMessage: 'Mentor not found' })
    }

    if (!mentorProfile.available) {
        throw createError({ statusCode: 400, statusMessage: 'This mentor is not currently available' })
    }

    if (mentorProfile.userId === auth.userId) {
        throw createError({ statusCode: 400, statusMessage: 'You cannot book a session with yourself' })
    }

    // Calculate credit cost (based on hourly rate and duration)
    const creditsCost = Math.ceil((mentorProfile.hourlyRate * duration) / 60)

    // Get current user's credits
    const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { credits: true, name: true }
    })

    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    if (user.credits < creditsCost) {
        throw createError({
            statusCode: 402, // Payment Required
            statusMessage: 'Insufficient credits',
            data: {
                required: creditsCost,
                available: user.credits,
                shortfall: creditsCost - user.credits
            }
        })
    }

    // Use transaction to ensure atomicity
    const booking = await prisma.$transaction(async (tx) => {
        // Deduct credits from user
        await tx.user.update({
            where: { id: auth.userId },
            data: {
                credits: {
                    decrement: creditsCost
                }
            }
        })

        // Create booking record
        const newBooking = await tx.mentorBooking.create({
            data: {
                userId: auth.userId,
                mentorId: mentorProfile.userId,
                scheduledAt,
                duration,
                creditsCost,
                status: 'PENDING',
                notes: body.notes || null
            },
            include: {
                mentor: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return newBooking
    })

    return {
        success: true,
        booking: {
            id: booking.id,
            mentorName: booking.mentor.name,
            scheduledAt: booking.scheduledAt,
            duration: booking.duration,
            creditsCost: booking.creditsCost,
            status: booking.status
        },
        remainingCredits: user.credits - creditsCost
    }
})
