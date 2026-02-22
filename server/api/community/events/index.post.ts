import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth) {
        throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
    }

    // Only community admins and platform admins can create events
    const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { role: true } })
    if (!user || !['ADMIN', 'COMMUNITY_ADMIN'].includes(user.role)) {
        throw createError({ statusCode: 403, statusMessage: 'Only community admins can create events' })
    }

    const formData = await readMultipartFormData(event)

    // Parse fields from multipart form data
    const fields: Record<string, string> = {}
    let imageFile: any = null

    if (formData) {
        for (const item of formData) {
            if (item.name === 'image' && item.filename) {
                imageFile = item
            } else if (item.name) {
                fields[item.name] = item.data.toString('utf-8')
            }
        }
    }

    if (!fields.title || !fields.description || !fields.scheduledAt) {
        throw createError({ statusCode: 400, statusMessage: 'Title, description, and scheduled time are required' })
    }

    // Handle image upload
    let coverImage: string | null = null
    if (imageFile) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        if (!imageFile.type || !allowedTypes.includes(imageFile.type)) {
            throw createError({ statusCode: 400, statusMessage: 'Invalid image type. Only JPEG, PNG, WebP, and GIF allowed.' })
        }

        const maxSize = 5 * 1024 * 1024 // 5MB
        if (imageFile.data.length > maxSize) {
            throw createError({ statusCode: 400, statusMessage: 'Image size exceeds 5MB limit' })
        }

        const ext = imageFile.filename.split('.').pop() || 'jpg'
        const filename = `event-${randomBytes(12).toString('hex')}.${ext}`

        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'events')
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true })
        }

        await writeFile(join(uploadsDir, filename), imageFile.data)
        coverImage = `/uploads/events/${filename}`
    }

    const session = await prisma.groupSession.create({
        data: {
            title: fields.title.trim(),
            description: fields.description.trim(),
            scheduledAt: new Date(fields.scheduledAt),
            duration: parseInt(fields.duration) || 60,
            maxAttendees: fields.maxAttendees ? parseInt(fields.maxAttendees) : null,
            meetingUrl: fields.meetingUrl || null,
            location: fields.location || null,
            ticketPrice: fields.ticketPrice && parseFloat(fields.ticketPrice) > 0 ? parseFloat(fields.ticketPrice) : null,
            ticketCurrency: fields.ticketCurrency || 'USD',
            tags: fields.tags || null,
            coverImage,
            hostId: auth.userId
        },
        include: {
            host: { select: { id: true, name: true, role: true } },
            _count: { select: { rsvps: true } }
        }
    })

    return session
})
