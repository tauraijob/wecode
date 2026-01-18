<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          @click="close"
        ></div>

        <!-- Modal -->
        <div class="relative w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="p-4 border-b border-slate-100 bg-gradient-to-r from-primary-50 to-primary-100">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-bold text-slate-900">Top Up Credits</h2>
              <button
                @click="close"
                class="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p class="mt-1 text-xs text-slate-600">
              Purchase credits to book mentorship sessions
            </p>
          </div>

          <!-- Currency Toggle -->
          <div class="px-4 pt-3">
            <div class="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                @click="selectedCurrency = 'USD'"
                class="flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all"
                :class="selectedCurrency === 'USD' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'"
              >
                🇺🇸 USD
              </button>
              <button
                @click="selectedCurrency = 'ZWG'"
                class="flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all"
                :class="selectedCurrency === 'ZWG' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'"
              >
                🇿🇼 ZWG
              </button>
            </div>
            <p class="mt-1.5 text-[10px] text-slate-400 text-center">
              1 USD ≈ {{ zwgRate.toFixed(1) }} ZWG
            </p>
          </div>

          <!-- Warning if insufficient -->
          <div v-if="shortfall > 0" class="mx-4 mt-3 p-2 rounded-md bg-amber-50 border border-amber-200">
            <div class="flex items-center gap-1.5 text-amber-700 text-xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>You need {{ shortfall }} more credits</span>
            </div>
          </div>

          <!-- Credit Packages -->
          <div class="p-4 space-y-2">
            <button
              v-for="pkg in packagesWithPrices"
              :key="pkg.id"
              @click="selectPackage(pkg.id)"
              class="w-full p-3 rounded-lg border-2 transition-all text-left"
              :class="selectedPackage === pkg.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-200 hover:border-slate-300 bg-white'"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-semibold text-slate-900">{{ pkg.name }}</h3>
                  <p class="text-xs text-slate-500">{{ pkg.credits }} credits</p>
                </div>
                <div class="text-right">
                  <span class="text-lg font-bold text-primary-600">
                    {{ currencySymbol }}{{ pkg.displayPrice }}
                  </span>
                  <p class="text-[10px] text-slate-400">
                    {{ currencySymbol }}{{ pkg.perCredit }}/credit
                  </p>
                </div>
              </div>
              <div v-if="pkg.bonus" class="mt-1.5 flex items-center gap-2">
                <span
                  v-if="pkg.popular"
                  class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-primary-100 text-primary-700 text-[10px] font-medium"
                >
                  <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Most Popular
                </span>
                <span class="text-[10px] text-green-600 font-medium">{{ pkg.bonus }}</span>
              </div>
            </button>
          </div>

          <!-- Token Info -->
          <div class="mx-4 mb-3 p-2 rounded-md bg-slate-50 border border-slate-200">
            <p class="text-[10px] text-slate-500 leading-relaxed">
              <strong class="text-slate-700">How it works:</strong> Credits are used to book mentorship sessions.
              Mentor rates vary (typically 30-100 credits/hr). Your credits never expire.
            </p>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
            <button
              @click="close"
              class="flex-1 py-2 px-3 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              @click="buyCredits"
              :disabled="!selectedPackage || loading"
              class="flex-1 py-2 px-3 rounded-md bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <svg v-if="loading" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? 'Processing...' : 'Pay with PayNow' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  shortfall?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const loading = ref(false)
const selectedPackage = ref<string>('standard')
const selectedCurrency = ref<'USD' | 'ZWG'>('USD')

// Exchange rate (matches .env ZWG_USD_RATE)
const zwgRate = 30.5

// Base packages with USD pricing
// Base rate: $0.10 per credit (1 credit = $0.10)
const packages = [
  { id: 'starter', name: 'Starter', credits: 100, priceUsd: 10, popular: false, bonus: '' },
  { id: 'standard', name: 'Standard', credits: 220, priceUsd: 20, popular: true, bonus: '+10% bonus' },
  { id: 'premium', name: 'Premium', credits: 500, priceUsd: 45, popular: false, bonus: '+11% bonus' }
]

// Currency symbol
const currencySymbol = computed(() => selectedCurrency.value === 'USD' ? '$' : 'ZWG ')

// Packages with calculated prices based on selected currency
const packagesWithPrices = computed(() => {
  return packages.map(pkg => {
    const displayPrice = selectedCurrency.value === 'ZWG' 
      ? Math.ceil(pkg.priceUsd * zwgRate)
      : pkg.priceUsd
    const perCredit = (displayPrice / pkg.credits).toFixed(2)
    
    return {
      ...pkg,
      displayPrice,
      perCredit
    }
  })
})

const close = () => {
  emit('update:modelValue', false)
}

const selectPackage = (id: string) => {
  selectedPackage.value = id
}

const buyCredits = async () => {
  if (!selectedPackage.value) return

  loading.value = true
  try {
    const response = await $fetch('/api/community/credits/topup', {
      method: 'POST',
      body: { 
        package: selectedPackage.value,
        currency: selectedCurrency.value
      }
    })

    if (response.redirectUrl) {
      // Redirect to PayNow
      window.location.href = response.redirectUrl
    }
  } catch (err: any) {
    console.error('Top-up error:', err)
    error(err.data?.message || 'Failed to initiate payment')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
