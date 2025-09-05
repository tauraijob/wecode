import { hashPassword } from '~~/server/utils/password'
import { prisma } from '~~/server/utils/prisma'

export default defineNitroPlugin(async () => {
  try {
    const demoUsers = [
      { email: 'admin@wecodezw.com', name: 'WeCodeZW Admin', role: 'ADMIN', password: 'Admin@12345' },
      { email: 'user@wecodezw.com', name: 'WeCodeZW Individual', role: 'INDIVIDUAL', password: 'User@12345' },
      { email: 'student@wecodezw.com', name: 'WeCodeZW Student', role: 'STUDENT', password: 'Student@12345' },
      { email: 'corporate@wecodezw.com', name: 'WeCodeZW Corporate', role: 'CORPORATE', password: 'Corporate@12345' }
    ] as const

    for (const u of demoUsers) {
      const hashedPassword = await hashPassword(u.password)
      await prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name, role: u.role as any, hashedPassword },
        create: { email: u.email, name: u.name, role: u.role as any, hashedPassword }
      })
      console.log('[seed] User ensured:', u.email)
    }
  } catch (err) {
    console.error('[seed] Failed to ensure admin user', err)
  }
})