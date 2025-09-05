<template>
  <div class="mx-auto max-w-5xl px-4 py-12">
    <h2 class="text-2xl font-bold tracking-tight">Your Requests</h2>
    <form @submit.prevent="create" class="mt-6 grid gap-3 rounded-xl border border-navy-800 bg-navy-900/40 p-4">
      <div class="grid gap-2">
        <UiLabel>Category</UiLabel>
        <UiSelect v-model="category">
          <option value="TRAINING">Training</option>
          <option value="WORKSHOP">Corporate Workshop</option>
          <option value="SCHOOL_CLUB">School Club</option>
          <option value="SERVICES">IT Services</option>
        </UiSelect>
      </div>
      <div class="grid gap-2">
        <UiLabel>Description</UiLabel>
        <UiTextarea v-model="description" rows="3" placeholder="Short details" />
      </div>
      <div class="grid gap-2">
        <UiLabel>Preferred date</UiLabel>
        <UiInput v-model="scheduledAt" type="datetime-local" />
      </div>
      <UiButton :disabled="loading">Create request</UiButton>
    </form>

    <div class="mt-8">
      <UiTable>
        <template #head>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Category</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Status</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Created</th>
          <th class="px-4 py-2 text-right text-sm font-medium text-navy-200">Actions</th>
        </template>
        <tr v-for="r in requests" :key="r.id" class="hover:bg-white/5">
          <td class="px-4 py-2 text-sm">{{ r.category }}</td>
          <td class="px-4 py-2 text-sm">{{ r.status }}</td>
          <td class="px-4 py-2 text-sm">{{ new Date(r.createdAt).toLocaleString() }}</td>
          <td class="px-4 py-2 text-sm text-right">
            <UiButton class="bg-white/10 text-white hover:bg-white/15" @click="open(r)">View</UiButton>
          </td>
        </tr>
      </UiTable>
    </div>

    <UiDialog v-model:open="dialogOpen">
      <template #title>Request details</template>
      <div v-if="selected">
        <div class="text-sm"><span class="text-navy-300">Category:</span> {{ selected.category }}</div>
        <div class="text-sm"><span class="text-navy-300">Status:</span> {{ selected.status }}</div>
        <div class="text-sm"><span class="text-navy-300">Created:</span> {{ new Date(selected.createdAt).toLocaleString() }}</div>
        <div class="mt-3 text-sm whitespace-pre-wrap"><span class="text-navy-300">Description:</span> {{ selected.description || '—' }}</div>
      </div>
      <template #actions>
        <UiButton class="bg-navy-400 text-navy-950 hover:bg-navy-300" @click="dialogOpen=false">Done</UiButton>
      </template>
    </UiDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UiSelect from '@/components/ui/Select.vue'
import UiLabel from '@/components/ui/Label.vue'
import UiTextarea from '@/components/ui/Textarea.vue'
import UiInput from '@/components/ui/Input.vue'
import UiButton from '@/components/ui/Button.vue'
import UiTable from '@/components/ui/Table.vue'
import UiDialog from '@/components/ui/Dialog.vue'
const category = ref<'TRAINING'|'WORKSHOP'|'SCHOOL_CLUB'|'SERVICES'>('TRAINING')
const description = ref('')
const loading = ref(false)
const requests = ref<any[]>([])
const scheduledAt = ref('')
const dialogOpen = ref(false)
const selected = ref<any | null>(null)

async function create() {
  try {
    loading.value = true
    await $fetch('/api/requests', { method: 'POST', body: { category: category.value, description: description.value, scheduledAt: scheduledAt.value || undefined } })
    description.value = ''
    scheduledAt.value = ''
    await load()
  } finally {
    loading.value = false
  }
}

async function load() {
  requests.value = await $fetch('/api/requests')
}

function open(row: any) {
  selected.value = row
  dialogOpen.value = true
}

onMounted(load)
</script>

