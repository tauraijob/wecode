/**
 * Utility composable for handling video URLs from various platforms
 * Supports YouTube, Vimeo, and direct video URLs
 */

export interface VideoInfo {
  type: 'youtube' | 'vimeo' | 'direct' | 'unknown'
  embedUrl: string | null
  originalUrl: string
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

/**
 * Extract Vimeo video ID from Vimeo URL
 */
function extractVimeoId(url: string): string | null {
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

/**
 * Parse video URL and return video information
 */
export function parseVideoUrl(url: string): VideoInfo {
  if (!url) {
    return { type: 'unknown', embedUrl: null, originalUrl: url }
  }

  const trimmedUrl = url.trim()

  // Check for YouTube
  const youtubeId = extractYouTubeId(trimmedUrl)
  if (youtubeId) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      originalUrl: trimmedUrl
    }
  }

  // Check for Vimeo
  const vimeoId = extractVimeoId(trimmedUrl)
  if (vimeoId) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      originalUrl: trimmedUrl
    }
  }

  // Check if it's a direct video URL (ends with video extensions)
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.m3u8']
  const isDirectVideo = videoExtensions.some(ext => trimmedUrl.toLowerCase().includes(ext))
  
  if (isDirectVideo || trimmedUrl.startsWith('http') && !trimmedUrl.includes('youtube') && !trimmedUrl.includes('vimeo')) {
    return {
      type: 'direct',
      embedUrl: trimmedUrl,
      originalUrl: trimmedUrl
    }
  }

  return {
    type: 'unknown',
    embedUrl: null,
    originalUrl: trimmedUrl
  }
}

/**
 * Get video platform name for display
 */
export function getVideoPlatformName(type: VideoInfo['type']): string {
  switch (type) {
    case 'youtube':
      return 'YouTube'
    case 'vimeo':
      return 'Vimeo'
    case 'direct':
      return 'Direct Video'
    default:
      return 'Unknown'
  }
}







