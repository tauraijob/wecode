<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 py-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
          Clubs
        </h1>
        <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">Manage your coding clubs</p>
      </div>
      <button
        @click="open = true"
        class="rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 self-start sm:self-auto"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Club
      </button>
    </div>

    <!-- Clubs List -->
    <div v-if="clubs.length === 0" class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
        <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">No clubs yet</h3>
      <p class="text-navy-300 mb-6">Create your first coding club to get started</p>
      <button
        @click="open = true"
        class="inline-block rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-lg"
      >
        Create Club
      </button>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="c in clubs"
        :key="c.id"
        class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 transition-all hover:border-navy-600 hover:shadow-xl"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white mb-2">{{ c.name }}</h3>
            <div class="flex flex-wrap items-center gap-4 text-sm text-navy-300">
              <span class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {{ c.level }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {{ c.students }} students
              </span>
              <span
                :class="{
                  'bg-green-500/20 text-green-400 border-green-500/30': c.status === 'ACTIVE',
                  'bg-amber-500/20 text-amber-400 border-amber-500/30': c.status === 'PAUSED',
                  'bg-navy-500/20 text-navy-400 border-navy-500/30': c.status === 'DRAFT'
                }"
                class="rounded-md border px-2.5 py-1 text-xs font-medium"
              >
                {{ c.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Club Modal -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click.self="open = false"
      >
        <div class="w-full max-w-md rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/95 to-navy-800/95 p-6 shadow-2xl">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white">Create Club</h2>
            <button
              @click="open = false"
              class="rounded-lg p-2 hover:bg-navy-800/50 transition-colors"
            >
              <svg class="h-5 w-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="create" class="space-y-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Club Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="e.g. Core Coding Club"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Level</label>
              <input
                v-model="form.level"
                type="text"
                required
                placeholder="primary | high"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Plan ID</label>
              <input
                v-model="form.planId"
                type="text"
                required
                placeholder="e.g. high-core"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Number of Students</label>
              <input
                v-model.number="form.students"
                type="number"
                min="1"
                required
                placeholder="students"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              />
            </div>
            <div class="flex gap-3 justify-end pt-4 border-t border-navy-700/50">
              <button
                type="button"
                @click="open = false"
                class="rounded-lg border border-navy-700 bg-navy-800/50 px-5 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="creating" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ creating ? 'Creating...' : 'Create Club' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
const clubs = ref<any[]>([])
const open = ref(false)
const creating = ref(false)
const form = reactive({ name: '', level: '', planId: '', students: 1 })

onMounted(async () => {
  clubs.value = (await $fetch('/api/dashboard/clubs').catch(() => [])) as any[]
})

async function create() {
  try {
    creating.value = true
    const res = await $fetch('/api/dashboard/clubs', { method: 'POST', body: { ...form, students: Number(form.students) } }).catch(() => null)
    if ((res as any)?.ok) {
      open.value = false
      form.name = ''; form.level = ''; form.planId = ''; form.students = 1
      clubs.value = (await $fetch('/api/dashboard/clubs').catch(() => [])) as any[]
    }
  } finally {
    creating.value = false
  }
}
</script>
