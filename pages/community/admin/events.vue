<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl font-bold text-slate-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Events Management
        </h1>
        <p class="text-xs text-slate-500 mt-0.5">Create, manage and monitor community events</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Create Event
      </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-2xl font-bold text-slate-900">{{ totalEvents }}</div>
        <div class="text-xs text-slate-500">Total Events</div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-2xl font-bold text-blue-600">{{ upcomingCount }}</div>
        <div class="text-xs text-slate-500">Upcoming</div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-2xl font-bold text-green-600">{{ totalRSVPs }}</div>
        <div class="text-xs text-slate-500">Total RSVPs</div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-2xl font-bold text-amber-600">{{ paidEvents }}</div>
        <div class="text-xs text-slate-500">Paid Events</div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-1 mb-4 bg-slate-100 rounded-lg p-0.5 w-fit">
      <button
        v-for="tab in tabs" :key="tab.key"
        @click="activeTab = tab.key"
        :class="activeTab === tab.key ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'"
        class="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-20 bg-white rounded-xl animate-pulse border border-slate-200"></div>
    </div>

    <!-- Events Table -->
    <div v-else-if="filteredEvents.length" class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-xs">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="text-left px-4 py-3 font-semibold text-slate-600">Event</th>
              <th class="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
              <th class="text-left px-4 py-3 font-semibold text-slate-600">Ticket</th>
              <th class="text-center px-4 py-3 font-semibold text-slate-600">RSVPs</th>
              <th class="text-center px-4 py-3 font-semibold text-slate-600">Status</th>
              <th class="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="event in filteredEvents" :key="event.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div v-if="event.coverImage" class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                    <img :src="event.coverImage" :alt="event.title" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div class="min-w-0">
                    <div class="font-semibold text-slate-900 truncate max-w-[200px]">{{ event.title }}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                      <span v-if="event.location">{{ event.location }}</span>
                      <span v-else>Online</span>
                      · {{ event.duration }}min
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-slate-600 whitespace-nowrap">
                {{ formatDate(event.scheduledAt) }}
              </td>
              <td class="px-4 py-3">
                <span v-if="event.ticketPrice && Number(event.ticketPrice) > 0" class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
                  {{ event.ticketCurrency || 'USD' }} {{ Number(event.ticketPrice).toFixed(2) }}
                </span>
                <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                  Free
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <span class="font-semibold text-slate-900">{{ event._count?.rsvps || 0 }}</span>
                <span v-if="event.maxAttendees" class="text-slate-400"> / {{ event.maxAttendees }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <span
                  :class="event.status === 'LIVE' ? 'bg-green-100 text-green-700' : event.status === 'COMPLETED' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                >
                  <span v-if="event.status === 'LIVE'" class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  {{ event.status === 'UPCOMING' ? 'Upcoming' : event.status === 'LIVE' ? 'Live' : 'Completed' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1">
                  <NuxtLink :to="`/community/events/${event.id}`" class="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-primary-600 transition-colors" title="View">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </NuxtLink>
                  <button @click="deleteEvent(event.id)" class="p-1.5 rounded-md hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors" title="Delete">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-sm font-medium text-slate-600 mb-1">No events found</p>
      <p class="text-xs text-slate-400">Create your first community event to get started</p>
    </div>

    <!-- Create Event Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="showCreateModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 class="text-base font-bold text-slate-900">Create Event</h2>
          <button @click="showCreateModal = false" class="p-1 rounded-md hover:bg-slate-100"><svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <form @submit.prevent="createEvent" class="p-6 space-y-4">
          <!-- Cover Image Upload -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Cover Image</label>
            <div 
              @click="$refs.imageInput.click()" 
              @dragover.prevent 
              @drop.prevent="handleDrop"
              class="relative w-full h-32 rounded-lg border-2 border-dashed border-slate-300 hover:border-primary-400 transition-colors cursor-pointer overflow-hidden flex items-center justify-center bg-slate-50"
            >
              <img v-if="imagePreview" :src="imagePreview" class="absolute inset-0 w-full h-full object-cover" />
              <div v-else class="text-center">
                <svg class="w-8 h-8 mx-auto text-slate-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p class="text-[10px] text-slate-400">Click or drag to upload</p>
              </div>
            </div>
            <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="handleImageSelect" />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Title *</label>
            <input v-model="form.title" required class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="React Fundamentals Workshop" />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Description *</label>
            <textarea v-model="form.description" required rows="3" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none resize-none" placeholder="What will this event cover?"></textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Location</label>
            <input v-model="form.location" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="Online / Harare Innovation Hub" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Date & Time *</label>
              <input v-model="form.scheduledAt" type="datetime-local" required class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Duration (min)</label>
              <input v-model="form.duration" type="number" min="15" max="480" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Max Attendees</label>
              <input v-model="form.maxAttendees" type="number" min="1" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="Unlimited" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Tags</label>
              <input v-model="form.tags" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="react, webdev" />
            </div>
          </div>
          <!-- Ticket Pricing -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Ticket</label>
            <div class="flex items-center gap-2 mb-2">
              <button type="button" @click="form.isPaid = false" :class="!form.isPaid ? 'bg-green-100 text-green-700 border-green-300' : 'bg-slate-50 text-slate-500 border-slate-200'" class="flex-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all">
                Free Event
              </button>
              <button type="button" @click="form.isPaid = true" :class="form.isPaid ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-50 text-slate-500 border-slate-200'" class="flex-1 px-3 py-2 rounded-lg border text-xs font-medium transition-all">
                Paid Event
              </button>
            </div>
            <div v-if="form.isPaid" class="grid grid-cols-3 gap-2">
              <div class="col-span-2">
                <input v-model="form.ticketPrice" type="number" min="0.01" step="0.01" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="10.00" />
              </div>
              <select v-model="form.ticketCurrency" class="px-2 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 outline-none">
                <option value="USD">USD</option>
                <option value="ZWG">ZWG</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Meeting URL</label>
            <input v-model="form.meetingUrl" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none" placeholder="https://meet.google.com/..." />
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
definePageMeta({
  layout: 'community-admin',
  middleware: ['community-admin']
})
useHead({ title: 'Events Management - Community Admin' })

const showCreateModal = ref(false)
const creating = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' }
]

const form = ref({
  title: '', description: '', scheduledAt: '', duration: 60,
  maxAttendees: null as number | null, meetingUrl: '', tags: '', location: '',
  isPaid: false, ticketPrice: null as number | null, ticketCurrency: 'USD'
})

const { data, pending, refresh } = useFetch<any>('/api/community/events', {
  query: computed(() => ({ status: activeTab.value === 'all' ? undefined : activeTab.value })),
  default: () => ({ events: [] })
})

const allEvents = computed(() => data.value?.events || data.value || [])

const filteredEvents = computed(() => {
  if (!Array.isArray(allEvents.value)) return []
  return allEvents.value
})

const totalEvents = computed(() => filteredEvents.value.length)
const upcomingCount = computed(() => filteredEvents.value.filter((e: any) => e.status === 'UPCOMING').length)
const totalRSVPs = computed(() => filteredEvents.value.reduce((sum: number, e: any) => sum + (e._count?.rsvps || 0), 0))
const paidEvents = computed(() => filteredEvents.value.filter((e: any) => e.ticketPrice && Number(e.ticketPrice) > 0).length)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function handleImageSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function handleDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

async function createEvent() {
  creating.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('description', form.value.description)
    formData.append('scheduledAt', form.value.scheduledAt)
    formData.append('duration', String(form.value.duration))
    if (form.value.maxAttendees) formData.append('maxAttendees', String(form.value.maxAttendees))
    if (form.value.meetingUrl) formData.append('meetingUrl', form.value.meetingUrl)
    if (form.value.tags) formData.append('tags', form.value.tags)
    if (form.value.location) formData.append('location', form.value.location)
    if (form.value.isPaid && form.value.ticketPrice) {
      formData.append('ticketPrice', String(form.value.ticketPrice))
      formData.append('ticketCurrency', form.value.ticketCurrency)
    }
    if (imageFile.value) formData.append('image', imageFile.value)

    await $fetch('/api/community/events', { method: 'POST', body: formData })
    showCreateModal.value = false
    form.value = { title: '', description: '', scheduledAt: '', duration: 60, maxAttendees: null, meetingUrl: '', tags: '', location: '', isPaid: false, ticketPrice: null, ticketCurrency: 'USD' }
    imageFile.value = null
    imagePreview.value = null
    refresh()
  } catch (e: any) {
    alert(e.data?.statusMessage || 'Failed to create event')
  } finally {
    creating.value = false
  }
}

async function deleteEvent(eventId: string) {
  if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return
  try {
    await $fetch(`/api/community/events/${eventId}`, { method: 'DELETE' })
    refresh()
  } catch (e: any) {
    alert(e.data?.statusMessage || 'Failed to delete event')
  }
}
</script>
