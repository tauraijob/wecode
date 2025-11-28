<template>
  <div class="min-h-screen flex bg-navy-950 text-white">
    <aside class="hidden md:flex md:flex-col md:w-[260px] md:flex-shrink-0 border-r border-navy-800 bg-navy-900/30 sticky top-0 h-screen overflow-y-auto">
      <div class="flex items-center gap-3 p-4">
        <span class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-navy-700 font-semibold">WZ</span>
        <div class="font-semibold tracking-tight">WeCodeZW Admin</div>
      </div>
      <nav class="mt-2 space-y-1 px-2">
        <NuxtLink :to="'/admin'" :class="navClass('/admin')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </NuxtLink>
        <div class="pt-2 pb-1">
          <div class="px-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">E-Learning</div>
        </div>
        <NuxtLink :to="'/admin/courses'" :class="navClass('/admin/courses')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>Courses</span>
        </NuxtLink>
        <NuxtLink :to="'/admin/courses/enrollments'" :class="navClass('/admin/courses/enrollments')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Enrollments</span>
        </NuxtLink>
        <NuxtLink :to="'/admin/courses/analytics'" :class="navClass('/admin/courses/analytics')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Analytics</span>
        </NuxtLink>
        <NuxtLink :to="'/admin/courses/certificates'" :class="navClass('/admin/courses/certificates')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span>Certificates</span>
        </NuxtLink>
        <div class="pt-2 pb-1">
          <div class="px-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">General</div>
        </div>
        <NuxtLink :to="'/admin/users'" :class="navClass('/admin/users')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Users</span>
        </NuxtLink>
        <NuxtLink :to="'/admin/schools'" :class="navClass('/admin/schools')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>Schools</span>
        </NuxtLink>
        <NuxtLink :to="'/admin/clubs'" :class="navClass('/admin/clubs')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Clubs</span>
        </NuxtLink>
        <NuxtLink :to="'/admin/requests'" :class="navClass('/admin/requests')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Requests</span>
        </NuxtLink>
        <NuxtLink :to="'/admin/quotes'" :class="navClass('/admin/quotes')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Quotes</span>
        </NuxtLink>
        <NuxtLink :to="'/admin/billing'" :class="navClass('/admin/billing')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>Billing</span>
        </NuxtLink>
      </nav>
    </aside>
    <div class="flex-1 flex flex-col min-w-0">
      <header class="sticky top-0 z-30 flex items-center justify-between border-b border-navy-800 bg-navy-950/60 px-4 py-3 backdrop-blur">
        <div class="md:hidden">
          <button @click="open = !open" class="rounded-md bg-white/10 px-2 py-1 text-sm hover:bg-white/15">Menu</button>
        </div>
        <div class="text-sm text-navy-200">Admin</div>
        <div class="flex items-center gap-3 text-sm">
          <div class="text-navy-300">{{ me?.name }} ({{ me?.role }})</div>
          <NuxtLink to="/" class="rounded-md bg-white/10 px-2 py-1 hover:bg-white/15">View site</NuxtLink>
          <button @click="onLogout" class="rounded-md bg-white/10 px-2 py-1 hover:bg-white/15">Logout</button>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>

    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-40 grid md:hidden">
        <div class="bg-black/50" @click="open=false"></div>
        <div class="absolute left-0 top-0 h-full w-72 border-r border-navy-800 bg-navy-900/95 p-4">
          <div class="mb-4 flex items-center gap-3">
            <span class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-navy-700 font-semibold">WZ</span>
            <div class="text-xl font-semibold">WeCodeZW</div>
          </div>
          <nav class="space-y-1">
            <NuxtLink @click="open=false" :to="'/admin'" :class="navClass('/admin')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </NuxtLink>
            <div class="pt-2 pb-1">
              <div class="px-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">E-Learning</div>
            </div>
            <NuxtLink @click="open=false" :to="'/admin/courses'" :class="navClass('/admin/courses')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Courses</span>
            </NuxtLink>
            <NuxtLink @click="open=false" :to="'/admin/courses/enrollments'" :class="navClass('/admin/courses/enrollments')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Enrollments</span>
            </NuxtLink>
            <NuxtLink @click="open=false" :to="'/admin/courses/analytics'" :class="navClass('/admin/courses/analytics')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Analytics</span>
            </NuxtLink>
            <NuxtLink @click="open=false" :to="'/admin/courses/certificates'" :class="navClass('/admin/courses/certificates')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>Certificates</span>
            </NuxtLink>
            <div class="pt-2 pb-1">
              <div class="px-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">General</div>
            </div>
            <NuxtLink @click="open=false" :to="'/admin/users'" :class="navClass('/admin/users')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Users</span>
            </NuxtLink>
            <NuxtLink @click="open=false" :to="'/admin/schools'" :class="navClass('/admin/schools')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Schools</span>
            </NuxtLink>
            <NuxtLink @click="open=false" :to="'/admin/clubs'" :class="navClass('/admin/clubs')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Clubs</span>
            </NuxtLink>
            <NuxtLink @click="open=false" :to="'/admin/requests'" :class="navClass('/admin/requests')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Requests</span>
            </NuxtLink>
            <NuxtLink @click="open=false" :to="'/admin/quotes'" :class="navClass('/admin/quotes')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Quotes</span>
            </NuxtLink>
            <NuxtLink @click="open=false" :to="'/admin/billing'" :class="navClass('/admin/billing')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Billing</span>
            </NuxtLink>
          </nav>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const { user: me } = useAuth()
if (!me.value || me.value.role !== 'ADMIN') {
  await navigateTo('/dashboard')
}

const open = ref(false)
const route = useRoute()

function isActive(path: string) {
  if (path.includes('#')) {
    const [p, h] = path.split('#')
    return route.path === p && route.hash === `#${h}`
  }
  return route.path.startsWith(path)
}

function navClass(path: string) {
  const base = 'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10'
  return isActive(path) ? `${base} bg-white/10 ring-1 ring-white/10` : `${base} text-navy-200`
}
async function onLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
  await navigateTo('/auth/login')
}
</script>

