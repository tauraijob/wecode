<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 py-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Your Requests
      </h1>
      <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">Submit and track your service requests</p>
    </div>

    <!-- Create Request Form -->
    <div class="mb-8 rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 shadow-xl">
      <h2 class="text-xl font-semibold text-white mb-4">Create New Request</h2>
      <form @submit.prevent="create" class="space-y-5">
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">Category</label>
          <select
            v-model="category"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          >
            <option value="TRAINING">Training</option>
            <option value="WORKSHOP">Corporate Workshop</option>
            <option value="SCHOOL_CLUB">School Club</option>
            <option value="SERVICES">IT Services</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">Description</label>
          <textarea
            v-model="description"
            rows="3"
            placeholder="Short details about your request..."
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          ></textarea>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">Preferred Date</label>
          <input
            v-model="scheduledAt"
            type="datetime-local"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          {{ loading ? 'Creating...' : 'Create Request' }}
        </button>
      </form>
    </div>

    <!-- Requests Table -->
    <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-navy-800/50 border-b border-navy-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Created</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-navy-200">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-navy-700/50">
            <tr v-for="r in requests" :key="r.id" class="hover:bg-navy-800/30 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ r.category }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'bg-amber-500/20 text-amber-400 border-amber-500/30': r.status === 'PENDING',
                    'bg-green-500/20 text-green-400 border-green-500/30': r.status === 'APPROVED',
                    'bg-red-500/20 text-red-400 border-red-500/30': r.status === 'REJECTED'
                  }"
                  class="rounded-md border px-2.5 py-1 text-xs font-medium"
                >
                  {{ r.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-navy-300">{{ new Date(r.createdAt).toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  @click="open(r)"
                  class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-1.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="requests.length === 0 && !loading" class="mt-8 rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
        <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">No requests yet</h3>
      <p class="text-navy-300">Create your first request using the form above</p>
    </div>

    <!-- Request Details Modal -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="dialogOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click.self="dialogOpen = false"
      >
        <div class="w-full max-w-lg rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/95 to-navy-800/95 p-6 shadow-2xl">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white">Request Details</h2>
            <button
              @click="dialogOpen = false"
              class="rounded-lg p-2 hover:bg-navy-800/50 transition-colors"
            >
              <svg class="h-5 w-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selected" class="space-y-4">
            <div>
              <span class="text-sm font-medium text-navy-300">Category:</span>
              <span class="ml-2 text-sm text-white">{{ selected.category }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-navy-300">Status:</span>
              <span
                :class="{
                  'bg-amber-500/20 text-amber-400 border-amber-500/30': selected.status === 'PENDING',
                  'bg-green-500/20 text-green-400 border-green-500/30': selected.status === 'APPROVED',
                  'bg-red-500/20 text-red-400 border-red-500/30': selected.status === 'REJECTED'
                }"
                class="ml-2 inline-flex rounded-md border px-2.5 py-1 text-xs font-medium"
              >
                {{ selected.status }}
              </span>
            </div>
            <div>
              <span class="text-sm font-medium text-navy-300">Created:</span>
              <span class="ml-2 text-sm text-white">{{ new Date(selected.createdAt).toLocaleString() }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-navy-300">Description:</span>
              <p class="mt-2 whitespace-pre-wrap text-sm text-white">{{ selected.description || '—' }}</p>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              @click="dialogOpen = false"
              class="rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
import { ref } from 'vue'
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
  } catch (error: any) {
    alert(error.data?.message || 'Failed to create request')
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
