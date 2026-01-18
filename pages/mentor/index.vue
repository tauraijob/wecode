<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">Mentor Dashboard</h1>
      <p class="text-slate-600">Manage your mentorship sessions and earnings</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <NuxtLink to="/mentor/sessions" class="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-primary-300 hover:shadow-md transition-all">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 rounded-lg bg-primary-100">
            <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">This Month</span>
        </div>
        <div class="text-2xl font-bold text-slate-900">{{ stats?.sessionsThisMonth || 0 }}</div>
        <div class="text-sm text-slate-500">Sessions Completed</div>
      </NuxtLink>

      <div class="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 rounded-lg bg-primary-100">
            <svg class="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span class="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">Total</span>
        </div>
        <div class="text-2xl font-bold text-slate-900">{{ profile?.sessionsCount || 0 }}</div>
        <div class="text-sm text-slate-500">Total Sessions</div>
      </div>

      <NuxtLink to="/mentor/earnings" class="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-amber-300 hover:shadow-md transition-all">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 rounded-lg bg-amber-100">
            <svg class="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">Earned</span>
        </div>
        <div class="text-2xl font-bold text-slate-900">{{ stats?.creditsEarned || 0 }}</div>
        <div class="text-sm text-slate-500">Credits Earned</div>
      </NuxtLink>

      <div class="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2 rounded-lg bg-blue-100">
            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span
            :class="profile?.verified ? 'text-primary-600' : 'text-slate-400'"
            class="text-2xl font-bold"
          >
            {{ profile?.verified ? 'Verified' : 'Pending' }}
          </span>
          <svg v-if="profile?.verified" class="h-6 w-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="text-sm text-slate-500">Verification Status</div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Upcoming Sessions -->
      <div class="lg:col-span-2 rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">Upcoming Sessions</h2>
          <NuxtLink to="/mentor/sessions" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </NuxtLink>
        </div>
        
        <div v-if="upcomingLoading" class="p-8 text-center">
          <div class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-r-transparent"></div>
        </div>

        <div v-else-if="!upcomingSessions?.length" class="p-8 text-center">
          <svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-slate-500">No upcoming sessions</p>
        </div>

        <div v-else class="divide-y divide-slate-100">
          <div v-for="session in upcomingSessions" :key="session.id" class="p-5 hover:bg-slate-50 transition-colors">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-medium text-sm">
                  {{ getInitials(session.clientName) }}
                </div>
                <div>
                  <h3 class="font-medium text-slate-900">{{ session.clientName }}</h3>
                  <p class="text-sm text-slate-500">{{ formatDateTime(session.scheduledAt) }}</p>
                  <p v-if="session.notes" class="text-sm text-slate-400 mt-1 line-clamp-1">{{ session.notes }}</p>
                </div>
              </div>
              <div class="text-right">
                <span class="text-sm font-medium text-primary-600">{{ session.duration }} min</span>
                <p class="text-xs text-slate-400">{{ session.creditsCost }} credits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Summary -->
      <div class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100">
          <h2 class="text-lg font-semibold text-slate-900">Your Profile</h2>
        </div>
        
        <div class="p-5">
          <div class="text-center mb-4">
            <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold">
              {{ user?.name?.charAt(0).toUpperCase() || 'M' }}
            </div>
            <h3 class="mt-3 font-semibold text-slate-900">{{ user?.name }}</h3>
            <div class="flex items-center justify-center gap-1 mt-1">
              <span
                v-if="profile?.verified"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-medium"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Verified Mentor
              </span>
              <span v-else class="text-xs text-slate-500">Pending Verification</span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Hourly Rate</span>
              <span class="font-medium text-slate-900">{{ profile?.hourlyRate || 0 }} credits</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Availability</span>
              <span :class="profile?.available ? 'text-primary-600' : 'text-slate-400'" class="font-medium">
                {{ profile?.available ? 'Available' : 'Unavailable' }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">Skills</span>
              <span class="font-medium text-slate-900 text-right max-w-32 truncate">{{ skillsDisplay }}</span>
            </div>
          </div>

          <NuxtLink
            to="/mentor/profile"
            class="mt-4 block w-full py-2.5 px-4 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-medium text-center transition-colors"
          >
            Edit Profile
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community',
  middleware: ['auth']
})

const { user } = useAuth()

// Fetch mentor profile
const { data: profile } = useFetch('/api/community/mentors/me', {
  default: () => null
})

// Fetch upcoming sessions
const { data: upcomingSessions, pending: upcomingLoading } = useFetch('/api/community/bookings', {
  query: { type: 'mentor', status: 'CONFIRMED', limit: 5 },
  default: () => []
})

// Mock stats (in real app, this would come from an API)
const stats = computed(() => ({
  sessionsThisMonth: 8,
  creditsEarned: profile.value?.sessionsCount ? profile.value.sessionsCount * 50 : 0
}))

const skillsDisplay = computed(() => {
  if (!profile.value?.skills) return 'No skills added'
  const skills = profile.value.skills.split(',')
  return skills.slice(0, 2).join(', ') + (skills.length > 2 ? ` +${skills.length - 2}` : '')
})

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
</script>
