<template>
  <div class="mx-auto max-w-7xl px-4 py-6">
    <h1 class="text-3xl font-bold tracking-tight">Admin Console</h1>
    <p class="mt-2 text-navy-300">Manage users, requests, and invoices.</p>

    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <UiCard>
        <div class="text-sm text-navy-300">Users</div>
        <div class="mt-1 text-2xl font-semibold">{{ stats.users }}</div>
      </UiCard>
      <UiCard>
        <div class="text-sm text-navy-300">Requests</div>
        <div class="mt-1 text-2xl font-semibold">{{ stats.requests }}</div>
      </UiCard>
      <UiCard>
        <div class="text-sm text-navy-300">Invoices</div>
        <div class="mt-1 text-2xl font-semibold">{{ stats.invoices }}</div>
      </UiCard>
      <UiCard>
        <div class="text-sm text-navy-300">Paid</div>
        <div class="mt-1 text-2xl font-semibold">{{ stats.paid }}</div>
      </UiCard>
    </div>

    <div class="mt-8 grid gap-8">
      <section id="users">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-lg font-semibold">Users</h2>
          <UiButton class="bg-white/10 text-white hover:bg-white/15" @click="reloadAll">Refresh</UiButton>
        </div>
        <UiTable>
          <template #head>
            <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Name</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Email</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Role</th>
            <th class="px-4 py-2 text-right text-sm font-medium text-navy-200">Actions</th>
          </template>
          <tr v-for="u in users" :key="u.id" class="hover:bg-white/5">
            <td class="px-4 py-2 text-sm">{{ u.name }}</td>
            <td class="px-4 py-2 text-sm">{{ u.email }}</td>
            <td class="px-4 py-2 text-sm">{{ u.role }}</td>
            <td class="px-4 py-2 text-sm text-right">
              <UiButton class="bg-navy-400 text-navy-950 hover:bg-navy-300" @click="viewUser(u)">View</UiButton>
            </td>
          </tr>
        </UiTable>
      </section>

      <section id="requests">
        <h2 class="mb-2 text-lg font-semibold">Requests</h2>
        <UiTable>
          <template #head>
            <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">User</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Category</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Status</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Created</th>
            <th class="px-4 py-2 text-right text-sm font-medium text-navy-200">Actions</th>
          </template>
          <tr v-for="r in requests" :key="r.id" class="hover:bg-white/5">
            <td class="px-4 py-2 text-sm">{{ r.user?.name || '—' }}</td>
            <td class="px-4 py-2 text-sm">{{ r.category }}</td>
            <td class="px-4 py-2 text-sm">
              <UiBadge :variant="r.status==='PENDING' ? 'warning' : r.status==='APPROVED' ? 'success' : 'secondary'">{{ r.status }}</UiBadge>
            </td>
            <td class="px-4 py-2 text-sm">{{ new Date(r.createdAt).toLocaleString() }}</td>
            <td class="px-4 py-2 text-sm text-right">
              <UiButton class="bg-white/10 text-white hover:bg-white/15" @click="viewRequest(r)">View</UiButton>
              <UiButton v-if="r.status==='PENDING'" class="ml-2 bg-navy-400 text-navy-950 hover:bg-navy-300" @click="openApprove(r)">Approve</UiButton>
            </td>
          </tr>
        </UiTable>
      </section>

      <section id="invoices">
        <h2 class="mb-2 text-lg font-semibold">Invoices</h2>
        <UiTable>
          <template #head>
            <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">User</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Number</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Amount</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Status</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Created</th>
            <th class="px-4 py-2 text-right text-sm font-medium text-navy-200">Actions</th>
          </template>
          <tr v-for="inv in invoices" :key="inv.id" class="hover:bg-white/5">
            <td class="px-4 py-2 text-sm">{{ inv.user?.name || '—' }}</td>
            <td class="px-4 py-2 text-sm">{{ inv.number }}</td>
            <td class="px-4 py-2 text-sm">${{ inv.amountUsd }}</td>
            <td class="px-4 py-2 text-sm">
              <UiBadge :variant="inv.status==='SENT' ? 'warning' : inv.status==='PAID' ? 'success' : inv.status==='VOID' ? 'destructive' : 'secondary'">{{ inv.status }}</UiBadge>
            </td>
            <td class="px-4 py-2 text-sm">{{ new Date(inv.createdAt).toLocaleString() }}</td>
            <td class="px-4 py-2 text-sm text-right">
              <UiButton class="bg-white/10 text-white hover:bg-white/15" @click="viewInvoice(inv)">View</UiButton>
              <NuxtLink :to="`/invoices/${inv.id}`" class="ml-2 rounded-md bg-navy-400 px-3 py-2 text-sm font-medium text-navy-950 hover:bg-navy-300">Open</NuxtLink>
            </td>
          </tr>
        </UiTable>
      </section>
    </div>

    <UiDialog v-model:open="dialog.open">
      <template #title>{{ dialog.title }}</template>
      <div v-if="dialog.title==='Invoice' && dialog.invoice" class="max-h-[70vh] overflow-auto rounded-xl bg-white p-6 text-black">
        <div class="flex items-start justify-between border-b pb-4">
          <div>
            <div class="text-xl font-bold">Invoice</div>
            <div class="mt-0.5 text-sm text-gray-600">{{ dialog.invoice.number }}</div>
          </div>
          <div class="text-right">
            <div class="text-base font-semibold">Tau Digital Investments T/A WeCodeZW</div>
            <div class="text-xs text-gray-700">Address 194 Baines Harare Zimbabwe</div>
            <div class="text-xs text-gray-700">+263778456168 • +263778144412</div>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div class="text-[11px] uppercase tracking-wide text-gray-500">Billed To</div>
            <div class="mt-1 text-sm font-medium">{{ dialog.invoice.user?.name }}</div>
            <div class="text-sm text-gray-700">{{ dialog.invoice.user?.email }}</div>
          </div>
          <div class="md:text-right">
            <div class="text-[11px] uppercase tracking-wide text-gray-500">Invoice Details</div>
            <div class="mt-1 text-sm text-gray-700">Date: {{ formatDate(dialog.invoice.createdAt) }}</div>
            <div class="text-sm text-gray-700">Due: {{ dialog.invoice.dueDate ? formatDate(dialog.invoice.dueDate) : '—' }}</div>
            <div class="text-sm text-gray-700">Status: {{ dialog.invoice.status }}</div>
          </div>
        </div>
        <div class="mt-4">
          <table class="w-full table-auto overflow-hidden rounded-lg border">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-600">Description</th>
                <th class="px-4 py-2 text-right text-xs font-medium text-gray-600">Amount (USD)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="px-4 py-3 text-sm text-gray-800">{{ invoiceDescription(dialog.invoice) }}</td>
                <td class="px-4 py-3 text-right text-sm font-semibold">${{ dialog.invoice.amountUsd }}</td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50">
              <tr>
                <td class="px-4 py-2 text-right text-sm font-medium text-gray-600">Total</td>
                <td class="px-4 py-2 text-right text-sm font-semibold">${{ dialog.invoice.amountUsd }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <div class="text-[11px] text-gray-500">Currency: USD</div>
          <div class="space-x-2">
            <NuxtLink :to="`/invoices/${dialog.invoice.id}`" class="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800">Open full page</NuxtLink>
            <button class="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-black hover:bg-gray-300" @click="print()">Print</button>
          </div>
        </div>
      </div>
      <pre v-else class="max-h-[60vh] overflow-auto rounded-lg bg-black/20 p-3 text-xs text-navy-100">{{ dialog.payload }}</pre>
      <template #actions>
        <UiButton class="bg-navy-400 text-navy-950 hover:bg-navy-300" @click="dialog.open=false">Close</UiButton>
      </template>
    </UiDialog>
    <UiDialog v-model:open="approve.open">
      <template #title>Approve request</template>
      <div class="grid gap-3">
        <div class="grid gap-1">
          <div class="text-sm text-navy-300">Amount (USD)</div>
          <input v-model.number="approve.amount" type="number" step="0.01" min="0" class="rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm" />
        </div>
        <div class="grid gap-1">
          <div class="text-sm text-navy-300">Due date</div>
          <input v-model="approve.dueDate" type="date" class="rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm" />
        </div>
        <UiButton class="bg-navy-400 text-navy-950 hover:bg-navy-300" @click="approveNow">Approve & Create Invoice</UiButton>
      </div>
    </UiDialog>
  </div>
</template>

<script setup lang="ts">
import UiTable from '@/components/ui/Table.vue'
import UiButton from '@/components/ui/Button.vue'
import UiDialog from '@/components/ui/Dialog.vue'
import UiBadge from '@/components/ui/Badge.vue'
import UiCard from '@/components/ui/Card.vue'

definePageMeta({ layout: 'admin' })
const me = await $fetch('/api/auth/me')
if (!me || me.role !== 'ADMIN') {
  await navigateTo('/dashboard')
}

const { data: stats } = await useAsyncData('admin-stats', () => $fetch('/api/admin/stats'), {
  default: () => ({ users: 0, requests: 0, invoices: 0, paid: 0 })
})
const { data: users } = await useAsyncData('admin-users', () => $fetch('/api/admin/users'), {
  default: () => [] as any[]
})
const { data: requests } = await useAsyncData('admin-requests', () => $fetch('/api/requests', { query: { all: 'true' } }), {
  default: () => [] as any[]
})
const { data: invoices } = await useAsyncData('admin-invoices', () => $fetch('/api/invoices', { query: { all: 'true' } }), {
  default: () => [] as any[]
})

const dialog = reactive<{ open: boolean; title: string; payload: any; invoice?: any }>({ open: false, title: '', payload: null })
const approve = reactive<{ open: boolean, requestId: string | null, amount: number, dueDate: string }>({ open: false, requestId: null, amount: 0, dueDate: '' })

function viewUser(u: any) {
  dialog.open = true
  dialog.title = 'User'
  dialog.payload = u
}
function viewRequest(r: any) {
  dialog.open = true
  dialog.title = 'Request'
  dialog.payload = r
}
function viewInvoice(i: any) {
  dialog.open = true
  dialog.title = 'Invoice'
  dialog.invoice = i
  dialog.payload = null
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString()
}

function invoiceDescription(i: any) {
  if (i?.request?.category) {
    return `${i.request.category} — ${i.request.description || 'Scope of work / training'}`
  }
  return 'Professional services'
}

function print() {
  window.print()
}

async function reloadAll() {
  await Promise.all([
    refreshNuxtData('admin-stats'),
    refreshNuxtData('admin-users'),
    refreshNuxtData('admin-requests'),
    refreshNuxtData('admin-invoices')
  ])
}

function openApprove(r: any) {
  approve.open = true
  approve.requestId = r.id
  approve.amount = 0
  approve.dueDate = ''
}

async function approveNow() {
  if (!approve.requestId) return
  await $fetch('/api/admin/requests.approve', {
    method: 'POST',
    body: { requestId: approve.requestId, amountUsd: approve.amount, dueDate: approve.dueDate || undefined }
  })
  approve.open = false
  await reloadAll()
}
</script>

