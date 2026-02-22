<template>
  <div class="max-w-5xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Community Events
        </h1>
        <p class="text-xs text-slate-500 mt-0.5">Free group sessions, webinars &amp; workshops</p>
      </div>
      <button
        v-if="canCreate"
        @click="showCreateModal = true"
        class="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-xs font-medium transition-all shadow-sm"
      >
        + Create Event
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-5 bg-slate-100 rounded-lg p-0.5 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="activeTab === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        class="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="i in 3" :key="i" class="rounded-xl bg-white border border-slate-200 p-5 animate-pulse">
        <div class="h-32 bg-slate-200 rounded-lg mb-3"></div>
        <div class="h-4 bg-slate-200 rounded w-2/3 mb-3"></div>
        <div class="h-3 bg-slate-100 rounded w-full mb-2"></div>
      </div>
    </div>

    <!-- Events Grid -->
    <div v-else-if="events?.length" class="grid gap-4 md:grid-cols-2">
      <div
        v-for="event in events"
        :key="event.id"
        class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- Cover Image -->
        <div v-if="event.coverImage" class="h-40 bg-slate-100 overflow-hidden">
          <img :src="event.coverImage" :alt="event.title" class="w-full h-full object-cover" />
        </div>
        <div v-else class="h-28 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
          <svg class="w-10 h-10 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>

        <div class="p-5">
          <!-- Status + Price Badge -->
          <div class="flex items-center gap-2 mb-3">
            <span
              v-if="event.ticketPrice && Number(event.ticketPrice) > 0"
              class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700"
            >
              {{ event.ticketCurrency || 'USD' }} {{ Number(event.ticketPrice).toFixed(2) }}
            </span>
            <span v-else class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
              Free
            </span>
            <span
              :class="statusClass(event)"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            >
              <svg v-if="event.status === 'UPCOMING'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span v-else-if="event.status === 'LIVE'" class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              {{ event.status === 'UPCOMING' ? 'Upcoming' : event.status === 'LIVE' ? 'Live Now' : 'Completed' }}
            </span>
            <span v-if="event.tags" class="text-[10px] text-slate-400">
              {{ event.tags.split(',').map((t: string) => '#' + t.trim()).join(' ') }}
            </span>
          </div>

          <h3 class="text-sm font-bold text-slate-900 mb-1.5">{{ event.title }}</h3>
          <p class="text-xs text-slate-500 mb-3 line-clamp-2">{{ event.description }}</p>

          <!-- Details -->
          <div class="space-y-1.5 mb-4">
            <div class="flex items-center gap-2 text-xs text-slate-600">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Hosted by <span class="font-medium">{{ event.host?.name }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-600">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ formatDate(event.scheduledAt) }} · {{ event.duration }} min
            </div>
            <div v-if="event.location" class="flex items-center gap-2 text-xs text-slate-600">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ event.location }}
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-600">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ event.attendeeCount }} {{ event.maxAttendees ? `/ ${event.maxAttendees}` : '' }} attendees
            </div>
          </div>

          <!-- Actions -->
          <NuxtLink
            :to="`/community/events/${event.id}`"
            class="block w-full py-2 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-medium text-center transition-colors border border-primary-200"
          >
            View Details →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>
      <h3 class="text-sm font-semibold text-slate-900 mb-1">No events yet</h3>
      <p class="text-xs text-slate-500">Check back soon for upcoming community events!</p>
    </div>

    <!-- Create Event Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="showCreateModal = false">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 class="text-sm font-bold text-slate-900">Create Event</h2>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form @submit.prevent="createEvent" class="p-5 space-y-3">
          <!-- Image Upload -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Cover Image</label>
            <div
              class="relative w-full h-36 rounded-lg border-2 border-dashed border-slate-300 hover:border-primary-400 transition-colors cursor-pointer overflow-hidden bg-slate-50"
              @click="($refs.imageInput as HTMLInputElement).click()"
            >
              <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover" />
              <div v-else class="flex flex-col items-center justify-center h-full text-slate-400">
                <svg class="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span class="text-[10px]">Click to upload event image</span>
              </div>
            </div>
            <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="onImageSelected" />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Title *</label>
            <input v-model="newEvent.title" required class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="React Fundamentals Workshop" />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Description *</label>
            <textarea v-model="newEvent.description" required rows="3" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none resize-none" placeholder="What will this event cover?"></textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Location</label>
            <div class="relative">
              <svg class="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <input v-model="newEvent.location" class="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="Online / Harare Innovation Hub" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Date & Time *</label>
              <input v-model="newEvent.scheduledAt" type="datetime-local" required class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Duration (min)</label>
              <input v-model="newEvent.duration" type="number" min="15" max="480" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Max Attendees</label>
              <input v-model="newEvent.maxAttendees" type="number" min="1" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="Unlimited" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Tags</label>
              <input v-model="newEvent.tags" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="react, webdev" />
            </div>
          </div>
          <!-- Ticket Pricing -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Ticket</label>
            <div class="flex items-center gap-2 mb-2">
              <button type="button" @click="newEvent.isPaid = false" :class="!newEvent.isPaid ? 'bg-green-100 text-green-700 border-green-300' : 'bg-slate-50 text-slate-500 border-slate-200'" class="flex-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all">
                Free Event
              </button>
              <button type="button" @click="newEvent.isPaid = true" :class="newEvent.isPaid ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-50 text-slate-500 border-slate-200'" class="flex-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all">
                Paid Event
              </button>
            </div>
            <div v-if="newEvent.isPaid" class="grid grid-cols-3 gap-2">
              <div class="col-span-2">
                <input v-model="newEvent.ticketPrice" type="number" min="0.01" step="0.01" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="10.00" />
              </div>
              <select v-model="newEvent.ticketCurrency" class="px-2 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 outline-none">
                <option value="USD">USD</option>
                <option value="ZWG">ZWG</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Meeting URL</label>
            <input v-model="newEvent.meetingUrl" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="https://meet.google.com/..." />
          </div>
          <button type="submit" :disabled="creating" class="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-medium transition-all disabled:opacity-50">
            {{ creating ? 'Creating...' : 'Create Event' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'community' })
useHead({ title: 'Community Events - WeCode' })

const { user } = useAuth()
const canCreate = computed(() => user.value && ['ADMIN', 'COMMUNITY_ADMIN'].includes(user.value.role))

const tabs = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'all', label: 'All' }
]
const activeTab = ref('upcoming')
const showCreateModal = ref(false)
const creating = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const newEvent = ref({ title: '', description: '', scheduledAt: '', duration: 60, maxAttendees: null as number | null, meetingUrl: '', tags: '', location: '', isPaid: false, ticketPrice: null as number | null, ticketCurrency: 'USD' })

const { data, pending, refresh } = useFetch('/api/community/events', {
  query: computed(() => ({ status: activeTab.value })),
  watch: [activeTab]
})

const events = computed(() => (data.value as any)?.sessions || [])

const statusClass = (event: any) => {
  if (event.status === 'LIVE') return 'bg-green-100 text-green-700'
  if (event.status === 'COMPLETED') return 'bg-slate-100 text-slate-600'
  return 'bg-blue-100 text-blue-700'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const onImageSelected = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.[0]) {
    imageFile.value = input.files[0]
    imagePreview.value = URL.createObjectURL(input.files[0])
  }
}

const createEvent = async () => {
  creating.value = true
  try {
    const formData = new FormData()
    formData.append('title', newEvent.value.title)
    formData.append('description', newEvent.value.description)
    formData.append('scheduledAt', newEvent.value.scheduledAt)
    formData.append('duration', String(newEvent.value.duration))
    if (newEvent.value.maxAttendees) formData.append('maxAttendees', String(newEvent.value.maxAttendees))
    if (newEvent.value.meetingUrl) formData.append('meetingUrl', newEvent.value.meetingUrl)
    if (newEvent.value.tags) formData.append('tags', newEvent.value.tags)
    if (newEvent.value.location) formData.append('location', newEvent.value.location)
    if (newEvent.value.isPaid && newEvent.value.ticketPrice) {
      formData.append('ticketPrice', String(newEvent.value.ticketPrice))
      formData.append('ticketCurrency', newEvent.value.ticketCurrency)
    }
    if (imageFile.value) formData.append('image', imageFile.value)

    await $fetch('/api/community/events', { method: 'POST', body: formData })
    showCreateModal.value = false
    newEvent.value = { title: '', description: '', scheduledAt: '', duration: 60, maxAttendees: null, meetingUrl: '', tags: '', location: '', isPaid: false, ticketPrice: null, ticketCurrency: 'USD' }
    imageFile.value = null
    imagePreview.value = null
    refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to create event')
  } finally {
    creating.value = false
  }
}
</script>
