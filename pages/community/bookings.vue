<template>
  <div class="min-h-screen bg-slate-50">
    <section class="mx-auto max-w-3xl px-3 py-5">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <NuxtLink to="/community" class="hover:text-primary-600 transition-colors">Community</NuxtLink>
        <span>/</span>
        <span class="text-slate-900">My Bookings</span>
      </div>

      <!-- Header -->
      <div class="mb-5">
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          My Bookings
        </h1>
        <p class="mt-1 text-xs text-slate-500">Manage your mentorship sessions</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1.5 mb-4">
        <button
          @click="activeTab = 'booked'"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          :class="activeTab === 'booked' ? 'bg-primary-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
        >
          Sessions I Booked
        </button>
        <button
          v-if="user?.role === 'MENTOR'"
          @click="activeTab = 'mentor'"
          class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
          :class="activeTab === 'mentor' ? 'bg-primary-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
        >
          Sessions as Mentor
        </button>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="space-y-3">
        <div v-for="i in 3" :key="i" class="p-4 rounded-lg bg-white border border-slate-200 shadow-sm animate-pulse">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-200"></div>
            <div class="flex-1">
              <div class="h-4 bg-slate-200 rounded w-1/3 mb-1.5"></div>
              <div class="h-3 bg-slate-100 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!bookings?.length" class="p-8 rounded-lg bg-white border border-slate-200 text-center">
        <svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="text-sm font-semibold text-slate-900 mb-1">No bookings yet</h3>
        <p class="text-slate-500 text-xs mb-3">
          {{ activeTab === 'booked' ? 'Browse mentors and book your first session!' : 'No sessions as a mentor yet.' }}
        </p>
        <NuxtLink
          v-if="activeTab === 'booked'"
          to="/community/mentors"
          class="inline-flex items-center gap-1.5 py-2 px-4 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors"
        >
          Browse Mentors
        </NuxtLink>
      </div>

      <!-- Bookings List -->
      <div v-else class="space-y-3">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          class="p-4 rounded-lg bg-white border border-slate-200 shadow-sm"
        >
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {{ getInitials(activeTab === 'booked' ? booking.mentorName : booking.clientName) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap mb-0.5">
                <h3 class="text-sm font-semibold text-slate-900">
                  {{ activeTab === 'booked' ? booking.mentorName : booking.clientName }}
                </h3>
                <span
                  v-if="booking.mentorVerified"
                  class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-primary-100 text-primary-700 text-[10px]"
                >
                  <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Verified
                </span>
                <span
                  class="px-1.5 py-0.5 rounded text-[10px] font-medium"
                  :class="getStatusClass(booking.status)"
                >
                  {{ booking.status }}
                </span>
              </div>

              <div class="flex flex-wrap gap-3 text-[10px] text-slate-500 mb-1.5">
                <span class="flex items-center gap-0.5">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDateTime(booking.scheduledAt) }}
                </span>
                <span class="flex items-center gap-0.5">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ booking.duration }} min
                </span>
                <span class="flex items-center gap-0.5 text-primary-600">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {{ booking.creditsCost }} credits
                </span>
              </div>

              <p v-if="booking.notes" class="text-xs text-slate-600 line-clamp-1">
                {{ booking.notes }}
              </p>
            </div>
            <div class="flex flex-col gap-2">
              <button 
                @click="viewDetails(booking)"
                class="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all hover:border-slate-300"
              >
                Details
              </button>
              <a 
                v-if="booking.status === 'CONFIRMED' && isSessionActive(booking)"
                :href="booking.meetingUrl"
                target="_blank"
                class="px-3 py-1.5 rounded-md bg-primary-600 text-white text-[10px] font-bold hover:bg-primary-700 transition-all shadow-sm flex items-center justify-center gap-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Join
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Details Modal with Chat -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showModal = false"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 class="font-bold text-slate-900">Booking Details</h3>
            <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-6">
            <!-- Mentor/Client -->
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                {{ getInitials(activeTab === 'booked' ? selectedBooking.mentorName : selectedBooking.clientName) }}
              </div>
              <div>
                <p class="text-xs font-bold text-primary-600 uppercase tracking-wider">
                  {{ activeTab === 'booked' ? 'Mentor' : 'Mentee' }}
                </p>
                <h4 class="font-bold text-slate-900 text-lg">
                  {{ activeTab === 'booked' ? selectedBooking.mentorName : selectedBooking.clientName }}
                </h4>
              </div>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Time</label>
                <p class="text-xs font-semibold text-slate-900">{{ formatDateTime(selectedBooking.scheduledAt) }}</p>
                <p class="text-[10px] text-slate-500">{{ selectedBooking.duration }} Minutes</p>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Credits</label>
                <p class="text-xs font-bold text-primary-600">★ {{ selectedBooking.creditsCost }}</p>
                <p class="text-[10px] text-slate-500 capitalize">{{ selectedBooking.status }}</p>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="selectedBooking.notes">
              <label class="block text-[10px] font-bold text-slate-400 uppercase mb-2">My Notes</label>
              <p class="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                "{{ selectedBooking.notes }}"
              </p>
            </div>

            <!-- Actions & Chat -->
            <div v-if="selectedBooking.status === 'CONFIRMED' && isSessionActive(selectedBooking)" class="space-y-4">
              <div class="flex gap-2">
                <a 
                  :href="selectedBooking.meetingUrl"
                  target="_blank"
                  class="flex-1 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-all text-center flex items-center justify-center gap-2"
                >
                  Join Google Meet
                </a>
                <button 
                  @click="showChat = !showChat"
                  class="flex-1 py-2 rounded-xl border border-primary-200 bg-primary-50 text-primary-700 text-xs font-bold hover:bg-primary-100 transition-all"
                >
                  {{ showChat ? 'Hide Chat' : 'Open Chat' }}
                </button>
              </div>
              


              <!-- Chat Window -->
              <div v-if="showChat" class="animate-in slide-in-from-bottom-2 duration-300">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Chat</h4>
                  <div class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                    <span class="relative flex h-2 w-2">
                       <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Live</span>
                  </div>
                </div>

                <div class="bg-slate-50/50 rounded-2xl border border-slate-200 h-80 flex flex-col relative overflow-hidden">
                  <div class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <div v-if="chatPending" class="h-full flex flex-col items-center justify-center text-slate-400">
                       <div class="w-6 h-6 border-2 border-slate-200 border-t-primary-500 rounded-full animate-spin mb-2"></div>
                       <span class="text-xs font-medium">Loading conversation...</span>
                    </div>

                    <div v-else-if="!messages?.length" class="h-full flex flex-col items-center justify-center text-slate-400">
                       <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-300">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                       </div>
                       <p class="text-sm font-medium text-slate-500">No messages yet</p>
                       <p class="text-xs text-slate-400 mt-1">Start the conversation below</p>
                    </div>

                     <div 
                        v-else
                        v-for="msg in messages" 
                        :key="msg.id"
                        class="flex w-full"
                        :class="msg.senderId === user?.id ? 'justify-end' : 'justify-start'"
                     >
                        <div class="flex items-end gap-2 max-w-[85%]">
                          <!-- Other Person Avatar (Only show if not me) -->
                          <div 
                             v-if="msg.senderId !== user?.id"
                             class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex-shrink-0 flex items-center justify-center text-[10px] text-white font-bold shadow-sm mb-1"
                          >
                             {{ otherPersonName?.charAt(0) || '?' }}
                          </div>

                          <div class="flex flex-col gap-1" :class="msg.senderId === user?.id ? 'items-end' : 'items-start'">
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
                  </div>

                  <div class="p-3 bg-white border-t border-slate-100">
                     <div class="flex items-end gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                        <textarea 
                           v-model="newMessage"
                           @keydown.enter.prevent="sendMessage"
                           placeholder="Type a message..."
                           rows="1"
                           class="flex-1 bg-transparent border-none focus:ring-0 text-sm p-2 max-h-32 min-h-[40px] resize-none text-slate-700 placeholder:text-slate-400 outline-none"
                        ></textarea>
                        
                        <button 
                           @click="sendMessage"
                           :disabled="sending || !newMessage.trim()"
                           class="p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0 mb-0.5"
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
            </div>
            <div v-else-if="selectedBooking.status === 'CONFIRMED'" class="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p class="text-[10px] text-blue-700 font-medium text-center">
                Session communication tools will activate {{ isBufferActive(selectedBooking) ? 'shortly' : '' }} at the scheduled time.
              </p>
            </div>

            <!-- Completion Action (Always Visible if Confirmed) -->
            <div v-if="selectedBooking.status === 'CONFIRMED'" class="mt-4 border-t border-slate-100 pt-4">
              <button 
                @click="updateStatus(selectedBooking.id, 'COMPLETED')"
                class="w-full py-2 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Mark Session Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model:isOpen="showConfirmModal"
      :title="pendingAction?.status === 'COMPLETED' ? 'Complete Session?' : 'Update Status?'"
      :message="pendingAction?.status === 'COMPLETED' ? 'Are you sure you want to mark this session as completed? This will finalize the booking.' : `Are you sure you want to mark this session as ${pendingAction?.status.toLowerCase()}?`"
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

const { user } = useAuth()
const { show, success, error } = useToast()

const activeTab = ref<'booked' | 'mentor'>('booked')
const showModal = ref(false)
const showConfirmModal = ref(false)
const pendingAction = ref<{id: string, status: string} | null>(null)

const selectedBooking = ref<any>(null)
const showChat = ref(false)
const newMessage = ref('')
const sending = ref(false)

const { data: bookings, pending, refresh } = useFetch('/api/community/bookings', {
  query: { type: activeTab },
  watch: [activeTab]
})

// Fetch messages
const { data: messages, pending: chatPending, refresh: refreshMessages } = useFetch(() => 
  selectedBooking.value?.chatRoomId && showChat.value 
    ? `/api/community/chat/${selectedBooking.value.chatRoomId}/messages` 
    : null
)

// Auto refresh
let chatInterval: any = null
watch([showChat, selectedBooking], ([isChatOpen, booking]) => {
  if (isChatOpen && booking?.chatRoomId) {
    if (!chatInterval) chatInterval = setInterval(refreshMessages, 3000)
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

const isSessionActive = (booking: any) => {
  if (!booking || booking.status !== 'CONFIRMED') return false
  const now = new Date()
  const start = new Date(booking.scheduledAt)
  // Join 5 mins early
  const startTime = new Date(start.getTime() - 5 * 60000)
  const endTime = new Date(start.getTime() + booking.duration * 60000)
  return now >= startTime && now <= endTime
}

const isBufferActive = (booking: any) => {
  const now = new Date()
  const start = new Date(booking.scheduledAt)
  const startTime = new Date(start.getTime() - 30 * 60000) // 30 min buffer message
  return now >= startTime
}

const otherPersonName = computed(() => {
  if (!selectedBooking.value) return ''
  return activeTab.value === 'booked' ? selectedBooking.value.mentorName : selectedBooking.value.clientName
})

const viewDetails = (booking: any) => {
  selectedBooking.value = { ...booking }
  showModal.value = true
  showChat.value = false
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedBooking.value?.chatRoomId) return
  sending.value = true
  try {
    await $fetch(`/api/community/chat/${selectedBooking.value.chatRoomId}/messages`, {
      method: 'POST',
      body: { content: newMessage.value }
    })
    newMessage.value = ''
    await refreshMessages()
  } catch (err) {
    console.error('Chat error:', err)
  } finally {
    sending.value = false
  }
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-100 text-amber-700'
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-700'
    case 'COMPLETED':
      return 'bg-green-100 text-green-700'
    case 'CANCELLED':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}
const updateStatus = async (id: string, status: string) => {
  // Use ConfirmModal for critical actions
  if (status === 'COMPLETED' || status === 'CANCELLED' || status === 'CONFIRMED') {
    pendingAction.value = { id, status }
    showConfirmModal.value = true
    return
  }
  
  // For other statuses (if any), proceed directly or use modal too.
  // Currently app only uses CONFIRMED (Approve as mentor), COMPLETED, CANCELLED.
  // Mentee only uses COMPLETED. 
  // Let's rely on confirmAction.
}

const confirmAction = async () => {
  if (!pendingAction.value) return
  const { id, status } = pendingAction.value
  
  try {
    await $fetch(`/api/community/bookings/${id}`, { 
      method: 'PATCH', 
      body: { status } 
    })
    
    // Refresh bookings list
    await refresh()
    
    // Update local state if details modal is open
    if (selectedBooking.value?.id === id) {
      selectedBooking.value.status = status
    }
    
    success(`Session marked as ${status.toLowerCase()}`)
  } catch (err: any) {
    error(err.data?.statusMessage || 'Failed to update status')
  } finally {
    pendingAction.value = null
  }
}
</script>
