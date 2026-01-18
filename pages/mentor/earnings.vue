<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Earnings Overview</h1>
        <p class="text-slate-600">Track your income from mentorship sessions</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openPayoutModal"
          class="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Request Payout
        </button>
        <NuxtLink 
          to="/mentor/payouts" 
          class="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </NuxtLink>
        <NuxtLink 
          to="/mentor" 
          class="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Dashboard
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <!-- Total Lifetime Earnings -->
      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 rounded-lg bg-blue-50 text-blue-900">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Lifetime</span>
        </div>
        <div class="text-3xl font-bold text-slate-900 flex items-baseline gap-2">
          <span>{{ totalEarnings }}</span>
          <span class="text-sm font-medium text-slate-400 uppercase">Credits</span>
        </div>
        <p class="mt-2 text-xs text-slate-500">From {{ completedSessions.length }} sessions</p>
      </div>

      <!-- Current Balance (Available) -->
      <div class="p-6 rounded-2xl bg-primary-500 border border-primary-600 shadow-sm text-white">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 rounded-lg bg-white/10 text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-xs font-bold text-white/90 uppercase tracking-wider">Available for Payout</span>
        </div>
        <div class="text-3xl font-bold text-white flex items-baseline gap-2">
          <span>{{ mentorProfile?.withdrawableBalance || 0 }}</span>
          <span class="text-sm font-medium text-slate-400 uppercase">Credits</span>
        </div>
        <div class="mt-2 flex items-center justify-between">
            <p class="text-xs text-slate-300 font-medium">
            ≈ ${{ ((mentorProfile?.withdrawableBalance || 0) * 0.10).toFixed(2) }} USD
            </p>
            <p class="text-[10px] text-slate-400">Earned from sessions</p>
        </div>
      </div>

      <!-- Pending -->
      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 rounded-lg bg-blue-50 text-blue-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</span>
        </div>
        <div class="text-3xl font-bold text-slate-900 flex items-baseline gap-2">
          <span>{{ pendingEarnings }}</span>
          <span class="text-sm font-medium text-slate-400 uppercase">Credits</span>
        </div>
        <p class="mt-2 text-xs text-slate-500">{{ pendingSessions.length }} sessions upcoming</p>
      </div>

      <!-- Info -->
      <div class="p-6 rounded-2xl bg-primary-500 border border-primary-600 text-white shadow-lg shadow-primary-900/20">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-2 rounded-lg bg-white/10">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-xs font-bold text-white uppercase tracking-wider">Cashout Info</span>
        </div>
        <div class="text-sm space-y-2">
          <p class="text-white">• 1 Credit = $0.10 USD</p>
          <p class="text-white">• Only earned credits are withdrawable</p>
          <p class="text-white">• Processing time: 24-48 hours</p>
        </div>
      </div>
    </div>

    <!-- Earnings History -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-900">Transaction History</h2>
        <div class="flex items-center gap-2">
          <select class="text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:border-slate-400 outline-none">
            <option>All Time</option>
            <option>This Month</option>
            <option>Last Month</option>
          </select>
        </div>
      </div>

      <div v-if="pendingFetch" class="p-12 text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-r-transparent"></div>
        <p class="mt-4 text-slate-500">Loading history...</p>
      </div>

      <div v-else-if="!completedSessions.length" class="p-12 text-center text-slate-500">
        <p>No earnings records found.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="session in completedSessions" :key="session.id" class="hover:bg-slate-50/20 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-slate-900">{{ formatDate(session.scheduledAt) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-900">Mentorship: {{ session.clientName }}</div>
                <div class="text-xs text-slate-500">{{ session.duration }} mins session</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-bold text-slate-700">+ {{ Math.floor(session.creditsCost * 0.6) }} Credits</div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Completed
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Payout Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPayoutModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closePayoutModal"></div>

          <!-- Modal -->
          <div class="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
            <div class="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 class="text-lg font-bold text-slate-900">{{ payoutSuccess ? 'Request Submitted!' : 'Request Payout' }}</h3>
              <p class="text-sm text-slate-500">{{ payoutSuccess ? 'Your request has been received' : 'Cash out your earned credits' }}</p>
            </div>

            <!-- Success State -->
            <div v-if="payoutSuccess" class="p-6 text-center space-y-5">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div class="space-y-1">
                <p class="text-slate-900 font-medium text-lg">Payout Pending</p>
                <p class="text-slate-500 text-sm">We'll process your request within 24-48 hours. You can speed this up by notifying the admin.</p>
              </div>

              <div class="pt-2 space-y-3">
                <button 
                  @click="openWhatsapp"
                  class="w-full px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Notify Admin on WhatsApp
                </button>
                <button 
                  @click="closePayoutModal"
                  class="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <div v-else class="p-6 space-y-4">
              <!-- Available Balance Info -->
              <div class="p-3 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center px-4">
                <span class="text-xs font-medium text-slate-600">Available:</span>
                <span class="text-sm font-bold text-slate-900">{{ mentorProfile?.withdrawableBalance || 0 }} Credits</span>
              </div>

              <!-- Amount -->
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Cashout Amount (Credits)</label>
                <div class="relative">
                  <input 
                    type="number" 
                    v-model="payoutForm.amount"
                    :max="mentorProfile?.withdrawableBalance || 0"
                    placeholder="Enter amount"
                    class="w-full pl-3 pr-12 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-sm font-medium"
                  >
                  <span class="absolute right-3 top-2 text-sm text-slate-500">Credits</span>
                </div>
                <p class="mt-1 text-xs text-slate-500 font-medium flex justify-between">
                   <span>Est. Value: ${{ (payoutForm.amount * 0.10).toFixed(2) }} USD</span>
                   <span v-if="payoutForm.amount > (mentorProfile?.withdrawableBalance || 0)" class="text-red-500">Exceeds balance</span>
                </p>
              </div>

              <!-- Payment Method -->
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
                <select 
                  v-model="payoutForm.method"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-sm"
                >
                  <option value="Cash">Cash Collection (Harare)</option>
                  <option value="Ecocash">Ecocash (ZWG)</option>
                  <option value="Innbucks">Innbucks (USD)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <!-- Details -->
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Payment Details</label>
                <textarea 
                  v-model="payoutForm.details"
                  rows="3"
                  placeholder="Enter phone number, bank account details, or collection preference..."
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-sm resize-none"
                ></textarea>
              </div>

              <!-- Warning -->
              <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <p>⚠️ Upon request, these credits will be deducted from your earnings balance. Processing takes 24-48 hours.</p>
              </div>

              <!-- Buttons -->
              <div class="flex gap-3 pt-2">
                <button 
                  @click="closePayoutModal"
                  class="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  @click="submitPayout"
                  :disabled="payoutLoading || payoutForm.amount <= 0 || payoutForm.amount > (mentorProfile?.withdrawableBalance || 0)"
                  class="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg v-if="payoutLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ payoutLoading ? 'Processing...' : 'Confirm Request' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'community',
  middleware: ['auth']
})

const { user } = useAuth()
// Fetch Mentor Profile for accurate Withdrawable Balance
const { data: mentorProfile, refresh: refreshProfile, pending: pendingProfile } = useFetch('/api/community/mentors/me')

const { data: sessions, pending: sessionsLoading } = await useFetch('/api/community/bookings', {
  query: { type: 'mentor' }
})
const { success, error } = useToast()

const pendingFetch = computed(() => pendingProfile.value || sessionsLoading.value)

// Payout Modal Logic
const showPayoutModal = ref(false)
const payoutSuccess = ref(false)
const payoutLoading = ref(false)
const payoutForm = reactive({
  amount: 0,
  method: 'Cash',
  details: ''
})

const openPayoutModal = () => {
  payoutSuccess.value = false
  payoutForm.amount = mentorProfile.value?.withdrawableBalance || 0
  payoutForm.details = '' // Reset details
  showPayoutModal.value = true
}

const closePayoutModal = () => {
  showPayoutModal.value = false
  if (payoutSuccess.value) {
    payoutSuccess.value = false // Reset for next time
  }
}

const openWhatsapp = () => {
  const config = useRuntimeConfig()
  const adminPhone = config.public.adminWhatsapp
  if (!adminPhone) {
    error('Admin WhatsApp number not configured')
    return
  }
  const message = encodeURIComponent(
    `Hello Admin, I have requested a payout.\n\nUser: ${user.value?.name}\nAmount: ${payoutForm.amount} Credits\nMethod: ${payoutForm.method}\n\nPlease process this request.`
  )
  window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank')
}

const submitPayout = async () => {
  if (!payoutForm.amount || payoutForm.amount <= 0) {
    error('Please enter a valid amount')
    return
  }
  if (payoutForm.amount > (mentorProfile.value?.withdrawableBalance || 0)) {
    error('Amount exceeds withdrawable balance')
    return
  }
  if (!payoutForm.details) {
    error('Please provide payment details')
    return
  }

  payoutLoading.value = true
  try {
    await $fetch('/api/community/payouts/request', {
      method: 'POST',
      body: {
        creditsAmount: payoutForm.amount,
        paymentMethod: payoutForm.method,
        paymentDetails: payoutForm.details
      }
    })

    success('Payout request submitted successfully!')
    await refreshProfile() // Refresh balance
    payoutSuccess.value = true
    // closePayoutModal() - Don't close, show success details
  } catch (err: any) {
    error(err.data?.message || 'Failed to submit request')
  } finally {
    payoutLoading.value = false
  }
}

// Stats & Helpers
const completedSessions = computed(() => {
  return sessions.value.filter((s: any) => s.status === 'COMPLETED')
})

const pendingSessions = computed(() => {
  return sessions.value.filter((s: any) => s.status !== 'COMPLETED' && s.status !== 'CANCELLED')
})

const totalEarnings = computed(() => {
  // Use mentorProfile.totalEarnings if available (cumulative from specific field), 
  // or calculate from sessions as fallback.
  // Note: MentorProfile.totalEarnings is better as it persists even if we cleared logs.
  if (mentorProfile.value?.totalEarnings) return mentorProfile.value.totalEarnings
  
  // Fallback calculation:
  return completedSessions.value.reduce((acc: number, curr: any) => acc + Math.floor(curr.creditsCost * 0.6), 0)
})

const pendingEarnings = computed(() => {
  // Potential earnings (60% of pending sessions)
  return pendingSessions.value.reduce((acc: number, curr: any) => acc + Math.floor(curr.creditsCost * 0.6), 0)
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
