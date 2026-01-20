import { z } from 'zod'
import prisma from '~~/server/utils/db'
import { sendMail } from '~~/server/utils/mailer'

const Schema = z.object({ email: z.string().email(), userId: z.string().optional() })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = Schema.safeParse(body)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  const { email } = parsed.data

  const user = await prisma.user.findFirst({ where: { email } })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

  const token = crypto.randomUUID().replace(/-/g, '')
  const expires = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes
  await prisma.magicLink.create({ data: { token, userId: user.id, expiresAt: expires } })

  // Determine if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Get site URL with production fallback
  let siteUrl = process.env.SITE_URL || (isDevelopment ? 'http://localhost:3000' : 'https://wecode.co.zw')

  // CRITICAL: In production, NEVER allow localhost URLs
  if (!isDevelopment && siteUrl.includes('localhost')) {
    siteUrl = 'https://wecode.co.zw'
  }

  const link = `${siteUrl}/api/auth/magic-link/verify?token=${token}`

  const { getMagicLinkTemplate } = await import('~~/server/utils/email-templates')
  const { html, text } = getMagicLinkTemplate(user.name || 'User', link)

  await sendMail({
    to: email,
    subject: 'Your secure sign-in link — WeCodeZW',
    html,
    text
  })

  return { ok: true }
})


