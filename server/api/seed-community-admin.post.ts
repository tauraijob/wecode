/**
 * Web-based Community Admin Seeder
 * 
 * POST /api/seed-community-admin
 * Body: { secret: string, email?: string, password?: string, name?: string }
 * 
 * Uses a secret key for authentication to prevent unauthorized access.
 * Set SEED_SECRET in your environment variables on the live server.
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    // Security: Require a secret key to run this endpoint
    const seedSecret = process.env.SEED_SECRET || 'WeCode2024SecretSeed!'

    if (!body.secret || body.secret !== seedSecret) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: Invalid seed secret'
        })
    }

    // Allow customization via body, with defaults
    const email = body.email || 'wecodezw@gmail.com'
    const password = body.password || 'DevTeam24.$.$'
    const name = body.name || 'Community Admin'

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        const hashedPassword = await bcrypt.hash(password, 12)

        let result

        if (existingUser) {
            // Update existing user to COMMUNITY_ADMIN role
            result = await prisma.user.update({
                where: { email },
                data: {
                    role: 'COMMUNITY_ADMIN',
                    hashedPassword,
                    emailVerified: true,
                    credits: existingUser.credits < 500 ? 500 : existingUser.credits
                }
            })

            return {
                success: true,
                message: 'Updated existing user to COMMUNITY_ADMIN',
                user: {
                    id: result.id,
                    email: result.email,
                    name: result.name,
                    role: result.role,
                    credits: result.credits
                },
                credentials: {
                    email,
                    password,
                    accessUrl: '/community/admin'
                }
            }
        } else {
            // Create new user with COMMUNITY_ADMIN role
            result = await prisma.user.create({
                data: {
                    email,
                    name,
                    hashedPassword,
                    role: 'COMMUNITY_ADMIN',
                    emailVerified: true,
                    credits: 1000
                }
            })

            // Also create a community profile for the admin
            await prisma.communityProfile.create({
                data: {
                    userId: result.id,
                    username: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ''),
                    profession: 'Community Administrator',
                    experienceLevel: 'EXPERT'
                }
            })

            return {
                success: true,
                message: 'Created new COMMUNITY_ADMIN user',
                user: {
                    id: result.id,
                    email: result.email,
                    name: result.name,
                    role: result.role,
                    credits: result.credits
                },
                credentials: {
                    email,
                    password,
                    accessUrl: '/community/admin'
                }
            }
        }
    } catch (error: any) {
        console.error('Seed Community Admin Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Failed to seed community admin'
        })
    } finally {
        await prisma.$disconnect()
    }
})
