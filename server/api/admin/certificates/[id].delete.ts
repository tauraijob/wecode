import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

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
        throw createError({ statusCode: 400, statusMessage: 'Certificate ID required' })
    }

    // Check if certificate exists
    const certificate = await prisma.certificate.findUnique({
        where: { id }
    })

    if (!certificate) {
        throw createError({ statusCode: 404, statusMessage: 'Certificate not found' })
    }

    // Delete the certificate
    await prisma.certificate.delete({
        where: { id }
    })

    return { success: true, message: 'Certificate deleted successfully' }
})
