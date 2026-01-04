<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Dashboard
      </h1>
      <p class="mt-2 text-navy-300">Welcome back! View your activity and manage invoices and clubs.</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid gap-6 md:grid-cols-4 mb-8">
      <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-blue-500/50 transition-all hover:shadow-lg">
        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-3">
            <div class="rounded-lg bg-blue-500/20 p-2.5 border border-blue-500/30">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div class="text-sm font-medium text-navy-300 mb-1">Quotes</div>
          <div class="text-3xl font-bold text-white">{{ summary.quotes }}</div>
        </div>
      </div>

      <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-purple-500/50 transition-all hover:shadow-lg">
        <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-3">
            <div class="rounded-lg bg-purple-500/20 p-2.5 border border-purple-500/30">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div class="text-sm font-medium text-navy-300 mb-1">Invoices</div>
          <div class="text-3xl font-bold text-white">{{ summary.invoices }}</div>
        </div>
      </div>

      <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg">
        <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-3">
            <div class="rounded-lg bg-emerald-500/20 p-2.5 border border-emerald-500/30">
              <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="text-sm font-medium text-navy-300 mb-1">Paid</div>
          <div class="text-3xl font-bold text-white">{{ summary.invoicesPaid }}</div>
        </div>
      </div>

      <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-amber-500/50 transition-all hover:shadow-lg">
        <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-3">
            <div class="rounded-lg bg-amber-500/20 p-2.5 border border-amber-500/30">
              <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div class="text-sm font-medium text-navy-300 mb-1">Clubs</div>
          <div class="text-3xl font-bold text-white">{{ summary.clubs }}</div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid gap-6 lg:grid-cols-2 mb-8">
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Payments Over Time</h3>
        <div class="h-64">
          <canvas ref="paymentsChart"></canvas>
        </div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Club Growth</h3>
        <div class="h-64">
          <canvas ref="clubsChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <h2 class="text-lg font-semibold text-white mb-4">Recent Quotes</h2>
        <div v-if="quotes.length === 0" class="text-center text-navy-400 py-8 text-sm">No quotes yet</div>
        <ul v-else class="space-y-3">
          <li
            v-for="q in quotes"
            :key="q.id"
            class="flex items-center justify-between rounded-lg border border-navy-700/50 bg-navy-800/30 p-3 hover:bg-navy-800/50 transition-colors"
          >
            <span class="text-sm text-white font-medium">{{ q.number }}</span>
            <span class="text-sm text-navy-300">USD {{ q.totalUsd.toFixed(2) }}</span>
          </li>
        </ul>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <h2 class="text-lg font-semibold text-white mb-4">Invoices</h2>
        <div v-if="invoices.length === 0" class="text-center text-navy-400 py-8 text-sm">No invoices yet</div>
        <ul v-else class="space-y-3">
          <li
            v-for="i in invoices"
            :key="i.number"
            class="flex items-center justify-between rounded-lg border border-navy-700/50 bg-navy-800/30 p-3 hover:bg-navy-800/50 transition-colors"
          >
            <div>
              <span class="text-sm text-white font-medium">{{ i.number }}</span>
              <span class="text-sm text-navy-400 ml-2">USD {{ Number(i.amountUsd).toFixed(2) }}</span>
            </div>
            <NuxtLink
              v-if="i.firstCourseId"
              :to="`/checkout/${i.firstCourseId}`"
              class="rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-md"
            >
              Pay
            </NuxtLink>
            <NuxtLink
              v-else
              :to="`/pay/${i.number}?amount=${i.amountUsd}`"
              class="rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-md"
            >
              Pay
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ 
  layout: 'dashboard',
  middleware: ['auth']
})

const { user: me } = useAuth()

// Redirect admins to admin dashboard
if (import.meta.client && me.value && me.value.role === 'ADMIN') {
  navigateTo('/admin', { replace: true })
}
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const quotes = ref<{ id: string; number: string; totalUsd: number }[]>([])
const invoices = ref<any[]>([])
const summary = reactive({ quotes: 0, invoices: 0, invoicesPaid: 0, clubs: 0 })
const chartsData = ref({ payments: [], clubs: [] })
const paymentsChart = ref<HTMLCanvasElement>()
const clubsChart = ref<HTMLCanvasElement>()

onMounted(async () => {
  const res = await $fetch('/api/dashboard/quotes').catch(() => [])
  quotes.value = (res as any) || []
  invoices.value = (await $fetch('/api/dashboard/invoices').catch(() => [])) as any[]
  const s = await $fetch('/api/dashboard/summary').catch(() => ({ quotes: 0, invoices: 0, invoicesPaid: 0, clubs: 0 }))
  Object.assign(summary, s as any)
  
  chartsData.value = await $fetch('/api/dashboard/charts').catch(() => ({ payments: [], clubs: [] }))
  
  nextTick(() => {
    initCharts()
  })
})

const initCharts = () => {
  if (!paymentsChart.value || !clubsChart.value) return

  new ChartJS(paymentsChart.value, {
    type: 'line',
    data: {
      labels: chartsData.value.payments.map((p: any) => p.month),
      datasets: [{
        label: 'Payments (USD)',
        data: chartsData.value.payments.map((p: any) => p.amount),
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96,165,250,0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#60a5fa',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { size: 12 } }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#fff',
          bodyColor: '#cbd5e1'
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8' },
          grid: { color: '#1e293b' }
        },
        y: {
          ticks: { color: '#94a3b8' },
          grid: { color: '#1e293b' }
        }
      }
    }
  })

  new ChartJS(clubsChart.value, {
    type: 'bar',
    data: {
      labels: chartsData.value.clubs.map((c: any) => c.month),
      datasets: [
        {
          label: 'Total Clubs',
          data: chartsData.value.clubs.map((c: any) => c.total),
          backgroundColor: 'rgba(52, 211, 153, 0.6)',
          borderColor: '#34d399',
          borderWidth: 1
        },
        {
          label: 'Active Clubs',
          data: chartsData.value.clubs.map((c: any) => c.active),
          backgroundColor: 'rgba(96, 165, 250, 0.6)',
          borderColor: '#60a5fa',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { size: 12 } }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#fff',
          bodyColor: '#cbd5e1'
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8' },
          grid: { color: '#1e293b' }
        },
        y: {
          ticks: { color: '#94a3b8' },
          grid: { color: '#1e293b' }
        }
      }
    }
  })
}
</script>
