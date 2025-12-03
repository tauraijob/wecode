import prisma from '~~/server/utils/db'
import { verifyJwt } from '~~/server/utils/jwt'
import { z } from 'zod'
import { Decimal } from '~~/server/utils/db'

const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  price: z.coerce.number().nonnegative(),
  currency: z.string().default('USD'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'OUT_OF_STOCK']).optional(),
  stock: z.coerce.number().int().nonnegative().default(0),
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
  featured: z.boolean().optional().default(false),
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

  const body = await readBody(event)
  const parsed = ProductSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid input', data: parsed.error })
  }

  const { images, weight, ...data } = parsed.data

  // Check if slug already exists
  const existing = await prisma.product.findUnique({
    where: { slug: data.slug }
  })

  if (existing) {
    throw createError({ statusCode: 400, statusMessage: 'Product with this slug already exists' })
  }

  // Check if SKU already exists (if provided)
  if (data.sku) {
    const existingSku = await prisma.product.findUnique({
      where: { sku: data.sku }
    })
    if (existingSku) {
      throw createError({ statusCode: 400, statusMessage: 'Product with this SKU already exists' })
    }
  }

  const product = await prisma.product.create({
    data: {
      ...data,
      price: new Decimal(data.price),
      weight: weight ? new Decimal(weight) : null,
      images: images ? images as any : null,
      status: data.status || 'DRAFT'
    }
  })

  return product
})

