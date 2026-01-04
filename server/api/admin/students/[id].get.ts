import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, message: 'Student ID required' })
    }

    const user = await getCurrentUser(event)
    if (!user || user.role !== 'ADMIN') {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    // Fetch student with full details
    const student = await prisma.user.findUnique({
        where: { id },
        include: {
            enrollments: {
                include: {
                    course: {
                        select: {
                            id: true,
                            name: true,
                            thumbnailUrl: true
                        }
                    }
                },
                orderBy: {
                    enrolledAt: 'desc'
                }
            },
            certificates: {
                include: {
                    course: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    issuedAt: 'desc'
                }
            },
            _count: {
                select: {
                    enrollments: true,
                    certificates: true,
                    invoices: true
                }
            }
        }
    })

    if (!student) {
        throw createError({ statusCode: 404, message: 'Student not found' })
    }

    if (student.role !== 'STUDENT') {
        throw createError({ statusCode: 400, message: 'User is not a student' })
    }

    return student
})
