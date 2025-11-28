<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Clubs
      </h1>
      <p class="mt-2 text-navy-300">Manage coding clubs and student groups</p>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[200px]">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="q"
          placeholder="Search clubs"
          class="w-full rounded-lg border border-navy-700 bg-navy-800/50 pl-10 pr-4 py-2 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        />
      </div>
      <select
        v-model="status"
        class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
      >
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="PAUSED">Paused</option>
        <option value="DRAFT">Draft</option>
      </select>
      <button
        @click="exportCsv"
        class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all flex items-center gap-2"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export CSV
      </button>
    </div>

    <!-- Clubs Table -->
    <div class="overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 mb-6">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-navy-800/50 border-b border-navy-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Level</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Students</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-navy-200">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-navy-700/50">
            <tr v-for="c in rows" :key="c.id" class="hover:bg-navy-800/30 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{{ c.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-navy-300">{{ c.level }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-navy-300">{{ c.students }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
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
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="c.status !== 'ACTIVE'"
                    @click="setStatus(c.id,'ACTIVE')"
                    class="rounded-lg border border-green-600 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20 transition-all"
                  >
                    Activate
                  </button>
                  <button
                    v-if="c.status !== 'PAUSED'"
                    @click="setStatus(c.id,'PAUSED')"
                    class="rounded-lg border border-amber-600 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-all"
                  >
                    Suspend
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between rounded-xl border border-navy-700/50 bg-navy-800/30 px-6 py-4">
      <button
        @click="prev"
        :disabled="page === 1"
        class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <div class="text-sm text-navy-300">Page {{ page }} of {{ totalPages }}</div>
      <button
        @click="next"
        :disabled="page === totalPages"
        class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="rows.length === 0 && !loading" class="mt-8 rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
        <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">No clubs found</h3>
      <p class="text-navy-300">{{ q || status ? 'Try adjusting your filters' : 'No clubs registered yet' }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const q = ref('')
const status = ref('')
const page = ref(1)
const pageSize = ref(10)
const rows = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

watch([q, status, page], () => load(), { immediate: true })

async function load() {
  loading.value = true
  try {
    const res = await $fetch('/api/admin/clubs', { query: { q: q.value, status: status.value || undefined, page: page.value, pageSize: pageSize.value } })
    rows.value = (res as any).rows
    total.value = (res as any).total
  } finally {
    loading.value = false
  }
}

function prev() { if (page.value > 1) page.value-- }
function next() { if (page.value < totalPages.value) page.value++ }
async function setStatus(id: string, s: 'ACTIVE'|'PAUSED'|'DRAFT') {
  await $fetch('/api/admin/clubs.status', { method: 'POST', body: { clubId: id, status: s } })
  await load()
}
function exportCsv() {
  const header = ['Name','Level','Students','Status']
  const lines = rows.value.map((r: any) => [r.name, r.level, r.students, r.status])
  const csv = [header, ...lines].map(a => a.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'clubs.csv'; a.click(); URL.revokeObjectURL(url)
}
</script>
