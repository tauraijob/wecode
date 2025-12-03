import prisma from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Product slug required' })
  }

  const product = await prisma.product.findUnique({
    where: { slug }
  })

  if (!product || product.status !== 'PUBLISHED') {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  return product
})



