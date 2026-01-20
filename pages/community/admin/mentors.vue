<template>
  <div>
    <!-- Header -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-lg font-bold text-slate-900">Mentor Applications</h1>
        <p class="text-xs text-slate-500">Review and manage mentor applications</p>
      </div>
      
      <!-- Filter Tabs -->
      <div class="flex bg-slate-100 rounded-lg p-0.5">
        <button 
          v-for="tab in tabs" :key="tab.value"
          @click="filter = tab.value"
          :class="[
            'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            filter === tab.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          {{ tab.label }}
          <span v-if="tab.count !== undefined" class="ml-1 text-[10px] opacity-70">({{ tab.count }})</span>
        </button>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div class="bg-white rounded-lg border border-slate-200 p-3">
        <div class="text-xs text-slate-500">Pending</div>
        <div class="text-xl font-bold text-amber-600">{{ data?.stats?.pending || 0 }}</div>
      </div>
      <div class="bg-white rounded-lg border border-slate-200 p-3">
        <div class="text-xs text-slate-500">Approved</div>
        <div class="text-xl font-bold text-green-600">{{ data?.stats?.approved || 0 }}</div>
      </div>
      <div class="bg-white rounded-lg border border-slate-200 p-3">
        <div class="text-xs text-slate-500">Total</div>
        <div class="text-xl font-bold text-slate-900">{{ data?.stats?.total || 0 }}</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-24 bg-white rounded-lg animate-pulse"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!mentors?.length" class="bg-white rounded-lg border border-slate-200 p-8 text-center">
      <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold text-slate-900 mb-1">No {{ filter === 'pending' ? 'pending' : filter === 'approved' ? 'approved' : '' }} mentors</h3>
      <p class="text-slate-500 text-xs">{{ filter === 'pending' ? 'All applications have been reviewed' : 'No mentors match this filter' }}</p>
    </div>

    <!-- Mentors List -->
    <div v-else class="space-y-3">
      <div 
        v-for="mentor in mentors" 
        :key="mentor.id" 
        class="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow"
      >
        <!-- Card Header with Avatar -->
        <div class="flex items-start gap-3 p-4">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
              :class="mentor.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
            >
              {{ mentor.user.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          
          <!-- Main Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <h3 class="text-sm font-semibold text-slate-900 truncate">{{ mentor.user.name }}</h3>
              <span 
                class="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0"
                :class="mentor.isApproved ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'"
              >
                {{ mentor.isApproved ? 'Approved' : 'Pending' }}
              </span>
            </div>
            <p class="text-xs text-slate-500 truncate">{{ mentor.user.email }}</p>
            
            <!-- Skills -->
            <div class="flex flex-wrap gap-1 mt-2">
              <span 
                v-for="skill in mentor.skills.split(',').slice(0, 4)" 
                :key="skill" 
                class="text-[10px] bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded font-medium"
              >
                {{ skill.trim() }}
              </span>
              <span 
                v-if="mentor.skills.split(',').length > 4"
                class="text-[10px] text-slate-400"
              >
                +{{ mentor.skills.split(',').length - 4 }} more
              </span>
            </div>
          </div>
          
          <!-- Rate Badge -->
          <div class="flex-shrink-0 text-right">
            <div class="text-sm font-bold text-primary-600">{{ mentor.hourlyRate }}</div>
            <div class="text-[10px] text-slate-400">credits/hr</div>
          </div>
        </div>
        
        <!-- Bio Section -->
        <div v-if="mentor.bio" class="px-4 pb-3">
          <p class="text-xs text-slate-600 line-clamp-2 bg-slate-50 rounded p-2">{{ mentor.bio }}</p>
        </div>
        
        <!-- Card Footer -->
        <div class="flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-slate-100">
          <div class="flex items-center gap-3 text-[10px] text-slate-400">
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Applied {{ formatDate(mentor.createdAt) }}
            </span>
            <span v-if="mentor.isApproved && mentor.approvedAt" class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Approved {{ formatDate(mentor.approvedAt) }}
            </span>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-1.5">
            <template v-if="!mentor.isApproved">
              <button 
                @click="approve(mentor.id)" 
                :disabled="processing === mentor.id"
                class="px-2.5 py-1 bg-primary-500 hover:bg-primary-600 text-white text-[11px] font-medium rounded transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <svg v-if="processing === mentor.id" class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </button>
              <button 
                @click="openRejectModal(mentor)" 
                :disabled="processing === mentor.id"
                class="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-medium rounded transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
            </template>
            <button 
              v-else
              @click="viewDetails(mentor)"
              class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium rounded transition-colors flex items-center gap-1"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showRejectModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div class="bg-white rounded-lg w-full max-w-sm p-5 shadow-xl">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-slate-900">Reject Application</h3>
                <p class="text-xs text-slate-500">{{ selectedMentor?.user?.name }}</p>
              </div>
            </div>
            <p class="text-xs text-slate-600 mb-3">This will remove their mentor application. They can reapply in the future.</p>
            <textarea 
              v-model="rejectReason" 
              placeholder="Optional: Reason for rejection (will be sent via email)"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-3 resize-none"
              rows="3"
            ></textarea>
            <div class="flex gap-2 justify-end">
              <button @click="showRejectModal = false" class="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900">Cancel</button>
              <button @click="reject()" :disabled="processing" class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-medium disabled:opacity-50">
                Reject Application
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Details Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div class="bg-white rounded-lg w-full max-w-md p-5 shadow-xl max-h-[80vh] overflow-y-auto">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-lg font-semibold">
                  {{ selectedMentor?.user?.name?.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-slate-900">{{ selectedMentor?.user?.name }}</h3>
                  <p class="text-xs text-slate-500">{{ selectedMentor?.user?.email }}</p>
                </div>
              </div>
              <button @click="showDetailsModal = false" class="p-1 hover:bg-slate-100 rounded">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="space-y-3">
              <div>
                <div class="text-[10px] font-medium text-slate-400 uppercase mb-1">Rate</div>
                <div class="text-sm font-semibold text-primary-600">{{ selectedMentor?.hourlyRate }} credits/hour</div>
              </div>
              
              <div>
                <div class="text-[10px] font-medium text-slate-400 uppercase mb-1">Skills</div>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="skill in selectedMentor?.skills?.split(',')" 
                    :key="skill" 
                    class="text-[10px] bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded font-medium"
                  >
                    {{ skill.trim() }}
                  </span>
                </div>
              </div>
              
              <div>
                <div class="text-[10px] font-medium text-slate-400 uppercase mb-1">Bio</div>
                <p class="text-xs text-slate-600 bg-slate-50 rounded p-2">{{ selectedMentor?.bio || 'No bio provided' }}</p>
              </div>
              
              <div class="flex gap-4 pt-2 border-t border-slate-100">
                <div>
                  <div class="text-[10px] font-medium text-slate-400 uppercase">Applied</div>
                  <div class="text-xs text-slate-700">{{ formatDate(selectedMentor?.createdAt) }}</div>
                </div>
                <div v-if="selectedMentor?.approvedAt">
                  <div class="text-[10px] font-medium text-slate-400 uppercase">Approved</div>
                  <div class="text-xs text-slate-700">{{ formatDate(selectedMentor?.approvedAt) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community-admin',
  middleware: ['community-admin']
})

const { error: toastError, success } = useToast()

const filter = ref<'all' | 'pending' | 'approved'>('pending')
const processing = ref<string | null>(null)
const showRejectModal = ref(false)
const showDetailsModal = ref(false)
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
  if (!date) return '-'
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

const viewDetails = (mentor: any) => {
  selectedMentor.value = mentor
  showDetailsModal.value = true
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
