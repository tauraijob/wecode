<template>
  <NuxtLayout name="admin">
    <div class="p-6 space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Tau AI Management</h1>
          <p class="text-navy-400">Train, monitor, and manage your AI assistant.</p>
        </div>
        <div class="flex gap-3">
          <button 
            @click="crawlSite" 
            :disabled="crawling"
            class="flex items-center gap-2 rounded-lg bg-navy-800 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 transition-colors disabled:opacity-50"
          >
            <svg :class="{ 'animate-spin': crawling }" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {{ crawling ? 'Crawling...' : 'Crawl Site Content' }}
          </button>
          <button 
            @click="showAddModal = true"
            class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-all shadow-lg"
          >
            Add Knowledge
          </button>
        </div>
      </div>

      <!-- Main Tabs -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Live Chats -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-white flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Support Chats
            </h2>
          </div>

          <div v-if="chatsLoading" class="p-12 text-center bg-navy-900/50 rounded-2xl border border-navy-800">
             <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-r-transparent"></div>
          </div>

          <div v-else-if="chats.length === 0" class="p-12 text-center bg-navy-900/50 rounded-2xl border border-navy-800 text-navy-400">
            No active chats right now.
          </div>

          <div v-else class="grid gap-4">
            <div 
              v-for="chat in chats" 
              :key="chat.id" 
              class="group relative overflow-hidden rounded-2xl border border-navy-800 bg-navy-900/50 p-4 transition-all hover:border-navy-700 hover:bg-navy-800/50"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-4">
                  <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 font-bold text-white shadow-lg">
                    {{ chat.user?.name?.charAt(0) || 'G' }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-white">{{ chat.user?.name || 'Guest User' }}</span>
                      <span :class="chat.status === 'HUMAN_ACTIVE' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-primary-500/20 text-primary-400 border-primary-500/30'" class="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        {{ chat.status === 'HUMAN_ACTIVE' ? 'Human Takeover' : 'AI Active' }}
                      </span>
                    </div>
                    <div class="text-xs text-navy-400">{{ chat.user?.email || chat.guestId?.substring(0,8) + '...' }}</div>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-2">
                  <span class="text-[10px] text-navy-500">{{ formatTime(chat.updatedAt) }}</span>
                  <button 
                    @click="joinChat(chat)"
                    class="rounded-lg bg-navy-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-600 transition-colors"
                  >
                    Join Chat
                  </button>
                </div>
              </div>
              <div class="mt-4 rounded-xl bg-navy-950/50 p-3 text-xs text-navy-300 line-clamp-2 italic">
                “{{ chat.messages[0]?.content }}”
              </div>
            </div>
          </div>
        </div>

        <!-- Knowledge Base -->
        <div class="space-y-6">
          <h2 class="text-lg font-semibold text-white">Knowledge Base</h2>
          
          <div v-if="kbLoading" class="p-8 text-center bg-navy-900/50 rounded-2xl border border-navy-800">
             <div class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-r-transparent"></div>
          </div>

          <div v-else class="space-y-3">
             <div 
              v-for="item in kb" 
              :key="item.id"
              class="rounded-xl border border-navy-800 bg-navy-900/30 p-3 hover:bg-navy-900/50 transition-colors"
             >
               <div class="flex items-center justify-between mb-2">
                 <span class="text-[10px] font-bold text-navy-500 uppercase tracking-widest">{{ item.isManual ? 'Manual Entry' : 'Crawled Page' }}</span>
                 <button @click="deleteKb(item.id)" class="text-navy-500 hover:text-red-400"><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
               </div>
               <p class="text-xs text-navy-200 line-clamp-3">{{ item.content }}</p>
               <div v-if="item.sourceUrl" class="mt-2 text-[10px] text-primary-400 truncate">{{ item.sourceUrl }}</div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals (Add KB, Chat UI) omitted for brevity but functionally planned -->
  </NuxtLayout>
</template>

<script setup lang="ts">
const crawling = ref(false)
const chatsLoading = ref(true)
const kbLoading = ref(true)
const showAddModal = ref(false)

const { data: chats, refresh: refreshChats } = useFetch<any[]>('/api/admin/ai/chats', { default: () => [] })
const { data: kb, refresh: refreshKb } = useFetch<any[]>('/api/admin/ai/kb', { default: () => [] })

onMounted(() => {
  chatsLoading.value = false
  kbLoading.value = false
})

async function crawlSite() {
  if (!confirm('Start crawling site content? This will update the Knowledge Base.')) return
  crawling.value = true
  try {
    await $fetch('/api/admin/ai/crawl', { method: 'POST' })
    refreshKb()
  } catch (e) {
    alert('Crawling failed')
  } finally {
    crawling.value = false
  }
}

async function joinChat(chat: any) {
  // Logic to take over chat and open a real-time modal
  if (confirm(`Join chat with ${chat.user?.name || 'Guest User'}? AI will stop responding.`)) {
    await $fetch(`/api/admin/ai/chats/${chat.id}/status`, { 
      method: 'PATCH',
      body: { status: 'HUMAN_ACTIVE' }
    })
    refreshChats()
    // Open chat interface...
  }
}

async function deleteKb(id: string) {
  if (confirm('Delete this knowledge entry?')) {
    await $fetch(`/api/admin/ai/kb/${id}`, { method: 'DELETE' })
    refreshKb()
  }
}

function formatTime(date: any) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
