<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        My Courses
      </h1>
      <p class="mt-2 text-navy-300">Continue your learning journey</p>
    </div>

    <!-- Payment Pending Notification -->
    <div v-if="hasPendingPayments && !checkingPayments.size" class="mb-6 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-900/60 to-amber-800/40 p-6">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-amber-300 mb-2">Payment Pending</h3>
          <p class="text-sm text-amber-200/80 mb-4">
            You have {{ pendingPaymentsCount }} course(s) waiting for payment confirmation. 
            <span v-if="isDev" class="block mt-2 text-xs text-amber-300/70">
              <strong>Localhost Testing:</strong> PayNow webhooks can't reach localhost. After completing payment on PayNow, you need to manually confirm the payment.
            </span>
          </p>
          <div class="flex flex-wrap gap-3">
            <button
              @click="checkAllPayments"
              :disabled="checkingPayments.size > 0"
              class="rounded-lg bg-amber-500/20 border border-amber-500/50 px-4 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="checkingPayments.size === 0" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span v-else class="h-4 w-4 inline-block animate-spin rounded-full border-2 border-amber-300 border-t-transparent"></span>
              {{ checkingPayments.size > 0 ? 'Checking...' : 'Check Payment Status' }}
            </button>
            <template v-for="enrollment in pendingEnrollmentsList" :key="enrollment.id">
              <NuxtLink
                :to="`/checkout/${enrollment.course.id}`"
                class="rounded-lg bg-blue-500/20 border border-blue-500/50 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-500/30 transition-all flex items-center gap-2"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Complete Payment for {{ enrollment.course.name }}
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
        <p class="mt-4 text-navy-300">Loading enrollments...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="enrollments.length === 0" class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
        <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">No courses enrolled</h3>
      <p class="text-navy-300 mb-6">You haven't enrolled in any courses yet.</p>
      <NuxtLink
        to="/courses"
        class="inline-block rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
      >
        Browse Courses
      </NuxtLink>
    </div>

    <!-- Enrollments Grid -->
    <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="enrollment in enrollments"
        :key="enrollment.id"
        class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 transition-all hover:border-navy-600 hover:shadow-xl"
      >
        <!-- Thumbnail -->
        <div v-if="enrollment.course.thumbnailUrl" class="relative h-48 overflow-hidden bg-navy-800">
          <img
            :src="enrollment.course.thumbnailUrl"
            :alt="enrollment.course.name"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div v-else class="flex h-48 items-center justify-center bg-gradient-to-br from-navy-700 to-navy-800">
          <svg class="h-12 w-12 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <!-- Content -->
        <div class="p-6">
          <h3 class="text-xl font-semibold text-white mb-2 line-clamp-1">{{ enrollment.course.name }}</h3>
          <p class="text-sm text-navy-300 line-clamp-2 mb-4">{{ enrollment.course.description }}</p>

          <!-- Progress (only show for active/completed enrollments) -->
          <div v-if="enrollment.status !== 'PENDING'" class="mb-4">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-navy-300">Progress</span>
              <span class="text-white font-medium">{{ Number(enrollment.progressPercent).toFixed(0) }}%</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-navy-800">
              <div
                class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                :style="{ width: `${Number(enrollment.progressPercent)}%` }"
              ></div>
            </div>
          </div>
          
          <!-- Pending Payment Message -->
          <div v-if="enrollment.status === 'PENDING'" class="mb-4 rounded-lg bg-amber-500/20 border border-amber-500/30 p-3">
            <p class="text-sm text-amber-300 mb-2">
              <span v-if="checkingPayments.has(enrollment.id)">Checking payment status...</span>
              <span v-else>Payment pending. Complete payment to access the course.</span>
            </p>
            <p v-if="!checkingPayments.has(enrollment.id)" class="text-xs text-amber-400/80">
              If you just completed payment, click the refresh button to check status.
            </p>
          </div>

          <!-- Status Badge -->
          <div class="mb-4">
            <span
              :class="{
                'bg-green-500/20 text-green-400 border-green-500/30': enrollment.status === 'COMPLETED',
                'bg-blue-500/20 text-blue-400 border-blue-500/30': enrollment.status === 'ACTIVE',
                'bg-amber-500/20 text-amber-400 border-amber-500/30': enrollment.status === 'PENDING'
              }"
              class="inline-flex rounded-md border px-2.5 py-1 text-xs font-medium"
            >
              {{ enrollment.status === 'PENDING' ? 'Pending Payment' : enrollment.status }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <NuxtLink
              v-if="enrollment.status === 'ACTIVE' || enrollment.status === 'COMPLETED'"
              :to="`/dashboard/learn/${enrollment.course.id}`"
              class="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {{ enrollment.status === 'COMPLETED' ? 'View Course' : 'Continue Learning' }}
            </NuxtLink>
            <div v-else-if="enrollment.status === 'PENDING' && enrollment.invoiceId" class="flex-1 flex gap-2">
              <NuxtLink
                :to="`/checkout/${enrollment.course.id}`"
                class="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
              >
                Complete Payment
              </NuxtLink>
              <button
                @click="checkPaymentStatus(enrollment.id)"
                :disabled="checkingPayments.has(enrollment.id)"
                class="rounded-lg border border-blue-600 bg-blue-500/10 px-3 py-2.5 text-sm font-medium text-blue-400 hover:bg-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Check if payment was completed"
              >
                <svg v-if="!checkingPayments.has(enrollment.id)" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span v-else class="h-5 w-5 inline-block animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></span>
              </button>
            </div>
            <button
              v-if="enrollment.status !== 'COMPLETED'"
              @click="handleUnenroll(enrollment.id, enrollment.course.name)"
              :disabled="unenrolling === enrollment.id"
              class="rounded-lg border border-red-700/50 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :title="enrollment.status === 'PENDING' ? 'Cancel enrollment' : 'Unenroll from course'"
            >
              <svg v-if="unenrolling !== enrollment.id" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span v-else class="h-5 w-5 inline-block animate-spin rounded-full border-2 border-red-400 border-t-transparent"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

    <script setup lang="ts">
    import { onMounted, ref, computed } from 'vue'
    import { useRoute } from '#app'

    definePageMeta({ layout: 'dashboard' })
    const { data: enrollments, pending: loading, refresh } = await useFetch('/api/enrollments')
    const unenrolling = ref<string | null>(null)
    const checkingPayments = ref<Set<string>>(new Set())
    
    const isDev = computed(() => {
      if (process.client) {
        return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      }
      return false
    })
    
    const hasPendingPayments = computed(() => {
      return enrollments.value?.some((e: any) => e.status === 'PENDING' && e.invoiceId) || false
    })
    
    const pendingPaymentsCount = computed(() => {
      return enrollments.value?.filter((e: any) => e.status === 'PENDING' && e.invoiceId).length || 0
    })
    
    const pendingEnrollmentsList = computed(() => {
      return enrollments.value?.filter((e: any) => e.status === 'PENDING' && e.invoiceId) || []
    })

    // Check payment status for all pending enrollments
    const checkAllPayments = async () => {
      try {
        // Mark all pending enrollments as checking
        if (enrollments.value) {
          enrollments.value
            .filter((e: any) => e.status === 'PENDING' && e.invoiceId)
            .forEach((e: any) => checkingPayments.value.add(e.id))
        }
        
        // Call endpoint to check and update payment status
        const result = await $fetch('/api/enrollments/check-payments', {
          method: 'POST'
        })
        
        if (result.updated > 0) {
          // Payments were updated, refresh enrollments
          await refresh()
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
      } finally {
        checkingPayments.value.clear()
      }
    }

    // Check payment status for a specific enrollment
    const checkPaymentStatus = async (enrollmentId: string) => {
      try {
        checkingPayments.value.add(enrollmentId)
        
        // Call endpoint to check and update payment status
        const result = await $fetch('/api/enrollments/check-payments', {
          method: 'POST'
        })
        
        if (result.updated > 0) {
          // Payments were updated, refresh enrollments
          await refresh()
        }
      } catch (error) {
        console.error('Error checking payment status:', error)
      } finally {
        checkingPayments.value.delete(enrollmentId)
      }
    }

    // Refresh enrollments when page becomes visible (e.g., after payment)
    if (process.client) {
      const route = useRoute()
      
      // Check if user just returned from PayNow (might have payment status in URL)
      onMounted(async () => {
        await refresh()
        
        // Always check payment status when page loads (user might have just returned from Paynow)
        // This ensures enrollments are activated even if webhook hasn't fired yet
        setTimeout(async () => {
          await checkAllPayments()
        }, 500)
        
        // Check URL parameters for payment status (PayNow might include these)
        const paymentStatus = route.query.status as string
        const reference = route.query.reference as string
        
        // Check if PayNow return parameters are present
        if (Object.keys(route.query).length > 0 && (paymentStatus || reference || route.query.reference)) {
          console.log('PayNow return detected with parameters:', route.query)
          // Try to process PayNow return parameters manually
          try {
            await $fetch('/api/paynow/process-return', {
              method: 'POST',
              body: {
                queryParams: route.query
              }
            })
            // Refresh enrollments after processing
            await refresh()
            // Clear query parameters from URL after processing
            await navigateTo(route.path, { replace: true })
          } catch (error) {
            console.error('Error processing PayNow return:', error)
          }
          // Also check all payments again after processing
          setTimeout(async () => {
            await checkAllPayments()
          }, 1000)
        }
        
        // Set up periodic checking for pending payments
        const pendingCheckInterval = setInterval(async () => {
          const hasPending = enrollments.value?.some((e: any) => e.status === 'PENDING' && e.invoiceId)
          if (hasPending) {
            await checkAllPayments()
          } else {
            // No pending payments, stop checking
            clearInterval(pendingCheckInterval)
          }
        }, 10000) // Check every 10 seconds
        
        // Clean up interval on unmount
        onUnmounted(() => {
          clearInterval(pendingCheckInterval)
        })
      })
      
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          refresh()
          // Check payment status when page becomes visible (user returned from Paynow)
          setTimeout(() => {
            checkAllPayments()
          }, 500)
        }
      })
    }

const handleUnenroll = async (enrollmentId: string, courseName: string) => {
  if (!confirm(`Are you sure you want to unenroll from "${courseName}"? This action cannot be undone.`)) {
    return
  }

  try {
    unenrolling.value = enrollmentId
    await $fetch(`/api/enrollments/${enrollmentId}/unenroll`, {
      method: 'DELETE'
    })
    
    // Refresh the enrollments list
    await refresh()
    
    // Show success message
    alert('Successfully unenrolled from the course.')
  } catch (error: any) {
    alert(error.data?.message || 'Failed to unenroll. Please try again.')
  } finally {
    unenrolling.value = null
  }
}
</script>
