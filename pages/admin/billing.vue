<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-16">
    <h1 class="text-3xl font-extrabold tracking-tight xs:text-4xl">Invoices & Payments</h1>
    <div class="mt-6 grid gap-6 md:grid-cols-2">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <div class="mb-3 flex items-center gap-3">
          <input v-model="invQ" placeholder="Search invoices" class="w-full max-w-md rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm" />
          <select v-model="invStatus" class="rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm">
            <option value="">All</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
        <table class="w-full table-auto overflow-hidden rounded-xl border border-navy-800">
          <thead class="bg-navy-900/40">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Number</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Amount</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in invoices.rows" :key="i.id" class="hover:bg-white/5">
              <td class="px-4 py-2 text-sm">{{ i.number }}</td>
              <td class="px-4 py-2 text-sm">USD {{ Number(i.amountUsd).toFixed(2) }}</td>
              <td class="px-4 py-2 text-sm">{{ i.status }}</td>
            </tr>
          </tbody>
        </table>
        <div class="mt-3 flex items-center justify-between">
          <button class="rounded-md border border-navy-700 px-3 py-1" :disabled="invPage===1" @click="invPrev">Prev</button>
          <div class="text-sm text-navy-300">Page {{ invPage }} of {{ invTotalPages }}</div>
          <button class="rounded-md border border-navy-700 px-3 py-1" :disabled="invPage===invTotalPages" @click="invNext">Next</button>
        </div>
        <div class="mt-3">
          <button class="rounded-md border border-navy-700 px-3 py-1" @click="exportInvCsv">Export CSV</button>
        </div>
      </div>

      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <div class="mb-3 flex items-center gap-3">
          <input v-model="payQ" placeholder="Search payments" class="w-full max-w-md rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm" />
          <select v-model="payStatus" class="rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm">
            <option value="">All</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
        <table class="w-full table-auto overflow-hidden rounded-xl border border-navy-800">
          <thead class="bg-navy-900/40">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Invoice</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Amount</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Status</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Method</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in payments.rows" :key="p.id" class="hover:bg-white/5">
              <td class="px-4 py-2 text-sm">{{ p.invoice?.number }}</td>
              <td class="px-4 py-2 text-sm">USD {{ Number(p.amountUsd).toFixed(2) }}</td>
              <td class="px-4 py-2 text-sm">{{ p.status }}</td>
              <td class="px-4 py-2 text-sm">{{ p.method || '—' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="mt-3 flex items-center justify-between">
          <button class="rounded-md border border-navy-700 px-3 py-1" :disabled="payPage===1" @click="payPrev">Prev</button>
          <div class="text-sm text-navy-300">Page {{ payPage }} of {{ payTotalPages }}</div>
          <button class="rounded-md border border-navy-700 px-3 py-1" :disabled="payPage===payTotalPages" @click="payNext">Next</button>
        </div>
        <div class="mt-3">
          <button class="rounded-md border border-navy-700 px-3 py-1" @click="exportPayCsv">Export CSV</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
// Invoices state
const invQ = ref('')
const invStatus = ref('')
const invPage = ref(1)
const invPageSize = ref(10)
const invoices = reactive<any>({ rows: [], total: 0 })
const invTotalPages = computed(() => Math.max(1, Math.ceil(invoices.total / invPageSize.value)))

// Payments state
const payQ = ref('')
const payStatus = ref('')
const payPage = ref(1)
const payPageSize = ref(10)
const payments = reactive<any>({ rows: [], total: 0 })
const payTotalPages = computed(() => Math.max(1, Math.ceil(payments.total / payPageSize.value)))

watch([invQ, invStatus, invPage], () => loadInvoices(), { immediate: true })
watch([payQ, payStatus, payPage], () => loadPayments(), { immediate: true })

async function loadInvoices() {
  const res = await $fetch('/api/admin/invoices', { query: { q: invQ.value, status: invStatus.value || undefined, page: invPage.value, pageSize: invPageSize.value } })
  invoices.rows = (res as any).rows
  invoices.total = (res as any).total
}
async function loadPayments() {
  const res = await $fetch('/api/admin/payments', { query: { q: payQ.value, status: payStatus.value || undefined, page: payPage.value, pageSize: payPageSize.value } })
  payments.rows = (res as any).rows
  payments.total = (res as any).total
}
function invPrev() { if (invPage.value > 1) invPage.value-- }
function invNext() { if (invPage.value < invTotalPages.value) invPage.value++ }
function payPrev() { if (payPage.value > 1) payPage.value-- }
function payNext() { if (payPage.value < payTotalPages.value) payPage.value++ }

function exportInvCsv() {
  const header = ['Number','Amount','Status']
  const lines = invoices.rows.map((r: any) => [r.number, Number(r.amountUsd).toFixed(2), r.status])
  const csv = [header, ...lines].map(a => a.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'invoices.csv'; a.click(); URL.revokeObjectURL(url)
}
function exportPayCsv() {
  const header = ['Invoice','Amount','Status','Method']
  const lines = payments.rows.map((r: any) => [r.invoice?.number || '', Number(r.amountUsd).toFixed(2), r.status, r.method || ''])
  const csv = [header, ...lines].map(a => a.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click(); URL.revokeObjectURL(url)
}
</script>


