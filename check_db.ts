import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

async function main() {
    const bookings = await prisma.mentorBooking.findMany({
        select: { id: true, status: true, mentorId: true, userId: true }
    })
    const output = bookings.map(b => `${b.id}|${b.status}|${b.mentorId}|${b.userId}`).join('\n')
    fs.writeFileSync('db_status.txt', output)
    console.log('Done')
}

main().finally(() => prisma.$disconnect())
