/**
 * Seed Community Admin User
 * 
 * Run with: npx tsx scripts/seed-community-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'taujob1111@gmail.com'
    const password = 'DevTeam24.$.$.'
    const name = 'Community Admin'

    console.log('🔧 Seeding Community Admin...')

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        // Update existing user to COMMUNITY_ADMIN role
        const updated = await prisma.user.update({
            where: { email },
            data: {
                role: 'COMMUNITY_ADMIN',
                emailVerified: true
            }
        })
        console.log(`✅ Updated existing user to COMMUNITY_ADMIN: ${updated.email}`)
    } else {
        // Create new user with COMMUNITY_ADMIN role
        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword,
                role: 'COMMUNITY_ADMIN',
                emailVerified: true,
                credits: 1000 // Give admin some credits
            }
        })

        // Also create a community profile
        await prisma.communityProfile.create({
            data: {
                userId: user.id,
                username: 'communityadmin',
                profession: 'Community Administrator',
                experienceLevel: 'EXPERT'
            }
        })

        console.log(`✅ Created Community Admin user: ${user.email}`)
    }

    console.log('\n📋 Login credentials:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log('\n🔗 Access the admin panel at: /community/admin')
}

main()
    .catch((e) => {
        console.error('❌ Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
