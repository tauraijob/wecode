<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-16">
    <h1 class="text-3xl font-extrabold tracking-tight xs:text-4xl">Requests</h1>
    <div class="mt-4 flex flex-wrap items-center gap-3">
      <input v-model="q" placeholder="Search requests" class="w-full max-w-md rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm" />
      <select v-model="status" class="rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm">
        <option value="">All</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </div>
    <table class="mt-6 w-full table-auto overflow-hidden rounded-xl border border-navy-800">
      <thead class="bg-navy-900/40">
        <tr>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">User</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Category</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Status</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Created</th>
          <th class="px-4 py-2 text-right text-sm font-medium text-navy-200">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.id" class="hover:bg-white/5">
          <td class="px-4 py-2 text-sm">{{ r.user?.name || r.user?.email }}</td>
          <td class="px-4 py-2 text-sm">{{ r.category }}</td>
          <td class="px-4 py-2 text-sm">{{ r.status }}</td>
          <td class="px-4 py-2 text-sm">{{ new Date(r.createdAt).toLocaleString() }}</td>
          <td class="px-4 py-2 text-right text-sm">
            <button v-if="r.status==='PENDING'" class="rounded-md border border-navy-700 px-3 py-1 hover:border-navy-500" @click="approve(r.id)">Approve</button>
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
  const res = await $fetch('/api/admin/requests', { query: { q: q.value, status: status.value || undefined, page: page.value, pageSize: pageSize.value } })
  rows.value = (res as any).rows
  total.value = (res as any).total
}
function prev() { if (page.value > 1) page.value-- }
function next() { if (page.value < totalPages.value) page.value++ }
async function approve(id: string) {
  const amount = Number(prompt('Invoice amount (USD):', '0'))
  if (!amount || isNaN(amount)) return
  await $fetch('/api/admin/requests.approve', { method: 'POST', body: { requestId: id, amountUsd: amount } })
  await load()
}
function exportCsv() {
  const header = ['User','Category','Status','Created']
  const lines = rows.value.map((r: any) => [r.user?.email || '', r.category, r.status, new Date(r.createdAt).toISOString()])
  const csv = [header, ...lines].map(a => a.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'requests.csv'; a.click(); URL.revokeObjectURL(url)
}
</script>


