/**
 * Admin API - Reject a mentor application
 */
import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { sendMail } from '~~/server/utils/mailer'
import { mentorRejectedEmail } from '~~/server/utils/email-templates'

export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    // Verify admin auth
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth || auth.role !== 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const mentorId = getRouterParam(event, 'id')
    if (!mentorId) {
        throw createError({ statusCode: 400, statusMessage: 'Mentor ID required' })
    }

    const body = await readBody(event)
    const { reason } = body

    // Find mentor profile
    const mentor = await prisma.mentorProfile.findUnique({
        where: { id: mentorId },
        include: {
            user: {
                select: { id: true, name: true, email: true }
            }
        }
    })

    if (!mentor) {
        throw createError({ statusCode: 404, statusMessage: 'Mentor not found' })
    }

    // Delete the mentor profile (rejection removes mentor status)
    await prisma.mentorProfile.delete({
        where: { id: mentorId }
    })

    // Send rejection email to mentor
    try {
        await sendMail({
            to: mentor.user.email,
            subject: 'Update on Your Mentor Application',
            html: mentorRejectedEmail(mentor.user.name, reason)
        })
    } catch (emailError) {
        console.error('Failed to send rejection email:', emailError)
    }

    return {
        success: true,
        message: 'Mentor application rejected'
    }
})
