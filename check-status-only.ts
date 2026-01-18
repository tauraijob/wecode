import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const all = await prisma.mentorBooking.findMany({ select: { status: true } })
    console.log('STATUSES_BEGIN')
    all.forEach(b => console.log(b.status))
    console.log('STATUSES_END')
}
main().finally(() => prisma.$disconnect())
