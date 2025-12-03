<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">
          My Courses
        </h1>
        <p class="mt-2 text-navy-300">Manage and track your courses</p>
      </div>
      <NuxtLink
        to="/instructor/courses/create"
        class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 text-sm font-medium text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Course
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center py-20">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
    </div>

    <div v-else-if="courses.length === 0" class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-12 text-center">
      <p class="text-navy-400 mb-4">You haven't created any courses yet.</p>
      <NuxtLink
        to="/instructor/courses/create"
        class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 text-sm font-medium text-white hover:from-purple-600 hover:to-purple-700 transition-all"
      >
        Create Your First Course
      </NuxtLink>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="course in courses"
        :key="course.id"
        class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-xl font-semibold text-white">{{ course.name }}</h3>
              <span
                :class="{
                  'bg-green-500/20 text-green-400 border-green-500/30': course.status === 'PUBLISHED',
                  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30': course.status === 'DRAFT',
                  'bg-gray-500/20 text-gray-400 border-gray-500/30': course.status === 'ARCHIVED'
                }"
                class="rounded-full border px-2.5 py-1 text-xs font-medium"
              >
                {{ course.status }}
              </span>
              <span
                :class="{
                  'bg-blue-500/20 text-blue-400 border-blue-500/30': course.reviewStatus === 'PENDING_REVIEW',
                  'bg-green-500/20 text-green-400 border-green-500/30': course.reviewStatus === 'APPROVED',
                  'bg-red-500/20 text-red-400 border-red-500/30': course.reviewStatus === 'REJECTED'
                }"
                class="rounded-full border px-2.5 py-1 text-xs font-medium"
              >
                {{ course.reviewStatus.replace('_', ' ') }}
              </span>
            </div>
            <p class="text-navy-300 mb-4 line-clamp-2">{{ course.description }}</p>
            <div class="flex items-center gap-6 text-sm text-navy-400">
              <span>{{ course._count.enrollments }} enrollments</span>
              <span>{{ course.topics.length }} topics</span>
              <span>{{ course.currency }} {{ Number(course.price).toFixed(2) }}</span>
            </div>
            <div v-if="course.rejectionReason" class="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <p class="text-sm text-red-400">
                <strong>Rejection Reason:</strong> {{ course.rejectionReason }}
              </p>
            </div>
          </div>
          <div class="ml-4 flex gap-2">
            <NuxtLink
              :to="`/instructor/courses/${course.id}`"
              class="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
            >
              Manage
            </NuxtLink>
            <button
              v-if="course.reviewStatus !== 'PENDING_REVIEW' && course.reviewStatus !== 'APPROVED'"
              @click="submitForReview(course.id)"
              :disabled="submitting === course.id"
              class="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {{ submitting === course.id ? 'Submitting...' : 'Submit for Review' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { user } = useAuth()
if (!user.value || user.value.role !== 'INSTRUCTOR') {
  await navigateTo('/dashboard')
}

const { data: courses, refresh, pending: loading } = await useFetch('/api/instructor/courses')
const submitting = ref<string | null>(null)

async function submitForReview(courseId: string) {
  try {
    submitting.value = courseId
    await $fetch(`/api/courses/${courseId}/submit-review`, {
      method: 'POST'
    })
    await refresh()
    alert('Course submitted for review successfully!')
  } catch (error: any) {
    alert(error.data?.message || 'Failed to submit course for review')
  } finally {
    submitting.value = null
  }
}
</script>

