<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Course Reviews
      </h1>
      <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">Review and approve courses submitted by instructors</p>
    </div>

    <div v-if="loading" class="text-center py-20">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
    </div>

    <div v-else-if="courses.length === 0" class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-12 text-center">
      <p class="text-navy-400">No courses pending review.</p>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="course in courses"
        :key="course.id"
        class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6"
      >
        <div class="mb-4">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-2xl font-semibold text-white">{{ course.name }}</h3>
            <span class="rounded-full border border-yellow-500/30 bg-yellow-500/20 px-2.5 py-1 text-xs font-medium text-yellow-400">
              PENDING REVIEW
            </span>
          </div>
          <p class="text-navy-300 mb-2">{{ course.description }}</p>
          <div class="flex items-center gap-4 text-sm text-navy-400">
            <span>Instructor: <strong class="text-navy-300">{{ course.instructor?.name || 'Unknown' }}</strong></span>
            <span>•</span>
            <span>Price: <strong class="text-navy-300">{{ course.currency }} {{ Number(course.price).toFixed(2) }}</strong></span>
            <span>•</span>
            <span>Commission: <strong class="text-navy-300">{{ Number(course.platformCommissionPercentage).toFixed(0) }}%</strong></span>
          </div>
          <div v-if="course.submittedForReviewAt" class="mt-2 text-xs text-navy-500">
            Submitted: {{ new Date(course.submittedForReviewAt).toLocaleString() }}
          </div>
        </div>

        <div class="mb-4 rounded-lg border border-navy-700/50 bg-navy-900/40 p-4">
          <h4 class="text-sm font-semibold text-white mb-2">Course Content</h4>
          <div class="text-sm text-navy-400">
            <p>{{ course.topics.length }} topics, {{ course.topics.reduce((sum: number, t: any) => sum + (t.lessons?.length || 0), 0) }} lessons</p>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="approveCourse(course.id, true)"
            :disabled="processing === course.id"
            class="flex-1 rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {{ processing === course.id ? 'Processing...' : 'Approve & Publish' }}
          </button>
          <button
            @click="approveCourse(course.id, false)"
            :disabled="processing === course.id"
            class="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Approve Only
          </button>
          <button
            @click="showRejectDialog(course)"
            :disabled="processing === course.id"
            class="rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Dialog -->
    <div
      v-if="rejectingCourse"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="rejectingCourse = null"
    >
      <div class="w-full max-w-md rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <h3 class="text-xl font-semibold text-white mb-4">Reject Course</h3>
        <p class="text-sm text-navy-300 mb-4">Please provide a reason for rejecting this course:</p>
        <textarea
          v-model="rejectionReason"
          placeholder="Enter rejection reason..."
          class="w-full rounded-lg border border-navy-600 bg-navy-900/50 p-3 text-white placeholder-navy-500 focus:border-navy-500 focus:outline-none"
          rows="4"
        ></textarea>
        <div class="mt-4 flex gap-3">
          <button
            @click="rejectCourse(rejectingCourse!.id)"
            :disabled="!rejectionReason.trim() || processing === rejectingCourse!.id"
            class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ processing === rejectingCourse!.id ? 'Processing...' : 'Reject Course' }}
          </button>
          <button
            @click="rejectingCourse = null; rejectionReason = ''"
            class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const toast = useToast()

const { data: courses, refresh, pending: loading } = await useFetch('/api/admin/courses/pending')
const processing = ref<string | null>(null)
const rejectingCourse = ref<any>(null)
const rejectionReason = ref('')

async function approveCourse(courseId: string, publish: boolean) {
  try {
    processing.value = courseId
    await $fetch(`/api/admin/courses/${courseId}/approve`, {
      method: 'POST',
      body: { publish }
    })
    await refresh()
    toast.success(`Course ${publish ? 'approved and published' : 'approved'} successfully!`)
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to approve course')
  } finally {
    processing.value = null
  }
}

function showRejectDialog(course: any) {
  rejectingCourse.value = course
  rejectionReason.value = ''
}

async function rejectCourse(courseId: string) {
  if (!rejectionReason.value.trim()) {
    toast.warning('Please provide a rejection reason')
    return
  }

  try {
    processing.value = courseId
    await $fetch(`/api/admin/courses/${courseId}/reject`, {
      method: 'POST',
      body: { reason: rejectionReason.value }
    })
    await refresh()
    rejectingCourse.value = null
    rejectionReason.value = ''
    toast.success('Course rejected successfully!')
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to reject course')
  } finally {
    processing.value = null
  }
}
</script>





