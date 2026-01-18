<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Payout History</h1>
        <p class="text-slate-600">View your past cashout requests and their status</p>
      </div>
      <NuxtLink 
        to="/mentor/earnings" 
        class="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 self-start sm:self-auto shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Earnings
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-16 bg-slate-100 rounded-xl animate-pulse"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8 rounded-xl bg-red-50 border border-red-100 text-center">
      <p class="text-red-600 font-medium">Failed to load payout history</p>
      <button 
        @click="refresh" 
        class="mt-2 text-red-700 underline text-sm hover:text-red-800"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!payouts.length" class="p-12 rounded-xl bg-white border border-slate-200 text-center shadow-sm">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-900 mb-1">No payout history</h3>
      <p class="text-slate-500 text-sm mb-4">You haven't requested any payouts yet.</p>
      <NuxtLink 
        to="/mentor/earnings"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
      >
        Request Payout
      </NuxtLink>
    </div>

    <!-- History Table -->
    <div v-else class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Method</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="payout in payouts" :key="payout.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <p class="text-sm font-medium text-slate-900">{{ formatDate(payout.requestedAt) }}</p>
                <p class="text-xs text-slate-500">{{ formatTime(payout.requestedAt) }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-bold text-slate-900">${{ Number(payout.amount).toFixed(2) }}</span>
                <span class="text-xs text-slate-500 ml-1">{{ payout.currency }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="p-1.5 rounded bg-slate-100 text-slate-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span class="text-sm text-slate-700 capitalize">{{ payout.method.replace('_', ' ').toLowerCase() }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                  :class="{
                    'bg-yellow-50 text-yellow-700 border-yellow-200': payout.status === 'PENDING',
                    'bg-green-50 text-green-700 border-green-200': payout.status === 'PROCESSED' || payout.status === 'COMPLETED',
                    'bg-red-50 text-red-700 border-red-200': payout.status === 'REJECTED' || payout.status === 'FAILED'
                  }"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="{
                    'bg-yellow-500': payout.status === 'PENDING',
                    'bg-green-500': payout.status === 'PROCESSED' || payout.status === 'COMPLETED',
                    'bg-red-500': payout.status === 'REJECTED' || payout.status === 'FAILED'
                  }"></span>
                  {{ payout.status }}
                </span>
                <p v-if="payout.processedAt" class="mt-1 text-[10px] text-slate-400">
                  {{ formatDate(payout.processedAt) }}
                </p>
              </td>
              <td class="px-6 py-4 max-w-xs">
                <p class="text-xs text-slate-600 truncate" :title="payout.notes">{{ payout.notes }}</p>
                <!-- Notify Admin Action -->
                <button 
                  v-if="payout.status === 'PENDING'"
                  @click="openWhatsapp(payout)"
                  class="mt-2 inline-flex items-center gap-1 text-[10px] text-green-600 hover:text-green-700 font-medium bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Notify Admin
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community',
  middleware: ['auth']
})

const { data: result, pending, error, refresh } = useFetch<any>('/api/community/payouts/history')
const { user } = useAuth()
const { error: toastError } = useToast()

const payouts = computed(() => result.value?.payouts || [])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

const openWhatsapp = (payout: any) => {
  const config = useRuntimeConfig()
  const adminPhone = config.public.adminWhatsapp
  if (!adminPhone) {
    toastError('Admin WhatsApp number not configured')
    return
  }
  const message = encodeURIComponent(
    `Hello Admin, I'm following up on my payout request.\n\nUser: ${user.value?.name}\nAmount: ${payout.amount} ${payout.currency}\nDate: ${formatDate(payout.requestedAt)}\n\nPlease process this request.`
  )
  window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank')
}
</script>
