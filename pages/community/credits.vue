<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
    <section class="mx-auto max-w-4xl px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <NuxtLink 
          to="/community" 
          class="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary-600 mb-3 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Community
        </NuxtLink>
        
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Understanding Credits
            </h1>
            <p class="text-sm text-slate-500">Your guide to using credits on WeCode Community</p>
          </div>
        </div>
      </div>

      <!-- Current Balance Card (if authenticated) -->
      <div v-if="isAuthenticated" class="mb-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 p-5 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-white/70 mb-1">Your Current Balance</p>
            <p class="text-3xl font-bold">{{ user?.credits || 0 }} <span class="text-lg font-normal text-white/80">credits</span></p>
          </div>
          <button 
            @click="showTopUpModal = true"
            class="px-4 py-2 rounded-lg bg-white text-primary-600 text-sm font-semibold hover:bg-white/90 transition-colors shadow-sm"
          >
            Buy Credits
          </button>
        </div>
      </div>

      <!-- What are Credits -->
      <div class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div class="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">1</span>
            What Are Credits?
          </h2>
        </div>
        <div class="p-5">
          <p class="text-sm text-slate-600 mb-4 leading-relaxed">
            Credits are the virtual currency on WeCode Community. They allow you to book mentorship sessions, 
            access premium features, and support the platform. Think of them as tokens that unlock learning opportunities!
          </p>
          
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-emerald-800 mb-1">Welcome Bonus</h3>
                <p class="text-xs text-emerald-700">Every new member receives <strong>20 free credits</strong> upon registration!</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
              <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-blue-800 mb-1">Coupon Codes</h3>
                <p class="text-xs text-blue-700">Redeem special coupon codes to receive bonus credits!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- How to Use Credits -->
      <div class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div class="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">2</span>
            How to Use Credits
          </h2>
        </div>
        <div class="p-5 space-y-4">
          <!-- Use Case 1: Book Mentorship -->
          <div class="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0 shadow-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-slate-800 mb-1">Book Mentorship Sessions</h3>
              <p class="text-xs text-slate-600 mb-2">
                Connect with experienced mentors for one-on-one guidance. Mentors set their own hourly rates in credits 
                (typically 10-500 credits per hour depending on expertise).
              </p>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-medium">10-500 credits/hour</span>
                <NuxtLink to="/community/mentors" class="text-xs text-primary-600 hover:underline">Browse Mentors →</NuxtLink>
              </div>
            </div>
          </div>

          <!-- Use Case 2: Coming Soon -->
          <div class="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 opacity-60">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center shrink-0 shadow-sm">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-slate-800 mb-1">Premium Features <span class="text-[10px] text-slate-400 font-normal">(Coming Soon)</span></h3>
              <p class="text-xs text-slate-500">
                Unlock exclusive content, priority support, and advanced tools. More features will be added as the platform grows!
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- How to Get Credits -->
      <div class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div class="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">3</span>
            How to Get More Credits
          </h2>
        </div>
        <div class="p-5">
          <div class="grid md:grid-cols-3 gap-4">
            <!-- Method 1: Purchase -->
            <div class="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 text-center">
              <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-amber-800 mb-2">Purchase Credits</h3>
              <p class="text-xs text-amber-700 mb-3">Buy credit packages using mobile money or bank transfer.</p>
              <div class="space-y-1 text-[10px] text-amber-600 mb-3">
                <p>Starter: 100 credits → $10</p>
                <p>Standard: 220 credits → $20</p>
                <p>Premium: 500 credits → $45</p>
              </div>
              <button 
                v-if="isAuthenticated"
                @click="showTopUpModal = true" 
                class="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium transition-colors"
              >
                Buy Now
              </button>
              <NuxtLink 
                v-else
                to="/auth/login?redirect=/community/credits"
                class="block w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium transition-colors text-center"
              >
                Sign In to Buy
              </NuxtLink>
            </div>

            <!-- Method 2: Coupon Codes -->
            <div class="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-center">
              <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-blue-800 mb-2">Redeem Coupon</h3>
              <p class="text-xs text-blue-700 mb-3">Have a coupon code? Redeem it in the sidebar to get free credits!</p>
              <div class="text-[10px] text-blue-600 mb-3">
                <p>Check our social media for special promotions and giveaways.</p>
              </div>
              <NuxtLink 
                to="/community"
                class="block w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium transition-colors text-center"
              >
                Go to Forum
              </NuxtLink>
            </div>

            <!-- Method 3: Become a Mentor -->
            <div class="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 text-center">
              <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-emerald-800 mb-2">Become a Mentor</h3>
              <p class="text-xs text-emerald-700 mb-3">Share your expertise and earn credits when students book your sessions!</p>
              <div class="text-[10px] text-emerald-600 mb-3">
                <p>Mentors earn 60% of session fees</p>
                <p>Cash out credits anytime</p>
              </div>
              <NuxtLink 
                to="/community/mentors"
                class="block w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors text-center"
              >
                Apply as Mentor
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Credit Value & Exchange -->
      <div class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div class="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">4</span>
            Credit Value
          </h2>
        </div>
        <div class="p-5">
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Purchase Rate</h3>
              <p class="text-2xl font-bold text-slate-800 mb-1">1 credit = $0.10 <span class="text-sm font-normal text-slate-500">USD</span></p>
              <p class="text-xs text-slate-500">Buy credits at this rate (bulk discounts available)</p>
            </div>
            <div class="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <h3 class="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">Mentor Cashout Rate</h3>
              <p class="text-2xl font-bold text-emerald-700 mb-1">1 credit = $0.10 <span class="text-sm font-normal text-emerald-600">USD</span></p>
              <p class="text-xs text-emerald-600">Mentors earn 60% of session value, cash out anytime</p>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <h2 class="text-lg font-bold text-slate-800">Frequently Asked Questions</h2>
        </div>
        <div class="divide-y divide-slate-100">
          <div class="p-5">
            <h3 class="text-sm font-semibold text-slate-800 mb-2">Do credits expire?</h3>
            <p class="text-xs text-slate-600">No, your credits never expire. Use them whenever you're ready!</p>
          </div>
          <div class="p-5">
            <h3 class="text-sm font-semibold text-slate-800 mb-2">Can I transfer credits to another user?</h3>
            <p class="text-xs text-slate-600">Currently, credits cannot be transferred between users. Each account maintains its own balance.</p>
          </div>
          <div class="p-5">
            <h3 class="text-sm font-semibold text-slate-800 mb-2">What payment methods are accepted?</h3>
            <p class="text-xs text-slate-600">We accept Ecocash, Innbucks, and bank transfers for credit purchases.</p>
          </div>
          <div class="p-5">
            <h3 class="text-sm font-semibold text-slate-800 mb-2">How do I cash out as a mentor?</h3>
            <p class="text-xs text-slate-600">Go to your Mentor Dashboard → Earnings → Request Payout. You can cash out via Ecocash, Innbucks, bank transfer, or cash collection in Harare.</p>
          </div>
          <div class="p-5">
            <h3 class="text-sm font-semibold text-slate-800 mb-2">I have more questions!</h3>
            <p class="text-xs text-slate-600">
              Feel free to post in the 
              <NuxtLink to="/community" class="text-primary-600 hover:underline">community forum</NuxtLink> 
              or contact us via WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- TopUp Modal -->
    <TopUpModal v-model="showTopUpModal" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community'
})

const { user, isAuthenticated } = useAuth()
const showTopUpModal = ref(false)
</script>
