<template>
  <div class="p-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-slate-900">Active Sessions</h1>
        <p class="text-sm text-slate-600">Sessions currently in progress or starting soon</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-xs font-bold text-emerald-700">{{ activeSessions.length }} Active</span>
        </div>
        <NuxtLink 
          to="/mentor/sessions" 
          class="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          All Sessions
        </NuxtLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-r-transparent"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!activeSessions.length" class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
      <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-900 mb-2">No Active Sessions</h3>
      <p class="text-sm text-slate-500 mb-4">You don't have any sessions currently in progress.</p>
      <NuxtLink 
        to="/mentor/sessions"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        View All Sessions
      </NuxtLink>
    </div>

    <!-- Active Sessions Grid -->
    <div v-else class="grid gap-4 md:grid-cols-2">
      <div 
        v-for="session in activeSessions" 
        :key="session.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Session Header -->
        <div class="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-primary-50 to-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
              {{ session.clientName.charAt(0) }}
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900">{{ session.clientName }}</h3>
              <p class="text-xs text-slate-500">{{ session.clientEmail }}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="text-[10px] font-bold text-emerald-600 uppercase">Live</span>
          </div>
        </div>

        <!-- Session Details -->
        <div class="px-5 py-4 space-y-3">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2 text-slate-600">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ formatTime(session.scheduledAt) }} - {{ session.duration }} min</span>
            </div>
            <div class="flex items-center gap-1 text-primary-600 font-bold">
              <svg class="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {{ session.creditsCost }}
            </div>
          </div>

          <div v-if="session.notes" class="text-xs text-slate-500 italic line-clamp-2 bg-slate-50 p-2 rounded-lg">
            "{{ session.notes }}"
          </div>
        </div>

        <!-- Actions -->
        <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex gap-2">
          <a 
            :href="session.meetingUrl"
            target="_blank"
            class="flex-1 py-2 rounded-lg bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-all text-center flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Join
          </a>
          <button 
            @click="openChat(session)"
            class="flex-1 py-2 rounded-lg border border-primary-200 bg-primary-50 text-primary-700 text-xs font-bold hover:bg-primary-100 transition-all text-center flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Chat
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Modal -->
    <Teleport to="body">
      <div v-if="showChatModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showChatModal = false"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[85vh] flex flex-col">
          <!-- Header -->
          <div class="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
                {{ selectedSession?.clientName?.charAt(0) }}
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900">{{ selectedSession?.clientName }}</h3>
                <p class="text-xs text-slate-500">Session Chat</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="text-[10px] font-bold text-emerald-600 uppercase">Live</span>
              </div>
              <button @click="showChatModal = false" class="p-2 rounded-full hover:bg-white transition-colors text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Messages Area -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
            <div v-if="chatPending" class="h-64 flex flex-col items-center justify-center text-slate-400">
              <div class="w-6 h-6 border-2 border-slate-200 border-t-primary-500 rounded-full animate-spin mb-2"></div>
              <span class="text-xs">Loading messages...</span>
            </div>
            
            <div v-else-if="!messages?.length" class="h-64 flex flex-col items-center justify-center text-slate-400">
              <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p class="text-sm font-medium text-slate-500">No messages yet</p>
              <p class="text-xs text-slate-400 mt-1">Start the conversation below</p>
            </div>

            <template v-else>
              <div 
                v-for="msg in messages" 
                :key="msg.id" 
                class="flex w-full"
                :class="msg.senderId === user?.id ? 'justify-end' : 'justify-start'"
              >
                <div class="flex items-end gap-2 max-w-[85%]">
                  <div 
                    v-if="msg.senderId !== user?.id"
                    class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold shadow-sm mb-1"
                  >
                    {{ selectedSession?.clientName?.charAt(0) }}
                  </div>

                  <div class="flex flex-col gap-0.5" :class="msg.senderId === user?.id ? 'items-end' : 'items-start'">
                    <div 
                      class="px-4 py-2.5 text-sm shadow-sm transition-all text-left"
                      :class="[
                        msg.senderId === user?.id 
                          ? 'bg-primary-600 text-white rounded-2xl rounded-tr-sm' 
                          : 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-tl-sm'
                      ]"
                    >
                      {{ msg.content }}
                    </div>
                    <span class="text-[10px] text-slate-400 px-1">
                        {{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Input Area -->
          <div class="p-4 bg-white border-t border-slate-100 flex-shrink-0">
            <div class="flex items-end gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <textarea 
                v-model="newMessage" 
                @keydown.enter.prevent="sendMessage"
                placeholder="Type a message..."
                rows="1"
                class="flex-1 bg-transparent border-none focus:ring-0 text-sm p-2 max-h-24 min-h-[40px] resize-none text-slate-700 placeholder:text-slate-400 outline-none"
              ></textarea>
              
              <button 
                @click="sendMessage"
                :disabled="sending || !newMessage.trim()"
                class="p-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0"
              >
                <svg v-if="sending" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community',
  middleware: ['auth']
})

const { user } = useAuth()

const { data: sessions, pending } = useFetch('/api/community/bookings', {
  query: { type: 'mentor' },
  default: () => []
})

const showChatModal = ref(false)
const selectedSession = ref<any>(null)
const newMessage = ref('')
const sending = ref(false)

// Fetch messages for active room
const { data: messages, pending: chatPending, refresh: refreshMessages } = useFetch(() => 
  selectedSession.value?.chatRoomId && showChatModal.value
    ? `/api/community/chat/${selectedSession.value.chatRoomId}/messages` 
    : null
)

// Auto refresh messages
let chatInterval: any = null
watch([showChatModal, selectedSession], ([isOpen, session]) => {
  if (isOpen && session?.chatRoomId) {
    if (!chatInterval) {
      chatInterval = setInterval(refreshMessages, 3000)
    }
  } else {
    if (chatInterval) {
      clearInterval(chatInterval)
      chatInterval = null
    }
  }
})

onUnmounted(() => {
  if (chatInterval) clearInterval(chatInterval)
})

const openChat = (session: any) => {
  selectedSession.value = { ...session }
  showChatModal.value = true
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedSession.value?.chatRoomId) return
  
  sending.value = true
  try {
    await $fetch(`/api/community/chat/${selectedSession.value.chatRoomId}/messages`, {
      method: 'POST',
      body: { content: newMessage.value }
    })
    newMessage.value = ''
    await refreshMessages()
  } catch (err) {
    console.error('Failed to send message:', err)
  } finally {
    sending.value = false
  }
}

const isSessionActive = (session: any) => {
  if (!session || session.status !== 'CONFIRMED') return false
  const now = new Date()
  const start = new Date(session.scheduledAt)
  // Allow joining 5 minutes early
  const startTime = new Date(start.getTime() - 5 * 60000)
  const endTime = new Date(start.getTime() + session.duration * 60000)
  return now >= startTime && now <= endTime
}

const activeSessions = computed(() => {
  return (sessions.value as any[]).filter(s => isSessionActive(s))
})

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}
</script>
