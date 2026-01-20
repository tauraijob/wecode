/**
 * Create/Update Community Admin User
 * Run with: npx tsx setup-community-admin.ts
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'community@wecode.co.zw'
    const password = 'CommunityAdmin24.$'
    const hashedPassword = await bcrypt.hash(password, 12)

    // Check if user exists
    const existing = await prisma.user.findUnique({
        where: { email }
    })

    if (existing) {
        // Update to community admin and set password
        await prisma.user.update({
            where: { email },
            data: {
                role: 'COMMUNITY_ADMIN',
                hashedPassword,
                emailVerified: true
            }
        })
        console.log('✅ Updated existing user to COMMUNITY_ADMIN:', email)
    } else {
        // Create new community admin user
        await prisma.user.create({
            data: {
                email,
                name: 'Community Admin',
                hashedPassword,
                role: 'COMMUNITY_ADMIN',
                emailVerified: true,
                credits: 500
            }
        })
        console.log('✅ Created new COMMUNITY_ADMIN user:', email)
    }

    console.log('')
    console.log('🔐 Login Credentials:')
    console.log('   Email:', email)
    console.log('   Password:', password)
    console.log('')
    console.log('📍 Access: http://localhost:3000/community/admin')
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
