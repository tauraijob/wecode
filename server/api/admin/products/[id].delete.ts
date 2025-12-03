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

  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      _count: {
        select: {
          orderItems: true
        }
      }
    }
  })

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  // Don't allow deletion if product has orders
  if (product._count.orderItems > 0) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot delete product with existing orders. Archive it instead.' })
  }

  await prisma.product.delete({
    where: { id: productId }
  })

  return { ok: true }
})



