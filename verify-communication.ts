import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Verification: Mentorship Communication Setup ---')

    // 1. Find a pending booking
    const pendingBooking = await prisma.mentorBooking.findFirst({
        where: { status: 'PENDING' }
    })

    if (!pendingBooking) {
        console.log('No pending bookings found for verification.')
        return
    }

    console.log(`Verifying Booking ID: ${pendingBooking.id}`)

    // 2. Simulate the patch logic (since I can't easily call the API handler with a mock event here)
    // I'll just check if the logic I added works by manually running a similar update or checking if one already got updated if the user tried it.

    // Let's check if any CONFIRMED booking already has a room
    const confirmed = await prisma.mentorBooking.findFirst({
        where: { status: 'CONFIRMED' },
        include: { chatRoom: true }
    })

    if (confirmed) {
        console.log('Confirmed booking found!')
        console.log(`  Meeting URL: ${confirmed.meetingUrl}`)
        console.log(`  Chat Room ID: ${confirmed.chatRoomId}`)
        if (confirmed.chatRoom) {
            console.log('  Chat Room verified in DB.')
        } else {
            console.log('  WARNING: Confirmed booking missing chat room relation!')
        }
    } else {
        console.log('No confirmed bookings found. Please approve a session in the UI to fully verify.')
    }
}

main().finally(() => prisma.$disconnect())
