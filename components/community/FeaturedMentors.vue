<template>
  <div class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
    <!-- Header with gradient -->
    <div class="p-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
      <h3 class="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
        <div class="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        Top Mentors
      </h3>
    </div>

    <div v-if="pending" class="p-3 space-y-3">
      <div v-for="i in 3" :key="i" class="animate-pulse flex items-center gap-2">
        <div class="w-9 h-9 rounded-full bg-slate-200"></div>
        <div class="flex-1">
          <div class="h-3 bg-slate-200 rounded w-2/3 mb-1"></div>
          <div class="h-2.5 bg-slate-100 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="mentors.length === 0" class="p-4 text-center">
      <p class="text-slate-500 text-xs">No mentors available</p>
    </div>

    <div v-else class="divide-y divide-slate-100">
      <NuxtLink
        v-for="(mentor, index) in mentors"
        :key="mentor.id"
        :to="`/community/mentors/${mentor.id}`"
        class="flex items-center gap-2.5 p-3 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all group"
      >
        <!-- Rank badge -->
        <div
          class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
          :class="{
            'bg-amber-100 text-amber-600': index === 0,
            'bg-slate-200 text-slate-600': index === 1,
            'bg-orange-100 text-orange-600': index === 2
          }"
        >
          {{ index + 1 }}
        </div>

        <!-- Avatar -->
        <div class="relative flex-shrink-0">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
            {{ getInitials(mentor.name) }}
          </div>
          <div
            v-if="mentor.verified"
            class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white"
          >
            <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1">
            <span class="text-xs font-medium text-slate-800 group-hover:text-primary-600 transition-colors truncate">
              {{ mentor.name }}
            </span>
            <span v-if="mentor.verified" class="text-[8px] text-emerald-600 font-medium">✓</span>
          </div>
          <div class="flex items-center gap-2 text-[10px] text-slate-500">
            <span>{{ mentor.sessionsCount }} sessions</span>
            <span class="text-primary-500 font-medium">{{ mentor.hourlyRate }} cr/hr</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Footer -->
    <div class="p-2.5 border-t border-slate-100 bg-slate-50/50">
      <NuxtLink
        to="/community/mentors"
        class="flex items-center justify-center gap-1 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-primary-600 text-xs font-medium transition-all group"
      >
        View All Mentors
        <svg class="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FeaturedMentor {
  id: string
  userId: string
  name: string
  bio: string
  skills: string[]
  hourlyRate: number
  verified: boolean
  sessionsCount: number
}

const { data: mentors, pending } = useFetch<FeaturedMentor[]>('/api/community/mentors/featured', {
  default: () => []
})

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}
</script>
