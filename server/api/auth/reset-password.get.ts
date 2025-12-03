import prismaModule from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const prisma = await prismaModule
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const query = getQuery(event)
  const token = query.token as string

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Reset token is required' })
  }

  // Find the magic link
  const magicLink = await prisma.magicLink.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true
        }
      }
    }
  })

  if (!magicLink) {
    throw createError({ statusCode: 404, statusMessage: 'Invalid or expired reset token' })
  }

  // Check if token is expired
  if (magicLink.expiresAt < new Date()) {
    throw createError({ statusCode: 400, statusMessage: 'Reset token has expired' })
  }

  // Check if token has been used
  if (magicLink.usedAt) {
    throw createError({ statusCode: 400, statusMessage: 'Reset token has already been used' })
  }

  // Token is valid
  return {
    valid: true,
    email: magicLink.user.email,
    name: magicLink.user.name
  }
})

