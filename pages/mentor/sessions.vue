<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Mentorship Sessions</h1>
        <p class="text-slate-600">View and manage your upcoming and past sessions</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink 
          to="/mentor" 
          class="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Dashboard
        </NuxtLink>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
      <button 
        v-for="tab in ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']" 
        :key="tab"
        @click="activeTab = tab"
        :class="activeTab === tab ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
        class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Sessions List -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="pending" class="p-12 text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-r-transparent"></div>
        <p class="mt-4 text-slate-500">Loading sessions...</p>
      </div>

      <div v-else-if="!filteredSessions.length" class="p-12 text-center">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-slate-900 font-semibold mb-1">No sessions found</h3>
        <p class="text-slate-500 text-sm">There are no sessions matching your current filter.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mentee</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Earnings</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="session in filteredSessions" :key="session.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold uppercase">
                    {{ session.clientName.charAt(0) }}
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-slate-900">{{ session.clientName }}</div>
                    <div class="text-xs text-slate-500">{{ session.clientEmail }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-900">{{ formatDate(session.scheduledAt) }}</div>
                <div class="text-xs text-slate-500">{{ formatTime(session.scheduledAt) }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-600">{{ session.duration }} mins</span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1 text-sm font-bold text-slate-900">
                  <svg class="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {{ session.creditsCost }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span 
                  :class="{
                    'bg-amber-100 text-amber-700': session.status === 'PENDING',
                    'bg-blue-100 text-blue-700': session.status === 'CONFIRMED',
                    'bg-primary-100 text-primary-700': session.status === 'COMPLETED',
                    'bg-slate-100 text-slate-600': session.status === 'CANCELLED'
                  }"
                  class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                >
                  {{ session.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button v-if="session.status === 'PENDING'" @click="updateStatus(session.id, 'CONFIRMED')" class="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors mr-3">
                  Approve
                </button>
                <button @click="viewDetails(session)" class="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showModal = false"></div>
        
        <!-- Modal Content - Wider for landscape layout -->
        <div 
          class="relative bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col"
          :class="showChat ? 'w-full max-w-5xl' : 'w-full max-w-xl'"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Session Details</h3>
              <p class="text-xs text-slate-500">Ref: {{ selectedSession?.id?.slice(-8).toUpperCase() }}</p>
            </div>
            <button @click="showModal = false" class="p-2 rounded-full hover:bg-white transition-colors text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body - Side by side when chat is open -->
          <div class="flex-1 overflow-hidden" :class="showChat ? 'flex' : ''">
            <!-- Left: Session Details -->
            <div 
              class="p-6 space-y-5 overflow-y-auto"
              :class="showChat ? 'w-1/2 border-r border-slate-100' : 'w-full'"
            >
              <!-- Mentee Info -->
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-800 flex items-center justify-center text-white text-lg font-bold">
                  {{ selectedSession?.clientName?.charAt(0) }}
                </div>
                <div>
                  <span class="text-[10px] font-bold text-primary-600 uppercase tracking-wider">Mentee</span>
                  <h4 class="text-sm font-bold text-slate-900">{{ selectedSession?.clientName }}</h4>
                  <p class="text-xs text-slate-500">{{ selectedSession?.clientEmail }}</p>
                </div>
              </div>

              <!-- Grid Details -->
              <div class="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Schedule</label>
                  <p class="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(selectedSession?.scheduledAt) }}
                  </p>
                  <p class="text-xs font-semibold text-slate-900 flex items-center gap-1.5 mt-1">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatTime(selectedSession?.scheduledAt) }}
                  </p>
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Session Info</label>
                  <p class="text-xs font-semibold text-slate-900">{{ selectedSession?.duration }} Minutes</p>
                  <p class="text-xs font-bold text-primary-600 flex items-center gap-1 mt-1">
                    <svg class="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {{ selectedSession?.creditsCost }} Credits
                  </p>
                </div>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mentee Notes</label>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 italic text-xs text-slate-600 leading-relaxed">
                  "{{ selectedSession?.notes || 'No specific notes provided.' }}"
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-wrap gap-2 pt-2">
                <a 
                  v-if="selectedSession?.status === 'CONFIRMED' && isSessionActive(selectedSession)"
                  :href="selectedSession.meetingUrl"
                  target="_blank"
                  class="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-lg shadow-primary-600/20 transition-all flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Join Google Meet
                </a>

                <button 
                  v-if="selectedSession?.status === 'CONFIRMED' && isSessionActive(selectedSession)"
                  @click="showChat = !showChat"
                  class="px-4 py-2 rounded-lg border border-primary-200 bg-primary-50 text-primary-700 text-xs font-bold hover:bg-primary-100 transition-all flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {{ showChat ? 'Close Chat' : 'Open Chat' }}
                </button>

                <button 
                  v-if="selectedSession?.status === 'PENDING'"
                  @click="updateStatusFromModal(selectedSession.id, 'CONFIRMED')"
                  class="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all"
                >
                  Approve
                </button>
                <button 
                  v-if="selectedSession?.status === 'CONFIRMED'"
                  @click="updateStatusFromModal(selectedSession.id, 'COMPLETED')"
                  class="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Session
                </button>
                <button 
                  v-if="['CONFIRMED', 'PENDING'].includes(selectedSession?.status)"
                  @click="updateStatusFromModal(selectedSession.id, 'CANCELLED')"
                  class="px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>

            <!-- Right: Chat Panel (Side by side) -->
            <div 
              v-if="showChat && selectedSession?.chatRoomId" 
              class="w-1/2 flex flex-col bg-slate-50/30"
            >
              <!-- Chat Header -->
              <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
                <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Session Chat</h4>
                <div class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                  <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Live</span>
                </div>
              </div>

              <!-- Messages Area -->
              <div class="flex-1 overflow-y-auto p-4 space-y-3">
                <div v-if="chatPending" class="h-full flex flex-col items-center justify-center text-slate-400">
                  <div class="w-5 h-5 border-2 border-slate-200 border-t-primary-500 rounded-full animate-spin mb-2"></div>
                  <span class="text-xs">Loading...</span>
                </div>
                
                <div v-else-if="!messages?.length" class="h-full flex flex-col items-center justify-center text-slate-400">
                  <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-slate-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p class="text-xs font-medium text-slate-500">No messages yet</p>
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
                        class="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex-shrink-0 flex items-center justify-center text-[8px] text-white font-bold shadow-sm mb-1"
                      >
                        {{ selectedSession?.clientName?.charAt(0) }}
                      </div>

                      <div class="flex flex-col gap-0.5" :class="msg.senderId === user?.id ? 'items-end' : 'items-start'">
                        <div 
                          class="px-3 py-2 text-xs shadow-sm transition-all text-left"
                          :class="[
                            msg.senderId === user?.id 
                              ? 'bg-primary-600 text-white rounded-xl rounded-tr-sm' 
                              : 'bg-white text-slate-700 border border-slate-200 rounded-xl rounded-tl-sm'
                          ]"
                        >
                          {{ msg.content }}
                        </div>
                        <span class="text-[9px] text-slate-400 px-1">
                            {{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Input Area -->
              <div class="p-3 bg-white border-t border-slate-100">
                <div class="flex items-end gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                  <textarea 
                    v-model="newMessage" 
                    @keydown.enter.prevent="sendMessage"
                    placeholder="Type a message..."
                    rows="1"
                    class="flex-1 bg-transparent border-none focus:ring-0 text-xs p-2 max-h-20 min-h-[36px] resize-none text-slate-700 placeholder:text-slate-400 outline-none"
                  ></textarea>
                  
                  <button 
                    @click="sendMessage"
                    :disabled="sending || !newMessage.trim()"
                    class="p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0"
                  >
                    <svg v-if="sending" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model:isOpen="showConfirmModal"
      :title="pendingAction?.status === 'COMPLETED' ? 'Complete Session?' : (pendingAction?.status === 'CONFIRMED' ? 'Approve Session?' : 'Update Status?')"
      :message="pendingAction?.status === 'COMPLETED' ? 'Are you sure you want to mark this session as completed? This will process the commission.' : `Are you sure you want to mark this session as ${pendingAction?.status.toLowerCase()}?`"
      :type="pendingAction?.status === 'CANCELLED' ? 'danger' : 'info'"
      confirm-text="Yes, Confirm"
      @confirm="confirmAction"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community',
  middleware: ['auth']
})

const activeTab = ref('ALL')
const showModal = ref(false)
const showConfirmModal = ref(false)
const pendingAction = ref<{id: string, status: string} | null>(null)

const selectedSession = ref<any>(null)
const showChat = ref(false)
const newMessage = ref('')
const sending = ref(false)

const { user } = useAuth()
const { show, success, error } = useToast()

const { data: sessions, pending, refresh } = useFetch('/api/community/bookings', {
  query: { type: 'mentor' },
  default: () => []
})

// Fetch messages for active room
const { data: messages, pending: chatPending, refresh: refreshMessages } = useFetch(() => 
  selectedSession.value?.chatRoomId && showChat.value 
    ? `/api/community/chat/${selectedSession.value.chatRoomId}/messages` 
    : null
)

// Auto refresh messages
let chatInterval: any = null
watch([showChat, selectedSession], ([isChatOpen, session]) => {
  if (isChatOpen && session?.chatRoomId) {
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

const isSessionActive = (session: any) => {
  if (!session || session.status !== 'CONFIRMED') return false
  const now = new Date()
  const start = new Date(session.scheduledAt)
  // Allow joining 5 minutes early
  const startTime = new Date(start.getTime() - 5 * 60000)
  const endTime = new Date(start.getTime() + session.duration * 60000)
  return now >= startTime && now <= endTime
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

const filteredSessions = computed(() => {
  if (activeTab.value === 'ALL') return sessions.value
  return sessions.value.filter((s: any) => s.status === activeTab.value)
})

const formatDate = (date: string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (date: string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

const updateStatus = async (id: string, status: string) => {
  pendingAction.value = { id, status }
  showConfirmModal.value = true
}

const confirmAction = async () => {
  if (!pendingAction.value) return
  const { id, status } = pendingAction.value
  
  try {
    await $fetch(`/api/community/bookings/${id}`, { 
      method: 'PATCH', 
      body: { status } 
    })
    
    await refresh()
    
    // Update local selected session if details modal is open
    if (selectedSession.value?.id === id) {
      selectedSession.value.status = status
    }
    
    // If cancelled, maybe close details modal?
    if (status === 'CANCELLED') showModal.value = false
    
    success(`Session marked as ${status.toLowerCase()}`)
  } catch (err: any) {
    error(err.data?.statusMessage || 'Failed to update status')
  } finally {
    pendingAction.value = null
  }
}

const updateStatusFromModal = async (id: string, status: string) => {
  updateStatus(id, status)
}

const viewDetails = (session: any) => {
  selectedSession.value = { ...session }
  showModal.value = true
}
</script>
