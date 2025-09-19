import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const adminEmail = 'admin@wecode.co.zw'
  const adminPassword = 'admin123' // Change this in production!
  
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      role: 'ADMIN',
      hashedPassword: hashedPassword,
      phone: '+263 778 456 168'
    }
  })

  console.log('✅ Admin user created:', {
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role
  })

  // Create a sample school for testing
  const sampleSchool = await prisma.school.create({
    data: {
      name: 'Sample School',
      contactEmail: 'school@example.com',
      contactName: 'School Administrator',
      phone: '+263 123 456 789'
    }
  })

  console.log('✅ Sample school created:', {
    name: sampleSchool.name,
    email: sampleSchool.contactEmail
  })

  // Create a sample school user
  const schoolUser = await prisma.user.create({
    data: {
      email: 'school@example.com',
      name: 'School Administrator',
      role: 'INDIVIDUAL',
      hashedPassword: await bcrypt.hash('school123', 10),
      phone: '+263 123 456 789'
    }
  })

  // Update the school to have this user as owner
  await prisma.school.update({
    where: { id: sampleSchool.id },
    data: { ownerId: schoolUser.id }
  })

  console.log('✅ Sample school user created:', {
    email: schoolUser.email,
    name: schoolUser.name,
    role: schoolUser.role
  })

  console.log('🎉 Seed completed successfully!')
  console.log('\n📋 Login credentials:')
  console.log('Admin: admin@wecode.co.zw / admin123')
  console.log('School: school@example.com / school123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
