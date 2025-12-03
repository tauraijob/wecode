<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">
        Instructor Dashboard
      </h1>
      <p class="mt-2 text-navy-300">Manage your courses and track your teaching progress</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-navy-400">Total Courses</p>
            <p class="text-3xl font-bold text-white mt-2">{{ stats.totalCourses }}</p>
          </div>
          <div class="rounded-lg bg-purple-500/20 p-3">
            <svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-navy-400">Published</p>
            <p class="text-3xl font-bold text-white mt-2">{{ stats.published }}</p>
          </div>
          <div class="rounded-lg bg-green-500/20 p-3">
            <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-navy-400">Pending Review</p>
            <p class="text-3xl font-bold text-white mt-2">{{ stats.pendingReview }}</p>
          </div>
          <div class="rounded-lg bg-yellow-500/20 p-3">
            <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-navy-400">Total Enrollments</p>
            <p class="text-3xl font-bold text-white mt-2">{{ stats.totalEnrollments }}</p>
          </div>
          <div class="rounded-lg bg-blue-500/20 p-3">
            <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8 rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
      <h2 class="text-xl font-semibold text-white mb-4">Quick Actions</h2>
      <div class="flex flex-wrap gap-4">
        <NuxtLink
          to="/instructor/courses/create"
          class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 text-sm font-medium text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Course
        </NuxtLink>
        <NuxtLink
          to="/instructor/courses"
          class="inline-flex items-center gap-2 rounded-lg border border-navy-600 bg-navy-800/50 px-6 py-3 text-sm font-medium text-white hover:bg-navy-700/50 transition-all"
        >
          View All Courses
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Courses -->
    <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-white">Recent Courses</h2>
        <NuxtLink to="/instructor/courses" class="text-sm text-navy-400 hover:text-navy-300">
          View all →
        </NuxtLink>
      </div>
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
      </div>
      <div v-else-if="recentCourses.length === 0" class="text-center py-8 text-navy-400">
        <p>No courses yet. Create your first course to get started!</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="course in recentCourses.slice(0, 5)"
          :key="course.id"
          class="flex items-center justify-between rounded-lg border border-navy-700/50 bg-navy-900/40 p-4 hover:bg-navy-800/50 transition-colors"
        >
          <div class="flex-1">
            <h3 class="font-medium text-white">{{ course.name }}</h3>
            <div class="mt-1 flex items-center gap-3 text-sm text-navy-400">
              <span class="capitalize">{{ course.status.toLowerCase() }}</span>
              <span>•</span>
              <span class="capitalize">{{ course.reviewStatus.toLowerCase().replace('_', ' ') }}</span>
              <span>•</span>
              <span>{{ course._count.enrollments }} enrollments</span>
            </div>
          </div>
          <NuxtLink
            :to="`/instructor/courses/${course.id}`"
            class="rounded-lg bg-navy-700 px-4 py-2 text-sm font-medium text-white hover:bg-navy-600 transition-colors"
          >
            View
          </NuxtLink>
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

const { data: courses, pending: loading } = await useFetch('/api/instructor/courses')
const recentCourses = computed(() => courses.value || [])

const stats = computed(() => {
  const allCourses = recentCourses.value
  return {
    totalCourses: allCourses.length,
    published: allCourses.filter((c: any) => c.status === 'PUBLISHED').length,
    pendingReview: allCourses.filter((c: any) => c.reviewStatus === 'PENDING_REVIEW').length,
    totalEnrollments: allCourses.reduce((sum: number, c: any) => sum + (c._count?.enrollments || 0), 0)
  }
})
</script>



