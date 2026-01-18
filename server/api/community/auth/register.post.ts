import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendMail } from '~~/server/utils/mailer'
import { welcomeEmail, adminNewUserAlert } from '~~/server/utils/email-templates'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { name, email, password, username, profession, experienceLevel, languages } = body

    // Validation
    if (!name || !email || !password || !username) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name, email, password, and username are required'
        })
    }

    if (password.length < 6) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Password must be at least 6 characters'
        })
    }

    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Username must be at least 3 characters and contain only letters, numbers, and underscores'
        })
    }

    try {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (existingUser) {
            throw createError({
                statusCode: 409,
                statusMessage: 'An account with this email already exists'
            })
        }

        // Check if username already exists
        const existingProfile = await prisma.communityProfile.findUnique({
            where: { username: username.toLowerCase() }
        })

        if (existingProfile) {
            throw createError({
                statusCode: 409,
                statusMessage: 'This username is already taken'
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex')
        const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        // Create user and community profile in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create user with INDIVIDUAL role (community member)
            const user = await tx.user.create({
                data: {
                    email: email.toLowerCase(),
                    name,
                    hashedPassword,
                    role: 'INDIVIDUAL',
                    credits: 10, // Starting credits for new community members
                    verificationToken,
                    tokenExpiresAt,
                    emailVerified: false
                }
            })

            // Create community profile
            const profile = await tx.communityProfile.create({
                data: {
                    userId: user.id,
                    username: username.toLowerCase(),
                    profession: profession || null,
                    experienceLevel: experienceLevel || 'BEGINNER',
                    languages: languages || null,
                }
            })

            return { user, profile }
        })

        // Send verification email to user
        // Use runtimeConfig to get SITE_URL at runtime (not baked in at build time)
        const config = useRuntimeConfig()
        const baseUrl = config.public.siteUrl || 'https://wecode.co.zw'
        const verificationLink = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`

        try {
            await sendMail({
                to: result.user.email,
                subject: 'Welcome to WeCode Community - Verify Your Email',
                html: welcomeEmail(result.user.name, verificationLink)
            })
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError)
            // Don't fail registration if email fails
        }

        // Notify admin of new user registration
        try {
            const adminEmail = process.env.COMMUNITY_ADMIN_EMAIL || 'wecodezw@gmail.com'
            await sendMail({
                to: adminEmail,
                subject: `New User Registration: ${result.user.name}`,
                html: adminNewUserAlert(result.user.name, result.user.email)
            })
        } catch (emailError) {
            console.error('Failed to send admin notification:', emailError)
        }

        // Generate JWT token using standard utility
        const { signJwt } = await import('~~/server/utils/jwt')
        const token = signJwt({
            userId: result.user.id,
            role: result.user.role
        })

        // Set cookie using standard name 'token'
        setCookie(event, 'token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        return {
            success: true,
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
                role: result.user.role,
                credits: result.user.credits,
                emailVerified: result.user.emailVerified,
                profile: {
                    username: result.profile.username,
                    profession: result.profile.profession,
                    experienceLevel: result.profile.experienceLevel,
                }
            },
            message: 'Registration successful! Please check your email to verify your account.'
        }
    } catch (error: any) {
        if (error.statusCode) throw error
        console.error('Registration error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Registration failed. Please try again.'
        })
    }
})
