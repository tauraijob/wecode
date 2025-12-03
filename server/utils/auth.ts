import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'
import prisma from '~~/server/utils/db'

const JWT_SECRET = process.env.JWT_SECRET || 'change-me'

export function signSession(payload: object, expiresIn: string = '7d') {
  return jwt.sign(payload as any, JWT_SECRET, { expiresIn })
}

export function verifySession<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T
  } catch {
    return null
  }
}

export function setSessionCookie(event: H3Event, token: string) {
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })
}

export async function getCurrentUser(event: H3Event) {
  // Try both cookie names for compatibility
  const token = getCookie(event, 'token') || getCookie(event, 'auth_token')
  if (!token) return null
  
  // Try to verify with JWT first (most common - used by login)
  try {
    const { verifyJwt } = await import('~~/server/utils/jwt')
    const payload = verifyJwt(token)
    if (payload?.userId) {
      return prisma.user.findUnique({ where: { id: payload.userId } })
    }
  } catch {
    // Continue to fallback
  }
  
  // Fall back to session token verification (for older auth_token cookies)
  const payload = verifySession<{ uid: string }>(token)
  if (payload?.uid) {
    return prisma.user.findUnique({ where: { id: payload.uid } })
  }
  
  return null
}


