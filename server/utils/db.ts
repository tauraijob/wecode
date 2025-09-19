import { PrismaClient } from '@prisma/client'

// Ensure a single PrismaClient instance across HMR in dev
// eslint-disable-next-line import/no-mutable-exports
let prisma: PrismaClient

declare const globalThis: { prismaGlobal?: PrismaClient } & typeof global

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = new PrismaClient()
  }
  prisma = globalThis.prismaGlobal
}

export default prisma


