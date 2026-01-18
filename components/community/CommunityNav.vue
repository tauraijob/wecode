<template>
  <nav class="space-y-2">
    <NuxtLink
      to="/community"
      class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
      :class="isActive('/community') && !isActive('/community/mentors') && !isActive('/community/bookings')
        ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
        : 'text-navy-300 hover:bg-navy-700/50 hover:text-white'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
      <span class="font-medium">Feed</span>
    </NuxtLink>

    <NuxtLink
      to="/community/mentors"
      class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
      :class="isActive('/community/mentors')
        ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
        : 'text-navy-300 hover:bg-navy-700/50 hover:text-white'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <span class="font-medium">Browse Mentors</span>
    </NuxtLink>

    <NuxtLink
      v-if="isAuthenticated"
      to="/community/bookings"
      class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
      :class="isActive('/community/bookings')
        ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
        : 'text-navy-300 hover:bg-navy-700/50 hover:text-white'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span class="font-medium">My Bookings</span>
    </NuxtLink>

    <!-- Credits display for logged-in users -->
    <div v-if="isAuthenticated && user" class="mt-6 p-4 rounded-xl bg-navy-700/30 border border-navy-600/50">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-navy-400">Your Credits</span>
        <span class="text-xl font-bold text-accent-400">{{ user.credits || 0 }}</span>
      </div>
      <button
        @click="$emit('openTopUp')"
        class="w-full py-2 px-4 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium transition-colors"
      >
        Top Up Credits
      </button>
    </div>

    <!-- Become a Mentor CTA -->
    <div v-if="isAuthenticated && user?.role !== 'MENTOR'" class="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary-600/50 to-primary-700/50 border border-primary-500/30">
      <h4 class="font-semibold text-white mb-1">Become a Mentor</h4>
      <p class="text-xs text-navy-300 mb-3">Share your expertise and earn credits</p>
      <NuxtLink
        to="/community/become-mentor"
        class="block w-full py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium text-center transition-colors"
      >
        Apply Now
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { user, isAuthenticated } = useAuth()
const route = useRoute()

defineEmits(['openTopUp'])

const isActive = (path: string) => {
  if (path === '/community') {
    return route.path === '/community'
  }
  return route.path.startsWith(path)
}
</script>
