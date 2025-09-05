<template>
  <div class="min-h-screen bg-navy-950 text-white">
    <header class="sticky top-0 z-40 border-b border-navy-800 bg-navy-950/60 backdrop-blur supports-[backdrop-filter]:bg-navy-950/50">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold tracking-tight">
          <span class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-navy-700">WZ</span>
          <span>WeCodeZW</span>
        </NuxtLink>
        <nav class="hidden items-center gap-6 md:flex">
          <NuxtLink to="/" class="hover:text-navy-200">Home</NuxtLink>
          <NuxtLink to="/training" class="hover:text-navy-200">Training</NuxtLink>
          <NuxtLink to="/corporate" class="hover:text-navy-200">Corporate</NuxtLink>
          <NuxtLink to="/schools" class="hover:text-navy-200">Schools</NuxtLink>
          <NuxtLink to="/services" class="hover:text-navy-200">IT Services</NuxtLink>
          <NuxtLink to="/products" class="hover:text-navy-200">Products</NuxtLink>
          <NuxtLink to="/about" class="hover:text-navy-200">About</NuxtLink>
        </nav>
        <div class="flex items-center gap-3">
          <button class="md:hidden rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15" @click="mobileOpen = !mobileOpen">Menu</button>
          <NuxtLink v-if="!me" to="/auth/login" class="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15">Sign in</NuxtLink>
          <div v-else class="relative">
            <button @click="menuOpen = !menuOpen" class="rounded-md bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15">{{ me.name }}</button>
            <div v-if="menuOpen" class="absolute right-0 mt-2 w-48 overflow-hidden rounded-md border border-navy-800 bg-navy-900/95 text-sm shadow-lg">
              <NuxtLink @click="menuOpen=false" to="/dashboard" class="block px-3 py-2 hover:bg-white/10">Dashboard</NuxtLink>
              <NuxtLink @click="menuOpen=false" to="/dashboard/account" class="block px-3 py-2 hover:bg-white/10">Account settings</NuxtLink>
              <button @click="onLogout" class="block w-full px-3 py-2 text-left hover:bg-white/10">Logout</button>
            </div>
          </div>
          <NuxtLink to="/request" class="rounded-md bg-navy-400 px-3 py-1.5 text-sm text-navy-950 shadow-sm shadow-navy-900/30 hover:bg-navy-300">Request Training</NuxtLink>
        </div>
      </div>
    </header>
    <transition name="fade">
      <div v-if="mobileOpen" class="md:hidden">
        <nav class="space-y-1 border-b border-navy-800 bg-navy-900/95 px-4 py-3">
          <NuxtLink @click="mobileOpen=false" to="/" class="block rounded-md px-3 py-2 hover:bg-white/10">Home</NuxtLink>
          <NuxtLink @click="mobileOpen=false" to="/training" class="block rounded-md px-3 py-2 hover:bg-white/10">Training</NuxtLink>
          <NuxtLink @click="mobileOpen=false" to="/corporate" class="block rounded-md px-3 py-2 hover:bg-white/10">Corporate</NuxtLink>
          <NuxtLink @click="mobileOpen=false" to="/schools" class="block rounded-md px-3 py-2 hover:bg-white/10">Schools</NuxtLink>
          <NuxtLink @click="mobileOpen=false" to="/services" class="block rounded-md px-3 py-2 hover:bg-white/10">IT Services</NuxtLink>
          <NuxtLink @click="mobileOpen=false" to="/products" class="block rounded-md px-3 py-2 hover:bg-white/10">Products</NuxtLink>
          <NuxtLink @click="mobileOpen=false" to="/about" class="block rounded-md px-3 py-2 hover:bg-white/10">About</NuxtLink>
        </nav>
      </div>
    </transition>
    <main>
      <slot />
    </main>
    <footer class="mt-16 border-t border-navy-800 bg-navy-900/30">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div class="mb-3 text-lg font-semibold">WeCodeZW</div>
          <p class="text-navy-200">Bridging knowledge, technology, and innovation for a digital-first world.</p>
          <div class="mt-4 text-sm text-navy-300">WhatsApp: +27 61 629 1608</div>
        </div>
        <div>
          <div class="mb-3 font-semibold">Offerings</div>
          <ul class="space-y-2 text-navy-200">
            <li><NuxtLink to="/training">Individuals</NuxtLink></li>
            <li><NuxtLink to="/schools">School Clubs</NuxtLink></li>
            <li><NuxtLink to="/corporate">Corporate Upskilling</NuxtLink></li>
            <li><NuxtLink to="/services">IT Services</NuxtLink></li>
          </ul>
        </div>
        <div>
          <div class="mb-3 font-semibold">Company</div>
          <ul class="space-y-2 text-navy-200">
            <li><NuxtLink to="/about">About</NuxtLink></li>
            <li><NuxtLink to="/contact">Contact</NuxtLink></li>
            <li><a href="https://wa.me/27616291608" target="_blank" class="underline">WhatsApp</a></li>
          </ul>
        </div>
        <div>
          <div class="mb-3 font-semibold">Newsletter</div>
          <form class="flex flex-col gap-2 sm:flex-row">
            <UiInput type="email" placeholder="Your email" />
            <UiButton type="submit" class="px-3">Join</UiButton>
          </form>
        </div>
      </div>
      <div class="border-t border-navy-800 py-6 text-center text-sm text-navy-300">© {{ new Date().getFullYear() }} WeCodeZW. All rights reserved.</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import UiInput from '@/components/ui/Input.vue'
import UiButton from '@/components/ui/Button.vue'
const me = await $fetch('/api/auth/me').catch(() => null)
const menuOpen = ref(false)
const mobileOpen = ref(false)
async function onLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
  await navigateTo('/auth/login')
}
</script>

