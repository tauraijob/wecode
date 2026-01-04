<template>
  <div class="min-h-screen bg-cream-50 text-gray-900">
    <header class="sticky top-0 z-40 border-b border-cream-300/60 bg-surface-50/95 backdrop-blur-md shadow-sm">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 py-3">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold tracking-tight">
          <div
            v-if="logoUrl"
            class="inline-flex items-center justify-center rounded-xl px-2 py-1"
          >
            <img
              :src="logoUrl"
              alt="WeCodeZW Logo"
              class="h-10 sm:h-12 md:h-14 w-auto object-contain"
              @error="logoUrl = null"
            />
          </div>
          <!-- Fallback Text Logo -->
          <template v-else>
            <span class="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 text-sm sm:text-base font-bold text-white shadow-md">WZ</span>
            <span class="hidden xs:inline font-semibold text-gray-900">WeCodeZW</span>
          </template>
        </NuxtLink>
        <nav class="hidden items-center gap-2 lg:gap-3 xl:flex">
          <NuxtLink 
            to="/" 
            :class="route.path === '/' ? 'bg-primary-50 text-primary-700 border-primary-200' : 'hover:bg-cream-100 text-gray-700 border-transparent'"
            class="rounded-lg border px-3 py-1.5 text-sm lg:text-base transition-all font-medium"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            v-if="me" 
            to="/courses" 
            :class="route.path.startsWith('/courses') ? 'bg-primary-50 text-primary-700 border-primary-200' : 'hover:bg-cream-100 text-gray-700 border-transparent'"
            class="rounded-lg border px-3 py-1.5 text-sm lg:text-base transition-all font-medium"
          >
            Courses
          </NuxtLink>
          <NuxtLink 
            v-if="me?.role === 'STUDENT'" 
            to="/dashboard/learn" 
            :class="route.path.startsWith('/dashboard/learn') ? 'bg-primary-50 text-primary-700 border-primary-200' : 'hover:bg-cream-100 text-gray-700 border-transparent'"
            class="rounded-lg border px-3 py-1.5 text-sm lg:text-base transition-all font-medium"
          >
            My Learning
          </NuxtLink>
          <NuxtLink 
            v-if="me && me.role !== 'ADMIN'" 
            to="/dashboard" 
            :class="route.path === '/dashboard' ? 'bg-primary-50 text-primary-700 border-primary-200' : 'hover:bg-cream-100 text-gray-700 border-transparent'"
            class="rounded-lg border px-3 py-1.5 text-sm lg:text-base transition-all font-medium"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink 
            v-if="me?.role === 'ADMIN'" 
            to="/admin" 
            :class="route.path.startsWith('/admin') ? 'bg-primary-50 text-primary-700 border-primary-200' : 'hover:bg-cream-100 text-gray-700 border-transparent'"
            class="rounded-lg border px-3 py-1.5 text-sm lg:text-base transition-all font-medium"
          >
            Admin
          </NuxtLink>
          <NuxtLink 
            v-if="!me" 
            to="/training" 
            :class="route.path.startsWith('/training') ? 'bg-primary-50 text-primary-700 border-primary-200' : 'hover:bg-cream-100 text-gray-700 border-transparent'"
            class="rounded-lg border px-3 py-1.5 text-sm lg:text-base transition-all font-medium"
          >
            Training
          </NuxtLink>
          <NuxtLink 
            v-if="!me" 
            to="/corporate" 
            :class="route.path.startsWith('/corporate') ? 'bg-primary-50 text-primary-700 border-primary-200' : 'hover:bg-cream-100 text-gray-700 border-transparent'"
            class="rounded-lg border px-3 py-1.5 text-sm lg:text-base transition-all font-medium"
          >
            Corporate
          </NuxtLink>
          <NuxtLink 
            v-if="!me" 
            to="/schools" 
            :class="route.path.startsWith('/schools') ? 'bg-primary-50 text-primary-700 border-primary-200' : 'hover:bg-cream-100 text-gray-700 border-transparent'"
            class="rounded-lg border px-3 py-1.5 text-sm lg:text-base transition-all font-medium"
          >
            Schools
          </NuxtLink>
          <NuxtLink 
            to="/services" 
            :class="route.path.startsWith('/services') ? 'bg-primary-50 text-primary-700 border-primary-200' : 'hover:bg-cream-100 text-gray-700 border-transparent'"
            class="rounded-lg border px-3 py-1.5 text-sm lg:text-base transition-all font-medium"
          >
            IT Services
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            :class="route.path.startsWith('/about') ? 'bg-primary-50 text-primary-700 border-primary-200' : 'hover:bg-cream-100 text-gray-700 border-transparent'"
            class="rounded-lg border px-3 py-1.5 text-sm lg:text-base transition-all font-medium"
          >
            About
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-2 sm:gap-3">
          <button class="xl:hidden rounded-lg border border-cream-300 bg-white px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-cream-100 transition-colors font-medium" @click="mobileOpen = !mobileOpen">Menu</button>
          
          <!-- Not Logged In -->
          <template v-if="!me">
            <NuxtLink to="/auth/login" class="hidden sm:inline-block rounded-lg border border-cream-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-cream-100 transition-colors font-medium">Sign in</NuxtLink>
            <NuxtLink to="/request" class="rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-white shadow-md hover:shadow-lg hover:from-primary-700 hover:to-primary-800 transition-all font-medium">Request Training</NuxtLink>
          </template>

          <!-- Logged In -->
          <template v-else>
            <!-- User Menu -->
            <div class="relative" ref="userMenuRef">
              <button 
                @click="menuOpen = !menuOpen" 
                class="flex items-center gap-2 rounded-md bg-gradient-to-r from-navy-700/50 to-navy-800/50 px-3 py-1.5 text-xs sm:text-sm hover:from-navy-600/50 hover:to-navy-700/50 transition-all border border-navy-700/50"
              >
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-emerald-600 text-xs font-semibold text-white">
                  {{ me.name?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="hidden sm:inline">
                  <span v-if="me.role === 'STUDENT'">E-Learning Student</span>
                  <span v-else-if="me.role === 'ADMIN'">Admin</span>
                  <span v-else>{{ me.name }}</span>
                </span>
                <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': menuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="menuOpen" class="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-navy-700/50 bg-navy-900/95 backdrop-blur-lg text-sm shadow-xl z-50">
                  <!-- User Info Header -->
                  <div class="border-b border-navy-700/50 bg-navy-800/50 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-emerald-600 text-sm font-semibold text-white">
                        {{ me.name?.charAt(0).toUpperCase() || 'U' }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-white truncate">{{ me.name }}</div>
                        <div class="text-xs text-navy-300 truncate">{{ me.email }}</div>
                        <div class="mt-1">
                          <span 
                            :class="{
                              'bg-blue-500/20 text-blue-400 border-blue-500/30': me.role === 'ADMIN',
                              'bg-purple-500/20 text-purple-400 border-purple-500/30': me.role === 'STUDENT',
                              'bg-emerald-500/20 text-emerald-400 border-emerald-500/30': me.role === 'USER'
                            }"
                            class="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
                          >
                            <span v-if="me.role === 'STUDENT'">E-Learning Student</span>
                            <span v-else-if="me.role === 'ADMIN'">Admin</span>
                            <span v-else>{{ me.role }}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Menu Items -->
                  <div class="py-1">
                    <NuxtLink 
                      v-if="me.role === 'ADMIN'" 
                      @click="menuOpen = false" 
                      to="/admin" 
                      class="flex items-center gap-3 px-4 py-2.5 hover:bg-navy-800/50 transition-colors group"
                    >
                      <svg class="h-4 w-4 text-navy-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span class="text-navy-200 group-hover:text-white">Admin Dashboard</span>
                    </NuxtLink>
                    
                    <NuxtLink 
                      v-else 
                      @click="menuOpen = false" 
                      to="/dashboard" 
                      class="flex items-center gap-3 px-4 py-2.5 hover:bg-navy-800/50 transition-colors group"
                    >
                      <svg class="h-4 w-4 text-navy-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span class="text-navy-200 group-hover:text-white">Dashboard</span>
                    </NuxtLink>

                    <NuxtLink 
                      v-if="me.role === 'STUDENT'"
                      @click="menuOpen = false" 
                      to="/dashboard/learn" 
                      class="flex items-center gap-3 px-4 py-2.5 hover:bg-navy-800/50 transition-colors group"
                    >
                      <svg class="h-4 w-4 text-navy-400 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span class="text-navy-200 group-hover:text-white">My Courses</span>
                    </NuxtLink>

                    <NuxtLink 
                      @click="menuOpen = false" 
                      to="/dashboard/account" 
                      class="flex items-center gap-3 px-4 py-2.5 hover:bg-navy-800/50 transition-colors group"
                    >
                      <svg class="h-4 w-4 text-navy-400 group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span class="text-navy-200 group-hover:text-white">Account Settings</span>
                    </NuxtLink>

                    <div class="my-1 border-t border-navy-700/50"></div>

                    <button 
                      @click="onLogout" 
                      class="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-red-500/10 transition-colors group"
                    >
                      <svg class="h-4 w-4 text-navy-400 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span class="text-navy-200 group-hover:text-red-400">Logout</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </template>
        </div>
      </div>
    </header>
    <transition name="fade">
      <div v-if="mobileOpen" class="xl:hidden">
        <nav class="space-y-1 border-b border-primary-500/30 bg-gradient-to-r from-primary-600 to-primary-700 px-3 sm:px-4 py-3 text-white">
          <NuxtLink @click="mobileOpen=false" to="/" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">Home</NuxtLink>
          <NuxtLink v-if="me" @click="mobileOpen=false" to="/courses" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">Courses</NuxtLink>
          <NuxtLink v-if="me?.role === 'STUDENT'" @click="mobileOpen=false" to="/dashboard/learn" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">My Learning</NuxtLink>
          <NuxtLink v-if="me" @click="mobileOpen=false" to="/dashboard" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">Dashboard</NuxtLink>
          <NuxtLink v-if="!me" @click="mobileOpen=false" to="/training" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">Training</NuxtLink>
          <NuxtLink v-if="!me" @click="mobileOpen=false" to="/corporate" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">Corporate</NuxtLink>
          <NuxtLink v-if="!me" @click="mobileOpen=false" to="/schools" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">Schools</NuxtLink>
          <NuxtLink @click="mobileOpen=false" to="/services" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">IT Services</NuxtLink>
          <NuxtLink @click="mobileOpen=false" to="/about" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">About</NuxtLink>
          <template v-if="me">
            <div class="border-t border-white/20 pt-2 mt-2">
              <div class="px-3 py-2 mb-2">
                <div class="flex items-center gap-2 mb-1">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-semibold text-white">
                    {{ me.name?.charAt(0).toUpperCase() || 'U' }}
                  </div>
                  <div>
                    <div class="font-medium text-sm text-white">{{ me.name }}</div>
                    <div class="text-xs text-white/70">
                      <span v-if="me.role === 'STUDENT'">E-Learning Student</span>
                      <span v-else-if="me.role === 'ADMIN'">Admin</span>
                      <span v-else>{{ me.role }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <NuxtLink v-if="me.role === 'ADMIN'" @click="mobileOpen=false" to="/admin" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">Admin Dashboard</NuxtLink>
              <template v-else>
                <NuxtLink @click="mobileOpen=false" to="/dashboard" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">Dashboard</NuxtLink>
                <NuxtLink v-if="me.role === 'STUDENT'" @click="mobileOpen=false" to="/dashboard/learn" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">My Courses</NuxtLink>
                <NuxtLink @click="mobileOpen=false" to="/dashboard/account" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">Account Settings</NuxtLink>
              </template>
              <button @click="onLogout; mobileOpen=false" class="block w-full text-left rounded-md px-3 py-2 hover:bg-red-500/30 text-sm sm:text-base text-red-200 font-medium">Logout</button>
            </div>
          </template>
          <div v-else class="border-t border-white/20 pt-2 mt-2">
            <NuxtLink @click="mobileOpen=false" to="/auth/login" class="block rounded-md px-3 py-2 hover:bg-white/20 text-sm sm:text-base text-white font-medium">Sign in</NuxtLink>
          </div>
        </nav>
      </div>
    </transition>
    <main>
      <slot />
    </main>
    <footer class="mt-16 bg-gradient-to-br from-navy-900 to-primary-900">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-3 sm:px-4 py-8 sm:py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div class="sm:col-span-2 lg:col-span-1">
          <div class="mb-3 flex items-center gap-2">
            <div
              v-if="logoUrl"
              class="inline-flex items-center justify-center rounded-xl bg-white px-3 py-1.5 shadow-xl"
            >
              <img
                :src="logoUrl"
                alt="WeCodeZW Logo"
                class="h-12 w-auto object-contain"
              />
            </div>
            <div v-else class="text-lg font-semibold text-white">WeCodeZW</div>
          </div>
          <p class="text-navy-200 text-sm sm:text-base">Bridging knowledge, technology, and innovation for a digital-first world.</p>
          <div class="mt-4 text-sm text-navy-300">WhatsApp: +263 778 456 168</div>
        </div>
        <div>
          <div class="mb-3 font-semibold text-sm sm:text-base text-white">Offerings</div>
          <ul class="space-y-2 text-navy-200 text-sm sm:text-base">
            <li><NuxtLink to="/training" class="hover:text-white transition-colors">Individuals</NuxtLink></li>
            <li><NuxtLink to="/schools" class="hover:text-white transition-colors">School Clubs</NuxtLink></li>
            <li><NuxtLink to="/corporate" class="hover:text-white transition-colors">Corporate Upskilling</NuxtLink></li>
            <li><NuxtLink to="/services" class="hover:text-white transition-colors">IT Services</NuxtLink></li>
          </ul>
        </div>
        <div>
          <div class="mb-3 font-semibold text-sm sm:text-base text-white">Company</div>
          <ul class="space-y-2 text-navy-200 text-sm sm:text-base">
            <li><NuxtLink to="/about" class="hover:text-white transition-colors">About</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-white transition-colors">Contact</NuxtLink></li>
            <li><a href="https://wa.me/263778456168" target="_blank" class="underline hover:text-white transition-colors">WhatsApp</a></li>
          </ul>
        </div>
        <div>
          <div class="mb-3 font-semibold text-sm sm:text-base text-white">Legal</div>
          <ul class="space-y-2 text-navy-200 text-sm sm:text-base">
            <li><NuxtLink to="/privacy-policy" class="hover:text-white transition-colors">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms-and-conditions" class="hover:text-white transition-colors">Terms & Conditions</NuxtLink></li>
          </ul>
          <!-- Newsletter -->
          <div class="mt-6">
            <div class="mb-2 font-semibold text-sm text-white">Newsletter</div>
            <form class="flex flex-col gap-2">
              <input type="email" placeholder="Your email" class="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-navy-300 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20" />
              <button type="submit" class="rounded-lg bg-gradient-to-r from-primary-400 to-primary-500 px-4 py-2 text-sm font-semibold text-white hover:from-primary-500 hover:to-primary-600 transition-all">Join</button>
            </form>
          </div>
        </div>
      </div>
      <div class="border-t border-white/10 py-4 sm:py-6">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-navy-300">
          <span>© {{ new Date().getFullYear() }} WeCodeZW. All rights reserved.</span>
          <div class="flex items-center gap-4">
            <NuxtLink to="/privacy-policy" class="hover:text-white transition-colors">Privacy Policy</NuxtLink>
            <span>•</span>
            <NuxtLink to="/terms-and-conditions" class="hover:text-white transition-colors">Terms & Conditions</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import UiInput from '@/components/ui/Input.vue'
import UiButton from '@/components/ui/Button.vue'

// Use reactive auth composable
const { user: me, refresh: refreshAuth } = useAuth()
const route = useRoute()
const { logoUrl } = useLogo()

const menuOpen = ref(false)
const mobileOpen = ref(false)
const userMenuRef = ref<HTMLElement>()

// Close menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (menuOpen.value && userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
      menuOpen.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  
  // Refresh auth state on mount to ensure it's up to date
  refreshAuth()
})

// Listen for auth state changes (e.g., after login)
if (process.client) {
  // Refresh auth when navigating (in case user logged in/out in another tab)
  const route = useRoute()
  watch(() => route.path, () => {
    refreshAuth()
  })
  
  // Listen for custom auth events
  window.addEventListener('auth:login', () => {
    refreshAuth()
  })
  window.addEventListener('auth:logout', () => {
    refreshAuth()
  })
}

// Structured data for SEO
const { organizationSchema, websiteSchema } = useStructuredData()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(organizationSchema)
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(websiteSchema)
    }
  ]
})

async function onLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
  // Trigger auth refresh event
  if (process.client) {
    window.dispatchEvent(new Event('auth:logout'))
  }
  await navigateTo('/auth/login')
}
</script>

