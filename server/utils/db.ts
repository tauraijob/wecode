// Dynamic import to avoid build-time issues
let prisma: any = null

declare const globalThis: { prismaGlobal?: any } & typeof global

// Only initialize Prisma if DATABASE_URL is available
if (process.env.DATABASE_URL) {
  try {
    const { PrismaClient } = require('@prisma/client')
    
    if (process.env.NODE_ENV === 'production') {
      prisma = new PrismaClient()
    } else {
      if (!globalThis.prismaGlobal) {
        globalThis.prismaGlobal = new PrismaClient()
      }
      prisma = globalThis.prismaGlobal
    }
  } catch (error) {
    console.warn('Prisma client not available:', error)
  }
}

export default prisma


