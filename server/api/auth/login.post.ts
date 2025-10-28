import prisma from '~~/server/utils/db'
import { verifyPassword } from '~~/server/utils/password'
import { z } from 'zod'
import { setCookie } from 'h3'
import { signJwt } from '~~/server/utils/jwt'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }
  
  const body = await readBody(event)
  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }
  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  const ok = await verifyPassword(password, user.hashedPassword)
  if (!ok) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  const token = signJwt({ userId: user.id, role: user.role })
  setCookie(event, 'token', token, { httpOnly: true, path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 })
  return { id: user.id, email: user.email, name: user.name, role: user.role }
})

