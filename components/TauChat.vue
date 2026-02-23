<template>
  <div class="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
    <!-- Chat Window -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-4 opacity-0 scale-95"
    >
      <div v-show="isOpen" class="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-navy-700/50 bg-navy-900/95 shadow-2xl backdrop-blur-xl">
        <!-- Header -->
        <div class="flex items-center justify-between bg-gradient-to-r from-primary-600 to-primary-800 px-4 py-3 text-white">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl font-bold">T</div>
              <div class="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-primary-700 bg-green-500"></div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <div class="text-sm font-bold uppercase tracking-wider">Tau</div>
                <div v-if="chatStatus === 'HUMAN_ACTIVE'" class="bg-white/20 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">Human Admin</div>
              </div>
              <div class="text-[10px] text-primary-100">AI Assistant • Online</div>
            </div>
          </div>
          <button @click="isOpen = false" class="rounded-full p-1 hover:bg-white/10">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Name Selection (for Guests) -->
        <div v-if="!sessionStarted && !user" class="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div class="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-2">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h3 class="text-white font-bold">How should we address you?</h3>
          <p class="text-xs text-navy-400">Please enter your name to start a conversation with Tau.</p>
          <input 
            v-model="guestName" 
            placeholder="Your Name" 
            @keyup.enter="startConversation"
            class="w-full rounded-xl border border-navy-700 bg-navy-800/50 px-4 py-3 text-sm text-white focus:border-primary-500 focus:outline-none"
          />
          <button 
            @click="startConversation" 
            :disabled="!guestName.trim()"
            class="w-full rounded-xl bg-primary-600 py-3 font-bold text-white hover:bg-primary-500 disabled:opacity-50 transition-all shadow-lg"
          >
            Start Chat
          </button>
        </div>

        <!-- Messages Area -->
        <template v-else>
          <div ref="messageArea" class="flex-1 overflow-y-auto p-4 space-y-4">
            <div v-for="(msg, i) in messages" :key="i" :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
              <div 
                :class="msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none shadow-primary-900/20' : 'bg-navy-800 text-navy-100 rounded-tl-none border border-navy-700/30 shadow-black/20'"
                class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md whitespace-pre-wrap leading-relaxed"
              >
                {{ msg.content }}
              </div>
            </div>
            <div v-if="typing" class="flex justify-start">
              <div class="bg-navy-800 rounded-2xl rounded-tl-none px-3 py-2 shadow-sm border border-navy-700/30">
                <div class="flex gap-1">
                  <div class="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-400"></div>
                  <div class="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-400 [animation-delay:0.2s]"></div>
                  <div class="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-400 [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <form @submit.prevent="sendMessage" class="border-t border-navy-700/50 p-4 transition-all" :class="{ 'opacity-50 pointer-events-none': typing }">
            <div class="relative flex items-center">
              <input 
                v-model="input" 
                placeholder="Type a message..." 
                class="w-full rounded-2xl border border-navy-700 bg-navy-800/50 px-4 py-3 pr-12 text-sm text-white placeholder-navy-500 transition-all focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50 shadow-inner"
              />
              <button 
                type="submit" 
                :disabled="!input.trim() || typing" 
                class="absolute right-2 rounded-xl bg-primary-600 p-2 text-white shadow-lg hover:bg-primary-500 hover:scale-105 active:scale-95 disabled:opacity-0 disabled:scale-95 transition-all"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </form>
        </template>
      </div>
    </transition>

    <!-- Floating Toggle Button -->
    <button 
      @click="toggleChat"
      :class="isOpen ? 'bg-navy-800 border-navy-700 rotate-90 shadow-none' : 'bg-gradient-to-r from-primary-600 to-primary-800 border-primary-500 shadow-[0_8px_32px_rgba(37,99,235,0.4)] scale-110'"
      class="group relative flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500 hover:scale-[1.15] active:scale-90"
    >
      <transition mode="out-in">
        <svg v-if="!isOpen" key="open" class="h-8 w-8 text-white transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <svg v-else key="close" class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </transition>
      
      <!-- Label tooltip -->
      <div v-if="!isOpen" class="absolute right-full mr-4 whitespace-nowrap rounded-2xl bg-navy-900/90 backdrop-blur border border-navy-700 px-4 py-2 text-sm font-medium text-white shadow-xl pointer-events-none translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        Hi! I'm Tau. Need help?
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth()
const isOpen = ref(false)
const input = ref('')
const guestName = ref('')
const sessionStarted = ref(false)
const typing = ref(false)
const messageArea = ref<HTMLElement>()
const chatId = ref<string | null>(null)

const messages = ref<any[]>([])
const chatStatus = ref('AI_ACTIVE')
let pollingInterval: any = null

function toggleChat() {
  isOpen.value = !isOpen.value
}

onMounted(() => {
  // Check if there's an existing guest ID or session
  const guestId = useCookie('tau_guest_id').value
  if (guestId) {
     // We don't have the chatId yet, but we could find it if we had an API for it
     // For now, we'll let it be set when they send the first message or if it's already in a ref
  }
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})

watch(chatId, (newId) => {
  if (pollingInterval) clearInterval(pollingInterval)
  if (newId) {
    pollingInterval = setInterval(refreshMessages, 3000)
  }
})

async function refreshMessages() {
  if (!chatId.value || !isOpen.value) return
  try {
    const res = await $fetch<any>('/api/ai/messages', {
      params: { chatId: chatId.value }
    })
    if (res.messages.length > messages.value.length) {
      messages.value = res.messages
      chatStatus.value = res.status
      scrollToBottom()
    }
  } catch (e) {
    console.warn('Failed to refresh messages')
  }
}

function startConversation() {
  if (!user.value && !guestName.value.trim()) return
  sessionStarted.value = true
  messages.value = [
    { role: 'assistant', content: `Hi ${guestName.value || user.value?.name}! I'm Tau, your WeCodeZW assistant. How can I help you today?` }
  ]
}

async function sendMessage() {
  if (!input.value.trim() || typing.value) return
  
  // Auto-start session for logged in users
  if (!sessionStarted.value && user.value) {
    sessionStarted.value = true
  }

  const userMsg = input.value.trim()
  input.value = ''
  
  // Optimistic update if AI is active
  if (chatStatus.value === 'AI_ACTIVE') {
    messages.value.push({ role: 'user', content: userMsg })
    typing.value = true
  }
  
  scrollToBottom()

  try {
    const res = await $fetch<any>('/api/ai/chat', {
      method: 'POST',
      body: { 
        message: userMsg, 
        chatId: chatId.value,
        guestName: user.value ? null : guestName.value 
      }
    })
    
    if (res.ok) {
      chatId.value = res.chatId
      if (res.reply) {
        messages.value.push({ role: 'assistant', content: res.reply })
      }
    }
  } catch (e) {
     if (chatStatus.value === 'AI_ACTIVE') {
       messages.value.push({ role: 'assistant', content: "Sorry, I'm having some technical difficulties." })
     }
  } finally {
    typing.value = false
    scrollToBottom()
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messageArea.value) {
      messageArea.value.scrollTop = messageArea.value.scrollHeight
    }
  })
}
</script>
