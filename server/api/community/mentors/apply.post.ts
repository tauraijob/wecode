/**
 * Apply to become a mentor
 * Creates a MentorProfile with isApproved=false
 * Notifies admin for approval
 */
import prismaModule from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { sendMail } from '~~/server/utils/mailer'
import { mentorPendingApprovalEmail, adminMentorApplicationAlert } from '~~/server/utils/email-templates'

export default defineEventHandler(async (event) => {
    const prisma = await prismaModule
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    // Verify authentication
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'You must be logged in to apply' })
    }

    const body = await readBody(event)
    const { bio, skills, hourlyRate } = body

    // Validation
    if (!bio || bio.trim().length < 50) {
        throw createError({ statusCode: 400, statusMessage: 'Bio must be at least 50 characters' })
    }

    if (!skills || skills.trim().length < 3) {
        throw createError({ statusCode: 400, statusMessage: 'Please list your skills' })
    }

    if (!hourlyRate || hourlyRate < 10 || hourlyRate > 500) {
        throw createError({ statusCode: 400, statusMessage: 'Hourly rate must be between 10 and 500 credits' })
    }

    // Get user info
    const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: { id: true, name: true, email: true, role: true }
    })

    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    // Check if already has mentor profile
    const existingProfile = await prisma.mentorProfile.findUnique({
        where: { userId: auth.userId }
    })

    if (existingProfile) {
        if (existingProfile.isApproved) {
            throw createError({ statusCode: 400, statusMessage: 'You are already an approved mentor' })
        } else {
            throw createError({ statusCode: 400, statusMessage: 'Your mentor application is pending approval' })
        }
    }

    // Create mentor profile (pending approval)
    const mentorProfile = await prisma.mentorProfile.create({
        data: {
            userId: auth.userId,
            bio: bio.trim(),
            skills: skills.trim(),
            hourlyRate: parseInt(hourlyRate),
            isApproved: false,
            available: true
        }
    })

    // Send confirmation email to user
    try {
        await sendMail({
            to: user.email,
            subject: 'Mentor Application Received',
            html: mentorPendingApprovalEmail(user.name)
        })
    } catch (emailError) {
        console.error('Failed to send user confirmation:', emailError)
    }

    // Notify admin
    try {
        const adminEmail = process.env.COMMUNITY_ADMIN_EMAIL || 'wecodezw@gmail.com'
        await sendMail({
            to: adminEmail,
            subject: `New Mentor Application: ${user.name}`,
            html: adminMentorApplicationAlert(user.name, user.email, skills.trim())
        })
    } catch (emailError) {
        console.error('Failed to send admin notification:', emailError)
    }

    return {
        success: true,
        message: 'Your mentor application has been submitted! We will review it and notify you.',
        mentorProfile
    }
})
