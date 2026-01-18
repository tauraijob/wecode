<template>
  <div class="min-h-screen bg-slate-50">
    <section class="mx-auto max-w-3xl px-3 py-5">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <NuxtLink to="/community" class="hover:text-primary-600 transition-colors">Community</NuxtLink>
        <span>/</span>
        <NuxtLink to="/community/mentors" class="hover:text-primary-600 transition-colors">Mentors</NuxtLink>
        <span>/</span>
        <span class="text-slate-900">{{ mentor?.name || 'Loading...' }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="animate-pulse">
        <div class="flex items-start gap-4 mb-5">
          <div class="w-16 h-16 rounded-full bg-slate-200"></div>
          <div class="flex-1">
            <div class="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div class="h-4 bg-slate-100 rounded w-1/4 mb-3"></div>
            <div class="h-16 bg-slate-100 rounded w-full"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="fetchError" class="p-8 rounded-lg bg-white border border-slate-200 text-center">
        <h3 class="text-sm font-semibold text-slate-900 mb-1">Mentor not found</h3>
        <p class="text-slate-500 text-xs mb-3">The mentor you're looking for doesn't exist.</p>
        <NuxtLink to="/community/mentors" class="text-primary-600 hover:underline text-xs">Browse all mentors</NuxtLink>
      </div>

      <!-- Mentor Profile -->
      <div v-else-if="mentor">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row items-start gap-4 mb-5">
          <div class="relative flex-shrink-0">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold">
              {{ getInitials(mentor.name) }}
            </div>
            <div
              v-if="mentor.verified"
              class="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center border-2 border-slate-50"
              title="Verified Mentor"
            >
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <div class="flex-1">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <h1 class="text-lg md:text-xl font-bold text-slate-900">{{ mentor.name }}</h1>
              <span
                v-if="mentor.verified"
                class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-primary-100 text-primary-700 text-xs font-medium"
              >
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Verified
              </span>
            </div>

            <!-- Stats -->
            <div class="flex flex-wrap gap-3 text-xs text-slate-600 mb-3">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="font-semibold text-slate-900">{{ mentor.hourlyRate }}</span> credits/hour
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="font-semibold text-slate-900">{{ mentor.sessionsCount }}</span> sessions
              </div>
            </div>

            <!-- Skills -->
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="skill in mentor.skills"
                :key="skill"
                class="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <!-- Bio Section -->
        <div class="mb-5 p-4 rounded-lg bg-white border border-slate-200 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-900 mb-2">About</h2>
          <p class="text-xs text-slate-600 whitespace-pre-line">{{ mentor.bio }}</p>
        </div>

        <!-- Booking Section -->
        <div class="p-4 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
          <h2 class="text-sm font-semibold text-slate-900 mb-3">Book a Session</h2>

          <div v-if="!isAuthenticated" class="text-center py-4">
            <p class="text-slate-600 text-xs mb-3">Please log in to book a session</p>
            <NuxtLink
              :to="`/auth/login?redirect=/community/mentors/${mentor.id}`"
              class="inline-flex items-center gap-1.5 py-2 px-4 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors"
            >
              Login to Book
            </NuxtLink>
          </div>

          <form v-else @submit.prevent="bookSession" class="space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Date & Time</label>
                <input
                  v-model="booking.scheduledAt"
                  type="datetime-local"
                  required
                  :min="minDateTime"
                  class="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-xs"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1">Duration</label>
                <select
                  v-model="booking.duration"
                  class="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-slate-900 focus:border-primary-500 outline-none text-xs"
                >
                  <option :value="30">30 minutes</option>
                  <option :value="60">1 hour</option>
                  <option :value="90">1.5 hours</option>
                  <option :value="120">2 hours</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Notes (optional)</label>
              <textarea
                v-model="booking.notes"
                rows="2"
                placeholder="What would you like to discuss?"
                class="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-primary-500 resize-none outline-none text-xs"
              ></textarea>
            </div>

            <!-- Cost Summary -->
            <div class="p-3 rounded-md bg-white border border-slate-200 flex items-center justify-between">
              <div>
                <span class="text-xs text-slate-600">Session Cost:</span>
                <span class="ml-1.5 text-base font-bold text-primary-600">{{ calculateCost }} credits</span>
              </div>
              <div class="text-xs text-slate-500">
                Balance: <span class="text-slate-900 font-medium">{{ user?.credits || 0 }} credits</span>
              </div>
            </div>

            <!-- Insufficient Credits Warning -->
            <div
              v-if="isAuthenticated && (user?.credits || 0) < calculateCost"
              class="p-3 rounded-md bg-amber-50 border border-amber-200"
            >
              <div class="flex items-center gap-1.5 text-amber-700 text-xs mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="font-medium">Insufficient credits</span>
              </div>
              <p class="text-xs text-slate-600 mb-2">
                You need {{ calculateCost - (user?.credits || 0) }} more credits.
              </p>
              <button
                type="button"
                @click="showTopUpModal = true"
                class="py-1.5 px-3 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors"
              >
                Top Up Credits
              </button>
            </div>

            <button
              type="submit"
              :disabled="bookingLoading || (user?.credits || 0) < calculateCost"
              class="w-full py-2.5 px-4 rounded-md bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <svg v-if="bookingLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ bookingLoading ? 'Booking...' : 'Book Session' }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Top Up Modal -->
    <TopUpModal v-model="showTopUpModal" :shortfall="calculateCost - (user?.credits || 0)" />

    <!-- Success Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="bookingSuccess" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="navigateTo('/community/bookings')"></div>
          <div class="relative w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-2xl p-6 text-center">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-base font-bold text-slate-900 mb-1">Session Booked!</h3>
            <p class="text-xs text-slate-600 mb-4">
              Your session with {{ mentor?.name }} has been scheduled.
            </p>
            <NuxtLink
              to="/community/bookings"
              class="inline-flex items-center gap-1.5 py-2 px-4 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors"
            >
              View My Bookings
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community'
})

const route = useRoute()
const { user, isAuthenticated, refresh: refreshAuth } = useAuth()
const { error: toastError } = useToast()

const showTopUpModal = ref(false)
const bookingLoading = ref(false)
const bookingSuccess = ref(false)

const booking = reactive({
  scheduledAt: '',
  duration: 60,
  notes: ''
})

const { data: mentor, pending, error: fetchError } = useFetch<any>(`/api/community/mentors/${route.params.id}`)

const minDateTime = computed(() => {
  const now = new Date()
  now.setHours(now.getHours() + 1)
  return now.toISOString().slice(0, 16)
})

const calculateCost = computed(() => {
  if (!mentor.value) return 0
  return Math.ceil((mentor.value.hourlyRate * booking.duration) / 60)
})

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const bookSession = async () => {
  if (!booking.scheduledAt || !mentor.value) return

  bookingLoading.value = true
  try {
    await $fetch('/api/community/book', {
      method: 'POST',
      body: {
        mentorProfileId: mentor.value.id,
        scheduledAt: booking.scheduledAt,
        duration: booking.duration,
        notes: booking.notes
      }
    })

    bookingSuccess.value = true
    refreshAuth()
  } catch (err: any) {
    if (err.statusCode === 402) {
      showTopUpModal.value = true
    } else {
      toastError(err.data?.message || 'Failed to book session')
    }
  } finally {
    bookingLoading.value = false
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
</style>
