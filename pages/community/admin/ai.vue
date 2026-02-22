<template>
  <NuxtLayout name="community-admin">
    <div class="space-y-6">
      <!-- Header -->
      <div class="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-xl font-bold text-slate-900 flex items-center gap-2">
              <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Tau AI Management
            </h1>
            <p class="text-sm text-slate-500 mt-1">Manage Tau AI and community support chats.</p>
          </div>
          <div class="flex gap-2">
            <button 
              @click="crawlSite" 
              :disabled="crawling"
              class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <svg :class="{ 'animate-spin': crawling }" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              {{ crawling ? 'Updating KB...' : 'Sync KB' }}
            </button>
            <button 
              @click="showAddModal = true"
              class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 transition-all shadow-md"
            >
              Train Tau
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Live Chats -->
        <div class="lg:col-span-2 space-y-4">
          <h2 class="text-sm font-semibold text-slate-900 uppercase tracking-wider px-1">Active Support Chats</h2>
          
          <div v-if="chatsLoading" class="p-12 text-center bg-white rounded-2xl border border-slate-200">
             <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-r-transparent"></div>
          </div>

          <div v-else-if="chats.length === 0" class="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            No active chats in the community hub.
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="chat in chats" 
              :key="chat.id" 
              class="group bg-white rounded-2xl border border-slate-200 p-4 transition-all hover:shadow-md"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold">
                    {{ chat.user?.name?.charAt(0) || 'G' }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-slate-900 text-sm">{{ chat.user?.name || 'Guest User' }}</span>
                      <span :class="chat.status === 'HUMAN_ACTIVE' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-green-100 text-green-700 border-green-200'" class="rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase">
                        {{ chat.status === 'HUMAN_ACTIVE' ? 'Admin Joined' : 'AI Handled' }}
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-500">{{ chat.user?.email || 'External Link Cache' }}</div>
                  </div>
                </div>
                <button 
                  @click="joinChat(chat)"
                  class="rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Enter Chat
                </button>
              </div>
              <div class="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                “{{ chat.messages[0]?.content }}”
              </div>
            </div>
          </div>
        </div>

        <!-- Knowledge Items -->
        <div class="space-y-4">
          <h2 class="text-sm font-semibold text-slate-900 uppercase tracking-wider px-1">Tau Knowledge</h2>
          
          <div class="space-y-3">
             <div 
              v-for="item in kb.slice(0, 10)" 
              :key="item.id"
              class="bg-white rounded-xl border border-slate-200 p-3"
             >
               <div class="flex items-center justify-between mb-1.5">
                 <span class="text-[9px] font-bold text-slate-400 uppercase">{{ item.isManual ? 'Manual' : 'Sync' }}</span>
                 <button @click="deleteKb(item.id)" class="text-slate-400 hover:text-red-500 transition-colors"><svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
               </div>
               <p class="text-[11px] text-slate-700 line-clamp-2 leading-relaxed">{{ item.content }}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const crawling = ref(false)
const chatsLoading = ref(true)
const showAddModal = ref(false)

const { data: chats, refresh: refreshChats } = useFetch<any[]>('/api/admin/ai/chats', { default: () => [] })
const { data: kb, refresh: refreshKb } = useFetch<any[]>('/api/admin/ai/kb', { default: () => [] })

onMounted(() => {
  chatsLoading.value = false
})

async function crawlSite() {
  crawling.value = true
  try {
    await $fetch('/api/admin/ai/crawl', { method: 'POST' })
    refreshKb()
  } catch (e) {
    alert('Failed to sync Knowledge Base')
  } finally {
    crawling.value = false
  }
}

async function joinChat(chat: any) {
  if (confirm(`Join support session with ${chat.user?.name || 'Guest'}?`)) {
    await $fetch(`/api/admin/ai/chats/${chat.id}/status`, { 
      method: 'PATCH',
      body: { status: 'HUMAN_ACTIVE' }
    })
    refreshChats()
  }
}

async function deleteKb(id: string) {
  if (confirm('Permanently remove this knowledge?')) {
    await $fetch(`/api/admin/ai/kb/${id}`, { method: 'DELETE' })
    refreshKb()
  }
}
</script>
