<template>
  <div class="mx-auto max-w-6xl px-4 py-12">
    <h2 class="text-2xl font-bold tracking-tight">Invoices (USD)</h2>
    <form @submit.prevent="create" class="mt-6 grid gap-3 rounded-xl border border-navy-800 bg-navy-900/40 p-4">
      <div class="grid gap-2 md:max-w-xs">
        <UiLabel>Amount (USD)</UiLabel>
        <UiInput v-model.number="amount" type="number" step="0.01" min="0" />
      </div>
      <UiButton :disabled="loading" class="w-max">Create invoice</UiButton>
    </form>

    <div class="mt-8">
      <UiTable>
        <template #head>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Number</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Amount</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Status</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Created</th>
          <th class="px-4 py-2 text-right text-sm font-medium text-navy-200">Actions</th>
        </template>
        <tr v-for="inv in invoices" :key="inv.id" class="hover:bg-white/5">
          <td class="px-4 py-2 text-sm">{{ inv.number }}</td>
          <td class="px-4 py-2 text-sm">${{ inv.amountUsd }}</td>
          <td class="px-4 py-2 text-sm">{{ inv.status }}</td>
          <td class="px-4 py-2 text-sm">{{ new Date(inv.createdAt).toLocaleString() }}</td>
          <td class="px-4 py-2 text-sm text-right">
            <UiButton class="bg-white/10 text-white hover:bg-white/15" @click="open(inv)">View</UiButton>
            <NuxtLink :to="`/invoices/${inv.id}`" class="ml-2 rounded-md bg-navy-400 px-3 py-2 text-sm font-medium text-navy-950 hover:bg-navy-300">Open</NuxtLink>
          </td>
        </tr>
      </UiTable>
    </div>

    <UiDialog v-model:open="dialogOpen">
      <template #title>Invoice details</template>
      <div v-if="selected">
        <div class="text-sm"><span class="text-navy-300">Invoice #:</span> {{ selected.number }}</div>
        <div class="text-sm"><span class="text-navy-300">Amount:</span> ${{ selected.amountUsd }}</div>
        <div class="text-sm"><span class="text-navy-300">Status:</span> {{ selected.status }}</div>
        <div class="text-sm"><span class="text-navy-300">Created:</span> {{ new Date(selected.createdAt).toLocaleString() }}</div>
      </div>
      <template #actions>
        <UiButton class="bg-navy-400 text-navy-950 hover:bg-navy-300" @click="dialogOpen=false">Done</UiButton>
      </template>
    </UiDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UiLabel from '@/components/ui/Label.vue'
import UiInput from '@/components/ui/Input.vue'
import UiButton from '@/components/ui/Button.vue'
import UiTable from '@/components/ui/Table.vue'
import UiDialog from '@/components/ui/Dialog.vue'
const amount = ref<number>(0)
const loading = ref(false)
const invoices = ref<any[]>([])
const dialogOpen = ref(false)
const selected = ref<any | null>(null)

async function create() {
  try {
    loading.value = true
    await $fetch('/api/invoices', { method: 'POST', body: { amountUsd: amount.value } })
    amount.value = 0
    await load()
  } finally {
    loading.value = false
  }
}

async function load() {
  invoices.value = await $fetch('/api/invoices')
}

function open(row: any) {
  selected.value = row
  dialogOpen.value = true
}

onMounted(load)
</script>

