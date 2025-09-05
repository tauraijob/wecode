<template>
  <div class="mx-auto max-w-6xl px-4 py-12">
    <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
    <p class="mt-2 text-navy-300">Welcome, {{ me?.name || 'User' }}.</p>

    <div class="mt-8 grid gap-6 md:grid-cols-3">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6">
        <div class="text-sm text-navy-300">Requests</div>
        <div class="mt-1 text-xl font-semibold">View or create requests</div>
        <NuxtLink to="/dashboard/requests" class="mt-4 inline-block text-navy-300 underline">Manage →</NuxtLink>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6">
        <div class="text-sm text-navy-300">Invoices</div>
        <div class="mt-1 text-xl font-semibold">Payments and invoices (USD)</div>
        <NuxtLink to="/dashboard/invoices" class="mt-4 inline-block text-navy-300 underline">View →</NuxtLink>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6">
        <div class="text-sm text-navy-300">Subscriptions</div>
        <div class="mt-1 text-xl font-semibold">Recurring services</div>
        <NuxtLink to="/dashboard/subscriptions" class="mt-4 inline-block text-navy-300 underline">Manage →</NuxtLink>
      </div>
    </div>

    <div v-if="me?.role === 'ADMIN'" class="mt-10 rounded-xl border border-amber-600/50 bg-amber-900/10 p-6">
      <div class="text-sm text-amber-300">Admin</div>
      <div class="mt-1 text-xl font-semibold">Admin Console</div>
      <NuxtLink to="/admin" class="mt-4 inline-block text-amber-300 underline">Open →</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const me = await $fetch('/api/auth/me')
</script>

