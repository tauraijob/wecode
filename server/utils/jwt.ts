import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

export interface JwtPayload {
  userId: string
  role: string
}

export function signJwt(payload: JwtPayload, expiresIn: string = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

