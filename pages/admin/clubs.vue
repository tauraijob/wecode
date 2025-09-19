<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-16">
    <h1 class="text-3xl font-extrabold tracking-tight xs:text-4xl">Clubs</h1>
    <div class="mt-4 flex flex-wrap items-center gap-3">
      <input v-model="q" placeholder="Search clubs" class="w-full max-w-md rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm" />
      <select v-model="status" class="rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm">
        <option value="">All</option>
        <option value="ACTIVE">Active</option>
        <option value="PAUSED">Paused</option>
        <option value="DRAFT">Draft</option>
      </select>
    </div>
    <table class="mt-6 w-full table-auto overflow-hidden rounded-xl border border-navy-800">
      <thead class="bg-navy-900/40">
        <tr>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Name</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Level</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Students</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Status</th>
          <th class="px-4 py-2 text-right text-sm font-medium text-navy-200">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in rows" :key="c.id" class="hover:bg-white/5">
          <td class="px-4 py-2 text-sm">{{ c.name }}</td>
          <td class="px-4 py-2 text-sm">{{ c.level }}</td>
          <td class="px-4 py-2 text-sm">{{ c.students }}</td>
          <td class="px-4 py-2 text-sm">{{ c.status }}</td>
          <td class="px-4 py-2 text-right text-sm">
            <button class="rounded-md border border-navy-700 px-3 py-1 hover:border-navy-500" @click="setStatus(c.id,'ACTIVE')">Activate</button>
            <button class="ml-2 rounded-md border border-navy-700 px-3 py-1 hover:border-navy-500" @click="setStatus(c.id,'PAUSED')">Suspend</button>
          </td>
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
const status = ref('')
const page = ref(1)
const pageSize = ref(10)
const rows = ref<any[]>([])
const total = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

watch([q, status, page], () => load(), { immediate: true })

async function load() {
  const res = await $fetch('/api/admin/clubs', { query: { q: q.value, status: status.value || undefined, page: page.value, pageSize: pageSize.value } })
  rows.value = (res as any).rows
  total.value = (res as any).total
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


