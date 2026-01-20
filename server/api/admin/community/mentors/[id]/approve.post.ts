/**
 * Admin API - Approve a mentor application
 */
import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { sendMail } from '~~/server/utils/mailer'
import { mentorApprovedEmail } from '~~/server/utils/email-templates'

export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    // Verify admin auth
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    const allowedRoles = ['ADMIN', 'COMMUNITY_ADMIN']
    if (!auth || !allowedRoles.includes(auth.role)) {
        throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const mentorId = getRouterParam(event, 'id')
    if (!mentorId) {
        throw createError({ statusCode: 400, statusMessage: 'Mentor ID required' })
    }

    // Find mentor profile
    const mentor = await prisma.mentorProfile.findUnique({
        where: { id: mentorId },
        include: {
            user: {
                select: { id: true, name: true, email: true, role: true }
            }
        }
    })

    if (!mentor) {
        throw createError({ statusCode: 404, statusMessage: 'Mentor not found' })
    }

    if (mentor.isApproved) {
        throw createError({ statusCode: 400, statusMessage: 'Mentor is already approved' })
    }

    // Approve mentor in transaction
    const updatedMentor = await prisma.$transaction(async (tx: any) => {
        // Update mentor profile
        const updated = await tx.mentorProfile.update({
            where: { id: mentorId },
            data: {
                isApproved: true,
                approvedAt: new Date()
            }
        })

        // Update user role to MENTOR if not already
        if (mentor.user.role !== 'MENTOR' && mentor.user.role !== 'ADMIN') {
            await tx.user.update({
                where: { id: mentor.user.id },
                data: { role: 'MENTOR' }
            })
        }

        return updated
    })

    // Send approval email to mentor
    try {
        await sendMail({
            to: mentor.user.email,
            subject: 'Your Mentor Application Has Been Approved! 🎉',
            html: mentorApprovedEmail(mentor.user.name)
        })
    } catch (emailError) {
        console.error('Failed to send approval email:', emailError)
    }

    return {
        success: true,
        message: 'Mentor approved successfully',
        mentor: updatedMentor
    }
})
