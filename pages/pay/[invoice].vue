<template>
  <section v-if="mounted" class="mx-auto max-w-4xl px-3 sm:px-4 py-8">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
        <p class="mt-4 text-navy-300">Loading invoice details...</p>
      </div>
    </div>

    <div v-else-if="error" class="rounded-2xl border border-red-700/50 bg-gradient-to-br from-red-900/60 to-red-800/40 p-8 text-center">
      <div class="mb-4">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-white mb-2">Invoice Not Found</h2>
      <p class="text-red-300 mb-2">{{ error }}</p>
      <p class="text-sm text-red-400/80 mb-4">
        Invoice Number: <span class="font-mono">{{ invoiceId }}</span>
      </p>
      
      <!-- Manual Payment Status Check Button -->
      <div v-if="isDev && invoiceId" class="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
        <p class="text-sm text-amber-300 mb-3">
          <strong>Payment Status Check:</strong> If you just paid, click below to check and update payment status.
        </p>
        <button
          @click="checkPaymentStatus"
          :disabled="checkingPayment"
          class="w-full rounded-lg border border-amber-600 bg-amber-500/20 px-5 py-3 text-center text-sm font-medium text-amber-400 hover:bg-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ checkingPayment ? 'Checking...' : 'Check Payment Status' }}
        </button>
      </div>
      
      <!-- Show user's actual invoices if available -->
      <div v-if="userInvoices && userInvoices.length > 0" class="mt-6 mb-6 text-left bg-navy-900/40 rounded-lg p-4 border border-navy-700/50">
        <p class="text-sm text-navy-300 mb-3">Your recent invoices:</p>
        <div class="space-y-2">
          <NuxtLink
            v-for="inv in userInvoices.slice(0, 5)"
            :key="inv.number"
            :to="`/pay/${inv.number}`"
            class="block rounded-lg border border-navy-700/50 bg-navy-800/30 p-3 hover:bg-navy-800/50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-mono text-white">{{ inv.number }}</span>
                <span class="text-xs text-navy-400 ml-2">{{ inv.currency }} {{ Number(inv.amountUsd).toFixed(2) }}</span>
              </div>
              <span 
                :class="{
                  'text-green-400': inv.status === 'PAID',
                  'text-amber-400': inv.status === 'SENT',
                  'text-red-400': inv.status === 'OVERDUE'
                }"
                class="text-xs font-medium"
              >
                {{ inv.status }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink
          to="/dashboard/invoices"
          class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all"
        >
          View All Invoices
        </NuxtLink>
        <NuxtLink
          to="/dashboard/learn"
          class="rounded-lg border border-navy-600 bg-navy-800/50 px-5 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
        >
          My Learning
        </NuxtLink>
        <NuxtLink
          to="/courses"
          class="rounded-lg border border-navy-600 bg-navy-800/50 px-5 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
        >
          Browse Courses
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="invoice">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
          Complete Your Enrollment
        </h1>
        <p class="mt-2 text-navy-300">Pay for your course to start learning</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Course Details -->
        <div class="lg:col-span-2 space-y-6">
          <div v-if="invoice.enrollments && invoice.enrollments.length > 0">
            <div
              v-for="enrollment in invoice.enrollments"
              :key="enrollment.id"
              class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 mb-6"
            >
              <div class="flex gap-4">
                <div v-if="enrollment.course.thumbnailUrl" class="flex-shrink-0">
                  <img
                    :src="enrollment.course.thumbnailUrl"
                    :alt="enrollment.course.name"
                    class="h-24 w-24 rounded-lg object-cover"
                  />
                </div>
                <div class="flex-1">
                  <h2 class="text-xl font-semibold text-white mb-2">{{ enrollment.course.name }}</h2>
                  <p class="text-sm text-navy-300 line-clamp-2">{{ enrollment.course.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Invoice Summary -->
          <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">Invoice Summary</h3>
              <div class="flex gap-2">
                <button
                  @click="viewPDF(invoice.number)"
                  class="rounded-lg border border-navy-600 bg-navy-800/50 px-3 py-1.5 text-xs font-medium text-navy-200 hover:bg-navy-700/50 transition-all flex items-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View PDF
                </button>
                <button
                  @click="downloadPDF(invoice.number)"
                  class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-navy-300">Invoice Number:</span>
                <span class="text-white font-medium">{{ invoice.number }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-navy-300">Status:</span>
                <span
                  :class="{
                    'text-green-400': invoice.status === 'PAID',
                    'text-amber-400': invoice.status === 'SENT',
                    'text-red-400': invoice.status === 'OVERDUE'
                  }"
                  class="font-medium"
                >
                  {{ invoice.status }}
                </span>
              </div>
              <div class="border-t border-navy-700/50 pt-3">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold text-white">Total Amount:</span>
                  <span class="text-2xl font-bold text-white">
                    {{ invoice.currency || 'USD' }} {{ Number(invoice.amountUsd).toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Options -->
        <div class="lg:col-span-1">
          <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 sticky top-4">
            <h3 class="text-lg font-semibold text-white mb-4">Payment Options</h3>
            
            <div v-if="invoice.status === 'PAID'" class="mb-4 rounded-lg bg-green-500/20 border border-green-500/30 p-4">
              <div class="flex items-center gap-2 text-green-400 mb-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-medium">Payment Confirmed</span>
              </div>
              <p class="text-sm text-green-300">Your enrollment is active. Start learning now!</p>
              <NuxtLink
                v-if="invoice.enrollments && invoice.enrollments.length > 0"
                :to="`/dashboard/learn/${invoice.enrollments[0].course.id}`"
                class="mt-4 block w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 text-center text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
              >
                Go to Course
              </NuxtLink>
            </div>

            <div v-else class="space-y-3">
              <button
                @click="payNow"
                :disabled="paying"
                class="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="paying" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {{ paying ? 'Processing...' : 'Pay with Paynow' }}
              </button>
              
              <NuxtLink
                :to="'mailto:info@wecode.co.zw?subject=Payment%20for%20' + invoiceId + '&body=Invoice%20Number:%20' + invoiceId"
                class="block w-full rounded-lg border border-navy-600 bg-navy-800/50 px-5 py-3 text-center text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
              >
                Email Us
              </NuxtLink>
              
              <a
                href="https://wa.me/263778456168"
                target="_blank"
                class="block w-full rounded-lg border border-navy-600 bg-navy-800/50 px-5 py-3 text-center text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
              >
                WhatsApp +263778456168
              </a>

              <!-- Development: Manual Payment Confirmation -->
              <div v-if="isDev" class="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p class="text-xs text-amber-300 mb-2">
                  <strong>Localhost Testing:</strong> PayNow webhooks can't reach localhost. After completing payment on PayNow, click the button below to manually confirm.
                </p>
                <button
                  @click="confirmPaymentManually"
                  :disabled="confirming"
                  class="w-full rounded-lg border border-amber-600 bg-amber-500/10 px-5 py-3 text-center text-sm font-medium text-amber-400 hover:bg-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ confirming ? 'Confirming...' : 'Mark as Paid (Dev Only)' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
// Get invoice number from route params, handling both /pay/[invoice] and query params
const invoiceId = computed(() => {
  const param = route.params.invoice as string
  // If there's a query param, it might be the invoice number
  const queryInvoice = route.query.invoice as string | undefined
  return param || queryInvoice || ''
})
const paying = ref(false)
const confirming = ref(false)
const checkingPayment = ref(false)
const error = ref<string | null>(null)
const isDev = computed(() => {
  if (process.client) {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  }
  return false
})

// Fetch user's invoices to show in error message
const userInvoices = ref<any[] | null>(null)
const mounted = ref(false)

// Only fetch if we have an invoice ID - use $fetch instead of useFetch to prevent SSR issues
const invoice = ref<any>(null)
const loading = ref(false)
const fetchError = ref<any>(null)

// Create a refresh function
const refresh = async () => {
  if (!invoiceId.value) return
  loading.value = true
  try {
    invoice.value = await $fetch(`/api/invoices/${invoiceId.value}`)
    fetchError.value = null
    error.value = null
  } catch (err: any) {
    // Normalize error structure for watch handler
    const normalizedError = {
      status: err.status || err.statusCode || 500,
      statusText: err.statusText || err.message || 'Unknown error',
      data: err.data || err.response?._data || {}
    }
    fetchError.value = normalizedError
    
    // Extract user invoices from error response if available
    if (normalizedError.data?.userInvoices) {
      userInvoices.value = normalizedError.data.userInvoices.map((inv: any) => ({
        number: inv.number,
        amountUsd: 0,
        currency: 'USD',
        status: inv.status
      }))
    } else if (normalizedError.status === 404) {
      // Fetch user invoices to show alternatives
      try {
        const invoices = await $fetch('/api/invoices')
        userInvoices.value = invoices.map((inv: any) => ({
          number: inv.number,
          amountUsd: inv.amountUsd || 0,
          currency: inv.currency || 'USD',
          status: inv.status
        }))
      } catch (invoiceErr) {
        console.error('Failed to fetch user invoices:', invoiceErr)
      }
    }
  } finally {
    loading.value = false
  }
}

// Set error from fetchError
watch(fetchError, (err) => {
  if (err) {
    console.error('Invoice fetch error:', {
      status: err.status,
      statusText: err.statusText,
      invoiceId: invoiceId.value,
      url: `/api/invoices/${invoiceId.value}`,
      errorData: err.data
    })
    
    // Fetch user's invoices to show in error message
    if (err.status === 404) {
      // Try to get invoices from error response data first
      if (err.data?.data?.userInvoices) {
        userInvoices.value = err.data.data.userInvoices.map((inv: any) => ({
          number: inv.number,
          amountUsd: 0,
          currency: 'USD',
          status: inv.status
        }))
      } else {
        // Fallback: fetch user invoices directly
        $fetch('/api/invoices').then(invoices => {
          userInvoices.value = invoices
        }).catch(invoiceErr => {
          console.error('Failed to fetch user invoices:', invoiceErr)
        })
      }
    }
    
    // Get the error message from the response
    const errorMessage = err.data?.statusMessage || err.statusText || 'Invoice not found'
    
    error.value = err.status === 404 
      ? `Invoice "${invoiceId.value}" not found. ${errorMessage.includes('recent invoices') || errorMessage.includes('Recent invoices') ? errorMessage : 'The invoice may not exist or you may not have permission to view it.'}`
      : err.status === 401
      ? 'Please log in to view this invoice.'
      : err.status === 403
      ? 'You do not have permission to view this invoice.'
      : errorMessage || 'Failed to load invoice. Please try again.'
  } else {
    error.value = null
  }
}, { immediate: true })

useHead({
  title: `Pay Invoice ${invoiceId.value} | WeCodeZW`,
  link: [{ rel: 'canonical', href: `https://wecode.co.zw/pay/${invoiceId.value}` }]
})

// Poll for payment status if not paid
onMounted(async () => {
  // Set mounted to true to prevent hydration mismatch
  mounted.value = true
  
  // Validate invoice ID
  if (!invoiceId.value) {
    error.value = 'Invoice number is missing from the URL. Please check the link and try again.'
    return
  }
  
  // Fetch invoice on mount (client-side only)
  loading.value = true
  try {
    invoice.value = await $fetch(`/api/invoices/${invoiceId.value}`)
    fetchError.value = null
    error.value = null
  } catch (err: any) {
    // Normalize error structure for watch handler
    const normalizedError = {
      status: err.status || err.statusCode || 500,
      statusText: err.statusText || err.message || 'Unknown error',
      data: err.data || err.response?._data || {}
    }
    fetchError.value = normalizedError
    console.error('Invoice fetch error on mount:', normalizedError)
    
    // Extract user invoices from error response if available
    if (normalizedError.data?.userInvoices) {
      userInvoices.value = normalizedError.data.userInvoices.map((inv: any) => ({
        number: inv.number,
        amountUsd: 0,
        currency: 'USD',
        status: inv.status
      }))
    }
    
    // If 404, try retrying a few times (handles race condition with invoice creation)
    if (normalizedError.status === 404) {
      console.log('Invoice not found on mount, retrying...', invoiceId.value)
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        try {
          invoice.value = await $fetch(`/api/invoices/${invoiceId.value}`)
          fetchError.value = null
          error.value = null
          console.log('Invoice found after retry:', invoice.value.number)
          break
        } catch (retryErr: any) {
          if (i === 2) {
            // Last retry failed, fetch user invoices if not already set
            if (!userInvoices.value || userInvoices.value.length === 0) {
              try {
                const invoices = await $fetch('/api/invoices')
                userInvoices.value = invoices.map((inv: any) => ({
                  number: inv.number,
                  amountUsd: inv.amountUsd || 0,
                  currency: inv.currency || 'USD',
                  status: inv.status
                }))
              } catch (invoiceErr) {
                console.error('Failed to fetch user invoices:', invoiceErr)
              }
            }
          }
        }
      }
    }
  } finally {
    loading.value = false
  }
  
  // If invoice still not found after retries, error will be set by watch(fetchError)
  
  // Always check payment status when page loads (user might have just returned from PayNow)
  // This helps update invoice status even if invoice wasn't found initially
  setTimeout(async () => {
    try {
      // Check all pending payments - this will update invoice status if payment was successful
      await $fetch('/api/enrollments/check-payments', { method: 'POST' })
      // Refresh invoice after checking payments
      if (invoiceId.value) {
        await refresh()
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
    }
  }, 1000)
  
  // Poll payment status if invoice exists and is not paid
  let pollInterval: NodeJS.Timeout | null = null
  if (invoice.value && invoice.value.status !== 'PAID') {
    pollInterval = setInterval(async () => {
      // Check payment status via check-payments endpoint
      try {
        await $fetch('/api/enrollments/check-payments', { method: 'POST' })
      } catch (error) {
        console.error('Error checking payment status:', error)
      }
      await refresh()
      if (invoice.value?.status === 'PAID') {
        if (pollInterval) clearInterval(pollInterval)
        // Redirect to course or dashboard after payment confirmed
        if (invoice.value?.enrollments && invoice.value.enrollments.length > 0) {
          setTimeout(() => {
            navigateTo(`/dashboard/learn/${invoice.value.enrollments[0].course.id}`)
          }, 2000)
        } else {
          setTimeout(() => {
            navigateTo('/dashboard/learn')
          }, 2000)
        }
      }
    }, 5000)
  }

  onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval)
  })
})

async function payNow() {
  if (paying.value) return
  
  try {
    paying.value = true
    const res = await $fetch('/api/paynow/initiate', {
      method: 'POST',
      body: {
        invoiceNumber: invoiceId.value,
        amount: Number(invoice.value?.amountUsd || 0)
      }
    })
    const redirectUrl = (res as any)?.redirectUrl
    if (redirectUrl) {
      // Open PayNow in same window (better for mobile) or new tab
      window.location.href = redirectUrl
      // Note: After payment, PayNow will redirect back to returnUrl
      // The polling mechanism will detect the payment status change
    } else {
      alert('Payment initiation failed. Please try again or contact us.')
    }
  } catch (e: any) {
    alert(e.data?.message || 'Failed to initiate payment. Please try again or contact us.')
  } finally {
    paying.value = false
  }
}

async function checkPaymentStatus() {
  if (checkingPayment.value) return
  
  try {
    checkingPayment.value = true
    // Check all pending payments
    await $fetch('/api/enrollments/check-payments', { method: 'POST' })
    // Try to refresh invoice
    if (invoiceId.value) {
      await refresh()
      // If invoice is now found and paid, show success
      if (invoice.value && invoice.value.status === 'PAID') {
        alert('Payment confirmed! Your enrollment is now active.')
        if (invoice.value.enrollments && invoice.value.enrollments.length > 0) {
          setTimeout(() => {
            navigateTo(`/dashboard/learn/${invoice.value.enrollments[0].course.id}`)
          }, 1000)
        } else {
          navigateTo('/dashboard/learn')
        }
      } else if (invoice.value) {
        alert(`Payment status checked. Invoice status: ${invoice.value.status}`)
      } else {
        alert('Payment status checked. Please refresh the page.')
      }
    }
  } catch (e: any) {
    console.error('Error checking payment status:', e)
    alert(e.data?.message || 'Failed to check payment status. Please try again.')
  } finally {
    checkingPayment.value = false
  }
}

async function confirmPaymentManually() {
  if (confirming.value || !invoice.value) return
  
  try {
    confirming.value = true
    await $fetch('/api/payments/course-webhook', {
      method: 'POST',
      body: {
        invoiceNumber: invoiceId.value,
        status: 'PAID'
      }
    })
    await refresh()
    
    // Show success message
    if (invoice.value?.enrollments && invoice.value.enrollments.length > 0) {
      // Redirect to course after a short delay
      setTimeout(() => {
        navigateTo(`/dashboard/learn/${invoice.value.enrollments[0].course.id}`)
      }, 1500)
    } else {
      navigateTo('/dashboard/learn')
    }
  } catch (e: any) {
    alert(e.data?.message || 'Failed to confirm payment. Please try again.')
  } finally {
    confirming.value = false
  }
}

function viewPDF(invoiceNumber: string) {
  // Try both route formats for compatibility
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
