<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-16">
    <h1 class="text-3xl font-extrabold tracking-tight xs:text-4xl">Quotes</h1>
    <div class="mt-4 flex items-center gap-3">
      <input v-model="q" placeholder="Search quotes" class="w-full max-w-md rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm" />
    </div>
    <table class="mt-6 w-full table-auto overflow-hidden rounded-xl border border-navy-800">
      <thead class="bg-navy-900/40">
        <tr>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Number</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">School</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Email</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.id" class="hover:bg-white/5">
          <td class="px-4 py-2 text-sm">{{ r.number }}</td>
          <td class="px-4 py-2 text-sm">{{ r.school?.name }}</td>
          <td class="px-4 py-2 text-sm">{{ r.user?.email }}</td>
          <td class="px-4 py-2 text-sm">USD {{ Number(r.totalUsd).toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4 flex items-center justify-between">
      <button class="rounded-md border border-navy-700 px-3 py-1" :disabled="page===1" @click="prev">Prev</button>
      <div class="text-sm text-navy-300">Page {{ page }} of {{ totalPages }}</div>
      <button class="rounded-md border border-navy-700 px-3 py-1" :disabled="page===totalPages" @click="next">Next</button>
    </div>
    <div class="mt-4">
      <button class="rounded-md border border-navy-700 px-3 py-1" @click="exportCsv">Export CSV</button>
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
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

watch([q, page], () => load(), { immediate: true })

async function load() {
  const res = await $fetch('/api/admin/quotes', { query: { q: q.value, page: page.value, pageSize: pageSize.value } })
  rows.value = (res as any).rows
  total.value = (res as any).total
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


