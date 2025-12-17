<template>
  <div class="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
    <div class="mx-auto max-w-4xl bg-white shadow-lg print:shadow-none">
      <!-- Header Section -->
      <div class="border-b-2 border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white print:from-white print:to-white print:text-black">
        <div class="flex flex-col justify-between md:flex-row md:items-start">
          <div class="mb-6 md:mb-0">
            <h1 class="text-4xl font-bold tracking-tight">INVOICE</h1>
            <p class="mt-2 text-lg text-blue-100 print:text-gray-600">Invoice #{{ invoice.number }}</p>
          </div>
          <div class="text-right">
            <div class="text-xl font-bold">WeCodeZW</div>
            <div class="mt-1 text-sm text-blue-100 print:text-gray-600">
              Tau Digital Investments T/A WeCodeZW
            </div>
            <div class="mt-2 space-y-1 text-sm text-blue-100 print:text-gray-600">
              <div>194 Baines Avenue</div>
              <div>Harare, Zimbabwe</div>
              <div class="mt-2">+263 778 456 168</div>
              <div>+263 778 144 412</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Details & Billing Info -->
      <div class="grid grid-cols-1 gap-8 border-b border-gray-200 px-8 py-8 md:grid-cols-2">
        <!-- Billed To -->
        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Billed To</h2>
          <div class="space-y-1">
            <div class="text-lg font-semibold text-gray-900">{{ invoice.user?.name }}</div>
            <div class="text-sm text-gray-600">{{ invoice.user?.email }}</div>
            <div v-if="invoice.user?.phone" class="text-sm text-gray-600">{{ invoice.user.phone }}</div>
            <div v-if="invoice.school" class="mt-2 text-sm text-gray-600">
              <div class="font-medium">{{ invoice.school.name }}</div>
              <div v-if="invoice.school.contactName">{{ invoice.school.contactName }}</div>
            </div>
          </div>
        </div>

        <!-- Invoice Details -->
        <div>
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Invoice Details</h2>
          <div class="space-y-3">
            <div class="flex justify-between md:justify-start md:space-x-4">
              <span class="text-sm font-medium text-gray-600">Invoice Date:</span>
              <span class="text-sm text-gray-900">{{ formatDate(invoice.createdAt) }}</span>
            </div>
            <div v-if="invoice.dueDate" class="flex justify-between md:justify-start md:space-x-4">
              <span class="text-sm font-medium text-gray-600">Due Date:</span>
              <span class="text-sm text-gray-900">{{ formatDate(invoice.dueDate) }}</span>
            </div>
            <div class="flex items-center justify-between md:justify-start md:space-x-4">
              <span class="text-sm font-medium text-gray-600">Status:</span>
              <span :class="statusBadgeClass" class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold">
                {{ invoice.status }}
              </span>
            </div>
            <div class="flex justify-between md:justify-start md:space-x-4">
              <span class="text-sm font-medium text-gray-600">Currency:</span>
              <span class="text-sm text-gray-900">{{ invoice.currency || 'USD' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="px-8 py-8">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b-2 border-gray-200 bg-gray-50">
              <th class="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Description</th>
              <th class="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-100">
              <td class="px-4 py-5 text-sm text-gray-800">
                <div class="font-medium">{{ lineDescription }}</div>
                <div v-if="invoice.request?.description" class="mt-1 text-xs text-gray-500">
                  {{ invoice.request.description }}
                </div>
              </td>
              <td class="px-4 py-5 text-right text-sm font-semibold text-gray-900">
                ${{ formatAmount(invoice.amountUsd) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-t-2 border-gray-200 bg-gray-50">
              <td class="px-4 py-4 text-right text-sm font-semibold uppercase tracking-wider text-gray-700">
                Total
              </td>
              <td class="px-4 py-4 text-right text-lg font-bold text-gray-900">
                ${{ formatAmount(invoice.amountUsd) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Payment Information -->
      <div v-if="invoice.status !== 'PAID'" class="border-t border-gray-200 bg-amber-50 px-8 py-6 print:bg-white">
        <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-700">Payment Instructions</h3>
        <div class="space-y-2 text-sm text-gray-700">
          <p>Please make payment using one of the following methods:</p>
          <ul class="ml-4 list-disc space-y-1">
            <li>PayNow (Mobile Money) - Use the "Pay Now" button below</li>
            <li>Bank Transfer - Contact us for bank details</li>
          </ul>
          <p class="mt-3 font-medium">Reference: Invoice #{{ invoice.number }}</p>
        </div>
      </div>

      <!-- Payment History -->
      <div v-if="invoice.payments && invoice.payments.length > 0" class="border-t border-gray-200 px-8 py-6">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700">Payment History</h3>
        <div class="space-y-3">
          <div
            v-for="payment in invoice.payments"
            :key="payment.id"
            class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
          >
            <div>
              <div class="text-sm font-medium text-gray-900">
                ${{ formatAmount(payment.amountUsd) }} - {{ payment.method || 'Payment' }}
              </div>
              <div class="text-xs text-gray-500">{{ formatDate(payment.createdAt) }}</div>
            </div>
            <span
              :class="{
                'bg-green-100 text-green-800': payment.status === 'SUCCESS',
                'bg-yellow-100 text-yellow-800': payment.status === 'PENDING',
                'bg-red-100 text-red-800': payment.status === 'FAILED'
              }"
              class="rounded-full px-2 py-1 text-xs font-semibold"
            >
              {{ payment.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="border-t border-gray-200 bg-gray-50 px-8 py-6 print:hidden">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div class="text-xs text-gray-500">
            Thank you for your business!
          </div>
          <div class="flex gap-3">
            <button
              v-if="invoice.status !== 'PAID'"
              @click="payNow"
              :disabled="paying"
              class="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="paying" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {{ paying ? 'Processing...' : 'Pay Now' }}
            </button>
            <button
              @click="print"
              class="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Print / Download PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Print Footer -->
      <div class="hidden border-t border-gray-200 px-8 py-6 print:block">
        <div class="text-center text-xs text-gray-500">
          <p>Thank you for your business!</p>
          <p class="mt-2">For questions about this invoice, please contact us at +263 778 456 168</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string
const invoice = await $fetch(`/api/invoices/${id}`)

const lineDescription = computed(() => {
  if (invoice.request?.category) {
    const category = invoice.request.category.replace(/_/g, ' ')
    return `${category} — ${invoice.request.description || 'Scope of work / training'}`
  }
  return 'Professional services'
})

const statusBadgeClass = computed(() => {
  const status = invoice.status?.toUpperCase()
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800 print:bg-green-50 print:text-green-900'
    case 'OVERDUE':
      return 'bg-red-100 text-red-800 print:bg-red-50 print:text-red-900'
    case 'SENT':
      return 'bg-blue-100 text-blue-800 print:bg-blue-50 print:text-blue-900'
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800 print:bg-gray-50 print:text-gray-900'
    default:
      return 'bg-gray-100 text-gray-800 print:bg-gray-50 print:text-gray-900'
  }
})

function formatDate(d: string | Date) {
  if (!d) return '—'
  const date = new Date(d)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatAmount(amount: string | number) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return num.toFixed(2)
}

const paying = ref(false)

async function payNow() {
  if (paying.value || invoice.status === 'PAID') return
  
  try {
    paying.value = true
    
    // Check if invoice has enrollments with courses - redirect to checkout if available
    if (invoice.enrollments && invoice.enrollments.length > 0) {
      const activeEnrollment = invoice.enrollments.find((e: any) => e.status !== 'CANCELLED')
      if (activeEnrollment && activeEnrollment.course?.id) {
        // Redirect to checkout page for the course
        navigateTo(`/checkout/${activeEnrollment.course.id}`)
        return
      }
    }
    
    // Fallback: If no course found, use old payment flow
    const userEmail = invoice.user?.email
    
    // Construct return URL to redirect back to this invoice page after payment
    const returnUrl = `${window.location.origin}/invoices/${invoice.id}`
    
    // Call PayNow initiate endpoint
    const res = await $fetch('/api/paynow/initiate', {
      method: 'POST',
      body: {
        invoiceNumber: invoice.number,
        email: userEmail,
        amount: Number(invoice.amountUsd || 0),
        returnUrl: returnUrl
      }
    })
    
    const redirectUrl = (res as any)?.redirectUrl
    const pollUrl = (res as any)?.pollUrl
    
    if (redirectUrl) {
      // Store pollUrl in localStorage for later use when user returns
      if (pollUrl && invoice.number) {
        try {
          const stored = localStorage.getItem('paynow_pollUrls') || '{}'
          const pollUrls = JSON.parse(stored)
          pollUrls[invoice.number] = pollUrl
          localStorage.setItem('paynow_pollUrls', JSON.stringify(pollUrls))
          console.log('Stored pollUrl for invoice:', invoice.number, 'PollUrl:', pollUrl.substring(0, 50) + '...')
        } catch (e) {
          console.warn('Failed to store pollUrl:', e)
        }
      } else {
        console.warn('Cannot store pollUrl - missing pollUrl or invoice number', { 
          pollUrl: !!pollUrl, 
          invoiceNumber: invoice.number 
        })
      }
      
      // Redirect to PayNow payment page
      window.location.href = redirectUrl
    } else {
      alert('Payment initiation failed. Please try again or contact us.')
    }
  } catch (e: any) {
    console.error('PayNow initiation error:', e)
    alert(e.data?.message || 'Failed to initiate payment. Please try again or contact us.')
  } finally {
    paying.value = false
  }
}

function print() {
  window.print()
}
</script>

<style scoped>
@media print {
  @page {
    margin: 1cm;
    size: A4;
  }

  html,
  body {
    background: #fff;
    color: #000;
  }

  .print\:bg-white {
    background-color: white !important;
  }

  .print\:text-black {
    color: black !important;
  }

  .print\:text-gray-600 {
    color: #4b5563 !important;
  }

  .print\:from-white {
    --tw-gradient-from: white !important;
  }

  .print\:to-white {
    --tw-gradient-to: white !important;
  }

  .print\:shadow-none {
    box-shadow: none !important;
  }

  .print\:py-0 {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .print\:bg-green-50 {
    background-color: #f0fdf4 !important;
  }

  .print\:text-green-900 {
    color: #14532d !important;
  }

  .print\:bg-red-50 {
    background-color: #fef2f2 !important;
  }

  .print\:text-red-900 {
    color: #7f1d1d !important;
  }

  .print\:bg-blue-50 {
    background-color: #eff6ff !important;
  }

  .print\:text-blue-900 {
    color: #1e3a8a !important;
  }

  .print\:bg-gray-50 {
    background-color: #f9fafb !important;
  }

  .print\:text-gray-900 {
    color: #111827 !important;
  }
}
</style>

