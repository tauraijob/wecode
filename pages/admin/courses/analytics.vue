<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
            Course Analytics
          </h1>
          <p class="mt-2 text-navy-300">View detailed analytics and statistics</p>
        </div>
        <NuxtLink
          to="/admin/courses"
          class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
        >
          ← Back to Courses
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
        <p class="mt-4 text-navy-300">Loading analytics...</p>
      </div>
    </div>

    <!-- Analytics Content -->
    <div v-else>
      <!-- Key Metrics -->
      <div class="grid gap-6 md:grid-cols-4 mb-8">
        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-blue-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-3">
              <div class="rounded-lg bg-blue-500/20 p-2.5 border border-blue-500/30">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Total Courses</div>
            <div class="text-3xl font-bold text-white">{{ analytics.totalCourses }}</div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-purple-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-3">
              <div class="rounded-lg bg-purple-500/20 p-2.5 border border-purple-500/30">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Total Enrollments</div>
            <div class="text-3xl font-bold text-white">{{ analytics.totalEnrollments }}</div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-3">
              <div class="rounded-lg bg-emerald-500/20 p-2.5 border border-emerald-500/30">
                <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Active Enrollments</div>
            <div class="text-3xl font-bold text-white">{{ analytics.activeEnrollments }}</div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-amber-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-3">
              <div class="rounded-lg bg-amber-500/20 p-2.5 border border-amber-500/30">
                <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Completed</div>
            <div class="text-3xl font-bold text-white">{{ analytics.completedEnrollments }}</div>
          </div>
        </div>
      </div>

      <!-- Secondary Metrics -->
      <div class="grid gap-6 md:grid-cols-3 mb-8">
        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-blue-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-3">
              <div class="rounded-lg bg-blue-500/20 p-2.5 border border-blue-500/30">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Certificates Issued</div>
            <div class="text-3xl font-bold text-white">{{ analytics.totalCertificates }}</div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-3">
              <div class="rounded-lg bg-emerald-500/20 p-2.5 border border-emerald-500/30">
                <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Average Progress</div>
            <div class="text-3xl font-bold text-white">{{ analytics.averageProgress.toFixed(1) }}%</div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-purple-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-3">
              <div class="rounded-lg bg-purple-500/20 p-2.5 border border-purple-500/30">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Exam Pass Rate</div>
            <div class="text-3xl font-bold text-white">{{ analytics.examPassRate.toFixed(1) }}%</div>
          </div>
        </div>
      </div>

      <!-- Average Exam Score -->
      <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-amber-500/50 transition-all hover:shadow-lg">
        <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div class="relative flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="rounded-lg bg-amber-500/20 p-2.5 border border-amber-500/30">
                <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-navy-300">Average Exam Score</div>
                <div class="text-3xl font-bold text-white">{{ analytics.averageExamScore.toFixed(1) }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const { data: analytics, pending: loading } = await useFetch('/api/admin/courses/analytics')
</script>
