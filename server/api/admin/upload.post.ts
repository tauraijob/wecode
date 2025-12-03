import { verifyJwt } from '~~/server/utils/jwt'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  const auth = token ? verifyJwt(token) : null
  if (!auth || auth.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const file = formData.find(item => item.name === 'image' && item.filename)
  if (!file || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'No image file provided' })
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!file.type || !allowedTypes.includes(file.type)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' })
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.data.length > maxSize) {
    throw createError({ statusCode: 400, statusMessage: 'File size exceeds 5MB limit' })
  }

  // Generate unique filename
  const ext = file.filename.split('.').pop() || 'jpg'
  const filename = `${randomBytes(16).toString('hex')}.${ext}`
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), 'public', 'uploads')
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true })
  }

  // Save file
  const filePath = join(uploadsDir, filename)
  await writeFile(filePath, file.data)

  // Return public URL
  const publicUrl = `/uploads/${filename}`
  
  return {
    url: publicUrl,
    filename: filename
  }
})



