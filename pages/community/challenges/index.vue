<template>
  <div class="max-w-5xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          Coding Challenges
        </h1>
        <p class="text-xs text-slate-500 mt-0.5">Sharpen your skills with weekly coding challenges</p>
      </div>
      <button
        v-if="canCreate"
        @click="showCreateModal = true"
        class="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-xs font-medium transition-all shadow-sm"
      >
        + New Challenge
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-5 bg-slate-100 rounded-lg p-0.5 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        class="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="i in 3" :key="i" class="rounded-xl bg-white border border-slate-200 p-5 animate-pulse">
        <div class="h-4 bg-slate-200 rounded w-2/3 mb-3"></div>
        <div class="h-3 bg-slate-100 rounded w-full mb-2"></div>
      </div>
    </div>

    <!-- Challenges Grid -->
    <div v-else-if="challenges?.length" class="grid gap-4 md:grid-cols-2">
      <div
        v-for="challenge in challenges"
        :key="challenge.id"
        class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-5">
          <!-- Difficulty & Status -->
          <div class="flex items-center gap-2 mb-3">
            <span
              :class="difficultyClass(challenge.difficulty)"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            >
              <svg v-if="challenge.difficulty === 'EASY'" class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /></svg>
              <svg v-else-if="challenge.difficulty === 'MEDIUM'" class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /></svg>
              <svg v-else class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /></svg>
              {{ challenge.difficulty === 'EASY' ? 'Easy' : challenge.difficulty === 'MEDIUM' ? 'Medium' : 'Hard' }}
            </span>
            <span :class="isActive(challenge) ? 'bg-green-100 text-green-700' : isUpcoming(challenge) ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold">
              <svg v-if="isActive(challenge)" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <svg v-else-if="isUpcoming(challenge)" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              {{ isActive(challenge) ? 'Active' : isUpcoming(challenge) ? 'Upcoming' : 'Ended' }}
            </span>
          </div>

          <h3 class="text-sm font-bold text-slate-900 mb-1.5">{{ challenge.title }}</h3>
          <p class="text-xs text-slate-500 mb-3 line-clamp-2">{{ challenge.description }}</p>

          <!-- Details -->
          <div class="space-y-1.5 mb-4">
            <div class="flex items-center gap-2 text-xs text-slate-600">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span v-if="isActive(challenge)">Ends {{ formatRelative(challenge.endsAt) }}</span>
              <span v-else-if="isUpcoming(challenge)">Starts {{ formatRelative(challenge.startsAt) }}</span>
              <span v-else>Ended {{ formatDate(challenge.endsAt) }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-600">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              {{ challenge.submissionCount }} submissions
            </div>
          </div>

          <!-- Tags -->
          <div v-if="challenge.tags" class="flex flex-wrap gap-1 mb-4">
            <span v-for="tag in challenge.tags.split(',')" :key="tag" class="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500">{{ tag.trim() }}</span>
          </div>

          <NuxtLink
            :to="`/community/challenges/${challenge.id}`"
            class="block w-full py-2 rounded-lg text-xs font-medium text-center transition-colors border"
            :class="isActive(challenge) ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-transparent hover:from-primary-600 hover:to-primary-700' : 'bg-primary-50 hover:bg-primary-100 text-primary-700 border-primary-200'"
          >
            {{ isActive(challenge) ? 'Take Challenge →' : 'View Details →' }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
      </div>
      <h3 class="text-sm font-semibold text-slate-900 mb-1">No challenges yet</h3>
      <p class="text-xs text-slate-500">Check back soon for exciting coding challenges!</p>
    </div>

    <!-- Create Challenge Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="showCreateModal = false">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-900">Create Challenge</h2>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form @submit.prevent="createChallenge" class="p-5 space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Title *</label>
            <input v-model="newChallenge.title" required class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Description *</label>
            <textarea v-model="newChallenge.description" required rows="4" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none resize-none" placeholder="Describe the challenge, include examples..."></textarea>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Difficulty</label>
              <select v-model="newChallenge.difficulty" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 outline-none">
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Start *</label>
              <input v-model="newChallenge.startsAt" type="datetime-local" required class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">End *</label>
              <input v-model="newChallenge.endsAt" type="datetime-local" required class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Tags</label>
            <input v-model="newChallenge.tags" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 outline-none" placeholder="javascript, algorithms" />
          </div>
          <button type="submit" :disabled="creating" class="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium transition-all disabled:opacity-50">
            {{ creating ? 'Creating...' : 'Create Challenge' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'community' })
useHead({ title: 'Coding Challenges - WeCode Community' })

const { user } = useAuth()
const canCreate = computed(() => user.value && ['ADMIN', 'COMMUNITY_ADMIN'].includes(user.value.role))

const tabs = [
  { key: 'active', label: 'Active' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' }
]
const activeTab = ref('active')
const showCreateModal = ref(false)
const creating = ref(false)
const newChallenge = ref({ title: '', description: '', difficulty: 'MEDIUM', startsAt: '', endsAt: '', tags: '' })

const { data, pending, refresh } = useFetch('/api/community/challenges', {
  query: computed(() => ({ status: activeTab.value })),
  watch: [activeTab]
})
const challenges = computed(() => (data.value as any)?.challenges || [])

const now = new Date()
const isActive = (c: any) => new Date(c.startsAt) <= now && new Date(c.endsAt) >= now
const isUpcoming = (c: any) => new Date(c.startsAt) > now

const difficultyClass = (d: string) => {
  if (d === 'EASY') return 'bg-green-100 text-green-700'
  if (d === 'MEDIUM') return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const formatRelative = (d: string) => {
  const diff = new Date(d).getTime() - Date.now()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  if (days > 0) return `in ${days}d ${hours}h`
  if (hours > 0) return `in ${hours}h`
  return 'soon'
}

const createChallenge = async () => {
  creating.value = true
  try {
    await $fetch('/api/community/challenges', { method: 'POST', body: newChallenge.value })
    showCreateModal.value = false
    newChallenge.value = { title: '', description: '', difficulty: 'MEDIUM', startsAt: '', endsAt: '', tags: '' }
    refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to create challenge')
  } finally {
    creating.value = false
  }
}
</script>
