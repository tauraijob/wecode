// Prisma client for Nitro - fully lazy, no top-level execution
let PrismaClientClass: any = null
let prismaInstance: any = null
let initPromise: Promise<any> | null = null
let DecimalClass: any = null

declare const globalThis: { prismaGlobal?: any } & typeof global

// Initialize Decimal when PrismaClient is loaded
// Use dynamic import to avoid Nitro static analysis
async function loadDecimal() {
  if (DecimalClass) return DecimalClass
  
  try {
    // Try dynamic import first
    try {
      const prismaModule: any = await import('@prisma/client')
      if (prismaModule.Decimal) {
        DecimalClass = prismaModule.Decimal
      } else if (prismaModule.Prisma?.Decimal) {
        DecimalClass = prismaModule.Prisma.Decimal
      }
    } catch {
      // Fallback to createRequire
      const { createRequire } = await import('module')
      const requireModule = createRequire(import.meta.url)
      const prismaModule = requireModule('@prisma/client')
      
      if (prismaModule.Decimal) {
        DecimalClass = prismaModule.Decimal
      } else if (prismaModule.Prisma?.Decimal) {
        DecimalClass = prismaModule.Prisma.Decimal
      } else {
        // Try using dynamic path construction to avoid static analysis
        const runtimePath = '@prisma/client/' + 'runtime/' + 'library'
        try {
          const runtime = requireModule(runtimePath)
          DecimalClass = runtime.Decimal
        } catch {
          // Decimal might not be available yet, will retry later
        }
      }
    }
  } catch (err) {
    // Silently fail - will retry when needed
  }
  
  return DecimalClass
}

// Export Decimal - fully lazy, no initialization at module load
export const Decimal = new Proxy(function Decimal(...args: any[]) {
  if (!DecimalClass) {
    throw new Error('Prisma Decimal not loaded yet - ensure PrismaClient is initialized first')
  }
  // @ts-ignore
  return new DecimalClass(...args)
} as any, {
  get(_target, prop) {
    if (!DecimalClass) {
      return undefined
    }
    if (prop in DecimalClass) {
      return DecimalClass[prop]
    }
    return undefined
  }
})

async function initializePrisma() {
  if (prismaInstance) return prismaInstance
  if (initPromise) return initPromise

  if (!process?.env?.DATABASE_URL) {
    return null
  }

  initPromise = (async () => {
    try {
      // Use dynamic import for ES modules - this preserves Prisma's internal structure
      if (!PrismaClientClass) {
        // Use fully dynamic import path to prevent Nitro static analysis
        const prismaPath = '@prisma' + '/client'
        try {
          const prismaModule = await import(prismaPath)
          // Try different ways to get PrismaClient
          PrismaClientClass = prismaModule.PrismaClient 
            || prismaModule.default?.PrismaClient 
            || prismaModule.default
            || (prismaModule.default && typeof prismaModule.default === 'function' ? prismaModule.default : null)
        } catch (importErr) {
          console.error('[db] Dynamic import failed, trying require:', importErr)
          // Fallback to createRequire if dynamic import fails
          const { createRequire } = await import('module')
          const requireModule = createRequire(import.meta.url)
          const prismaModule = requireModule(prismaPath)
          PrismaClientClass = prismaModule.PrismaClient 
            || prismaModule.default?.PrismaClient 
            || prismaModule.default
        }
        
        if (!PrismaClientClass || typeof PrismaClientClass !== 'function') {
          console.error('[db] PrismaClient not found or invalid in @prisma/client module')
          return null
        }
        
        // Try to load Decimal now that we have PrismaClient
        await loadDecimal()
      }

      // Prisma reads DATABASE_URL from environment automatically
      // Ensure we're calling it as a constructor with proper context
      let instance: any
      try {
        // Use Function constructor to preserve 'this' context
        const PrismaConstructor = PrismaClientClass
        if (process.env.NODE_ENV === 'production') {
          instance = new PrismaConstructor()
        } else {
          if (!globalThis.prismaGlobal) {
            globalThis.prismaGlobal = new PrismaConstructor()
          }
          instance = globalThis.prismaGlobal
        }
        
        // Verify the instance is valid by checking for a known property
        if (!instance || typeof instance !== 'object') {
          throw new Error('PrismaClient instance is invalid')
        }
        
        // Test that the instance works by checking for a model
        // PrismaClient models should be available immediately
        // If not, there might be an issue with the import or generation
        if (!instance.user) {
          // Log available properties for debugging
          console.error('[db] PrismaClient instance properties:', Object.keys(instance))
          console.error('[db] PrismaClient constructor:', PrismaClientClass?.name)
          throw new Error('PrismaClient instance missing models - Prisma client may not be generated correctly')
        }
        
        prismaInstance = instance
      } catch (constructErr) {
        console.error('[db] Failed to construct PrismaClient:', constructErr)
        if (constructErr instanceof Error) {
          console.error('[db] Constructor error:', constructErr.message)
          console.error('[db] Stack:', constructErr.stack)
        }
        return null
      }

      // Ensure Decimal is loaded
      if (!DecimalClass) {
        await loadDecimal()
      }

      return prismaInstance
    } catch (err) {
      console.error('[db] Failed to initialize Prisma:', err)
      if (err instanceof Error) {
        console.error('[db] Error details:', err.message, err.stack)
      }
      return null
    }
  })()

  return initPromise
}

// NO top-level initialization - everything is lazy

// Proxy that works synchronously once initialized, async until then
export default new Proxy({} as any, {
  get(_target, prop) {
    if (prop === 'then' || prop === Symbol.toPrimitive) {
      return undefined
    }
    
    // If already initialized, return immediately (synchronous)
    if (prismaInstance) {
      return prismaInstance[prop as string]
    }
    
    // Otherwise, return async proxy that waits for initialization
    return new Proxy(() => {}, {
      get(__target, modelProp) {
        return async (...args: any[]) => {
          const prisma = await (initPromise || initializePrisma())
          if (!prisma) {
            throw new Error('Database not available')
          }
          const model = prisma[prop as string]
          if (model && typeof model[modelProp] === 'function') {
            return model[modelProp](...args)
          }
          return model?.[modelProp]
        }
      },
      apply(__target, __thisArg, args) {
        return (async () => {
          const prisma = await (initPromise || initializePrisma())
          if (!prisma) {
            throw new Error('Database not available')
          }
          const fn = prisma[prop as string]
          if (typeof fn === 'function') {
            return fn.apply(prisma, args)
          }
          return fn
        })()
      }
    })
  }
})
