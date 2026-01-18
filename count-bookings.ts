import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const count = await prisma.mentorBooking.count()
    console.log(`Total Bookings: ${count}`)

    if (count > 0) {
        const all = await prisma.mentorBooking.findMany()
        console.log(JSON.stringify(all, null, 2))
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
