/**
 * Storage utility for uploading files to local server storage
 * Files are stored in public/uploads/ directory for direct HTTP access
 */

/**
 * Upload a file buffer to storage (defaults to local server storage)
 * Returns the public URL of the uploaded file
 */
export async function uploadFile(
  buffer: Buffer,
  filename: string,
  folder: string = 'certificates'
): Promise<string> {
  // Always use local server storage (no cloud services)
  return uploadToLocal(buffer, filename, folder)
}

/**
 * Upload to local server filesystem
 * Files are stored in public/uploads directory for direct HTTP access
 */
async function uploadToLocal(
  buffer: Buffer,
  filename: string,
  folder: string
): Promise<string> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    // Store in public/uploads directory for direct HTTP access
    const uploadDir = 'public/uploads'
    const fullPath = path.join(process.cwd(), uploadDir, folder)
    
    // Ensure directory exists
    await fs.mkdir(fullPath, { recursive: true })
    
    // Write file
    const filePath = path.join(fullPath, filename)
    await fs.writeFile(filePath, buffer)
    
    // Return public URL (relative path - Nuxt will serve from public/)
    // This works for both development and production
    return `/uploads/${folder}/${filename}`
  } catch (error) {
    console.error('Local upload error:', error)
    throw new Error('Failed to upload file to server storage')
  }
}

/**
 * Delete a file from local server storage
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    // Extract path from URL (handles both absolute and relative URLs)
    let relativePath = url
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Extract path from full URL
      const urlObj = new URL(url)
      relativePath = urlObj.pathname
    }
    
    // Remove leading slash if present
    if (relativePath.startsWith('/')) {
      relativePath = relativePath.substring(1)
    }
    
    // Ensure it's in the uploads directory for security
    if (!relativePath.startsWith('uploads/')) {
      throw new Error('Invalid file path - must be in uploads directory')
    }
    
    const filePath = path.join(process.cwd(), 'public', relativePath)
    await fs.unlink(filePath)
    console.log('File deleted:', filePath)
  } catch (error) {
    console.error('Failed to delete file:', error)
    // Don't throw - file might not exist
  }
}

