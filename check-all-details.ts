import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } })
    const all = await prisma.mentorBooking.findMany({
        select: { id: true, status: true, mentorId: true, userId: true }
    })
    console.log('Users Map:')
    users.forEach(u => console.log(`${u.id}: ${u.name} (${u.email})`))
    console.log('\nBookings Detailed Check:')
    all.forEach(b => {
        console.log(`ID: ${b.id} | Status: ${b.status} | MentorID: ${b.mentorId} | MenteeID: ${b.userId}`)
    })
}
main().finally(() => prisma.$disconnect())
