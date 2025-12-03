<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>
      <p class="mt-2 text-navy-300">Welcome back! Here's what's happening with your platform.</p>
    </div>

    <!-- E-Learning Platform Section -->
    <div class="mb-8 rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 via-navy-900/60 to-navy-800/40 p-8 shadow-xl backdrop-blur-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3 border border-blue-500/30">
            <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">E-Learning Platform</h2>
            <p class="text-sm text-navy-300">Manage courses, enrollments, and student progress</p>
          </div>
        </div>
        <div class="flex gap-2">
          <NuxtLink
            to="/admin/courses"
            class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Manage Courses
          </NuxtLink>
          <NuxtLink
            to="/admin/courses/analytics"
            class="rounded-lg border border-navy-600 bg-navy-800/50 px-5 py-2.5 font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
          >
            View Analytics
          </NuxtLink>
        </div>
      </div>

      <!-- E-Learning Metrics Cards -->
      <div class="grid gap-4 md:grid-cols-4 mb-6">
        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-blue-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-2">
              <div class="rounded-lg bg-blue-500/20 p-2 border border-blue-500/30">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Total Courses</div>
            <div class="text-3xl font-bold text-white">{{ elearningMetrics.courses }}</div>
            <div class="text-xs text-navy-400 mt-2">{{ elearningMetrics.publishedCourses }} published</div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-purple-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-2">
              <div class="rounded-lg bg-purple-500/20 p-2 border border-purple-500/30">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Total Enrollments</div>
            <div class="text-3xl font-bold text-white">{{ elearningMetrics.enrollments }}</div>
            <div class="text-xs text-navy-400 mt-2">{{ elearningMetrics.activeStudents }} active students</div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-2">
              <div class="rounded-lg bg-emerald-500/20 p-2 border border-emerald-500/30">
                <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Published Courses</div>
            <div class="text-3xl font-bold text-white">{{ elearningMetrics.publishedCourses }}</div>
            <div class="text-xs text-navy-400 mt-2">Ready for enrollment</div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-amber-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-2">
              <div class="rounded-lg bg-amber-500/20 p-2 border border-amber-500/30">
                <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Active Students</div>
            <div class="text-3xl font-bold text-white">{{ elearningMetrics.activeStudents }}</div>
            <div class="text-xs text-navy-400 mt-2">Currently learning</div>
          </div>
        </div>
      </div>

      <!-- Recent Courses -->
      <div v-if="recentCourses.length > 0" class="mt-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Recent Courses</h3>
          <NuxtLink to="/admin/courses" class="text-sm text-navy-400 hover:text-navy-300">View all →</NuxtLink>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <div
            v-for="course in recentCourses.slice(0, 3)"
            :key="course.id"
            class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-navy-800/40 p-5 hover:border-navy-600 hover:bg-navy-800/60 transition-all cursor-pointer"
          >
            <div v-if="course.thumbnailUrl" class="mb-3 overflow-hidden rounded-lg">
              <img :src="course.thumbnailUrl" :alt="course.name" class="h-32 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div class="font-semibold text-white mb-1">{{ course.name }}</div>
            <div class="flex items-center gap-3 text-xs text-navy-300">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {{ course._count.topics }} topics
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ course._count.enrollments }} enrolled
              </span>
            </div>
            <NuxtLink
              :to="`/admin/courses/${course.id}`"
              class="absolute inset-0"
            ></NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications Section -->
    <div class="mb-8 rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 via-navy-900/60 to-navy-800/40 p-8 shadow-xl backdrop-blur-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 p-3 border border-amber-500/30">
            <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">Recent Notifications</h2>
            <p class="text-sm text-navy-300">Stay updated with platform activities</p>
          </div>
        </div>
        <NuxtLink
          to="/admin/notifications"
          class="rounded-lg border border-navy-600 bg-navy-800/50 px-5 py-2.5 font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
        >
          View All
        </NuxtLink>
      </div>

      <div v-if="notificationsLoading" class="text-center py-8">
        <div class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-navy-400 border-r-transparent"></div>
      </div>
      <div v-else-if="recentNotifications.length === 0" class="text-center py-8 text-navy-400">
        <p>No notifications</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="notification in recentNotifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          :class="{
            'border-blue-500/50 bg-blue-500/10': !notification.read,
            'border-navy-700/50 bg-navy-800/40': notification.read
          }"
          class="rounded-lg border p-4 cursor-pointer hover:bg-navy-800/60 transition-colors"
        >
          <div class="flex items-start gap-3">
            <div
              :class="{
                'bg-blue-500/20': notification.type === 'COURSE_SUBMITTED',
                'bg-green-500/20': notification.type === 'COURSE_APPROVED',
                'bg-red-500/20': notification.type === 'COURSE_REJECTED'
              }"
              class="rounded-lg p-2"
            >
              <svg
                v-if="notification.type === 'COURSE_SUBMITTED'"
                class="h-5 w-5 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <svg
                v-else-if="notification.type === 'COURSE_APPROVED'"
                class="h-5 w-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg
                v-else-if="notification.type === 'COURSE_REJECTED'"
                class="h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p :class="{ 'font-semibold': !notification.read }" class="text-sm text-white">
                {{ notification.title }}
              </p>
              <p class="mt-1 text-xs text-navy-400 line-clamp-2">{{ notification.message }}</p>
              <p class="mt-1 text-xs text-navy-500">
                {{ formatNotificationTime(notification.createdAt) }}
              </p>
            </div>
            <div v-if="!notification.read" class="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8 grid gap-4 md:grid-cols-4">
      <NuxtLink
        to="/admin/courses"
        class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-blue-500/50 transition-all hover:shadow-lg"
      >
        <div class="flex items-center gap-4">
          <div class="rounded-xl bg-blue-500/20 p-3 border border-blue-500/30 group-hover:bg-blue-500/30 transition-colors">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <div class="font-semibold text-white">Manage Courses</div>
            <div class="text-xs text-navy-400">Create & edit courses</div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/courses/enrollments"
        class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-purple-500/50 transition-all hover:shadow-lg"
      >
        <div class="flex items-center gap-4">
          <div class="rounded-xl bg-purple-500/20 p-3 border border-purple-500/30 group-hover:bg-purple-500/30 transition-colors">
            <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div class="font-semibold text-white">Enrollments</div>
            <div class="text-xs text-navy-400">View all enrollments</div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/courses/analytics"
        class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg"
      >
        <div class="flex items-center gap-4">
          <div class="rounded-xl bg-emerald-500/20 p-3 border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-colors">
            <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <div class="font-semibold text-white">Analytics</div>
            <div class="text-xs text-navy-400">View statistics</div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/admin/courses/certificates"
        class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-amber-500/50 transition-all hover:shadow-lg"
      >
        <div class="flex items-center gap-4">
          <div class="rounded-xl bg-amber-500/20 p-3 border border-amber-500/30 group-hover:bg-amber-500/30 transition-colors">
            <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <div class="font-semibold text-white">Certificates</div>
            <div class="text-xs text-navy-400">Manage certificates</div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- General Platform Metrics -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white">General Platform</h2>
          <p class="text-sm text-navy-300 mt-1">Overview of your business operations</p>
        </div>
      </div>
      <div class="grid gap-6 md:grid-cols-4">
        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-green-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-3">
              <div class="rounded-lg bg-green-500/20 p-2.5 border border-green-500/30">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Total Revenue</div>
            <div class="text-3xl font-bold text-white">USD {{ metrics.revenue.toFixed(2) }}</div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-blue-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-3">
              <div class="rounded-lg bg-blue-500/20 p-2.5 border border-blue-500/30">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Schools</div>
            <div class="text-3xl font-bold text-white">{{ metrics.schools }}</div>
            <NuxtLink to="/admin/schools" class="text-xs text-navy-400 hover:text-navy-300 mt-2 inline-block">View all →</NuxtLink>
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
            <div class="text-sm font-medium text-navy-300 mb-1">Active Clubs</div>
            <div class="text-3xl font-bold text-white">{{ metrics.clubs }}</div>
            <NuxtLink to="/admin/clubs" class="text-xs text-navy-400 hover:text-navy-300 mt-2 inline-block">View all →</NuxtLink>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-amber-500/50 transition-all hover:shadow-lg">
          <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div class="relative">
            <div class="flex items-center justify-between mb-3">
              <div class="rounded-lg bg-amber-500/20 p-2.5 border border-amber-500/30">
                <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div class="text-sm font-medium text-navy-300 mb-1">Pending Requests</div>
            <div class="text-3xl font-bold text-white">{{ metrics.pendingRequests }}</div>
            <NuxtLink to="/admin/requests" class="text-xs text-navy-400 hover:text-navy-300 mt-2 inline-block">View all →</NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid gap-6 md:grid-cols-2 mb-8">
      <!-- Recent Invoices -->
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-white">Recent Invoices</h2>
          <NuxtLink to="/admin/billing" class="text-sm text-navy-400 hover:text-navy-300">View all →</NuxtLink>
        </div>
        <div v-if="invoices.length === 0" class="text-center text-navy-400 py-8 text-sm">No invoices yet</div>
        <div v-else class="space-y-3">
          <div
            v-for="invoice in invoices.slice(0, 5)"
            :key="invoice.id"
            class="flex items-center justify-between rounded-lg border border-navy-700/50 bg-navy-800/30 p-3 hover:bg-navy-800/50 transition-colors"
          >
            <div>
              <div class="font-medium text-white text-sm">{{ invoice.number }}</div>
              <div class="text-xs text-navy-400 mt-1">USD {{ Number(invoice.amountUsd).toFixed(2) }}</div>
            </div>
            <span
              :class="{
                'bg-green-500/20 text-green-400 border-green-500/30': invoice.status === 'PAID',
                'bg-amber-500/20 text-amber-400 border-amber-500/30': invoice.status === 'SENT',
                'bg-navy-500/20 text-navy-400 border-navy-500/30': invoice.status === 'DRAFT',
                'bg-red-500/20 text-red-400 border-red-500/30': invoice.status === 'OVERDUE'
              }"
              class="rounded-md border px-2 py-1 text-xs font-medium"
            >
              {{ invoice.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recent Requests -->
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-white">Recent Requests</h2>
          <NuxtLink to="/admin/requests" class="text-sm text-navy-400 hover:text-navy-300">View all →</NuxtLink>
        </div>
        <div v-if="requests.length === 0" class="text-center text-navy-400 py-8 text-sm">No requests yet</div>
        <div v-else class="space-y-3">
          <div
            v-for="request in requests.slice(0, 5)"
            :key="request.id"
            class="flex items-center justify-between rounded-lg border border-navy-700/50 bg-navy-800/30 p-3 hover:bg-navy-800/50 transition-colors"
          >
            <div>
              <div class="font-medium text-white text-sm">{{ request.category }}</div>
              <div class="text-xs text-navy-400 mt-1">{{ request.user?.name || request.user?.email }}</div>
            </div>
            <span
              :class="{
                'bg-green-500/20 text-green-400 border-green-500/30': request.status === 'APPROVED',
                'bg-amber-500/20 text-amber-400 border-amber-500/30': request.status === 'PENDING',
                'bg-red-500/20 text-red-400 border-red-500/30': request.status === 'REJECTED',
                'bg-blue-500/20 text-blue-400 border-blue-500/30': request.status === 'SCHEDULED'
              }"
              class="rounded-md border px-2 py-1 text-xs font-medium"
            >
              {{ request.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid gap-6 md:grid-cols-3">
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <h2 class="text-lg font-semibold text-white mb-4">Revenue Trend</h2>
        <div class="h-56">
          <canvas ref="revenueCanvas"></canvas>
        </div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <h2 class="text-lg font-semibold text-white mb-4">New Clubs</h2>
        <div class="h-56">
          <canvas ref="clubsCanvas"></canvas>
        </div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <h2 class="text-lg font-semibold text-white mb-4">New Schools</h2>
        <div class="h-56">
          <canvas ref="schoolsCanvas"></canvas>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, LineController, BarElement, Title, Tooltip, Legend)
const metrics = reactive({ revenue: 0, schools: 0, clubs: 0, pendingRequests: 0 })
const elearningMetrics = reactive({ courses: 0, publishedCourses: 0, enrollments: 0, activeStudents: 0 })
const schools = ref<any[]>([])
const clubs = ref<any[]>([])
const invoices = ref<any[]>([])
const requests = ref<any[]>([])
const recentCourses = ref<any[]>([])
const charts = reactive<{ revenue: any[]; clubs: any[]; schools: any[] }>({ revenue: [], clubs: [], schools: [] })
const revenueCanvas = ref<HTMLCanvasElement>()
const clubsCanvas = ref<HTMLCanvasElement>()
const schoolsCanvas = ref<HTMLCanvasElement>()

const notificationsLoading = ref(false)
const recentNotifications = ref<any[]>([])

function formatNotificationTime(date: string | Date) {
  if (!date) return 'Unknown'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid date'
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}

async function handleNotificationClick(notification: any) {
  if (!notification.read) {
    try {
      await $fetch(`/api/admin/notifications/${notification.id}/read`, {
        method: 'POST'
      })
      await loadNotifications()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Navigate based on notification type
  if (notification.type === 'COURSE_SUBMITTED' && notification.metadata?.courseId) {
    await navigateTo(`/admin/courses/review`)
  } else if (notification.type === 'COURSE_APPROVED' || notification.type === 'COURSE_REJECTED') {
    await navigateTo(`/admin/courses`)
  }
}

async function loadNotifications() {
  try {
    notificationsLoading.value = true
    const data = await $fetch('/api/admin/notifications', {
      query: { limit: 5 }
    }) as any
    recentNotifications.value = data.notifications || []
  } catch (error) {
    console.error('Failed to load notifications:', error)
  } finally {
    notificationsLoading.value = false
  }
}

onMounted(async () => {
  try {
    const m = await $fetch('/api/admin/metrics').catch((err) => {
      console.error('Failed to load metrics:', err)
      return { revenue: 0, schools: 0, clubs: 0, users: 0, quotes: 0, invoices: 0, payments: 0, pendingRequests: 0 }
    })
    Object.assign(metrics, m as any)
    
    schools.value = (await $fetch('/api/admin/schools').catch((err) => {
      console.error('Failed to load schools:', err)
      return []
    })) as any[]
    
    clubs.value = (await $fetch('/api/admin/clubs').catch((err) => {
      console.error('Failed to load clubs:', err)
      return []
    })) as any[]
    
    invoices.value = (await $fetch('/api/admin/invoices').catch((err) => {
      console.error('Failed to load invoices:', err)
      return []
    })) as any[]
    
    requests.value = (await $fetch('/api/admin/requests').catch((err) => {
      console.error('Failed to load requests:', err)
      return []
    })) as any[]
    
    const c = await $fetch('/api/admin/charts').catch((err) => {
      console.error('Failed to load charts:', err)
      return { revenue: [], clubs: [], schools: [] }
    })
    Object.assign(charts, c as any)
    
    // Load e-learning metrics
    const courses = await $fetch('/api/admin/courses').catch((err) => {
      console.error('Failed to load courses:', err)
      return []
    }) as any[]
    recentCourses.value = courses || []
    elearningMetrics.courses = courses.length
    elearningMetrics.publishedCourses = courses.filter((c: any) => c?.status === 'PUBLISHED').length
    elearningMetrics.enrollments = courses.reduce((sum: number, c: any) => sum + (c?._count?.enrollments || 0), 0)
    
    // Get unique students from enrollments
    const enrollments = await $fetch('/api/admin/enrollments').catch((err) => {
      console.error('Failed to load enrollments:', err)
      return []
    }) as any[]
    const uniqueStudents = new Set(enrollments.map((e: any) => e?.user?.id).filter(Boolean))
    elearningMetrics.activeStudents = uniqueStudents.size
    
    // Load notifications
    await loadNotifications()
    
    nextTick(() => {
      try {
        initCharts()
      } catch (err) {
        console.error('Failed to initialize charts:', err)
      }
    })
  } catch (error) {
    console.error('Error loading admin dashboard:', error)
  }
})

function initCharts() {
  if (!revenueCanvas.value || !clubsCanvas.value || !schoolsCanvas.value) return
  
  // Ensure charts data exists
  if (!charts.revenue || !Array.isArray(charts.revenue)) charts.revenue = []
  if (!charts.clubs || !Array.isArray(charts.clubs)) charts.clubs = []
  if (!charts.schools || !Array.isArray(charts.schools)) charts.schools = []
  
  // Revenue
  new ChartJS(revenueCanvas.value, {
    type: 'line',
    data: {
      labels: charts.revenue.map((p: any) => p?.m || ''),
      datasets: [{ label: 'Revenue (USD)', data: charts.revenue.map((p: any) => p?.v || 0), borderColor: '#60a5fa', backgroundColor: 'rgba(96,165,250,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#60a5fa', pointBorderColor: '#fff', pointBorderWidth: 2 }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false, 
      plugins: { 
        legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
        tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#cbd5e1' }
      }, 
      scales: { 
        x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }, 
        y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } } 
      } 
    }
  })
  // Clubs
  new ChartJS(clubsCanvas.value, {
    type: 'line',
    data: {
      labels: charts.clubs.map((p: any) => p?.m || ''),
      datasets: [{ label: 'New Clubs', data: charts.clubs.map((p: any) => p?.v || 0), borderColor: '#a78bfa', backgroundColor: 'rgba(167,139,250,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#a78bfa', pointBorderColor: '#fff', pointBorderWidth: 2 }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false, 
      plugins: { 
        legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
        tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#cbd5e1' }
      }, 
      scales: { 
        x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }, 
        y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } } 
      } 
    }
  })
  // Schools
  new ChartJS(schoolsCanvas.value, {
    type: 'line',
    data: {
      labels: charts.schools.map((p: any) => p?.m || ''),
      datasets: [{ label: 'New Schools', data: charts.schools.map((p: any) => p?.v || 0), borderColor: '#34d399', backgroundColor: 'rgba(52,211,153,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#34d399', pointBorderColor: '#fff', pointBorderWidth: 2 }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false, 
      plugins: { 
        legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
        tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#cbd5e1' }
      }, 
      scales: { 
        x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }, 
        y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } } 
      } 
    }
  })
}

async function setClub(id: string, status: 'ACTIVE'|'PAUSED'|'DRAFT') {
  await $fetch('/api/admin/clubs.status', { method: 'POST', body: { clubId: id, status } })
  clubs.value = (await $fetch('/api/admin/clubs').catch(() => [])) as any[]
}
</script>
