import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'

const UpdateSchema = z.object({
    name: z.string().min(1).optional(),
    courseId: z.string().optional().nullable().or(z.literal('')),
    design: z.object({
        backgroundColor: z.string().optional().or(z.literal('')),
        textColor: z.string().optional().or(z.literal('')),
        titleFont: z.string().optional().or(z.literal('')),
        titleSize: z.number().optional(),
        bodyFont: z.string().optional().or(z.literal('')),
        bodySize: z.number().optional(),
        logoUrl: z.string().optional().or(z.literal('')),
        borderColor: z.string().optional().or(z.literal('')),
        borderWidth: z.number().optional()
    }).passthrough().optional(),
    variables: z.record(z.any()).optional()
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

    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Template ID required' })
    }

    // Check if template exists
    const existingTemplate = await prisma.certificateTemplate.findUnique({
        where: { id }
    })

    if (!existingTemplate) {
        throw createError({ statusCode: 404, statusMessage: 'Template not found' })
    }

    const body = await readBody(event)
    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
    }

    // Build update data
    const updateData: any = {}

    if (parsed.data.name !== undefined) {
        updateData.name = parsed.data.name
    }

    if (parsed.data.courseId !== undefined) {
        updateData.courseId = parsed.data.courseId || null
    }

    if (parsed.data.design !== undefined) {
        updateData.design = {
            ...(existingTemplate.design as any || {}),
            ...parsed.data.design
        }
    }

    if (parsed.data.variables !== undefined) {
        updateData.variables = {
            ...(existingTemplate.variables as any || {}),
            ...parsed.data.variables
        }
    }

    const template = await prisma.certificateTemplate.update({
        where: { id },
        data: updateData,
        include: {
            course: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    return template
})
