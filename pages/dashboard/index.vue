<template>
  <section class="mx-auto max-w-5xl px-3 sm:px-4 py-16">
    <h1 class="text-3xl font-extrabold tracking-tight xs:text-4xl">School Dashboard</h1>
    <p class="mt-2 text-navy-300">Welcome. View your activity and manage invoices and clubs.</p>
    <div class="mt-6 grid gap-6 md:grid-cols-4">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-4">
        <div class="text-sm text-navy-300">Quotes</div>
        <div class="mt-1 text-2xl font-bold">{{ summary.quotes }}</div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-4">
        <div class="text-sm text-navy-300">Invoices</div>
        <div class="mt-1 text-2xl font-bold">{{ summary.invoices }}</div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-4">
        <div class="text-sm text-navy-300">Paid</div>
        <div class="mt-1 text-2xl font-bold">{{ summary.invoicesPaid }}</div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-4">
        <div class="text-sm text-navy-300">Clubs</div>
        <div class="mt-1 text-2xl font-bold">{{ summary.clubs }}</div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="mt-8 grid gap-6 lg:grid-cols-2">
      <!-- Payments Over Time Chart -->
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Payments Over Time</h3>
        <div class="h-64">
          <canvas ref="paymentsChart"></canvas>
        </div>
      </div>

      <!-- Club Growth Chart -->
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Club Growth</h3>
        <div class="h-64">
          <canvas ref="clubsChart"></canvas>
        </div>
      </div>
    </div>
    <div class="mt-8 grid gap-6 md:grid-cols-2">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <h2 class="text-lg font-semibold">Recent Quotes</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="q in quotes" :key="q.id" class="flex items-center justify-between text-sm">
            <span>{{ q.number }}</span>
            <span class="text-navy-300">USD {{ q.totalUsd.toFixed(2) }}</span>
          </li>
        </ul>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <h2 class="text-lg font-semibold">Invoices</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="i in invoices" :key="i.number" class="flex items-center justify-between text-sm">
            <span>{{ i.number }} — USD {{ Number(i.amountUsd).toFixed(2) }}</span>
            <NuxtLink :to="`/pay/${i.number}?amount=${i.amountUsd}`" class="rounded-md border border-navy-700 px-3 py-1 hover:border-navy-500">Pay</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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
  
  // Load charts data
  chartsData.value = await $fetch('/api/dashboard/charts').catch(() => ({ payments: [], clubs: [] }))
  
  // Initialize charts
  nextTick(() => {
    initCharts()
  })
})

const initCharts = () => {
  if (!paymentsChart.value || !clubsChart.value) return

  // Payments chart
  new Chart(paymentsChart.value, {
    type: 'line',
    data: {
      labels: chartsData.value.payments.map((p: any) => p.month),
      datasets: [{
        label: 'Payments (USD)',
        data: chartsData.value.payments.map((p: any) => p.amount),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8' }
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

  // Clubs chart
  new Chart(clubsChart.value, {
    type: 'bar',
    data: {
      labels: chartsData.value.clubs.map((c: any) => c.month),
      datasets: [
        {
          label: 'Total Clubs',
          data: chartsData.value.clubs.map((c: any) => c.total),
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: '#22c55e',
          borderWidth: 1
        },
        {
          label: 'Active Clubs',
          data: chartsData.value.clubs.map((c: any) => c.active),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: '#3b82f6',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8' }
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

