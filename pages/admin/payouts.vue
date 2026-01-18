<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Payout Requests
      </h1>
      <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">Review and process instructor payout requests</p>
    </div>

    <!-- Stats -->
    <div class="grid gap-4 sm:grid-cols-3 mb-8">
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <p class="text-xs text-navy-400">Pending Requests</p>
        <p class="text-2xl font-bold text-amber-400">{{ pendingCount }}</p>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <p class="text-xs text-navy-400">Processing</p>
        <p class="text-2xl font-bold text-blue-400">{{ processingCount }}</p>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <p class="text-xs text-navy-400">Total Pending Amount</p>
        <p class="text-2xl font-bold text-white">${{ totalPendingAmount.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <select
        v-model="statusFilter"
        class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
      >
        <option value="">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="PROCESSING">Processing</option>
        <option value="COMPLETED">Completed</option>
        <option value="FAILED">Failed</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
        <p class="mt-4 text-navy-300">Loading payout requests...</p>
      </div>
    </div>

    <!-- Payouts List -->
    <div v-else-if="filteredPayouts && filteredPayouts.length > 0" class="space-y-4">
      <div
        v-for="payout in filteredPayouts"
        :key="payout.id"
        class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <p class="text-xl font-bold text-white">${{ Number(payout.amount).toFixed(2) }}</p>
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                payout.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                payout.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-400' :
                payout.status === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                'bg-amber-500/20 text-amber-400'
              ]">
                {{ payout.status }}
              </span>
            </div>
            <p class="text-sm text-navy-300">
              <strong>Instructor:</strong> {{ payout.instructor?.name || 'Unknown' }}
              <span class="text-navy-400">({{ payout.instructor?.email }})</span>
            </p>
            <p class="text-sm text-navy-400">Method: {{ payout.method || 'Not specified' }}</p>
            <p class="text-xs text-navy-500 mt-1">Requested: {{ formatDate(payout.requestedAt) }}</p>
          </div>
        </div>

        <!-- Payment Details -->
        <div v-if="payout.notes" class="mb-4 p-4 rounded-lg bg-navy-900/50 border border-navy-700/30">
          <p class="text-xs text-navy-400 mb-2">Payment Details</p>
          <pre class="text-sm text-navy-300 whitespace-pre-wrap font-sans">{{ payout.notes }}</pre>
        </div>

        <!-- Actions -->
        <div v-if="payout.status === 'PENDING' || payout.status === 'PROCESSING'" class="flex gap-3 pt-4 border-t border-navy-700/50">
          <button
            v-if="payout.status === 'PENDING'"
            @click="updateStatus(payout.id, 'PROCESSING')"
            :disabled="processing === payout.id"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Start Processing
          </button>
          <button
            @click="showCompleteDialog(payout)"
            :disabled="processing === payout.id"
            class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Mark Completed
          </button>
          <button
            @click="showFailDialog(payout)"
            :disabled="processing === payout.id"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Mark Failed
          </button>
        </div>

        <!-- Completed Info -->
        <div v-if="payout.status === 'COMPLETED' && payout.processedAt" class="pt-4 border-t border-navy-700/50">
          <p class="text-sm text-green-400">
            <span class="text-navy-400">Processed:</span> {{ formatDate(payout.processedAt) }}
            <span v-if="payout.reference" class="text-navy-400"> | Reference: {{ payout.reference }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-12 text-center">
      <p class="text-navy-300">No payout requests found</p>
    </div>

    <!-- Complete Dialog -->
    <div
      v-if="completingPayout"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="completingPayout = null"
    >
      <div class="w-full max-w-md rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800 to-navy-900 p-6">
        <h3 class="text-xl font-semibold text-white mb-4">Complete Payout</h3>
        <p class="text-sm text-navy-300 mb-4">
          Confirm payment of <strong>${{ Number(completingPayout.amount).toFixed(2) }}</strong> to {{ completingPayout.instructor?.name }}.
        </p>
        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Transaction Reference *</label>
            <input
              v-model="referenceInput"
              type="text"
              required
              class="w-full rounded-lg border border-navy-600 bg-navy-900/50 p-3 text-white placeholder-navy-500 focus:border-navy-500 focus:outline-none"
              placeholder="e.g., TXN123456"
            />
          </div>
        </div>
        <div class="mt-6 flex gap-3">
          <button
            @click="completePayout"
            :disabled="!referenceInput.trim() || processing === completingPayout.id"
            class="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {{ processing === completingPayout.id ? 'Processing...' : 'Confirm Payment' }}
          </button>
          <button
            @click="completingPayout = null; referenceInput = ''"
            class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Fail Dialog -->
    <div
      v-if="failingPayout"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="failingPayout = null"
    >
      <div class="w-full max-w-md rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800 to-navy-900 p-6">
        <h3 class="text-xl font-semibold text-white mb-4">Mark as Failed</h3>
        <p class="text-sm text-navy-300 mb-4">
          Provide a reason for marking this payout as failed.
        </p>
        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Failure Reason *</label>
            <textarea
              v-model="failReasonInput"
              required
              rows="3"
              class="w-full rounded-lg border border-navy-600 bg-navy-900/50 p-3 text-white placeholder-navy-500 focus:border-navy-500 focus:outline-none"
              placeholder="Enter failure reason..."
            ></textarea>
          </div>
        </div>
        <div class="mt-6 flex gap-3">
          <button
            @click="failPayout"
            :disabled="!failReasonInput.trim() || processing === failingPayout.id"
            class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ processing === failingPayout.id ? 'Processing...' : 'Mark Failed' }}
          </button>
          <button
            @click="failingPayout = null; failReasonInput = ''"
            class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const toast = useToast()

const { data: payouts, refresh, pending: loading } = await useFetch('/api/admin/payouts')

const statusFilter = ref('')
const processing = ref<string | null>(null)
const completingPayout = ref<any>(null)
const failingPayout = ref<any>(null)
const referenceInput = ref('')
const failReasonInput = ref('')

const filteredPayouts = computed(() => {
  if (!payouts.value) return []
  if (!statusFilter.value) return payouts.value
  return payouts.value.filter((p: any) => p.status === statusFilter.value)
})

const pendingCount = computed(() => 
  (payouts.value || []).filter((p: any) => p.status === 'PENDING').length
)

const processingCount = computed(() => 
  (payouts.value || []).filter((p: any) => p.status === 'PROCESSING').length
)

const totalPendingAmount = computed(() => 
  (payouts.value || [])
    .filter((p: any) => p.status === 'PENDING' || p.status === 'PROCESSING')
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0)
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function updateStatus(payoutId: string, status: string) {
  try {
    processing.value = payoutId
    await $fetch(`/api/admin/payouts/${payoutId}/process`, {
      method: 'POST',
      body: { status }
    })
    await refresh()
    toast.success(`Payout status updated to ${status}`)
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to update payout')
  } finally {
    processing.value = null
  }
}

function showCompleteDialog(payout: any) {
  completingPayout.value = payout
  referenceInput.value = ''
}

async function completePayout() {
  if (!completingPayout.value || !referenceInput.value.trim()) return
  
  try {
    processing.value = completingPayout.value.id
    await $fetch(`/api/admin/payouts/${completingPayout.value.id}/process`, {
      method: 'POST',
      body: { 
        status: 'COMPLETED',
        reference: referenceInput.value
      }
    })
    await refresh()
    completingPayout.value = null
    referenceInput.value = ''
    toast.success('Payout marked as completed!')
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to complete payout')
  } finally {
    processing.value = null
  }
}

function showFailDialog(payout: any) {
  failingPayout.value = payout
  failReasonInput.value = ''
}

async function failPayout() {
  if (!failingPayout.value || !failReasonInput.value.trim()) return
  
  try {
    processing.value = failingPayout.value.id
    await $fetch(`/api/admin/payouts/${failingPayout.value.id}/process`, {
      method: 'POST',
      body: { 
        status: 'FAILED',
        notes: failReasonInput.value
      }
    })
    await refresh()
    failingPayout.value = null
    failReasonInput.value = ''
    toast.success('Payout marked as failed')
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to update payout')
  } finally {
    processing.value = null
  }
}
</script>
