import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'

const UpdateCartItemSchema = z.object({
  quantity: z.coerce.number().int().positive()
})

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

  const body = await readBody(event)
  const parsed = UpdateCartItemSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
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
    where: { id: itemId },
    include: { product: true }
  })

  if (!item || item.cartId !== cart.id) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' })
  }

  // Check stock
  if (item.product.stock < parsed.data.quantity) {
    throw createError({ statusCode: 400, statusMessage: 'Insufficient stock' })
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: parsed.data.quantity }
  })

  // Return updated cart
  const updatedCart = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  return updatedCart
})



