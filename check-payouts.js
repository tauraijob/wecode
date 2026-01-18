const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const payouts = await prisma.payout.findMany({
        take: 10,
        select: {
            id: true,
            amount: true,
            instructorId: true,
            status: true,
            requestedAt: true
        }
    })
    console.log('Payouts found:', payouts.length)
    console.log(JSON.stringify(payouts, null, 2))
}

main().finally(() => prisma.$disconnect())
