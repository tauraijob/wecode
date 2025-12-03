import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }

  const itemId = getRouterParam(event, 'id')
  if (!itemId) {
    throw createError({ statusCode: 400, statusMessage: 'Item ID required' })
  }

  // Get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId: auth.userId }
  })

  if (!cart) {
    throw createError({ statusCode: 404, statusMessage: 'Cart not found' })
  }

  // Verify item belongs to user's cart
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId }
  })

  if (!item || item.cartId !== cart.id) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' })
  }

  await prisma.cartItem.delete({
    where: { id: itemId }
  })

  return { ok: true }
})



