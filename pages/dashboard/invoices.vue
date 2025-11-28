<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 py-8">
    <!-- Header -->
    <div class="mb-8 flex items-start justify-between">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
          Invoices
        </h1>
        <p class="mt-2 text-navy-300">View and pay your invoices</p>
      </div>
      <button
        v-if="!loading && invoices.length > 0"
        @click="cleanupOrphanedInvoices"
        :disabled="cleaning"
        class="rounded-lg border border-amber-500/50 bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg v-if="!cleaning" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <svg v-else class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ cleaning ? 'Cleaning...' : 'Clean Up Orphaned Invoices' }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
        <p class="mt-4 text-navy-300">Loading invoices...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="invoices.length === 0" class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
        <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">No invoices</h3>
      <p class="text-navy-300">You don't have any invoices yet</p>
    </div>

    <!-- Invoices List -->
    <div v-else class="space-y-4">
      <div
        v-for="i in invoices"
        :key="i.id"
        class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 transition-all hover:border-navy-600 hover:shadow-xl"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-white mb-2">{{ i.number }}</h3>
            
            <!-- Course Names -->
            <div v-if="i.courses && i.courses.length > 0" class="mb-3">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(courseName, idx) in i.courses"
                  :key="idx"
                  class="inline-flex items-center rounded-md bg-blue-500/20 border border-blue-500/30 px-2.5 py-1 text-xs font-medium text-blue-400"
                >
                  <svg class="h-3 w-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {{ courseName }}
                </span>
              </div>
            </div>
            
            <div class="flex flex-wrap items-center gap-4 text-sm">
              <span class="text-navy-300">{{ i.currency || 'USD' }} {{ Number(i.amountUsd).toFixed(2) }}</span>
              <span
                :class="{
                  'bg-green-500/20 text-green-400 border-green-500/30': i.status === 'PAID',
                  'bg-amber-500/20 text-amber-400 border-amber-500/30': i.status === 'SENT',
                  'bg-red-500/20 text-red-400 border-red-500/30': i.status === 'OVERDUE'
                }"
                class="rounded-md border px-2.5 py-1 text-xs font-medium"
              >
                {{ i.status }}
              </span>
              <span class="text-navy-400 text-xs">{{ new Date(i.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col gap-2">
            <div class="flex gap-2">
              <button
                @click="viewPDF(i.number)"
                class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all flex items-center gap-1.5"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View PDF
              </button>
              <button
                @click="downloadPDF(i.number)"
                class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-1.5 shadow-lg hover:shadow-xl"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
            <NuxtLink
              v-if="i.status !== 'PAID'"
              :to="`/pay/${i.number}`"
              class="rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-medium text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl text-center"
            >
              Pay Now
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
const invoices = ref<any[]>([])
const loading = ref(true)
const cleaning = ref(false)

onMounted(async () => {
  await refreshInvoices()
})

const refreshInvoices = async () => {
  try {
    invoices.value = (await $fetch('/api/dashboard/invoices').catch(() => [])) as any[]
  } finally {
    loading.value = false
  }
}

const cleanupOrphanedInvoices = async () => {
  if (!confirm('This will permanently delete unpaid invoices for cancelled enrollments. Continue?')) {
    return
  }

  try {
    cleaning.value = true
    const result = await $fetch('/api/invoices/cleanup', { method: 'POST' }) as any
    
    if (result.deleted > 0) {
      alert(`Successfully cleaned up ${result.deleted} orphaned invoice(s).`)
      await refreshInvoices()
    } else {
      alert('No orphaned invoices found. All invoices are either paid or have active enrollments.')
    }
  } catch (error: any) {
    console.error('Cleanup error:', error)
    alert(error.data?.message || 'Failed to clean up invoices. Please try again.')
  } finally {
    cleaning.value = false
  }
}

function viewPDF(invoiceNumber: string) {
  window.open(`/api/invoices/pdf/${invoiceNumber}`, '_blank')
}

async function downloadPDF(invoiceNumber: string) {
  try {
    const response = await fetch(`/api/invoices/pdf/${invoiceNumber}`)
    if (!response.ok) {
      throw new Error('Failed to download PDF')
    }
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${invoiceNumber}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Error downloading PDF:', error)
    alert('Failed to download PDF. Please try again.')
  }
}
</script>
