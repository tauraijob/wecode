<template>
  <div class="min-h-screen bg-slate-50">
    <section class="mx-auto max-w-6xl px-3 py-5">
      <!-- Header -->
      <div class="mb-5">
        <div class="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <NuxtLink to="/community" class="hover:text-primary-600 transition-colors">Community</NuxtLink>
          <span>/</span>
          <span class="text-slate-900">Browse Mentors</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Find a Mentor
        </h1>
        <p class="mt-1 text-xs text-slate-500">Connect with experienced professionals</p>
      </div>

      <!-- Search & Filters -->
      <div class="mb-5 flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by skill..."
            class="w-full pl-9 pr-3 py-2 rounded-md bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors text-xs"
          />
        </div>
        <select
          v-model="sortBy"
          class="px-3 py-2 rounded-md bg-white border border-slate-300 text-slate-700 focus:border-primary-500 outline-none text-xs"
        >
          <option value="default">Sort: Recommended</option>
          <option value="sessions">Most Sessions</option>
          <option value="rate-low">Rate: Low to High</option>
          <option value="rate-high">Rate: High to Low</option>
        </select>
      </div>

      <!-- Mentors Grid -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="p-4 rounded-lg bg-white border border-slate-200 shadow-sm animate-pulse">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-slate-200"></div>
            <div class="flex-1">
              <div class="h-4 bg-slate-200 rounded w-2/3 mb-1.5"></div>
              <div class="h-3 bg-slate-100 rounded w-1/2 mb-2"></div>
              <div class="h-12 bg-slate-100 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!mentors?.length" class="p-8 rounded-lg bg-white border border-slate-200 text-center">
        <svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-sm font-semibold text-slate-900 mb-1">No mentors found</h3>
        <p class="text-slate-500 text-xs">Try adjusting your search</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MentorCard
          v-for="mentor in sortedMentors"
          :key="mentor.id"
          :mentor="mentor"
          @open-top-up-modal="openTopUp"
          @book="handleQuickBook"
        />
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="mt-5 flex justify-center gap-1.5">
        <button
          v-for="p in pagination.totalPages"
          :key="p"
          @click="page = p"
          class="px-3 py-1.5 rounded-md transition-colors text-xs"
          :class="page === p ? 'bg-primary-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
        >
          {{ p }}
        </button>
      </div>
    </section>

    <!-- Top Up Modal -->
    <TopUpModal v-model="showTopUpModal" :shortfall="creditShortfall" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community'
})

interface Mentor {
  id: string
  userId: string
  name: string
  bio: string
  skills: string[]
  hourlyRate: number
  available: boolean
  verified: boolean
  sessionsCount: number
}

const page = ref(1)
const searchQuery = ref('')
const sortBy = ref('default')
const showTopUpModal = ref(false)
const creditShortfall = ref(0)

const { data, pending } = useFetch<{ mentors: Mentor[], pagination: any }>('/api/community/mentors', {
  query: { page, skill: searchQuery },
  watch: [page]
})

const mentors = computed(() => data.value?.mentors || [])
const pagination = computed(() => data.value?.pagination)

const sortedMentors = computed(() => {
  const list = [...mentors.value]
  switch (sortBy.value) {
    case 'sessions':
      return list.sort((a, b) => b.sessionsCount - a.sessionsCount)
    case 'rate-low':
      return list.sort((a, b) => a.hourlyRate - b.hourlyRate)
    case 'rate-high':
      return list.sort((a, b) => b.hourlyRate - a.hourlyRate)
    default:
      return list
  }
})

const openTopUp = () => {
  showTopUpModal.value = true
}

const handleQuickBook = (mentor: Mentor) => {
  navigateTo(`/community/mentors/${mentor.id}`)
}
</script>
