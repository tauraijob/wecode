import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Current Mentor Bookings ---')
    const bookings = await prisma.mentorBooking.findMany({
        include: {
            user: { select: { name: true, email: true } },
            mentor: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    bookings.forEach(b => {
        console.log(`ID: ${b.id}`)
        console.log(`  Mentee: ${b.user.name} (${b.user.email})`)
        console.log(`  Mentor: ${b.mentor.name} (${b.mentor.email})`)
        console.log(`  Status: ${b.status}`)
        console.log(`  Created: ${b.createdAt}`)
        console.log('---------------------------')
    })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
