<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <!-- Back -->
    <NuxtLink to="/community/events" class="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mb-4 transition-colors">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      Back to Events
    </NuxtLink>

    <!-- Loading -->
    <div v-if="pending" class="rounded-xl bg-white border border-slate-200 p-6 animate-pulse">
      <div class="h-5 bg-slate-200 rounded w-2/3 mb-4"></div>
      <div class="h-3 bg-slate-100 rounded w-full mb-2"></div>
      <div class="h-3 bg-slate-100 rounded w-3/4"></div>
    </div>

    <template v-else-if="event">
      <!-- Event Card -->
      <div class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6">
          <!-- Status -->
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

          <!-- Description -->
          <div class="prose prose-sm max-w-none text-slate-700 mb-6 text-xs leading-relaxed whitespace-pre-wrap">{{ event.description }}</div>

          <!-- Tags -->
          <div v-if="event.tags" class="flex flex-wrap gap-1.5 mb-5">
            <span v-for="tag in event.tags.split(',')" :key="tag" class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
              #{{ tag.trim() }}
            </span>
          </div>

          <!-- RSVP Action -->
          <div class="flex items-center gap-3">
            <button
              v-if="user && event.status !== 'COMPLETED'"
              @click="toggleRSVP"
              :disabled="rsvping"
              :class="event.hasRSVPd ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'"
              class="px-5 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 border"
            >
              <svg v-if="!rsvping && !event.hasRSVPd" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>
              {{ rsvping ? '...' : event.hasRSVPd ? 'Cancel RSVP' : 'RSVP Now' }}
            </button>
            <a
              v-if="event.meetingUrl && event.status === 'LIVE'"
              :href="event.meetingUrl"
              target="_blank"
              class="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-medium transition-colors"
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'community' })

const route = useRoute()
const { user } = useAuth()
const rsvping = ref(false)

const { data, pending, refresh } = useFetch(`/api/community/events/${route.params.id}`)
const event = computed(() => data.value as any)

useHead({ title: computed(() => event.value?.title ? `${event.value.title} - Events` : 'Event') })

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const toggleRSVP = async () => {
  rsvping.value = true
  try {
    await $fetch(`/api/community/events/${route.params.id}/rsvp`, { method: 'POST' })
    refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to RSVP')
  } finally {
    rsvping.value = false
  }
}
</script>
