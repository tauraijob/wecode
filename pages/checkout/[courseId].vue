<template>
  <div class="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink to="/dashboard/learn" class="inline-flex items-center text-navy-300 hover:text-white transition-colors mb-4">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Courses
        </NuxtLink>
        <h1 class="text-3xl font-bold text-white">Course Checkout</h1>
        <p class="text-navy-300 mt-2">Review your course and complete payment to access the course</p>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p class="mt-4 text-navy-300">Loading checkout...</p>
        </div>
      </div>

      <div v-else-if="error" class="rounded-xl border border-red-500/30 bg-red-500/10 p-6 mb-6">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-400 mb-1">Error</h3>
            <p class="text-red-300">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="course" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content - Course Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Course Summary -->
          <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Course Summary</h2>
            
            <div class="flex gap-4">
              <img
                v-if="course.thumbnailUrl"
                :src="course.thumbnailUrl"
                :alt="course.name"
                class="w-32 h-24 object-cover rounded-lg"
              />
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-white mb-2">{{ course.name }}</h3>
                <p class="text-sm text-navy-300 line-clamp-2">{{ course.description }}</p>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Payment Method</h2>
            
            <div class="space-y-3">
              <!-- PayNow Option -->
              <div 
                @click="selectedPaymentMethod = 'paynow'"
                :class="[
                  'rounded-lg border-2 p-4 cursor-pointer transition-all',
                  selectedPaymentMethod === 'paynow' 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-navy-600 bg-navy-800/30 hover:border-navy-500'
                ]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="paynow" 
                        v-model="selectedPaymentMethod"
                        class="w-4 h-4 text-blue-600"
                      />
                      <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-white">PayNow</p>
                      <p class="text-sm text-navy-300">Pay via Ecocash, OneMoney, Bank Transfer, or Card</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <img src="https://www.paynow.co.zw/Content/landing/images/paynow-logo-blue.svg" alt="PayNow" class="h-6" />
                    <span class="text-xs text-navy-400">Secure Payment</span>
                  </div>
                </div>
              </div>

              <!-- PayPal Option -->
              <div 
                @click="selectedPaymentMethod = 'paypal'"
                :class="[
                  'rounded-lg border-2 p-4 cursor-pointer transition-all',
                  selectedPaymentMethod === 'paypal' 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-navy-600 bg-navy-800/30 hover:border-navy-500'
                ]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="paypal" 
                        v-model="selectedPaymentMethod"
                        class="w-4 h-4 text-blue-600"
                      />
                      <svg class="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.386zm4.6-14.4l-1.598 10.536h2.19c4.298 0 7.664-1.748 8.647-6.797.03-.15.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287-1.112-1.267-3.12-1.81-5.69-1.81H5.998l-1.465 9.636h5.143z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-white">PayPal</p>
                      <p class="text-sm text-navy-300">Pay securely with your PayPal account or card</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" class="h-6" />
                    <span class="text-xs text-navy-400">Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Options -->
          <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Need Help?</h2>
            <div class="space-y-3">
              <a
                href="mailto:info@wecode.co.zw?subject=Payment%20Assistance"
                class="flex items-center gap-3 text-navy-300 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email: info@wecode.co.zw</span>
              </a>
              <a
                href="https://wa.me/263778456168"
                target="_blank"
                class="flex items-center gap-3 text-navy-300 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>WhatsApp: +263778456168</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Sidebar - Order Summary -->
        <div class="lg:col-span-1">
          <div class="sticky top-8 rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Order Summary</h2>
            
            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-navy-300">
                <span>Course Price</span>
                <span class="text-white font-medium">{{ formatPrice(course.price, course.currency) }}</span>
              </div>
              <div class="border-t border-navy-700 pt-4">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold text-white">Total</span>
                  <span class="text-2xl font-bold text-white">{{ formatPrice(course.price, course.currency) }}</span>
                </div>
              </div>
            </div>

            <button
              @click="proceedToPayment"
              :disabled="processing || !course"
              class="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-center text-lg font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <span v-if="processing" class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {{ processing ? 'Processing...' : 'Proceed to Payment' }}
            </button>

            <p class="text-xs text-navy-400 text-center mt-4">
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </p>

            <!-- Security Badge -->
            <div class="mt-6 pt-6 border-t border-navy-700 flex items-center justify-center gap-2 text-xs text-navy-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const courseId = computed(() => route.params.courseId as string)

// Validate this is a course checkout, not product checkout
if (!courseId.value || courseId.value === 'undefined') {
  throw createError({ statusCode: 400, statusMessage: 'Course ID is required' })
}

const course = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const processing = ref(false)
const selectedPaymentMethod = ref('paynow') // Default to PayNow

// Fetch course details
onMounted(async () => {
  if (!courseId.value) {
    error.value = 'Course ID is required'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = null
    
    // Fetch course details
    const courseData = await $fetch(`/api/courses/${courseId.value}`)
    course.value = courseData
    
    // Check if user is already enrolled
    if (courseData.enrollment) {
      if (courseData.enrollment.status === 'ACTIVE' || courseData.enrollment.status === 'COMPLETED') {
        // Already enrolled, redirect to course
        navigateTo(`/dashboard/learn/${courseId.value}`)
        return
      }
    }
  } catch (err: any) {
    console.error('Error fetching course:', err)
    error.value = err.data?.statusMessage || err.message || 'Failed to load course details'
  } finally {
    loading.value = false
  }
})

const formatPrice = (price: number | string, currency: string = 'USD') => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  if (currency === 'USD') {
    return `$${numPrice.toFixed(2)}`
  }
  return `${currency} ${numPrice.toFixed(2)}`
}

const proceedToPayment = async () => {
  if (!course.value || processing.value) return

  try {
    processing.value = true
    
    // Check if enrollment exists
    let enrollment = course.value.enrollment
    
    // If no enrollment or enrollment is cancelled, create new enrollment
    if (!enrollment || enrollment.status === 'CANCELLED') {
      const enrollResponse = await $fetch(`/api/courses/${courseId.value}/enroll`, {
        method: 'POST'
      })
      
      enrollment = enrollResponse.enrollment
      
      // If free course, redirect immediately
      if (enrollResponse.redirectUrl === null && !enrollResponse.invoice) {
        navigateTo(`/dashboard/learn/${courseId.value}`)
        return
      }
    }
    
    // For paid courses, initiate payment
    if (Number(course.value.price) > 0) {
      // Get invoice number from enrollment or create payment
      let invoiceNumber = enrollment?.invoice?.number
      
      if (!invoiceNumber && enrollment?.invoiceId) {
        // Try to get invoice
        try {
          const invoice = await $fetch(`/api/invoices/${enrollment.invoiceId}`)
          invoiceNumber = invoice.number
        } catch (err) {
          console.error('Error fetching invoice:', err)
        }
      }
      
      // If no invoice number, create enrollment to get one
      if (!invoiceNumber) {
        const enrollResponse = await $fetch(`/api/courses/${courseId.value}/enroll`, {
          method: 'POST'
        })
        
        if (enrollResponse.invoice?.number) {
          invoiceNumber = enrollResponse.invoice.number
        } else if (enrollResponse.redirectUrl) {
          // If PayNow redirect URL is provided, use it
          window.location.href = enrollResponse.redirectUrl
          return
        }
      }
      
      // Handle payment based on selected method
      if (selectedPaymentMethod.value === 'paypal') {
        // PayPal payment
        if (!invoiceNumber) {
          error.value = 'Invoice not found. Please try again.'
          return
        }
        
        const paypalResponse = await $fetch('/api/paypal/initiate', {
          method: 'POST',
          body: {
            invoiceNumber: invoiceNumber,
            amount: Number(course.value.price),
            courseName: course.value.name,
            courseId: courseId.value
          }
        })
        
        if (paypalResponse.paymentUrl) {
          window.location.href = paypalResponse.paymentUrl
          return
        } else {
          error.value = 'Failed to create PayPal payment link. Please try again.'
          return
        }
      } else {
        // PayNow payment (default)
        if (invoiceNumber) {
          const paymentResponse = await $fetch('/api/paynow/initiate', {
            method: 'POST',
            body: {
              invoiceNumber: invoiceNumber,
              amount: Number(course.value.price),
              email: undefined // Will use user's email from auth
            }
          })
          
          if (paymentResponse.redirectUrl) {
            // Store pollUrl in localStorage for later use when user returns
            if (paymentResponse.pollUrl && invoiceNumber) {
              try {
                const stored = localStorage.getItem('paynow_pollUrls') || '{}'
                const pollUrls = JSON.parse(stored)
                pollUrls[invoiceNumber] = paymentResponse.pollUrl
                localStorage.setItem('paynow_pollUrls', JSON.stringify(pollUrls))
              } catch (e) {
                console.warn('Failed to store pollUrl:', e)
              }
            }
            
            window.location.href = paymentResponse.redirectUrl
            return
          }
        }
      }
    }
    
    error.value = 'Failed to initiate payment. Please try again or contact support.'
  } catch (err: any) {
    console.error('Payment initiation error:', err)
    error.value = err.data?.message || err.message || 'Failed to initiate payment. Please try again.'
  } finally {
    processing.value = false
  }
}

useHead({
  title: `Course Checkout - ${course.value?.name || 'Course'} | WeCodeZW`,
  meta: [
    { name: 'description', content: 'Complete your course purchase securely' }
  ]
})
</script>

