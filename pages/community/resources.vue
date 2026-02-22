<template>
  <div class="max-w-5xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Resource Library
        </h1>
        <p class="text-xs text-slate-500 mt-0.5">Curated learning resources shared by the community</p>
      </div>
      <button
        v-if="user"
        @click="showCreateModal = true"
        class="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-xs font-medium transition-all shadow-sm"
      >
        + Share Resource
      </button>
    </div>

    <!-- Category Filter -->
    <div class="flex flex-wrap gap-1.5 mb-5">
      <button
        @click="activeCategory = 'all'"
        :class="activeCategory === 'all' ? 'bg-primary-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
        class="px-3 py-1.5 rounded-full text-[10px] font-medium transition-all"
      >
        All
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        @click="activeCategory = cat"
        :class="activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
        class="px-3 py-1.5 rounded-full text-[10px] font-medium transition-all"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="i in 4" :key="i" class="rounded-xl bg-white border border-slate-200 p-4 animate-pulse flex gap-4">
        <div class="w-10 h-10 bg-slate-200 rounded-lg"></div>
        <div class="flex-1"><div class="h-3 bg-slate-200 rounded w-1/2 mb-2"></div><div class="h-3 bg-slate-100 rounded w-full"></div></div>
      </div>
    </div>

    <!-- Resources List -->
    <div v-else-if="resources?.length" class="space-y-3">
      <div
        v-for="resource in resources"
        :key="resource.id"
        class="rounded-xl bg-white border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow flex gap-4"
      >
        <!-- Upvote -->
        <div class="flex flex-col items-center gap-0.5">
          <button
            v-if="user"
            @click="upvote(resource.id)"
            class="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 text-slate-400 border-slate-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
          </button>
          <span class="text-xs font-bold text-slate-700">{{ resource.upvoteCount }}</span>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500 font-medium">{{ resource.category }}</span>
          </div>
          <a :href="resource.url" target="_blank" class="text-sm font-semibold text-slate-900 hover:text-primary-600 transition-colors block truncate">
            {{ resource.title }}
            <svg class="w-3 h-3 inline-block ml-0.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
          <p v-if="resource.description" class="text-xs text-slate-500 mt-0.5 line-clamp-2">{{ resource.description }}</p>
          <div class="text-[10px] text-slate-400 mt-1.5">
            Shared by {{ resource.author?.name }} · {{ formatDate(resource.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
      </div>
      <h3 class="text-sm font-semibold text-slate-900 mb-1">No resources yet</h3>
      <p class="text-xs text-slate-500">Be the first to share a helpful resource!</p>
    </div>

    <!-- Create Resource Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="showCreateModal = false">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-900">Share a Resource</h2>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form @submit.prevent="createResource" class="p-5 space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Title *</label>
            <input v-model="newResource.title" required class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="React Official Documentation" />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">URL *</label>
            <input v-model="newResource.url" type="url" required class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="https://..." />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Category *</label>
            <select v-model="newResource.category" required class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 outline-none">
              <option value="">Select...</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Documentation">Documentation</option>
              <option value="Tool">Tool</option>
              <option value="Article">Article</option>
              <option value="Video">Video</option>
              <option value="Course">Course</option>
              <option value="Book">Book</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Description</label>
            <textarea v-model="newResource.description" rows="2" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 outline-none resize-none" placeholder="A brief description..."></textarea>
          </div>
          <button type="submit" :disabled="creating" class="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium transition-all disabled:opacity-50">
            {{ creating ? 'Sharing...' : 'Share Resource' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'community' })
useHead({ title: 'Resource Library - WeCode Community' })

const { user } = useAuth()
const activeCategory = ref('all')
const showCreateModal = ref(false)
const creating = ref(false)
const newResource = ref({ title: '', url: '', category: '', description: '' })

const { data, pending, refresh } = useFetch('/api/community/resources', {
  query: computed(() => ({ category: activeCategory.value })),
  watch: [activeCategory]
})

const resources = computed(() => (data.value as any)?.resources || [])
const categories = computed(() => (data.value as any)?.categories || [])

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const upvote = async (id: string) => {
  try {
    await $fetch(`/api/community/resources/${id}/upvote`, { method: 'POST' })
    refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to upvote')
  }
}

const createResource = async () => {
  creating.value = true
  try {
    await $fetch('/api/community/resources', { method: 'POST', body: newResource.value })
    showCreateModal.value = false
    newResource.value = { title: '', url: '', category: '', description: '' }
    refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to share resource')
  } finally {
    creating.value = false
  }
}
</script>
