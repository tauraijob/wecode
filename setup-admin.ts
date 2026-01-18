/**
 * Create/Update Community Admin User
 * Run with: npx tsx setup-admin.ts
 */
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'wecodezw@gmail.com'
    const password = 'DevTeam24.$.$'
    const hashedPassword = await bcrypt.hash(password, 12)

    // Check if user exists
    const existing = await prisma.user.findUnique({
        where: { email }
    })

    if (existing) {
        // Update to admin and set password
        await prisma.user.update({
            where: { email },
            data: {
                role: 'ADMIN',
                hashedPassword,
                emailVerified: true
            }
        })
        console.log('✅ Updated existing user to ADMIN:', email)
    } else {
        // Create new admin user
        await prisma.user.create({
            data: {
                email,
                name: 'Community Admin',
                hashedPassword,
                role: 'ADMIN',
                emailVerified: true,
                credits: 1000
            }
        })
        console.log('✅ Created new ADMIN user:', email)
    }

    console.log('Email:', email)
    console.log('Password:', password)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
