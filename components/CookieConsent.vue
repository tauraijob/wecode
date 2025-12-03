<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-lg border-t border-navy-700/50 shadow-2xl"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-5">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 border border-purple-500/30">
                <svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 class="text-base sm:text-lg font-semibold text-white">We Use Cookies</h3>
            </div>
            <p class="text-sm sm:text-base text-navy-300">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. 
              <NuxtLink to="/privacy-policy" class="underline hover:text-navy-100 inline">Learn more</NuxtLink>
            </p>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <button
              @click="acceptAll"
              class="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-4 sm:px-6 py-2.5 text-sm font-medium text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Accept All
            </button>
            <button
              @click="acceptEssential"
              class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 sm:px-6 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-colors whitespace-nowrap"
            >
              Essential Only
            </button>
            <button
              @click="dismiss"
              class="rounded-lg p-2 text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 transition-colors"
              aria-label="Close"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const showBanner = ref(false)

onMounted(() => {
  // Check if user has already made a choice
  if (process.client) {
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      // Show banner after a short delay
      setTimeout(() => {
        showBanner.value = true
      }, 1000)
    }
  }
})

function acceptAll() {
  if (process.client) {
    localStorage.setItem('cookieConsent', 'all')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    showBanner.value = false
    
    // Enable all cookies/analytics here if needed
    // Example: enableGoogleAnalytics()
  }
}

function acceptEssential() {
  if (process.client) {
    localStorage.setItem('cookieConsent', 'essential')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    showBanner.value = false
    
    // Only enable essential cookies
  }
}

function dismiss() {
  if (process.client) {
    // Store that user dismissed (they can still use the site)
    localStorage.setItem('cookieConsent', 'dismissed')
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    showBanner.value = false
  }
}
</script>



