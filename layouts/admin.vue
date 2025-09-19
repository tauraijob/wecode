<template>
  <div class="min-h-screen grid grid-cols-12 bg-navy-950 text-white">
    <aside class="col-span-12 md:col-span-3 lg:col-span-2 border-r border-navy-800">
      <div class="px-4 py-5 text-xl font-bold">Admin</div>
      <nav class="px-2 pb-6 space-y-1">
        <NuxtLink to="/admin" class="block rounded-md px-3 py-2 hover:bg-white/5">Dashboard</NuxtLink>
        <NuxtLink to="/admin/users" class="block rounded-md px-3 py-2 hover:bg-white/5">Users</NuxtLink>
        <NuxtLink to="/admin/schools" class="block rounded-md px-3 py-2 hover:bg-white/5">Schools</NuxtLink>
        <NuxtLink to="/admin/clubs" class="block rounded-md px-3 py-2 hover:bg-white/5">Clubs</NuxtLink>
        <NuxtLink to="/admin/requests" class="block rounded-md px-3 py-2 hover:bg-white/5">Requests</NuxtLink>
        <NuxtLink to="/admin/quotes" class="block rounded-md px-3 py-2 hover:bg-white/5">Quotes</NuxtLink>
        <NuxtLink to="/admin/billing" class="block rounded-md px-3 py-2 hover:bg-white/5">Invoices & Payments</NuxtLink>
      </nav>
    </aside>
    <main class="col-span-12 md:col-span-9 lg:col-span-10">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const me = await $fetch('/api/auth/me').catch(() => null)
if (!me || me.role !== 'ADMIN') {
  await navigateTo('/dashboard')
}
</script>

<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-navy-950 text-white">
    <aside class="hidden md:block border-r border-navy-800 bg-navy-900/30">
      <div class="flex items-center gap-3 p-4">
        <span class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-navy-700 font-semibold">WZ</span>
        <div class="font-semibold tracking-tight">WeCodeZW Admin</div>
      </div>
      <nav class="mt-2 space-y-1 px-2">
        <NuxtLink :to="'/admin'" :class="navClass('/admin')">Dashboard</NuxtLink>
        <NuxtLink :to="'/admin/dashboard#users'" :class="navClass('/admin/dashboard#users')">Users</NuxtLink>
        <NuxtLink :to="'/admin/dashboard#requests'" :class="navClass('/admin/dashboard#requests')">Requests</NuxtLink>
        <NuxtLink :to="'/admin/dashboard#invoices'" :class="navClass('/admin/dashboard#invoices')">Invoices</NuxtLink>
        <NuxtLink :to="'/dashboard'" :class="navClass('/dashboard')">My account</NuxtLink>
      </nav>
    </aside>
    <div>
      <header class="sticky top-0 z-30 flex items-center justify-between border-b border-navy-800 bg-navy-950/60 px-4 py-3 backdrop-blur">
        <div class="md:hidden">
          <button @click="open = !open" class="rounded-md bg-white/10 px-2 py-1 text-sm hover:bg-white/15">Menu</button>
        </div>
        <div class="text-sm text-navy-200">Admin</div>
        <div class="flex items-center gap-3 text-sm">
          <div class="text-navy-300">{{ me?.name }} ({{ me?.role }})</div>
          <NuxtLink to="/dashboard" class="rounded-md bg-white/10 px-2 py-1 hover:bg-white/15">View site</NuxtLink>
          <NuxtLink to="/dashboard/account" class="rounded-md bg-white/10 px-2 py-1 hover:bg-white/15">Account</NuxtLink>
          <button @click="onLogout" class="rounded-md bg-white/10 px-2 py-1 hover:bg-white/15">Logout</button>
        </div>
      </header>
      <main class="p-4">
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
            <NuxtLink @click="open=false" :to="'/admin'" :class="navClass('/admin')">Dashboard</NuxtLink>
            <NuxtLink @click="open=false" :to="'/admin/dashboard#users'" :class="navClass('/admin/dashboard#users')">Users</NuxtLink>
            <NuxtLink @click="open=false" :to="'/admin/dashboard#requests'" :class="navClass('/admin/dashboard#requests')">Requests</NuxtLink>
            <NuxtLink @click="open=false" :to="'/admin/dashboard#invoices'" :class="navClass('/admin/dashboard#invoices')">Invoices</NuxtLink>
            <NuxtLink @click="open=false" :to="'/dashboard'" :class="navClass('/dashboard')">My account</NuxtLink>
          </nav>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const me = await $fetch('/api/auth/me')
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
  const base = 'block rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10'
  return isActive(path) ? `${base} bg-white/10 ring-1 ring-white/10` : `${base} text-navy-200`
}
async function onLogout() {
  await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
  await navigateTo('/auth/login')
}
</script>

