<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-16">
    <h1 class="text-3xl font-extrabold tracking-tight xs:text-4xl">Admin Dashboard</h1>
    <div class="mt-6 grid gap-6 md:grid-cols-4">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <div class="text-sm text-navy-300">Total Revenue</div>
        <div class="mt-1 text-2xl font-bold">USD {{ metrics.revenue.toFixed(2) }}</div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <div class="text-sm text-navy-300">Schools</div>
        <div class="mt-1 text-2xl font-bold">{{ metrics.schools }}</div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <div class="text-sm text-navy-300">Active Clubs</div>
        <div class="mt-1 text-2xl font-bold">{{ metrics.clubs }}</div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <div class="text-sm text-navy-300">Pending Requests</div>
        <div class="mt-1 text-2xl font-bold">{{ metrics.pendingRequests }}</div>
      </div>
    </div>

    <div class="mt-8 grid gap-6 md:grid-cols-2">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <h2 class="text-lg font-semibold">Schools</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="s in schools" :key="s.id" class="flex items-center justify-between text-sm">
            <span>{{ s.name }}</span>
            <span class="text-navy-300">{{ s.contactEmail }}</span>
          </li>
        </ul>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <h2 class="text-lg font-semibold">Clubs</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="c in clubs" :key="c.id" class="flex items-center justify-between gap-4 text-sm">
            <div>
              <div class="font-medium">{{ c.name }}</div>
              <div class="text-navy-300">{{ c.level }} • {{ c.students }} students</div>
            </div>
            <div class="flex gap-2">
              <button class="rounded-md border border-navy-700 px-3 py-1 hover:border-navy-500" @click="setClub(c.id,'ACTIVE')">Activate</button>
              <button class="rounded-md border border-navy-700 px-3 py-1 hover:border-navy-500" @click="setClub(c.id,'PAUSED')">Suspend</button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-8 grid gap-6 md:grid-cols-2">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <h2 class="text-lg font-semibold">Invoices</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="i in invoices" :key="i.id" class="flex items-center justify-between text-sm">
            <span>{{ i.number }} — USD {{ Number(i.amountUsd).toFixed(2) }}</span>
            <span class="text-navy-300">{{ i.status }}</span>
          </li>
        </ul>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <h2 class="text-lg font-semibold">Requests</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="r in requests" :key="r.id" class="flex items-center justify-between text-sm">
            <span>{{ r.category }} — {{ r.user?.name || r.user?.email }}</span>
            <span class="text-navy-300">{{ r.status }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-8 grid gap-6 md:grid-cols-3">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <h2 class="text-lg font-semibold">Revenue (last 6 months)</h2>
        <div class="h-56">
          <canvas ref="revenueCanvas"></canvas>
        </div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <h2 class="text-lg font-semibold">New Clubs</h2>
        <div class="h-56">
          <canvas ref="clubsCanvas"></canvas>
        </div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <h2 class="text-lg font-semibold">New Schools</h2>
        <div class="h-56">
          <canvas ref="schoolsCanvas"></canvas>
        </div>
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
const metrics = reactive({ revenue: 0, schools: 0, clubs: 0, pendingRequests: 0 })
const schools = ref<any[]>([])
const clubs = ref<any[]>([])
const invoices = ref<any[]>([])
const requests = ref<any[]>([])
const charts = reactive<{ revenue: any[]; clubs: any[]; schools: any[] }>({ revenue: [], clubs: [], schools: [] })
const revenueCanvas = ref<HTMLCanvasElement>()
const clubsCanvas = ref<HTMLCanvasElement>()
const schoolsCanvas = ref<HTMLCanvasElement>()

onMounted(async () => {
  const m = await $fetch('/api/admin/metrics').catch(() => ({ revenue: 0, schools: 0, clubs: 0 }))
  Object.assign(metrics, m as any)
  schools.value = (await $fetch('/api/admin/schools').catch(() => [])) as any[]
  clubs.value = (await $fetch('/api/admin/clubs').catch(() => [])) as any[]
  invoices.value = (await $fetch('/api/admin/invoices').catch(() => [])) as any[]
  requests.value = (await $fetch('/api/admin/requests').catch(() => [])) as any[]
  const c = await $fetch('/api/admin/charts').catch(() => ({ revenue: [], clubs: [], schools: [] }))
  Object.assign(charts, c as any)
  nextTick(() => initCharts())
})

function initCharts() {
  if (!revenueCanvas.value || !clubsCanvas.value || !schoolsCanvas.value) return
  // Revenue
  new ChartJS(revenueCanvas.value, {
    type: 'line',
    data: {
      labels: charts.revenue.map(p => p.m),
      datasets: [{ label: 'Revenue (USD)', data: charts.revenue.map(p => p.v), borderColor: '#7899d1', backgroundColor: 'rgba(120,153,209,0.2)', tension: 0.3, fill: true }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } } } }
  })
  // Clubs
  new ChartJS(clubsCanvas.value, {
    type: 'line',
    data: {
      labels: charts.clubs.map(p => p.m),
      datasets: [{ label: 'New Clubs', data: charts.clubs.map(p => p.v), borderColor: '#2e518d', backgroundColor: 'rgba(46,81,141,0.2)', tension: 0.3, fill: true }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } } } }
  })
  // Schools
  new ChartJS(schoolsCanvas.value, {
    type: 'line',
    data: {
      labels: charts.schools.map(p => p.m),
      datasets: [{ label: 'New Schools', data: charts.schools.map(p => p.v), borderColor: '#456dac', backgroundColor: 'rgba(69,109,172,0.2)', tension: 0.3, fill: true }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } } } }
  })
}

async function setClub(id: string, status: 'ACTIVE'|'PAUSED'|'DRAFT') {
  await $fetch('/api/admin/clubs.status', { method: 'POST', body: { clubId: id, status } })
  clubs.value = (await $fetch('/api/admin/clubs').catch(() => [])) as any[]
}
</script>

