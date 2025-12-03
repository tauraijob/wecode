import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { Decimal } from '~~/server/utils/db'

const CreateOrderSchema = z.object({
  shippingAddress: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    postalCode: z.string().optional()
  }),
  billingAddress: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    postalCode: z.string().optional()
  }).optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional()
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
  const parsed = CreateOrderSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  // Get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId: auth.userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  if (!cart || cart.items.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Cart is empty' })
  }

  // Validate stock and calculate total
  let total = 0
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw createError({ statusCode: 400, statusMessage: `Insufficient stock for ${item.product.name}` })
    }
    total += Number(item.product.price) * item.quantity
  }

  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

  // Create order
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        userId: auth.userId,
        total: new Decimal(total),
        currency: cart.items[0].product.currency || 'USD',
        shippingAddress: parsed.data.shippingAddress as any,
        billingAddress: parsed.data.billingAddress as any,
        paymentMethod: parsed.data.paymentMethod || null,
        notes: parsed.data.notes || null,
        status: 'PENDING'
      }
    })

    // Create order items and update stock
    for (const item of cart.items) {
      await tx.orderItem.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        }
      })

      // Update product stock
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    // Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id }
    })

    return newOrder
  })

  // Return order with items
  const orderWithItems = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  return orderWithItems
})



