<template>
  <div>
    <!-- Header -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-lg font-bold text-slate-900">Payouts</h1>
        <p class="text-xs text-slate-500">Process mentor payout requests</p>
      </div>
      
      <!-- Filter Tabs -->
      <div class="flex bg-slate-100 rounded-md p-0.5">
        <button 
          v-for="tab in tabs" :key="tab.value"
          @click="filter = tab.value"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded transition-colors',
            filter === tab.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="ml-1 text-[10px] opacity-70">({{ tab.count }})</span>
        </button>
      </div>
    </div>

    <!-- Payment Methods Legend - Compact -->
    <div class="mb-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
      <h3 class="text-xs font-semibold text-slate-600 mb-2">Payout Methods</h3>
      <div class="flex flex-wrap gap-2">
        <div class="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded border border-green-100">
          <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span class="text-[10px] font-medium text-green-700">Cash</span>
        </div>
        <div class="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded border border-emerald-100">
          <svg class="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span class="text-[10px] font-medium text-emerald-700">Ecocash</span>
        </div>
        <div class="flex items-center gap-1.5 px-2 py-1 bg-orange-50 rounded border border-orange-100">
          <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-[10px] font-medium text-orange-700">Innbucks</span>
        </div>
        <div class="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded border border-blue-100">
          <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span class="text-[10px] font-medium text-blue-700">Bank Transfer</span>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-2">
      <div v-for="i in 3" :key="i" class="h-14 bg-white rounded-lg animate-pulse"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!payouts?.length" class="bg-white rounded-lg border border-slate-200 p-8 text-center">
      <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold text-slate-900 mb-1">No {{ filter || '' }} payouts</h3>
      <p class="text-slate-500 text-xs">No payout requests match this filter</p>
    </div>

    <!-- Payouts List - Compact -->
    <div v-else class="space-y-2">
      <div 
        v-for="payout in payouts" 
        :key="payout.id" 
        class="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow transition-shadow"
      >
        <div class="flex flex-col lg:flex-row lg:items-center gap-3">
          <!-- Left: Mentor Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-sm font-semibold text-slate-900 truncate">{{ payout.instructor.name }}</h3>
              <span 
                class="text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0"
                :class="{
                  'bg-amber-50 text-amber-600 border border-amber-200': payout.status === 'PENDING',
                  'bg-green-50 text-green-600 border border-green-200': payout.status === 'COMPLETED',
                  'bg-red-50 text-red-600 border border-red-200': payout.status === 'FAILED'
                }"
              >
                {{ payout.status }}
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span class="flex items-center gap-1 truncate">
                <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ payout.instructor.email }}
              </span>
              <span v-if="payout.instructor.phone" class="flex items-center gap-1">
                <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {{ payout.instructor.phone }}
              </span>
            </div>
          </div>
          
          <!-- Middle: Stats Row -->
          <div class="flex flex-wrap items-center gap-2 lg:gap-3">
            <div class="px-2.5 py-1.5 bg-slate-50 rounded-md text-center min-w-[70px]">
              <p class="text-[10px] text-slate-400">Amount</p>
              <p class="text-sm font-bold text-slate-900">${{ Number(payout.amount).toFixed(2) }}</p>
            </div>
            <div class="px-2.5 py-1.5 rounded-md text-center min-w-[70px]" :class="getMethodBgClass(payout.method)">
              <p class="text-[10px]" :class="getMethodLabelClass(payout.method)">Method</p>
              <p class="text-xs font-semibold" :class="getMethodTextClass(payout.method)">{{ formatMethodName(payout.method) }}</p>
            </div>
            <div class="px-2.5 py-1.5 bg-slate-50 rounded-md text-center min-w-[80px]">
              <p class="text-[10px] text-slate-400">Requested</p>
              <p class="text-xs font-medium text-slate-700">{{ formatDate(payout.requestedAt) }}</p>
            </div>
            <div v-if="payout.processedAt" class="px-2.5 py-1.5 bg-green-50 rounded-md text-center min-w-[80px]">
              <p class="text-[10px] text-green-600">Processed</p>
              <p class="text-xs font-medium text-green-700">{{ formatDate(payout.processedAt) }}</p>
            </div>
          </div>
          
          <!-- Right: Actions -->
          <div class="flex gap-2 lg:ml-auto shrink-0">
            <template v-if="payout.status === 'PENDING'">
              <button 
                @click="openProcessModal(payout)" 
                :disabled="processing === payout.id"
                class="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Process
              </button>
              <button 
                @click="openRejectModal(payout)" 
                :disabled="processing === payout.id"
                class="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-medium rounded-md transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </template>
            <template v-else>
              <div class="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-md">
                {{ payout.status === 'COMPLETED' ? '✓ Done' : '✕ Failed' }}
              </div>
            </template>
          </div>
        </div>
        
        <!-- Expandable Details Row -->
        <div v-if="payout.notes || payout.reference" class="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-3">
          <div v-if="payout.notes" class="flex-1 min-w-[200px]">
            <p class="text-[10px] font-semibold text-slate-400 uppercase mb-1">Payment Details</p>
            <div class="flex flex-wrap gap-x-4 gap-y-0.5">
              <span v-for="(line, idx) in parsePaymentDetails(payout.notes)" :key="idx" class="text-xs">
                <span class="text-slate-500">{{ line.label }}:</span>
                <span class="font-medium text-slate-700 ml-1">{{ line.value }}</span>
              </span>
            </div>
          </div>
          <div v-if="payout.reference" class="px-2 py-1 bg-blue-50 rounded border border-blue-100">
            <p class="text-[10px] text-blue-600">Ref: <span class="font-mono font-medium text-blue-800">{{ payout.reference }}</span></p>
          </div>
        </div>
      </div>
    </div>

    <!-- Process Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showProcessModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div class="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 rounded-full bg-green-100 text-green-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-slate-900">Process Payout</h3>
            </div>
            
            <div class="p-4 bg-slate-50 rounded-lg mb-4">
              <p class="text-sm text-slate-600">
                Confirm payment of <strong class="text-green-600">${{ Number(selectedPayout?.amount).toFixed(2) }}</strong> to:
              </p>
              <p class="font-semibold text-slate-900 mt-1">{{ selectedPayout?.instructor?.name }}</p>
              <p class="text-sm text-slate-500">via {{ formatMethodName(selectedPayout?.method) }}</p>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Transaction Reference</label>
              <input 
                v-model="reference" 
                placeholder="Enter reference number (optional)"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div class="flex gap-3 justify-end">
              <button @click="showProcessModal = false" class="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium">Cancel</button>
              <button @click="process()" :disabled="processing" class="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2">
                <svg v-if="processing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Confirm Processed
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Reject Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div class="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 rounded-full bg-red-100 text-red-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-slate-900">Reject Payout</h3>
            </div>
            
            <p class="text-sm text-slate-600 mb-4">
              Are you sure you want to reject the payout request of <strong>${{ Number(selectedPayout?.amount).toFixed(2) }}</strong> from <strong>{{ selectedPayout?.instructor?.name }}</strong>?
            </p>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 mb-1">Reason for Rejection</label>
              <textarea 
                v-model="rejectReason" 
                rows="3"
                placeholder="Provide a reason for rejection..."
                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              ></textarea>
            </div>
            
            <div class="flex gap-3 justify-end">
              <button @click="showRejectModal = false" class="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium">Cancel</button>
              <button @click="reject()" :disabled="processing || !rejectReason" class="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

definePageMeta({
  layout: 'community-admin',
  middleware: ['community-admin']
})

const { error: toastError, success } = useToast()

const filter = ref<'' | 'PENDING' | 'COMPLETED'>('PENDING')
const processing = ref<string | null>(null)
const showProcessModal = ref(false)
const showRejectModal = ref(false)
const selectedPayout = ref<any>(null)
const reference = ref('')
const rejectReason = ref('')

const tabs = computed(() => [
  { label: 'Pending', value: 'PENDING', count: data.value?.stats?.pending },
  { label: 'Completed', value: 'COMPLETED', count: data.value?.stats?.completed },
  { label: 'All', value: '', count: data.value?.stats?.total }
])

const { data, pending, refresh } = useFetch<any>(() => `/api/admin/community/payouts?status=${filter.value}`, {
  watch: [filter]
})

const payouts = computed(() => data.value?.payouts || [])

// Format helpers
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const formatMethodName = (method: string | undefined) => {
  if (!method) return 'N/A'
  const methodNames: Record<string, string> = {
    'Cash': 'Cash Collection',
    'Ecocash': 'Ecocash',
    'Innbucks': 'Innbucks',
    'Bank Transfer': 'Bank Transfer',
    'Bank_Transfer': 'Bank Transfer'
  }
  return methodNames[method] || method.replace('_', ' ')
}

// Payment method styling helpers
const getMethodBgClass = (method: string | undefined) => {
  const classes: Record<string, string> = {
    'Cash': 'bg-green-50',
    'Ecocash': 'bg-emerald-50',
    'Innbucks': 'bg-orange-50',
    'Bank Transfer': 'bg-blue-50',
    'Bank_Transfer': 'bg-blue-50'
  }
  return classes[method || ''] || 'bg-slate-50'
}

const getMethodLabelClass = (method: string | undefined) => {
  const classes: Record<string, string> = {
    'Cash': 'text-green-600',
    'Ecocash': 'text-emerald-600',
    'Innbucks': 'text-orange-600',
    'Bank Transfer': 'text-blue-600',
    'Bank_Transfer': 'text-blue-600'
  }
  return classes[method || ''] || 'text-slate-400'
}

const getMethodTextClass = (method: string | undefined) => {
  const classes: Record<string, string> = {
    'Cash': 'text-green-700',
    'Ecocash': 'text-emerald-700',
    'Innbucks': 'text-orange-700',
    'Bank Transfer': 'text-blue-700',
    'Bank_Transfer': 'text-blue-700'
  }
  return classes[method || ''] || 'text-slate-700'
}

const getMethodIconClass = (method: string | undefined) => {
  const classes: Record<string, string> = {
    'Cash': 'text-green-600',
    'Ecocash': 'text-emerald-600',
    'Innbucks': 'text-orange-600',
    'Bank Transfer': 'text-blue-600',
    'Bank_Transfer': 'text-blue-600'
  }
  return classes[method || ''] || 'text-slate-500'
}

// Method icons - return SVG component
const getMethodIcon = (method: string | undefined) => {
  const icons: Record<string, any> = {
    'Cash': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' })
    ]),
    'Ecocash': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })
    ]),
    'Innbucks': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
    ]),
    'Bank Transfer': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' })
    ]),
    'Bank_Transfer': h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' })
    ])
  }
  return icons[method || ''] || h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' })
  ])
}

// Parse payment details from notes field
const parsePaymentDetails = (notes: string) => {
  if (!notes) return []
  
  const lines = notes.split('\n').filter(line => line.trim())
  const result: { label: string; value: string }[] = []
  
  for (const line of lines) {
    if (line.includes(':')) {
      const [label, ...valueParts] = line.split(':')
      result.push({
        label: label.trim(),
        value: valueParts.join(':').trim()
      })
    } else {
      result.push({
        label: 'Info',
        value: line.trim()
      })
    }
  }
  
  return result
}

// Modal actions
const openProcessModal = (payout: any) => {
  selectedPayout.value = payout
  reference.value = ''
  showProcessModal.value = true
}

const openRejectModal = (payout: any) => {
  selectedPayout.value = payout
  rejectReason.value = ''
  showRejectModal.value = true
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

const reject = async () => {
  if (!selectedPayout.value || !rejectReason.value) return
  processing.value = selectedPayout.value.id
  try {
    await $fetch(`/api/admin/community/payouts/${selectedPayout.value.id}/reject`, { 
      method: 'POST',
      body: { reason: rejectReason.value }
    })
    success('Payout request rejected')
    showRejectModal.value = false
    refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Failed to reject payout')
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
