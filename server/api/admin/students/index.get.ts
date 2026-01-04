import prisma from '~~/server/utils/db'
import { getCurrentUser } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const user = await getCurrentUser(event)
    if (!user || user.role !== 'ADMIN') {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    // Fetch all students with their enrollment and certificate counts
    const students = await prisma.user.findMany({
        where: {
            role: 'STUDENT'
        },
        include: {
            _count: {
                select: {
                    enrollments: true,
                    certificates: true
                }
            },
            enrollments: {
                select: {
                    status: true,
                    progressPercent: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Calculate additional metrics for each student
    const studentsWithMetrics = students.map(student => {
        const activeEnrollments = student.enrollments.filter(e => e.status === 'ACTIVE').length
        const totalProgress = student.enrollments.reduce((sum, e) => sum + Number(e.progressPercent || 0), 0)
        const averageProgress = student.enrollments.length > 0
            ? Math.round(totalProgress / student.enrollments.length)
            : 0

        return {
            id: student.id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            emailVerified: student.emailVerified,
            createdAt: student.createdAt,
            _count: student._count,
            activeEnrollments,
            averageProgress
        }
    })

    return {
        students: studentsWithMetrics,
        total: studentsWithMetrics.length
    }
})
