/**
 * Logo composable
 * Detects and provides logo URL for use across layouts
 */

export function useLogo() {
  // Set logo URL - prioritize logo.png since it exists
  const logoUrl = ref<string | null>('/logo/logo.png')

  // Verify logo exists on client side and handle errors gracefully
  if (process.client) {
    onMounted(() => {
      const img = new Image()
      img.onload = () => {
        // Logo exists and loaded successfully
      }
      img.onerror = () => {
        // Logo.png doesn't exist, try other formats
        const logoFormats = ['logo.svg', 'logo.webp', 'logo.jpg']
        const logoPath = '/logo/'
        let found = false
        
        for (const format of logoFormats) {
          if (found) break
          const testImg = new Image()
          testImg.onload = () => {
            if (!found) {
              logoUrl.value = `${logoPath}${format}`
              found = true
            }
          }
          testImg.src = `${logoPath}${format}`
        }
        
        // If no logo found after checking all formats, set to null
        if (!found) {
          setTimeout(() => {
            logoUrl.value = null
          }, 1000)
        }
      }
      img.src = '/logo/logo.png'
    })
  }

  return {
    logoUrl: readonly(logoUrl)
  }
}

