<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
            Course Enrollments
          </h1>
          <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">View and manage all course enrollments</p>
        </div>
        <NuxtLink
          to="/admin/courses"
          class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all self-start sm:self-auto"
        >
          ← Back to Courses
        </NuxtLink>
      </div>

      <!-- Search and Filters -->
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative flex-1 min-w-[200px]">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search enrollments..."
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 pl-10 pr-4 py-2 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
        </div>
        <select
          v-model="statusFilter"
          class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
        <p class="mt-4 text-navy-300">Loading enrollments...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredEnrollments.length === 0" class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
        <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">No enrollments found</h3>
      <p class="text-navy-300">{{ searchQuery || statusFilter ? 'Try adjusting your filters' : 'No students have enrolled in courses yet' }}</p>
    </div>

    <!-- Enrollments List -->
    <div v-else class="grid gap-4 md:grid-cols-2">
      <div
        v-for="enrollment in filteredEnrollments"
        :key="enrollment.id"
        class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 transition-all hover:border-navy-600 hover:shadow-xl"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="mb-3">
              <h3 class="text-lg font-semibold text-white mb-1">{{ enrollment.course.name }}</h3>
              <div class="flex items-center gap-2 text-sm text-navy-300">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{{ enrollment.user.name }}</span>
                <span class="text-navy-500">•</span>
                <span>{{ enrollment.user.email }}</span>
              </div>
            </div>

            <!-- Stats -->
            <div class="mb-4 flex flex-wrap gap-4 text-sm">
              <div class="flex items-center gap-2">
                <span
                  :class="{
                    'bg-amber-500/20 text-amber-400 border-amber-500/30': enrollment.status === 'PENDING',
                    'bg-green-500/20 text-green-400 border-green-500/30': enrollment.status === 'ACTIVE',
                    'bg-blue-500/20 text-blue-400 border-blue-500/30': enrollment.status === 'COMPLETED',
                    'bg-red-500/20 text-red-400 border-red-500/30': enrollment.status === 'CANCELLED'
                  }"
                  class="rounded-md border px-2.5 py-1 text-xs font-medium"
                >
                  {{ enrollment.status }}
                </span>
              </div>
              <div class="flex items-center gap-1 text-navy-300">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Enrolled: {{ new Date(enrollment.enrolledAt).toLocaleDateString() }}
              </div>
              <div class="flex items-center gap-1 text-navy-300">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Progress: {{ Number(enrollment.progressPercent).toFixed(1) }}%
              </div>
              <div v-if="enrollment.completedAt" class="flex items-center gap-1 text-navy-300">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed: {{ new Date(enrollment.completedAt).toLocaleDateString() }}
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="h-2 w-full overflow-hidden rounded-full bg-navy-800">
                <div
                  class="h-full bg-gradient-to-r from-accent-500 to-emerald-600 transition-all"
                  :style="{ width: `${Number(enrollment.progressPercent)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="ml-4 flex flex-col gap-2">
            <button
              @click="updateEnrollmentStatus(enrollment.id, enrollment.status === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE')"
              class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all whitespace-nowrap"
            >
              {{ enrollment.status === 'ACTIVE' ? 'Mark Complete' : 'Reactivate' }}
            </button>
            <button
              @click="openCancelModal(enrollment.id)"
              class="rounded-lg border border-red-700/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <ConfirmModal
      v-model:is-open="showConfirmModal"
      title="Cancel Enrollment"
      message="Are you sure you want to cancel this enrollment? This action cannot be undone."
      type="danger"
      confirm-text="Cancel Enrollment"
      cancel-text="Keep Enrollment"
      @confirm="confirmCancelEnrollment"
    />
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const toast = useToast()
const { data: enrollments, refresh, pending: loading } = await useFetch('/api/admin/enrollments')

const searchQuery = ref('')
const statusFilter = ref('')
const showConfirmModal = ref(false)
const enrollmentToCancel = ref<string | null>(null)

const filteredEnrollments = computed(() => {
  let result = enrollments.value || []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((e: any) =>
      e.course.name.toLowerCase().includes(query) ||
      e.user.name.toLowerCase().includes(query) ||
      e.user.email.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    result = result.filter((e: any) => e.status === statusFilter.value)
  }

  return result
})

const updateEnrollmentStatus = async (id: string, status: string) => {
  try {
    await $fetch(`/api/enrollments/${id}/complete`, {
      method: 'POST',
      body: { status }
    })
    toast.success('Enrollment status updated')
    await refresh()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to update enrollment')
  }
}

const openCancelModal = (id: string) => {
  enrollmentToCancel.value = id
  showConfirmModal.value = true
}

const confirmCancelEnrollment = async () => {
  if (!enrollmentToCancel.value) return
  try {
    await $fetch(`/api/admin/enrollments/${enrollmentToCancel.value}`, {
      method: 'DELETE'
    })
    toast.success('Enrollment cancelled successfully')
    await refresh()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to cancel enrollment')
  } finally {
    enrollmentToCancel.value = null
  }
}
</script>
