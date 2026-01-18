<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Mentor Applications</h1>
        <p class="text-slate-500">Review and manage mentor applications</p>
      </div>
      
      <!-- Filter Tabs -->
      <div class="flex bg-slate-100 rounded-lg p-1">
        <button 
          v-for="tab in tabs" :key="tab.value"
          @click="filter = tab.value"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            filter === tab.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="ml-1.5 text-xs opacity-70">({{ tab.count }})</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-20 bg-white rounded-xl animate-pulse"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!mentors?.length" class="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-900 mb-1">No {{ filter === 'pending' ? 'pending' : filter === 'approved' ? 'approved' : '' }} mentors</h3>
      <p class="text-slate-500 text-sm">{{ filter === 'pending' ? 'All applications have been reviewed' : 'No mentors match this filter' }}</p>
    </div>

    <!-- Mentors List -->
    <div v-else class="space-y-4">
      <div 
        v-for="mentor in mentors" 
        :key="mentor.id" 
        class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
      >
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <!-- Info -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="font-semibold text-slate-900">{{ mentor.user.name }}</h3>
              <span 
                class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="mentor.isApproved ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'"
              >
                {{ mentor.isApproved ? 'Approved' : 'Pending' }}
              </span>
            </div>
            <p class="text-sm text-slate-500 mb-2">{{ mentor.user.email }}</p>
            
            <div class="flex flex-wrap gap-2 mb-3">
              <span 
                v-for="skill in mentor.skills.split(',').slice(0, 5)" 
                :key="skill" 
                class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md"
              >
                {{ skill.trim() }}
              </span>
            </div>
            
            <p class="text-sm text-slate-600 line-clamp-2">{{ mentor.bio }}</p>
            
            <div class="flex gap-4 mt-3 text-xs text-slate-400">
              <span>Rate: {{ mentor.hourlyRate }} credits/hr</span>
              <span>Applied: {{ formatDate(mentor.createdAt) }}</span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-2">
            <template v-if="!mentor.isApproved">
              <button 
                @click="approve(mentor.id)" 
                :disabled="processing === mentor.id"
                class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <span v-if="processing === mentor.id">...</span>
                <span v-else>Approve</span>
              </button>
              <button 
                @click="openRejectModal(mentor)" 
                :disabled="processing === mentor.id"
                class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </template>
            <span v-else class="text-sm text-slate-400">Approved {{ formatDate(mentor.approvedAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div class="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">Reject Application</h3>
            <p class="text-sm text-slate-600 mb-4">Are you sure you want to reject <strong>{{ selectedMentor?.user?.name }}</strong>'s mentor application?</p>
            <textarea 
              v-model="rejectReason" 
              placeholder="Optional: Reason for rejection (will be included in email)"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-4"
              rows="3"
            ></textarea>
            <div class="flex gap-3 justify-end">
              <button @click="showRejectModal = false" class="px-4 py-2 text-slate-600 hover:text-slate-900">Cancel</button>
              <button @click="reject()" :disabled="processing" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50">
                Reject Application
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin-community',
  middleware: ['auth']
})

const { error: toastError, success } = useToast()

const filter = ref<'all' | 'pending' | 'approved'>('pending')
const processing = ref<string | null>(null)
const showRejectModal = ref(false)
const selectedMentor = ref<any>(null)
const rejectReason = ref('')

const tabs = computed(() => [
  { label: 'Pending', value: 'pending', count: data.value?.stats?.pending },
  { label: 'Approved', value: 'approved', count: data.value?.stats?.approved },
  { label: 'All', value: 'all', count: data.value?.stats?.total }
])

const { data, pending, refresh } = useFetch<any>(() => `/api/admin/community/mentors?status=${filter.value}`, {
  watch: [filter]
})

const mentors = computed(() => data.value?.mentors || [])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const approve = async (id: string) => {
  processing.value = id
  try {
    await $fetch(`/api/admin/community/mentors/${id}/approve`, { method: 'POST' })
    success('Mentor approved successfully')
    refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Failed to approve mentor')
  } finally {
    processing.value = null
  }
}

const openRejectModal = (mentor: any) => {
  selectedMentor.value = mentor
  rejectReason.value = ''
  showRejectModal.value = true
}

const reject = async () => {
  if (!selectedMentor.value) return
  processing.value = selectedMentor.value.id
  try {
    await $fetch(`/api/admin/community/mentors/${selectedMentor.value.id}/reject`, { 
      method: 'POST',
      body: { reason: rejectReason.value }
    })
    success('Application rejected')
    showRejectModal.value = false
    refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Failed to reject application')
  } finally {
    processing.value = null
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
