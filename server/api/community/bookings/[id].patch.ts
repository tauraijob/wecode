import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

/**
 * Update mentor booking status
 * 
 * COMMISSION MODEL (60-40):
 * - When session is COMPLETED, credits are split:
 * - 60% → Mentor (added to mentor's credit balance)
 * - 40% → Platform (kept as revenue)
 * 
 * Example: 100 credit session
 * - Mentor earns: 60 credits ($6)
 * - Platform keeps: 40 credits ($4)
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

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!body.status) {
        throw createError({ statusCode: 400, statusMessage: 'Status is required' })
    }

    // Find booking with all necessary relations
    const booking = await prisma.mentorBooking.findUnique({
        where: { id },
        include: {
            mentor: true,
            user: { select: { id: true, name: true } }
        }
    })

    if (!booking) {
        throw createError({ statusCode: 404, statusMessage: 'Booking not found' })
    }

    // Check if user is authorized (Mentor OR Mentee)
    if (booking.mentorId !== auth.userId && booking.userId !== auth.userId) {
        throw createError({ statusCode: 403, statusMessage: 'Not authorized to update this booking' })
    }

    // Update status
    const updateData: any = { status: body.status }

    // If confirmed, setup communication
    if (body.status === 'CONFIRMED' && booking.status === 'PENDING') {
        // Only mentor can confirm
        if (booking.mentorId !== auth.userId) {
            throw createError({ statusCode: 403, statusMessage: 'Only mentor can confirm booking' })
        }

        // 1. Find or create persistent chat room between these two people
        const chatRoom = await prisma.chatRoom.upsert({
            where: {
                mentorId_menteeId: {
                    mentorId: booking.mentorId,
                    menteeId: booking.userId
                }
            },
            update: {}, // Don't change anything if it exists
            create: {
                mentorId: booking.mentorId,
                menteeId: booking.userId
            }
        })

        updateData.chatRoomId = chatRoom.id

        // 2. Generate a unique meeting URL (Google Meet style)
        const meetCode = Math.random().toString(36).substring(2, 5).toLowerCase() + '-' +
            Math.random().toString(36).substring(2, 6).toLowerCase() + '-' +
            Math.random().toString(36).substring(2, 5).toLowerCase()
        updateData.meetingUrl = `https://meet.google.com/${meetCode}`
    }

    const updated = await prisma.mentorBooking.update({
        where: { id },
        data: updateData
    })

    // If completed, process commission and increment mentor's session count
    if (body.status === 'COMPLETED' && booking.status !== 'COMPLETED') {
        // COMMISSION MODEL: 60% Mentor / 40% Platform
        const MENTOR_COMMISSION_RATE = 0.60

        const totalCredits = booking.creditsCost
        const mentorEarnings = Math.floor(totalCredits * MENTOR_COMMISSION_RATE)
        const platformEarnings = totalCredits - mentorEarnings

        console.log(`📊 Session completed: ${booking.id}`)
        console.log(`   Total Credits: ${totalCredits}`)
        console.log(`   Mentor Earns: ${mentorEarnings} credits (60%)`)
        console.log(`   Platform Keeps: ${platformEarnings} credits (40%)`)

        try {
            // Add credits to mentor's GENERAL balance (so they can spend them)
            // AND add to WITHDRAWABLE balance (so they can cash them out)
            await prisma.user.update({
                where: { id: booking.mentorId },
                data: { credits: { increment: mentorEarnings } }
            })

            // Increment mentor's session count and earnings stats
            await prisma.mentorProfile.update({
                where: { userId: booking.mentorId },
                data: {
                    sessionsCount: { increment: 1 },
                    // Store total earnings (in credits) for mentor dashboard
                    totalEarnings: { increment: mentorEarnings },
                    // Increment withdrawable amount
                    withdrawableBalance: { increment: mentorEarnings }
                }
            })

            console.log(`   ✅ Added ${mentorEarnings} credits to mentor ${booking.mentorId} (Withdrawable: +${mentorEarnings})`)
            console.log(`   💰 Platform earned ${platformEarnings} credits ($${(platformEarnings * 0.10).toFixed(2)})`)

        } catch (err) {
            console.error('Failed to process commission:', err)
        }
    }

    // Notify other party
    const isMentor = auth.userId === booking.mentorId
    const recipientId = isMentor ? booking.userId : booking.mentorId
    const actorName = isMentor ? booking.mentor.name : booking.user.name // Need to fetch user name if mentee

    try {
        await prisma.notification.create({
            data: {
                userId: recipientId,
                type: 'BOOKING_UPDATED',
                title: 'Booking Update',
                message: `Your session has been ${body.status.toLowerCase()} by ${isMentor ? 'mentor' : 'mentee'}.`,
                metadata: {
                    bookingId: id,
                    status: body.status,
                    mentorId: booking.mentorId
                }
            }
        })
    } catch (err) {
        console.error('Failed to create notification:', err)
    }

    return updated
})
