import prisma from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({ statusCode: 503, statusMessage: 'Database not available' })
  }

  const query = getQuery(event)
  const category = query.category as string | undefined
  const featured = query.featured === 'true'
  const search = query.search as string | undefined

  const where: any = {
    status: 'PUBLISHED'
  }

  if (category) {
    where.category = category
  }

  if (featured) {
    where.featured = true
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } }
    ]
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' }
    ]
  })

  return products
})



