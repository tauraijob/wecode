import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const all = await prisma.mentorBooking.findMany({
        select: { id: true, status: true, mentorId: true, userId: true, scheduledAt: true }
    })
    console.log('Bookings Status Check:')
    all.forEach(b => {
        console.log(`ID: ${b.id} | Status: ${b.status} | Mentor: ${b.mentorId} | User: ${b.userId} | Date: ${b.scheduledAt}`)
    })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
