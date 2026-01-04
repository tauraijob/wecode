import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'

const IssueSchema = z.object({
    enrollmentIds: z.array(z.string()).min(1),
    templateId: z.string().optional()
})

export default defineEventHandler(async (event) => {
    if (!prisma) {
        throw createError({ statusCode: 503, statusMessage: 'Database not available' })
    }

    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null
    if (!auth || auth.role !== 'ADMIN') {
        throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const body = await readBody(event)
    const parsed = IssueSchema.safeParse(body)
    if (!parsed.success) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
    }

    const { enrollmentIds, templateId } = parsed.data
    const results: any[] = []
    const errors: any[] = []

    for (const enrollmentId of enrollmentIds) {
        try {
            // Get enrollment with course and user info
            const enrollment = await prisma.enrollment.findUnique({
                where: { id: enrollmentId },
                include: {
                    user: true,
                    course: {
                        include: {
                            certificateTemplates: true
                        }
                    }
                }
            })

            if (!enrollment) {
                errors.push({ enrollmentId, error: 'Enrollment not found' })
                continue
            }

            // Only COMPLETED enrollments can receive certificates
            if (enrollment.status !== 'COMPLETED') {
                errors.push({ enrollmentId, error: 'Only completed enrollments can receive certificates' })
                continue
            }

            // Check if certificate already exists
            const existingCert = await prisma.certificate.findFirst({
                where: { enrollmentId }
            })

            if (existingCert) {
                errors.push({ enrollmentId, error: 'Certificate already issued', certificateId: existingCert.id })
                continue
            }

            // Find template - use specified, course-specific, or first available
            let template = null
            if (templateId) {
                template = await prisma.certificateTemplate.findUnique({ where: { id: templateId } })
            }
            if (!template) {
                template = enrollment.course.certificateTemplates[0] ||
                    await prisma.certificateTemplate.findFirst({ where: { courseId: null } }) ||
                    await prisma.certificateTemplate.findFirst()
            }

            if (!template) {
                errors.push({ enrollmentId, error: 'No certificate template available' })
                continue
            }

            // Generate unique certificate number
            const timestamp = Date.now().toString(36).toUpperCase()
            const random = Math.random().toString(36).substring(2, 6).toUpperCase()
            const certificateNumber = `CERT-${timestamp}-${random}`

            // Create certificate
            const certificate = await prisma.certificate.create({
                data: {
                    certificateNumber,
                    enrollmentId,
                    userId: enrollment.userId,
                    courseId: enrollment.courseId,
                    templateId: template.id
                },
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    course: { select: { id: true, name: true } }
                }
            })

            results.push(certificate)
        } catch (err: any) {
            errors.push({ enrollmentId, error: err.message || 'Failed to issue certificate' })
        }
    }

    return {
        success: results.length > 0,
        issued: results.length,
        failed: errors.length,
        certificates: results,
        errors
    }
})
