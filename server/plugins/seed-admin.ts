// Seed plugin - fully deferred to avoid renderer initialization issues
export default defineNitroPlugin(async (nitroApp) => {
  // Defer execution until after renderer is fully initialized
  if (typeof setImmediate !== 'undefined') {
    setImmediate(async () => {
      // Additional delay to ensure everything is ready
      await new Promise(resolve => setTimeout(resolve, 3000))
      await seedDatabase()
    })
  } else {
    // Fallback for environments without setImmediate
    setTimeout(async () => {
      await seedDatabase()
    }, 3000)
  }
})

async function seedDatabase() {
  try {
    const { hashPassword } = await import('~~/server/utils/password')
    const dbModule = await import('~~/server/utils/db')
    const prisma = dbModule.default

    // Wait for Prisma to initialize
    const prismaInstance = await prisma
    if (!prismaInstance || !prismaInstance.user) {
      console.log('[seed] Skipping seed - no database connection')
      return
    }

    const demoUsers = [
      { email: 'admin@wecodezw.com', name: 'WeCodeZW Admin', role: 'ADMIN', password: 'Admin@12345' },
      { email: 'user@wecodezw.com', name: 'WeCodeZW Individual', role: 'INDIVIDUAL', password: 'User@12345' },
      { email: 'student@wecodezw.com', name: 'WeCodeZW Student', role: 'STUDENT', password: 'Student@12345' },
      { email: 'corporate@wecodezw.com', name: 'WeCodeZW Corporate', role: 'CORPORATE', password: 'Corporate@12345' }
    ] as const

    for (const u of demoUsers) {
      const hashedPassword = await hashPassword(u.password)
      await prismaInstance.user.upsert({
        where: { email: u.email },
        update: { name: u.name, role: u.role as any, hashedPassword },
        create: { email: u.email, name: u.name, role: u.role as any, hashedPassword }
      })
      console.log('[seed] User ensured:', u.email)
    }
  } catch (err) {
    console.error('[seed] Failed to ensure admin user', err)
  }
}