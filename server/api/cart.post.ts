import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'

const AddToCartSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().int().positive().default(1)
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

  const body = await readBody(event)
  const parsed = AddToCartSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({
    where: { userId: auth.userId }
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: auth.userId
      }
    })
  }

  // Check if product exists and is available
  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId }
  })

  if (!product || product.status !== 'PUBLISHED') {
    throw createError({ statusCode: 404, statusMessage: 'Product not found or not available' })
  }

  if (product.stock < parsed.data.quantity) {
    throw createError({ statusCode: 400, statusMessage: 'Insufficient stock' })
  }

  // Check if item already in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId: parsed.data.productId
    }
  })

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + parsed.data.quantity
    if (product.stock < newQuantity) {
      throw createError({ statusCode: 400, statusMessage: 'Insufficient stock' })
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity }
    })
  } else {
    // Create new cart item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: parsed.data.productId,
        quantity: parsed.data.quantity
      }
    })
  }

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



