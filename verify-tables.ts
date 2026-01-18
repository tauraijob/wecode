import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const chatRoomCount = await prisma.chatRoom.count()
        console.log(`ChatRoom table exists. Count: ${chatRoomCount}`)

        const messageCount = await prisma.chatMessage.count()
        console.log(`ChatMessage table exists. Count: ${messageCount}`)

        // Check if MentorBooking has meetingUrl
        const firstBooking = await prisma.mentorBooking.findFirst()
        if (firstBooking && 'meetingUrl' in firstBooking) {
            console.log('MentorBooking table updated with meetingUrl')
        } else {
            console.log('MentorBooking table NOT updated with meetingUrl (or no bookings found)')
        }
    } catch (err: any) {
        console.log('Error verifying tables:', err.message)
    }
}

main().finally(() => prisma.$disconnect())
