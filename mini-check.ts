import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } })
    const all = await prisma.mentorBooking.findMany({ select: { id: true, status: true, mentorId: true, userId: true } })
    users.forEach(u => console.log(`U|${u.id}|${u.name}|${u.email}`))
    all.forEach(b => console.log(`B|${b.id}|${b.status}|${b.mentorId}|${b.userId}`))
}
main().finally(() => prisma.$disconnect())
