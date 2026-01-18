<template>
  <section class="mx-auto max-w-4xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <NuxtLink
        to="/instructor/payouts"
        class="inline-flex items-center gap-2 text-sm text-navy-400 hover:text-navy-300 mb-4"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Payouts
      </NuxtLink>
      <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Request Payout
      </h1>
      <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">Enter your payment details to request a payout of your earnings</p>
    </div>

    <!-- Available Balance -->
    <div class="mb-8 rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-navy-400">Available Balance</p>
          <p class="text-3xl font-bold text-white">${{ availableBalance.toFixed(2) }}</p>
        </div>
        <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
          <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Request Form -->
    <form @submit.prevent="submitRequest" class="space-y-6">
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 space-y-6">
        
        <!-- Amount -->
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">Amount to Withdraw (USD) *</label>
          <input
            v-model.number="form.amount"
            type="number"
            step="0.01"
            min="1"
            :max="availableBalance"
            required
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="Enter amount"
          />
          <p class="mt-1 text-xs text-navy-400">Minimum: $1.00 | Maximum: ${{ availableBalance.toFixed(2) }}</p>
        </div>

        <!-- Payment Method -->
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">Payment Method *</label>
          <select
            v-model="form.method"
            required
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">Select payment method</option>
            <option value="ECOCASH">EcoCash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="PAYPAL">PayPal</option>
            <option value="INNBUCKS">InnBucks</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <!-- EcoCash Details -->
        <div v-if="form.method === 'ECOCASH'" class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">EcoCash Phone Number *</label>
            <input
              v-model="form.paymentDetails.phoneNumber"
              type="tel"
              required
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="e.g., 077XXXXXXX"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Account Holder Name *</label>
            <input
              v-model="form.paymentDetails.accountName"
              type="text"
              required
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Name registered on EcoCash"
            />
          </div>
        </div>

        <!-- InnBucks Details -->
        <div v-if="form.method === 'INNBUCKS'" class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">InnBucks Phone Number *</label>
            <input
              v-model="form.paymentDetails.phoneNumber"
              type="tel"
              required
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="e.g., 077XXXXXXX"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Account Holder Name *</label>
            <input
              v-model="form.paymentDetails.accountName"
              type="text"
              required
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Name registered on InnBucks"
            />
          </div>
        </div>

        <!-- Bank Transfer Details -->
        <div v-if="form.method === 'BANK_TRANSFER'" class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Bank Name *</label>
            <input
              v-model="form.paymentDetails.bankName"
              type="text"
              required
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="e.g., CBZ Bank"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Account Number *</label>
            <input
              v-model="form.paymentDetails.accountNumber"
              type="text"
              required
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Your bank account number"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Account Holder Name *</label>
            <input
              v-model="form.paymentDetails.accountName"
              type="text"
              required
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Name on the account"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Branch Code (Optional)</label>
            <input
              v-model="form.paymentDetails.branchCode"
              type="text"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Branch code if applicable"
            />
          </div>
        </div>

        <!-- PayPal Details -->
        <div v-if="form.method === 'PAYPAL'" class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">PayPal Email *</label>
            <input
              v-model="form.paymentDetails.paypalEmail"
              type="email"
              required
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <!-- Other Payment Method -->
        <div v-if="form.method === 'OTHER'" class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Payment Method Name *</label>
            <input
              v-model="form.paymentDetails.otherMethodName"
              type="text"
              required
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="e.g., Mukuru, WorldRemit, etc."
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Account Details *</label>
            <textarea
              v-model="form.paymentDetails.otherDetails"
              required
              rows="3"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Provide all necessary details for receiving payment"
            ></textarea>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">Additional Notes (Optional)</label>
          <textarea
            v-model="form.notes"
            rows="2"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            placeholder="Any additional information for the admin"
          ></textarea>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex gap-4 justify-end">
        <NuxtLink
          to="/instructor/payouts"
          class="rounded-lg border border-navy-600 bg-navy-800/50 px-6 py-3 text-sm font-medium text-white hover:bg-navy-700/50 transition-colors"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="submitting || !isFormValid"
          class="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-medium text-white hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? 'Submitting...' : 'Submit Payout Request' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const router = useRouter()
const toast = useToast()

// Fetch available balance
const { data: earningsData } = await useFetch('/api/instructor/earnings')
const availableBalance = computed(() => {
  if (!earningsData.value) return 0
  return earningsData.value.pendingTotal || 0
})

const form = reactive({
  amount: 0,
  method: '',
  notes: '',
  paymentDetails: {
    phoneNumber: '',
    accountName: '',
    bankName: '',
    accountNumber: '',
    branchCode: '',
    paypalEmail: '',
    otherMethodName: '',
    otherDetails: ''
  }
})

const submitting = ref(false)

const isFormValid = computed(() => {
  if (!form.amount || form.amount < 1 || form.amount > availableBalance.value) return false
  if (!form.method) return false
  
  switch (form.method) {
    case 'ECOCASH':
    case 'INNBUCKS':
      return form.paymentDetails.phoneNumber && form.paymentDetails.accountName
    case 'BANK_TRANSFER':
      return form.paymentDetails.bankName && form.paymentDetails.accountNumber && form.paymentDetails.accountName
    case 'PAYPAL':
      return form.paymentDetails.paypalEmail
    case 'OTHER':
      return form.paymentDetails.otherMethodName && form.paymentDetails.otherDetails
    default:
      return false
  }
})

async function submitRequest() {
  if (!isFormValid.value) return
  
  try {
    submitting.value = true
    
    await $fetch('/api/instructor/payouts', {
      method: 'POST',
      body: {
        amount: form.amount,
        method: form.method,
        notes: form.notes || null,
        paymentDetails: form.paymentDetails
      }
    })
    
    toast.success('Payout request submitted successfully!')
    router.push('/instructor/payouts')
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to submit payout request')
  } finally {
    submitting.value = false
  }
}
</script>
