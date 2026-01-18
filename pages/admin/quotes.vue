<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Quotes
      </h1>
      <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">View and manage training quotes</p>
    </div>

    <!-- Search -->
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[200px]">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="q"
          placeholder="Search quotes"
          class="w-full rounded-lg border border-navy-700 bg-navy-800/50 pl-10 pr-4 py-2 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        />
      </div>
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

    <!-- Quotes Table -->
    <div class="overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 mb-6">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-navy-800/50 border-b border-navy-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Number</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">School</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-navy-700/50">
            <tr v-for="r in rows" :key="r.id" class="hover:bg-navy-800/30 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{{ r.number }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-navy-300">{{ r.school?.name || '—' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-navy-300">{{ r.user?.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">USD {{ Number(r.totalUsd).toFixed(2) }}</td>
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">No quotes found</h3>
      <p class="text-navy-300">{{ q ? 'Try adjusting your search' : 'No quotes generated yet' }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const q = ref('')
const page = ref(1)
const pageSize = ref(10)
const rows = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

watch([q, page], () => load(), { immediate: true })

async function load() {
  loading.value = true
  try {
    const res = await $fetch('/api/admin/quotes', { query: { q: q.value, page: page.value, pageSize: pageSize.value } })
    rows.value = (res as any).rows
    total.value = (res as any).total
  } finally {
    loading.value = false
  }
}

function prev() { if (page.value > 1) page.value-- }
function next() { if (page.value < totalPages.value) page.value++ }
function exportCsv() {
  const header = ['Number','School','Email','Total']
  const lines = rows.value.map((r: any) => [r.number, r.school?.name || '', r.user?.email || '', Number(r.totalUsd).toFixed(2)])
  const csv = [header, ...lines].map(a => a.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'quotes.csv'; a.click(); URL.revokeObjectURL(url)
}
</script>
