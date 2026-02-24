<template>
  <NuxtLink
    :to="`/community/post/${post.id}`"
    class="block group"
  >
    <div class="relative overflow-hidden rounded-xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300">
      <!-- Gradient accent bar -->
      <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div class="p-4">
        <!-- Author row -->
        <div class="flex items-center gap-2 mb-2.5">
          <div class="relative">
            <!-- Avatar with image or initials -->
            <div 
              v-if="post.author?.communityProfile?.avatarUrl"
              class="w-8 h-8 rounded-full overflow-hidden shadow-sm"
            >
              <img :src="post.author.communityProfile.avatarUrl" class="w-full h-full object-cover" alt="Avatar" />
            </div>
            <div 
              v-else
              class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-sm"
            >
              {{ getInitials(post.author?.name || 'U') }}
            </div>
            <div
              v-if="post.author?.role === 'MENTOR'"
              class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center border-2 border-white shadow-sm"
            >
              <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-medium text-slate-800">{{ post.author?.name || 'Anonymous' }}</span>
              <span
                v-if="post.author?.role === 'MENTOR'"
                class="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-[9px] font-semibold uppercase tracking-wide"
              >
                Mentor
              </span>
            </div>
            <span class="text-[10px] text-slate-400">{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>

        <!-- Title -->
        <h3 class="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors mb-1.5 line-clamp-2 leading-snug">
          {{ post.title }}
        </h3>
        
        <!-- Content preview -->
        <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {{ truncateContent(post.content) }}
        </p>

        <!-- Footer stats -->
        <div class="flex items-center justify-between pt-2.5 border-t border-slate-100">
          <div class="flex items-center gap-3">
            <!-- Likes -->
            <div class="flex items-center gap-1 text-slate-400">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span class="text-[10px] font-medium">{{ post.likes || 0 }}</span>
            </div>
            <!-- Comments -->
            <div class="flex items-center gap-1 text-slate-400 group-hover:text-primary-500 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span class="text-[10px] font-medium">{{ post.commentCount || post._count?.comments || 0 }}</span>
            </div>
            <!-- Views -->
            <div class="flex items-center gap-1 text-slate-400">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span class="text-[10px] font-medium">{{ post.viewCount || 0 }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Share Icon -->
            <button 
              @click.stop.prevent="sharePost"
              class="p-1.5 rounded-full text-slate-400 hover:text-primary-500 hover:bg-primary-50 transition-all"
              title="Copy link"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            
            <!-- Read more indicator -->
            <div class="flex items-center gap-1 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-[10px] font-medium">Read</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  viewCount?: number
  likes?: number
  dislikes?: number
  author?: {
    id: string
    name: string
    role?: string
    communityProfile?: {
      avatarUrl?: string
    }
  }
  commentCount?: number
  _count?: {
    comments: number
  }
}

defineProps<{
  post: Post
}>()

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const truncateContent = (content: string, length = 100) => {
  if (content.length <= length) return content
  return content.substring(0, length).trim() + '...'
}

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const { success: toastSuccess, error: toastError } = useToast()

const sharePost = () => {
  if (process.client) {
    const url = `${window.location.origin}/community/post/${props.post.id}`
    navigator.clipboard.writeText(url)
      .then(() => toastSuccess('Link copied!'))
      .catch(() => toastError('Failed to copy'))
  }
}
</script>
