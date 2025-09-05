<template>
  <div class="mx-auto max-w-4xl bg-white text-black print:bg-white">
    <div class="flex items-start justify-between border-b p-6">
      <div>
        <div class="text-2xl font-bold">Invoice</div>
        <div class="mt-1 text-sm text-gray-600">{{ invoice.number }}</div>
      </div>
      <div class="text-right">
        <div class="text-lg font-semibold">Tau Digital Investments T/A WeCodeZW</div>
        <div class="text-sm text-gray-700">Address 194 Baines Harare Zimbabwe</div>
        <div class="text-sm text-gray-700">+263778456168 • +263778144412</div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      <div>
        <div class="text-xs uppercase tracking-wide text-gray-500">Billed To</div>
        <div class="mt-1 font-medium">{{ invoice.user?.name }}</div>
        <div class="text-gray-700">{{ invoice.user?.email }}</div>
      </div>
      <div class="md:text-right">
        <div class="text-xs uppercase tracking-wide text-gray-500">Invoice Details</div>
        <div class="mt-1 text-gray-700">Date: {{ formatDate(invoice.createdAt) }}</div>
        <div class="text-gray-700">Due: {{ invoice.dueDate ? formatDate(invoice.dueDate) : '—' }}</div>
        <div class="text-gray-700">Status: {{ invoice.status }}</div>
      </div>
    </div>

    <div class="px-6">
      <table class="w-full table-auto overflow-hidden rounded-lg border">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600">Description</th>
            <th class="px-4 py-2 text-right text-sm font-medium text-gray-600">Amount (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="px-4 py-3 text-sm text-gray-800">
              {{ lineDescription }}
            </td>
            <td class="px-4 py-3 text-right text-sm font-semibold">${{ invoice.amountUsd }}</td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50">
          <tr>
            <td class="px-4 py-2 text-right text-sm font-medium text-gray-600">Total</td>
            <td class="px-4 py-2 text-right text-sm font-semibold">${{ invoice.amountUsd }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="flex items-center justify-between p-6">
      <div class="text-xs text-gray-500">Currency: USD</div>
      <div class="space-x-2">
        <NuxtLink :to="payLink" class="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 print:hidden">Pay Now</NuxtLink>
        <button @click="print" class="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 print:hidden">Print</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const invoice = await $fetch(`/api/invoices/${id}`)
const lineDescription = computed(() => {
  if (invoice.request?.category) {
    return `${invoice.request.category} — ${invoice.request.description || 'Scope of work / training'}`
  }
  return 'Professional services'
})
function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString()
}
const payLink = computed(() => `/dashboard/invoices?id=${id}`)
function print() {
  window.print()
}
</script>

<style>
@media print {
  html, body { background: #fff; }
}
</style>

