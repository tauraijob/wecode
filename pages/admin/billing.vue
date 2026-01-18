<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-6">
    <!-- Header -->
    <div class="mb-5">
      <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Invoices & Payments
      </h1>
      <p class="mt-1 text-xs sm:text-sm text-navy-300">Manage invoices and payment records</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <!-- Invoices -->
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <h2 class="text-lg font-semibold text-white mb-3">Invoices</h2>
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <div class="relative flex-1 min-w-[150px]">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="invQ"
              placeholder="Search invoices"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 pl-10 pr-4 py-2 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            />
          </div>
          <select
            v-model="invStatus"
            class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          >
            <option value="">All</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
        <div class="overflow-hidden rounded-lg border border-navy-700/50 bg-navy-800/30 mb-4">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-navy-800/50 border-b border-navy-700/50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Number</th>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Amount</th>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-navy-700/50">
                <tr v-for="i in invoices.rows" :key="i.id" class="hover:bg-navy-800/30 transition-colors">
                  <td class="px-4 py-2 text-sm text-white">{{ i.number }}</td>
                  <td class="px-4 py-2 text-sm text-navy-300">USD {{ Number(i.amountUsd).toFixed(2) }}</td>
                  <td class="px-4 py-2 text-sm">
                    <span
                      :class="{
                        'bg-green-500/20 text-green-400 border-green-500/30': i.status === 'PAID',
                        'bg-amber-500/20 text-amber-400 border-amber-500/30': i.status === 'SENT',
                        'bg-red-500/20 text-red-400 border-red-500/30': i.status === 'OVERDUE'
                      }"
                      class="rounded-md border px-2.5 py-1 text-xs font-medium"
                    >
                      {{ i.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="flex items-center justify-between mb-4">
          <button
            @click="invPrev"
            :disabled="invPage === 1"
            class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div class="text-sm text-navy-300">Page {{ invPage }} of {{ invTotalPages }}</div>
          <button
            @click="invNext"
            :disabled="invPage === invTotalPages"
            class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <button
          @click="exportInvCsv"
          class="w-full rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all flex items-center justify-center gap-2"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      <!-- Payments -->
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <h2 class="text-lg font-semibold text-white mb-3">Payments</h2>
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <div class="relative flex-1 min-w-[150px]">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="payQ"
              placeholder="Search payments"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 pl-10 pr-4 py-2 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            />
          </div>
          <select
            v-model="payStatus"
            class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          >
            <option value="">All</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
        <div class="overflow-hidden rounded-lg border border-navy-700/50 bg-navy-800/30 mb-4">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-navy-800/50 border-b border-navy-700/50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Invoice</th>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Amount</th>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Status</th>
                  <th class="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Method</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-navy-700/50">
                <tr v-for="p in payments.rows" :key="p.id" class="hover:bg-navy-800/30 transition-colors">
                  <td class="px-4 py-2 text-sm text-white">{{ p.invoice?.number || '—' }}</td>
                  <td class="px-4 py-2 text-sm text-navy-300">USD {{ Number(p.amountUsd).toFixed(2) }}</td>
                  <td class="px-4 py-2 text-sm">
                    <span
                      :class="{
                        'bg-green-500/20 text-green-400 border-green-500/30': p.status === 'SUCCESS',
                        'bg-amber-500/20 text-amber-400 border-amber-500/30': p.status === 'PENDING',
                        'bg-red-500/20 text-red-400 border-red-500/30': p.status === 'FAILED'
                      }"
                      class="rounded-md border px-2.5 py-1 text-xs font-medium"
                    >
                      {{ p.status }}
                    </span>
                  </td>
                  <td class="px-4 py-2 text-sm text-navy-300">{{ p.method || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="flex items-center justify-between mb-4">
          <button
            @click="payPrev"
            :disabled="payPage === 1"
            class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div class="text-sm text-navy-300">Page {{ payPage }} of {{ payTotalPages }}</div>
          <button
            @click="payNext"
            :disabled="payPage === payTotalPages"
            class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <button
          @click="exportPayCsv"
          class="w-full rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all flex items-center justify-center gap-2"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
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
