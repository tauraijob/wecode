import { prisma } from '~~/server/utils/prisma'
import { hashPassword } from '~~/server/utils/password'
import { z } from 'zod'
import { setCookie } from 'h3'
import { signJwt } from '~~/server/utils/jwt'

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['INDIVIDUAL', 'STUDENT', 'CORPORATE']).optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = RegisterSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input' })
  }
  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }
  const hashedPassword = await hashPassword(password)
  const user = await prisma.user.create({
    data: { name, email, hashedPassword }
  })
  const token = signJwt({ userId: user.id, role: user.role })
  setCookie(event, 'token', token, { httpOnly: true, path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 })
  return { id: user.id, email: user.email, name: user.name, role: user.role }
})

