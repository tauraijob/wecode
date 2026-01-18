<template>
  <div class="min-h-screen bg-slate-50">
    <section class="mx-auto max-w-3xl px-3 py-5">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <NuxtLink to="/community" class="hover:text-primary-600 transition-colors">Community</NuxtLink>
        <span>/</span>
        <span class="text-slate-900 truncate max-w-xs">{{ post?.title || 'Loading...' }}</span>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="animate-pulse">
        <div class="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div class="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
        <div class="space-y-2">
          <div class="h-3 bg-slate-100 rounded w-full"></div>
          <div class="h-3 bg-slate-100 rounded w-5/6"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="fetchError" class="p-8 rounded-lg bg-white border border-slate-200 text-center">
        <h3 class="text-sm font-semibold text-slate-900 mb-1">Post not found</h3>
        <NuxtLink to="/community" class="text-primary-600 hover:underline text-xs">Back to Community</NuxtLink>
      </div>

      <!-- Post Content -->
      <div v-else-if="post">
        <article class="mb-5">
          <h1 class="text-lg font-bold text-slate-900 mb-3">{{ post.title }}</h1>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-medium">
              {{ getInitials(post.author?.name || 'U') }}
            </div>
            <div>
              <span class="text-xs font-medium text-slate-900">{{ post.author?.name }}</span>
              <span class="text-[10px] text-slate-500 ml-2">{{ formatDate(post.createdAt) }}</span>
            </div>
          </div>
          <div class="p-4 rounded-lg bg-white border border-slate-200 shadow-sm">
            <ForumContent :content="post.content" />
          </div>
        </article>

        <!-- AI Chat Section -->
        <div class="mb-5">
          <div class="rounded-lg overflow-hidden border border-primary-200 shadow-sm bg-white">
            <!-- AI Header -->
            <div class="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span class="text-xs font-semibold text-white">AI Assistant</span>
                <span class="text-[9px] text-white/70 bg-white/10 px-1.5 py-0.5 rounded">Powered by Groq</span>
              </div>
              <button
                v-if="chatMessages.length === 0 && !loadingAI"
                @click="startAIChat"
                class="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-[10px] font-medium transition-colors flex items-center gap-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Ask AI for Help
              </button>
              <button
                v-if="chatMessages.length > 0"
                @click="resetChat"
                class="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[10px] transition-colors"
              >
                Reset
              </button>
            </div>
            
            <!-- Chat Messages Area -->
            <div class="max-h-96 overflow-y-auto">
              <!-- Initial State -->
              <div v-if="chatMessages.length === 0 && !loadingAI" class="p-6 text-center">
                <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-50 flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p class="text-slate-500 text-xs">Click "Ask AI for Help" to start a conversation with the AI assistant.</p>
              </div>

              <!-- Chat Messages -->
              <div v-else class="p-4 space-y-3">
                <div v-for="(msg, index) in chatMessages" :key="index" class="flex gap-2" :class="msg.role === 'user' ? 'flex-row-reverse' : ''">
                  <!-- Avatar -->
                  <div 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium flex-shrink-0"
                    :class="msg.role === 'user' ? 'bg-slate-600 text-white' : 'bg-gradient-to-br from-primary-400 to-primary-600 text-white'"
                  >
                    {{ msg.role === 'user' ? getInitials(user?.name || 'You') : 'AI' }}
                  </div>
                  <!-- Message Bubble -->
                  <div 
                    class="max-w-[85%] rounded-lg p-3"
                    :class="msg.role === 'user' ? 'bg-slate-100 text-slate-800' : 'bg-primary-50 border border-primary-100'"
                  >
                    <ForumContent :content="msg.content" />
                  </div>
                </div>

                <!-- Loading indicator -->
                <div v-if="loadingAI" class="flex gap-2">
                  <div class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[9px] font-medium flex-shrink-0">AI</div>
                  <div class="bg-primary-50 border border-primary-100 rounded-lg p-3">
                    <div class="flex items-center gap-2">
                      <div class="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      <span class="text-xs text-slate-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Input -->
            <div v-if="chatMessages.length > 0" class="p-3 border-t border-slate-100 bg-slate-50">
              <form @submit.prevent="sendMessage" class="flex gap-2">
                <input
                  v-model="userMessage"
                  type="text"
                  placeholder="Ask a follow-up question..."
                  class="flex-1 px-3 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none"
                  :disabled="loadingAI"
                />
                <button
                  type="submit"
                  :disabled="loadingAI || !userMessage.trim()"
                  class="px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </button>
              </form>
            </div>

            <!-- Error Display -->
            <div v-if="aiError" class="px-4 py-2 bg-red-50 border-t border-red-100">
              <p class="text-red-600 text-xs">{{ aiError }}</p>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div>
          <h2 class="text-sm font-semibold text-slate-900 mb-3">{{ post.comments?.length || 0 }} Comments</h2>
          <div v-if="isAuthenticated" class="mb-4">
            <form @submit.prevent="addComment" class="flex gap-2">
              <div class="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-[10px] font-medium flex-shrink-0">
                {{ getInitials(user?.name || 'U') }}
              </div>
              <div class="flex-1">
                <textarea v-model="newComment" rows="2" placeholder="Add a comment..." required class="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-primary-500 outline-none resize-none text-xs"></textarea>
                <div class="mt-1.5 flex justify-end">
                  <button type="submit" :disabled="commenting || !newComment.trim()" class="px-4 py-1.5 rounded-md bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-xs font-medium">
                    {{ commenting ? 'Posting...' : 'Post' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div v-else class="mb-4 p-3 rounded-lg bg-white border border-slate-200 text-center">
            <p class="text-slate-500 text-xs mb-2">Login to comment</p>
            <NuxtLink :to="`/auth/login?redirect=/community/post/${route.params.id}`" class="py-1.5 px-3 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium">Login</NuxtLink>
          </div>
          <div v-if="!post.comments?.length" class="p-6 rounded-lg bg-slate-100 text-center">
            <p class="text-slate-500 text-xs">No comments yet.</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="comment in post.comments" :key="comment.id" class="flex gap-2">
              <div class="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-white text-[9px] font-medium flex-shrink-0">{{ getInitials(comment.author?.name || 'U') }}</div>
              <div class="flex-1 p-2 rounded-lg bg-white border border-slate-200">
                <span class="text-xs font-medium text-slate-900">{{ comment.author?.name }}</span>
                <span class="text-[10px] text-slate-400 ml-2">{{ formatDate(comment.createdAt) }}</span>
                <div class="mt-1">
                  <ForumContent :content="comment.content" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

definePageMeta({ layout: 'community' })
const route = useRoute()
const { user, isAuthenticated } = useAuth()
const { error: toastError } = useToast()
const newComment = ref('')
const commenting = ref(false)
const userMessage = ref('')
const loadingAI = ref(false)
const aiError = ref('')
const chatMessages = ref<ChatMessage[]>([])

const { data: post, pending, error: fetchError, refresh } = useFetch<any>(`/api/community/posts/${route.params.id}`)

// Load saved chat on page load
const loadSavedChat = async () => {
  try {
    const result = await $fetch<{ messages: ChatMessage[] }>(`/api/community/posts/${route.params.id}/ai-chat`)
    if (result.messages && result.messages.length > 0) {
      chatMessages.value = result.messages
    }
  } catch (err) {
    // No saved chat, that's fine
  }
}

// Save chat to database
const saveChat = async () => {
  if (chatMessages.value.length === 0) return
  try {
    await $fetch(`/api/community/posts/${route.params.id}/ai-chat`, {
      method: 'POST',
      body: { messages: chatMessages.value }
    })
  } catch (err) {
    console.error('Failed to save chat:', err)
  }
}

// Load chat when post is ready
watch(() => post.value, async (newPost) => {
  if (newPost && newPost.id) {
    await loadSavedChat()
  }
}, { immediate: true })

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

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
  return d.toLocaleDateString()
}

const addComment = async () => {
  if (!newComment.value.trim()) return
  commenting.value = true
  try {
    await $fetch(`/api/community/posts/${route.params.id}/comments`, { method: 'POST', body: { content: newComment.value } })
    newComment.value = ''
    refresh()
  } catch (err: any) { toastError(err.data?.message || 'Failed to post comment') }
  finally { commenting.value = false }
}

// Start AI conversation
const startAIChat = async () => {
  if (!post.value) return
  loadingAI.value = true
  aiError.value = ''
  
  try {
    const result = await $fetch<{ response: string }>('/api/community/ai-response', {
      method: 'POST',
      body: {
        postId: post.value.id,
        title: post.value.title,
        content: post.value.content,
        messages: []
      }
    })
    
    chatMessages.value.push({
      role: 'assistant',
      content: result.response
    })
    
    // Auto-save after getting AI response
    await saveChat()
  } catch (err: any) {
    aiError.value = err.data?.message || 'Failed to get AI response'
  } finally {
    loadingAI.value = false
  }
}

// Send follow-up message
const sendMessage = async () => {
  if (!post.value || !userMessage.value.trim()) return
  
  const message = userMessage.value.trim()
  userMessage.value = ''
  
  // Add user message to chat
  chatMessages.value.push({
    role: 'user',
    content: message
  })
  
  loadingAI.value = true
  aiError.value = ''
  
  try {
    const result = await $fetch<{ response: string }>('/api/community/ai-response', {
      method: 'POST',
      body: {
        postId: post.value.id,
        title: post.value.title,
        content: post.value.content,
        messages: chatMessages.value
      }
    })
    
    chatMessages.value.push({
      role: 'assistant',
      content: result.response
    })
    
    // Auto-save after each exchange
    await saveChat()
  } catch (err: any) {
    aiError.value = err.data?.message || 'Failed to get AI response'
  } finally {
    loadingAI.value = false
  }
}

// Reset conversation
const resetChat = async () => {
  chatMessages.value = []
  aiError.value = ''
  // Clear from database too
  try {
    await $fetch(`/api/community/posts/${route.params.id}/ai-chat`, {
      method: 'POST',
      body: { messages: [] }
    })
  } catch (err) {
    // Ignore error on reset
  }
}
</script>
