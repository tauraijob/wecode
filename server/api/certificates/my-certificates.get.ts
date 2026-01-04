import { defineEventHandler } from 'h3'
import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    const auth = token ? verifyJwt(token) : null

    if (!auth) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    try {
        // Get all certificates for the current user
        const certificates = await prisma.issuedCertificate.findMany({
            where: {
                enrollment: {
                    userId: auth.userId
                }
            },
            include: {
                enrollment: {
                    include: {
                        course: {
                            include: {
                                instructor: {
                                    select: {
                                        name: true,
                                        email: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                issuedAt: 'desc'
            }
        })

        return certificates
    } catch (error: any) {
        console.error('Error fetching certificates:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch certificates'
        })
    }
})
