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

  let cart = await prisma.cart.findUnique({
    where: { userId: auth.userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: auth.userId
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })
  }

  return cart
})



