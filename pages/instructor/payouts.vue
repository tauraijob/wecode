<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Payout History
      </h1>
      <p class="mt-2 text-navy-300">View your payout requests and their status</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
        <p class="mt-4 text-navy-300">Loading payouts...</p>
      </div>
    </div>

    <!-- Payouts List -->
    <div v-else-if="payouts && payouts.length > 0" class="space-y-4">
      <div
        v-for="payout in payouts"
        :key="payout.id"
        class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-lg font-semibold text-white">
              ${{ Number(payout.amount).toFixed(2) }}
            </p>
            <p class="text-sm text-navy-300">
              Requested: {{ formatDate(payout.requestedAt) }}
            </p>
            <p v-if="payout.processedAt" class="text-sm text-navy-300">
              Processed: {{ formatDate(payout.processedAt) }}
            </p>
          </div>
          <div :class="[
            'px-3 py-1 rounded-full text-xs font-medium',
            payout.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
            payout.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-400' :
            payout.status === 'FAILED' ? 'bg-red-500/20 text-red-400' :
            'bg-amber-500/20 text-amber-400'
          ]">
            {{ payout.status }}
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <p class="text-xs text-navy-400 mb-1">Payment Method</p>
            <p class="text-sm text-navy-300">{{ payout.method || 'Not specified' }}</p>
          </div>
          <div v-if="payout.reference">
            <p class="text-xs text-navy-400 mb-1">Reference</p>
            <p class="text-sm text-navy-300">{{ payout.reference }}</p>
          </div>
        </div>

        <div v-if="payout.earnings && payout.earnings.length > 0" class="mt-4 pt-4 border-t border-navy-700/50">
          <p class="text-xs text-navy-400 mb-2">Linked Earnings ({{ payout.earnings.length }})</p>
          <div class="space-y-2">
            <div
              v-for="earning in payout.earnings"
              :key="earning.id"
              class="text-sm text-navy-300"
            >
              {{ earning.course.name }} - ${{ Number(earning.amount).toFixed(2) }}
            </div>
          </div>
        </div>

        <div v-if="payout.notes" class="mt-4 pt-4 border-t border-navy-700/50">
          <p class="text-xs text-navy-400 mb-1">Notes</p>
          <p class="text-sm text-navy-300">{{ payout.notes }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-12 text-center">
      <p class="text-navy-300">No payout requests yet</p>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { data: payouts, pending: loading } = await useFetch('/api/instructor/payouts')

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

