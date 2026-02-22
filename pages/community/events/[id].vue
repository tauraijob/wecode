<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <!-- Back -->
    <NuxtLink to="/community/events" class="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mb-4 transition-colors">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      Back to Events
    </NuxtLink>

    <!-- Loading -->
    <div v-if="pending" class="rounded-xl bg-white border border-slate-200 p-6 animate-pulse">
      <div class="h-48 bg-slate-200 rounded-lg mb-4"></div>
      <div class="h-5 bg-slate-200 rounded w-2/3 mb-4"></div>
      <div class="h-3 bg-slate-100 rounded w-full mb-2"></div>
    </div>

    <template v-else-if="event">
      <!-- Event Card -->
      <div class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <!-- Cover Image Banner -->
        <div v-if="event.coverImage" class="relative h-56 sm:h-64 overflow-hidden">
          <img :src="event.coverImage" :alt="event.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-4 left-5 right-5">
            <span
              :class="event.status === 'LIVE' ? 'bg-green-500 text-white' : event.status === 'COMPLETED' ? 'bg-slate-500 text-white' : 'bg-blue-500 text-white'"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
            >
              <svg v-if="event.status === 'UPCOMING'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span v-else-if="event.status === 'LIVE'" class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              {{ event.status === 'UPCOMING' ? 'Upcoming' : event.status === 'LIVE' ? 'Live Now' : 'Completed' }}
            </span>
          </div>
        </div>
        <!-- No Image Status -->
        <div v-else class="px-6 pt-6">
          <div class="flex items-center gap-2 mb-3">
            <span
              :class="event.status === 'LIVE' ? 'bg-green-100 text-green-700' : event.status === 'COMPLETED' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            >
              <svg v-if="event.status === 'UPCOMING'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span v-else-if="event.status === 'LIVE'" class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              {{ event.status === 'UPCOMING' ? 'Upcoming' : event.status === 'LIVE' ? 'Live Now' : 'Completed' }}
            </span>
          </div>
        </div>

        <div class="p-6">
          <h1 class="text-lg font-bold text-slate-900 mb-2">{{ event.title }}</h1>

          <!-- Host & Details -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="flex items-center gap-2 text-xs text-slate-600">
              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[10px] font-bold">
                {{ event.host?.name?.charAt(0) || 'H' }}
              </div>
              <div>
                <div class="font-medium text-slate-900">{{ event.host?.name }}</div>
                <div class="text-[10px] text-slate-400">Host</div>
              </div>
            </div>
            <div class="space-y-1 text-xs text-slate-600">
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {{ formatDate(event.scheduledAt) }}
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {{ event.duration }} minutes
              </div>
            </div>
          </div>

          <!-- Location -->
          <div v-if="event.location" class="flex items-center gap-2 text-xs text-slate-600 mb-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
            <svg class="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="font-medium">{{ event.location }}</span>
          </div>

          <!-- Ticket Price Badge -->
          <div class="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border" :class="event.ticketPrice && Number(event.ticketPrice) > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'">
            <svg class="w-4 h-4 flex-shrink-0" :class="event.ticketPrice && Number(event.ticketPrice) > 0 ? 'text-amber-500' : 'text-green-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span v-if="event.ticketPrice && Number(event.ticketPrice) > 0" class="text-xs font-semibold text-amber-700">
              Ticket: {{ event.ticketCurrency || 'USD' }} {{ Number(event.ticketPrice).toFixed(2) }}
            </span>
            <span v-else class="text-xs font-semibold text-green-700">
              Free Event — No ticket required
            </span>
          </div>

          <!-- Description -->
          <div class="prose prose-sm max-w-none text-slate-700 mb-6 text-xs leading-relaxed whitespace-pre-wrap">{{ event.description }}</div>

          <!-- Tags -->
          <div v-if="event.tags" class="flex flex-wrap gap-1.5 mb-5">
            <span v-for="tag in event.tags.split(',')" :key="tag" class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
              #{{ tag.trim() }}
            </span>
          </div>

          <!-- RSVP Action -->
          <div class="flex items-center gap-3 flex-wrap">
            <button
              v-if="user && event.status !== 'COMPLETED'"
              @click="toggleRSVP"
              :disabled="rsvping"
              :class="event.hasRSVPd ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'"
              class="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 border"
            >
              <svg v-if="!rsvping && !event.hasRSVPd" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>
              {{ rsvping ? '...' : event.hasRSVPd ? 'Cancel RSVP' : 'RSVP Now' }}
            </button>

            <!-- Download Ticket Button -->
            <button
              v-if="event.hasRSVPd"
              @click="showTicketModal = true; fetchTicket()"
              class="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 text-xs font-medium transition-all"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              View E-Ticket
            </button>

            <a
              v-if="event.meetingUrl && event.status === 'LIVE'"
              :href="event.meetingUrl"
              target="_blank"
              class="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-medium transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              Join Meeting
            </a>
            <span class="text-xs text-slate-500">
              {{ event.attendeeCount }} {{ event.maxAttendees ? `/ ${event.maxAttendees}` : '' }} attending
            </span>
          </div>
        </div>
      </div>

      <!-- Attendees List -->
      <div class="mt-6 rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <h2 class="text-xs font-semibold text-slate-900">Attendees ({{ event.rsvps?.length || 0 }})</h2>
        </div>
        <div class="p-4">
          <div v-if="event.rsvps?.length" class="flex flex-wrap gap-2">
            <div v-for="rsvp in event.rsvps" :key="rsvp.id" class="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
              <div class="w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[8px] font-bold">
                {{ rsvp.user?.name?.charAt(0) || 'U' }}
              </div>
              <span class="text-[10px] text-slate-700 font-medium">{{ rsvp.user?.name }}</span>
            </div>
          </div>
          <p v-else class="text-xs text-slate-500 text-center py-4">No RSVPs yet. Be the first!</p>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-16 text-sm text-slate-500">Event not found.</div>

    <!-- E-Ticket Modal -->
    <div v-if="showTicketModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showTicketModal = false">
      <div class="w-full max-w-md mx-4">
        <!-- Close -->
        <div class="flex justify-end mb-2">
          <button @click="showTicketModal = false" class="text-white/80 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Ticket -->
        <div v-if="ticketData" ref="ticketRef" class="rounded-2xl overflow-hidden shadow-2xl">
          <!-- Ticket Top -->
          <div class="relative bg-gradient-to-br from-primary-600 via-primary-500 to-blue-500 px-6 pt-6 pb-8 text-white">
            <!-- Event Image Overlay -->
            <div v-if="ticketData.eventImage" class="absolute inset-0 opacity-20">
              <img :src="ticketData.eventImage" class="w-full h-full object-cover" />
            </div>
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                </div>
                <span class="text-[10px] font-semibold uppercase tracking-wider opacity-80">WeCode ZW • E-Ticket</span>
              </div>
              <h3 class="text-lg font-bold leading-tight mb-2">{{ ticketData.eventTitle }}</h3>
              <p class="text-xs opacity-80">Hosted by {{ ticketData.hostName }}</p>
            </div>
          </div>

          <!-- Ticket Perforation -->
          <div class="relative bg-white">
            <div class="absolute -top-3 left-0 right-0 flex justify-between px-2">
              <div class="w-6 h-6 rounded-full bg-black/50"></div>
              <div class="flex-1 border-t-2 border-dashed border-slate-300 mt-3 mx-2"></div>
              <div class="w-6 h-6 rounded-full bg-black/50"></div>
            </div>
          </div>

          <!-- Ticket Bottom -->
          <div class="bg-white px-6 pt-6 pb-6">
            <!-- Details Grid -->
            <div class="grid grid-cols-2 gap-4 mb-5">
              <div>
                <div class="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Attendee</div>
                <div class="text-sm font-semibold text-slate-900">{{ ticketData.attendeeName }}</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Date</div>
                <div class="text-sm font-semibold text-slate-900">{{ formatTicketDate(ticketData.eventDate) }}</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Time</div>
                <div class="text-sm font-semibold text-slate-900">{{ formatTicketTime(ticketData.eventDate) }}</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Duration</div>
                <div class="text-sm font-semibold text-slate-900">{{ ticketData.eventDuration }} min</div>
              </div>
              <div v-if="ticketData.eventLocation" class="col-span-2">
                <div class="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Location</div>
                <div class="text-sm font-semibold text-slate-900 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {{ ticketData.eventLocation }}
                </div>
              </div>
            </div>

            <!-- Ticket Code -->
            <div class="rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 p-4 text-center">
              <div class="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Ticket Code</div>
              <div class="text-2xl font-black tracking-[0.2em] text-primary-600 font-mono">{{ ticketData.ticketCode }}</div>
              <div class="text-[10px] text-slate-400 mt-1">Present this code at the event</div>
            </div>

            <!-- Footer -->
            <div class="mt-4 flex items-center justify-between text-[10px] text-slate-400">
              <span>Registered {{ formatTicketDate(ticketData.registeredAt) }}</span>
              <span class="font-medium">wecode.co.zw</span>
            </div>
          </div>
        </div>
        <div v-else class="bg-white rounded-xl p-8 text-center">
          <div class="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          <p class="text-xs text-slate-500 mt-3">Loading your ticket...</p>
        </div>

        <!-- Download Button -->
        <div v-if="ticketData" class="mt-3 text-center">
          <button
            @click="downloadTicket"
            class="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-white text-slate-900 text-xs font-medium shadow-lg hover:bg-slate-50 transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Save as Image
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'community' })

const route = useRoute()
const { user } = useAuth()
const rsvping = ref(false)
const showTicketModal = ref(false)
const ticketData = ref<any>(null)

const { data, pending, refresh } = useFetch(`/api/community/events/${route.params.id}`)
const event = computed(() => data.value as any)

useHead({ title: computed(() => event.value?.title ? `${event.value.title} - Events` : 'Event') })

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const formatTicketDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatTicketTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const toggleRSVP = async () => {
  rsvping.value = true
  try {
    const result: any = await $fetch(`/api/community/events/${route.params.id}/rsvp`, { method: 'POST' })
    if (result.rsvpd) {
      ticketData.value = null // Reset ticket data so it gets refetched
    }
    refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to RSVP')
  } finally {
    rsvping.value = false
  }
}

const fetchTicket = async () => {
  try {
    ticketData.value = await $fetch(`/api/community/events/${route.params.id}/ticket`)
  } catch (err: any) {
    alert(err.data?.message || 'Failed to load ticket')
    showTicketModal.value = false
  }
}

const ticketRef = ref<HTMLElement | null>(null)
const downloadTicket = async () => {
  if (!ticketRef.value) return

  try {
    // Use html2canvas if available, otherwise fallback to print
    const { default: html2canvas } = await import('html2canvas').catch(() => ({ default: null }))
    if (html2canvas) {
      const canvas = await html2canvas(ticketRef.value, { scale: 2, useCORS: true, backgroundColor: null })
      const link = document.createElement('a')
      link.download = `ticket-${ticketData.value.ticketCode}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } else {
      // Fallback: open print dialog
      window.print()
    }
  } catch {
    window.print()
  }
}
</script>
