<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr] bg-slate-50 text-slate-900">
    <!-- Sidebar -->
    <aside class="hidden md:block border-r border-slate-200 bg-white">
      <div class="flex items-center gap-2 p-3 border-b border-slate-200">
        <div
          v-if="logoUrl"
          class="inline-flex items-center justify-center rounded-lg px-1.5 py-0.5"
        >
          <img
            :src="logoUrl"
            alt="WeCodeZW Logo"
            class="h-8 w-auto object-contain"
          />
        </div>
        <span v-else class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 font-semibold text-white text-sm">WZ</span>
        <div>
          <div class="font-semibold text-slate-900 text-sm">Admin Panel</div>
          <div class="text-[10px] text-slate-500">Community Management</div>
        </div>
      </div>
      
      <nav class="mt-1.5 space-y-0.5 px-2">
        <div class="pt-1.5 pb-0.5">
          <div class="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Management</div>
        </div>
        
        <NuxtLink to="/community/admin" :class="navClass('/community/admin', true)">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Dashboard</span>
        </NuxtLink>

        <NuxtLink to="/community/admin/users" :class="navClass('/community/admin/users')">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Users</span>
        </NuxtLink>

        <NuxtLink to="/community/admin/mentors" :class="navClass('/community/admin/mentors')">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span>Mentor Applications</span>
          <span v-if="pendingMentors > 0" class="ml-auto bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{{ pendingMentors }}</span>
        </NuxtLink>

        <NuxtLink to="/community/admin/payouts" :class="navClass('/community/admin/payouts')">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Payouts</span>
          <span v-if="pendingPayouts > 0" class="ml-auto bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{{ pendingPayouts }}</span>
        </NuxtLink>

        <NuxtLink to="/community/admin/coupons" :class="navClass('/community/admin/coupons')">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span>Coupons</span>
        </NuxtLink>

        <NuxtLink to="/community/admin/events" :class="navClass('/community/admin/events')">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Events</span>
        </NuxtLink>

        <NuxtLink to="/community/admin/ai" :class="navClass('/community/admin/ai')">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Tau AI</span>
        </NuxtLink>

        <!-- Quick Links -->
        <div class="pt-3 pb-0.5">
          <div class="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Quick Links</div>
        </div>

        <NuxtLink to="/community" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Community</span>
        </NuxtLink>

        <NuxtLink v-if="user?.role === 'ADMIN'" to="/admin" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Main Admin</span>
        </NuxtLink>
      </nav>
    </aside>
    
    <div class="flex flex-col">
      <!-- Header -->
      <header class="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-3 py-2 backdrop-blur-lg">
        <div class="md:hidden">
          <button @click="open = !open" class="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs hover:bg-slate-50 transition-colors">
            <svg class="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <div class="flex-1 flex items-center gap-3 ml-3">
          <span class="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">Community Admin</span>
        </div>
        
        <div class="flex items-center gap-2 text-xs">
          <div class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 border border-slate-200">
            <div class="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-[9px] font-semibold text-white">
              {{ user?.name?.charAt(0).toUpperCase() || 'A' }}
            </div>
            <span class="hidden sm:inline text-slate-700 text-xs">{{ user?.name || 'Admin' }}</span>
          </div>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="flex-1 overflow-auto bg-slate-50 p-4">
        <slot />
      </main>
    </div>

    <!-- Mobile Sidebar -->
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-40 grid md:hidden">
        <div class="bg-black/30" @click="open=false"></div>
        <div class="absolute left-0 top-0 h-full w-60 border-r border-slate-200 bg-white p-3 overflow-y-auto">
          <div class="mb-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div
                v-if="logoUrl"
                class="inline-flex items-center justify-center rounded-lg px-1.5 py-0.5"
              >
              <img :src="logoUrl" alt="WeCodeZW Logo" class="h-8 w-auto object-contain" />
              </div>
              <span v-else class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 font-semibold text-white text-sm">WZ</span>
              <div class="text-sm font-semibold text-slate-900">Community Admin</div>
            </div>
            <button @click="open=false" class="rounded p-0.5 hover:bg-slate-100">
              <svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Mobile Nav Links -->
          <nav class="space-y-0.5">
            <div class="pt-1.5 pb-0.5">
              <div class="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Management</div>
            </div>
            <NuxtLink @click="open=false" to="/community/admin" :class="navClass('/community/admin', true)">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </NuxtLink>
            <NuxtLink @click="open=false" to="/community/admin/users" :class="navClass('/community/admin/users')">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Users</span>
            </NuxtLink>
            <NuxtLink @click="open=false" to="/community/admin/mentors" :class="navClass('/community/admin/mentors')">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Mentors</span>
            </NuxtLink>
            <NuxtLink @click="open=false" to="/community/admin/payouts" :class="navClass('/community/admin/payouts')">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Payouts</span>
            </NuxtLink>
            <NuxtLink @click="open=false" to="/community/admin/coupons" :class="navClass('/community/admin/coupons')">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span>Coupons</span>
            </NuxtLink>
            <NuxtLink @click="open=false" to="/community/admin/events" :class="navClass('/community/admin/events')">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Events</span>
            </NuxtLink>
            
            <div class="pt-3 pb-0.5">
              <div class="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Quick Links</div>
            </div>
            <NuxtLink @click="open=false" to="/community" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Community</span>
            </NuxtLink>
          </nav>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { user } = useAuth()
const { logoUrl } = useLogo()
const open = ref(false)

// Fetch pending counts for sidebar badges
const { data: stats } = useFetch<any>('/api/admin/community/stats', {
  default: () => ({ mentors: { pending: 0 }, payouts: { pending: 0 } })
})

const pendingMentors = computed(() => Number(stats.value?.mentors?.pending) || 0)
const pendingPayouts = computed(() => Number(stats.value?.payouts?.pending) || 0)

function isActive(path: string, exact = false) {
  if (exact) {
    return route.path === path
  }
  return route.path.startsWith(path)
}

function navClass(path: string, exact = false) {
  const base = 'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors'
  return isActive(path, exact)
    ? `${base} bg-primary-50 border border-primary-200 text-primary-700 font-medium`
    : `${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900`
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
