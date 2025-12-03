import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth || auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  const query = getQuery(event)
  const status = query.status as string | undefined
  const search = query.search as string | undefined

  const where: any = {}
  if (status) {
    where.status = status
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { sku: { contains: search } }
    ]
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          cartItems: true,
          orderItems: true
        }
      }
    }
  })

  return products
})



