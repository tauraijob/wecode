<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Earnings Dashboard
      </h1>
      <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">Track your course earnings and payout requests</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
        <p class="mt-4 text-navy-300">Loading earnings...</p>
      </div>
    </div>

    <!-- Summary Cards -->
    <div v-else-if="summary" class="grid gap-6 md:grid-cols-4 mb-8">
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="text-sm font-medium text-navy-300 mb-1">Total Earned</div>
        <div class="text-3xl font-bold text-white">${{ summary.totalEarned.toFixed(2) }}</div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="text-sm font-medium text-navy-300 mb-1">Available for Payout</div>
        <div class="text-3xl font-bold text-green-400">${{ summary.availableForPayout.toFixed(2) }}</div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="text-sm font-medium text-navy-300 mb-1">Paid Out</div>
        <div class="text-3xl font-bold text-blue-400">${{ summary.paidAmount.toFixed(2) }}</div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="text-sm font-medium text-navy-300 mb-1">Pending Earnings</div>
        <div class="text-3xl font-bold text-amber-400">{{ summary.pendingCount }}</div>
      </div>
    </div>

    <!-- Request Payout Button -->
    <div v-if="summary && summary.availableForPayout > 0" class="mb-6">
      <button
        @click="showPayoutModal = true"
        class="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-medium text-white hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
      >
        Request Payout (${{ summary.availableForPayout.toFixed(2) }})
      </button>
    </div>

    <!-- Earnings History -->
    <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
      <h2 class="text-xl font-semibold text-white mb-4">Earnings History</h2>
      
      <div v-if="earningsLoading" class="text-center py-8 text-navy-300">Loading...</div>
      <div v-else-if="earningsData && earningsData.earnings.length === 0" class="text-center py-8 text-navy-300">
        No earnings yet
      </div>
      <div v-else-if="earningsData" class="space-y-4">
        <div
          v-for="earning in earningsData.earnings"
          :key="earning.id"
          class="rounded-lg border border-navy-700/50 bg-navy-800/30 p-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-white">{{ earning.course.name }}</p>
              <p class="text-sm text-navy-300">
                Student: {{ earning.enrollment.user.name }}
              </p>
              <p class="text-xs text-navy-400">
                {{ formatDate(earning.earnedAt) }}
              </p>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-white">
                ${{ Number(earning.amount).toFixed(2) }}
              </div>
              <div class="text-xs text-navy-400">
                {{ Number(earning.commissionRate).toFixed(0) }}% commission
              </div>
              <div :class="[
                'mt-1 text-xs px-2 py-1 rounded',
                earning.status === 'PAID' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
              ]">
                {{ earning.status }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payout Modal -->
    <div
      v-if="showPayoutModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showPayoutModal = false"
    >
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 max-w-md w-full">
        <h3 class="text-xl font-semibold text-white mb-4">Request Payout</h3>
        
        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Amount</label>
            <input
              v-model.number="payoutAmount"
              type="number"
              :max="summary?.availableForPayout"
              min="0"
              step="0.01"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            />
            <p class="mt-1 text-xs text-navy-400">
              Available: ${{ summary?.availableForPayout.toFixed(2) }}
            </p>
          </div>
          
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Payment Method</label>
            <select
              v-model="payoutMethod"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="PAYPAL">PayPal</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div class="flex gap-3">
            <button
              @click="requestPayout"
              :disabled="requesting || !payoutAmount || payoutAmount <= 0"
              class="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
            >
              {{ requesting ? 'Requesting...' : 'Request Payout' }}
            </button>
            <button
              @click="showPayoutModal = false"
              class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue'

const { data: summary, pending: loading, refresh: refreshSummary } = await useFetch('/api/instructor/earnings')
const { data: earningsData, pending: earningsLoading, refresh: refreshEarnings } = await useFetch('/api/instructor/earnings/history')

const showPayoutModal = ref(false)
const payoutAmount = ref<number | null>(null)
const payoutMethod = ref('BANK_TRANSFER')
const requesting = ref(false)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function requestPayout() {
  if (!payoutAmount.value || payoutAmount.value <= 0) return

  try {
    requesting.value = true
    await $fetch('/api/instructor/payouts/request', {
      method: 'POST',
      body: {
        amount: payoutAmount.value,
        method: payoutMethod.value
      }
    })
    
    alert('Payout request submitted successfully!')
    showPayoutModal.value = false
    payoutAmount.value = null
    await refreshSummary()
    await refreshEarnings()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to request payout')
  } finally {
    requesting.value = false
  }
}

onMounted(() => {
  if (summary.value) {
    payoutAmount.value = summary.value.availableForPayout
  }
})
</script>

