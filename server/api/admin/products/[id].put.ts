import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { Decimal } from '~~/server/utils/db'

const ProductUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  price: z.coerce.number().nonnegative().optional(),
  currency: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'OUT_OF_STOCK']).optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  sku: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  images: z.array(z.string().refine(
    (val) => {
      // Accept full URLs or relative paths starting with /
      return val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/')
    },
    { message: 'Image must be a valid URL or relative path starting with /' }
  )).optional().nullable(),
  featured: z.boolean().optional(),
  weight: z.coerce.number().nonnegative().optional().nullable(),
  dimensions: z.string().optional().nullable()
})

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

  const body = await readBody(event)
  const parsed = ProductUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const { images, weight, price, ...data } = parsed.data

  // Check if product exists
  const existing = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  // Check if slug already exists (if changing)
  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await prisma.product.findUnique({
      where: { slug: data.slug }
    })
    if (slugExists) {
      throw createError({ statusCode: 400, statusMessage: 'Product with this slug already exists' })
    }
  }

  // Check if SKU already exists (if changing)
  if (data.sku && data.sku !== existing.sku) {
    const skuExists = await prisma.product.findUnique({
      where: { sku: data.sku }
    })
    if (skuExists) {
      throw createError({ statusCode: 400, statusMessage: 'Product with this SKU already exists' })
    }
  }

  const updateData: any = { ...data }
  if (price !== undefined) {
    updateData.price = new Decimal(price)
  }
  if (weight !== undefined) {
    updateData.weight = weight ? new Decimal(weight) : null
  }
  if (images !== undefined) {
    updateData.images = images ? images as any : null
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: updateData
  })

  return product
})

