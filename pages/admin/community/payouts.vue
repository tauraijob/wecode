<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Payouts</h1>
        <p class="text-slate-500">Process mentor payout requests</p>
      </div>
      
      <!-- Filter Tabs -->
      <div class="flex bg-slate-100 rounded-lg p-1">
        <button 
          v-for="tab in tabs" :key="tab.value"
          @click="filter = tab.value"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            filter === tab.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="ml-1.5 text-xs opacity-70">({{ tab.count }})</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-20 bg-white rounded-xl animate-pulse"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!payouts?.length" class="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-900 mb-1">No {{ filter || '' }} payouts</h3>
      <p class="text-slate-500 text-sm">No payout requests match this filter</p>
    </div>

    <!-- Payouts List -->
    <div v-else class="space-y-4">
      <div 
        v-for="payout in payouts" 
        :key="payout.id" 
        class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
      >
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <!-- Info -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="font-semibold text-slate-900">{{ payout.instructor.name }}</h3>
              <span 
                class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="{
                  'bg-amber-50 text-amber-600': payout.status === 'PENDING',
                  'bg-green-50 text-green-600': payout.status === 'PROCESSED',
                  'bg-red-50 text-red-600': payout.status === 'REJECTED'
                }"
              >
                {{ payout.status }}
              </span>
            </div>
            <p class="text-sm text-slate-500 mb-2">{{ payout.instructor.email }}</p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p class="text-slate-400 text-xs">Amount</p>
                <p class="font-bold text-slate-900">${{ Number(payout.amount).toFixed(2) }} {{ payout.currency }}</p>
              </div>
              <div>
                <p class="text-slate-400 text-xs">Method</p>
                <p class="text-slate-700">{{ payout.method?.replace('_', ' ') || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-slate-400 text-xs">Requested</p>
                <p class="text-slate-700">{{ formatDate(payout.requestedAt) }}</p>
              </div>
              <div v-if="payout.processedAt">
                <p class="text-slate-400 text-xs">Processed</p>
                <p class="text-slate-700">{{ formatDate(payout.processedAt) }}</p>
              </div>
            </div>
            
            <p v-if="payout.notes" class="mt-3 text-xs text-slate-500 bg-slate-50 p-2 rounded">{{ payout.notes }}</p>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-2">
            <template v-if="payout.status === 'PENDING'">
              <button 
                @click="openProcessModal(payout)" 
                :disabled="processing === payout.id"
                class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Mark as Processed
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Process Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showProcessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div class="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">Process Payout</h3>
            <p class="text-sm text-slate-600 mb-4">
              Confirm that you've sent <strong>${{ Number(selectedPayout?.amount).toFixed(2) }}</strong> to <strong>{{ selectedPayout?.instructor?.name }}</strong>.
            </p>
            <input 
              v-model="reference" 
              placeholder="Transaction reference (optional)"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-4"
            />
            <div class="flex gap-3 justify-end">
              <button @click="showProcessModal = false" class="px-4 py-2 text-slate-600 hover:text-slate-900">Cancel</button>
              <button @click="process()" :disabled="processing" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50">
                Confirm Processed
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin-community',
  middleware: ['auth']
})

const { error: toastError, success } = useToast()

const filter = ref<'' | 'PENDING' | 'PROCESSED'>('PENDING')
const processing = ref<string | null>(null)
const showProcessModal = ref(false)
const selectedPayout = ref<any>(null)
const reference = ref('')

const tabs = computed(() => [
  { label: 'Pending', value: 'PENDING', count: data.value?.stats?.pending },
  { label: 'Processed', value: 'PROCESSED', count: data.value?.stats?.processed },
  { label: 'All', value: '', count: data.value?.stats?.total }
])

const { data, pending, refresh } = useFetch<any>(() => `/api/admin/community/payouts?status=${filter.value}`, {
  watch: [filter]
})

const payouts = computed(() => data.value?.payouts || [])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const openProcessModal = (payout: any) => {
  selectedPayout.value = payout
  reference.value = ''
  showProcessModal.value = true
}

const process = async () => {
  if (!selectedPayout.value) return
  processing.value = selectedPayout.value.id
  try {
    await $fetch(`/api/admin/community/payouts/${selectedPayout.value.id}/process`, { 
      method: 'POST',
      body: { reference: reference.value }
    })
    success('Payout marked as processed')
    showProcessModal.value = false
    refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Failed to process payout')
  } finally {
    processing.value = null
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
