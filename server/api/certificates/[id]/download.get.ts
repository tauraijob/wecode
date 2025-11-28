import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { generateCertificate } from '~~/server/utils/certificate'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Certificate ID required' })
  }

  const certificate = await prisma.certificate.findUnique({
    where: { id },
    include: {
      enrollment: {
        include: {
          user: true,
          course: true
        }
      }
    }
  })

  if (!certificate) {
    throw createError({ statusCode: 404, statusMessage: 'Certificate not found' })
  }

  // Only the certificate owner or admin can download
  if (certificate.userId !== auth.userId && auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  // If PDF exists, return it; otherwise generate it
  if (certificate.pdfUrl) {
    // In production, fetch from storage
    throw createError({ statusCode: 501, statusMessage: 'PDF storage not implemented' })
  }

  // Generate certificate
  const result = await generateCertificate(certificate.enrollment)
  const pdfBuffer = Buffer.from(result.pdfBytes, 'base64')

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="certificate-${certificate.certificateNumber}.pdf"`)

  return pdfBuffer
})

