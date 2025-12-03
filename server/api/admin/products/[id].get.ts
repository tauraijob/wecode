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

  const productId = getRouterParam(event, 'id')
  if (!productId) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID required' })
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      _count: {
        select: {
          cartItems: true,
          orderItems: true
        }
      }
    }
  })

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  return product
})



