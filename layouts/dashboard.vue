<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-navy-950 text-white">
    <!-- Sidebar -->
    <aside class="hidden md:block border-r border-navy-800 bg-navy-900/30">
      <div class="flex items-center gap-3 p-4 border-b border-navy-800">
        <div
          v-if="logoUrl"
          class="inline-flex items-center justify-center rounded-xl bg-white px-3 py-1.5 shadow-xl border-2 border-white/50 ring-2 ring-white/30"
        >
          <img
            :src="logoUrl"
            alt="WeCodeZW Logo"
            class="h-12 w-auto object-contain"
          />
        </div>
        <span v-else class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">WZ</span>
        <div class="font-semibold tracking-tight">Dashboard</div>
      </div>
      <nav class="mt-2 space-y-1 px-2">
        <NuxtLink :to="'/dashboard'" :class="navClass('/dashboard')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Overview</span>
        </NuxtLink>
        
        <div v-if="me?.role === 'STUDENT'" class="pt-2 pb-1">
          <div class="px-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">Learning</div>
        </div>
        <NuxtLink v-if="me?.role === 'STUDENT'" :to="'/dashboard/learn'" :class="navClass('/dashboard/learn')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>My Courses</span>
        </NuxtLink>
        <NuxtLink v-if="me?.role === 'STUDENT'" :to="'/dashboard/certificates'" :class="navClass('/dashboard/certificates')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span>My Certificates</span>
        </NuxtLink>
        <div v-if="me?.role === 'INSTRUCTOR'" class="pt-2 pb-1">
          <div class="px-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">Instructor</div>
        </div>
        <NuxtLink v-if="me?.role === 'INSTRUCTOR'" :to="'/instructor'" :class="navClass('/instructor')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Instructor Dashboard</span>
        </NuxtLink>
        <NuxtLink v-if="me?.role === 'INSTRUCTOR'" :to="'/instructor/courses'" :class="navClass('/instructor/courses')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>My Courses</span>
        </NuxtLink>
        <NuxtLink v-if="me?.role === 'INSTRUCTOR'" :to="'/instructor/earnings'" :class="navClass('/instructor/earnings')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Earnings</span>
        </NuxtLink>
        <NuxtLink v-if="me?.role === 'INSTRUCTOR'" :to="'/instructor/payouts'" :class="navClass('/instructor/payouts')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Payouts</span>
        </NuxtLink>
        
        <div class="pt-2 pb-1">
          <div class="px-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">Account</div>
        </div>
        <NuxtLink v-if="me?.role !== 'INSTRUCTOR'" :to="'/dashboard/invoices'" :class="navClass('/dashboard/invoices')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Invoices</span>
        </NuxtLink>
        <NuxtLink v-if="me?.role !== 'INSTRUCTOR'" :to="'/dashboard/requests'" :class="navClass('/dashboard/requests')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Requests</span>
        </NuxtLink>
        <NuxtLink v-if="me?.role !== 'INSTRUCTOR'" :to="'/dashboard/clubs'" :class="navClass('/dashboard/clubs')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Clubs</span>
        </NuxtLink>
        <NuxtLink :to="'/dashboard/account'" :class="navClass('/dashboard/account')">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Account Settings</span>
        </NuxtLink>
      </nav>
    </aside>
    
    <div class="flex flex-col">
      <!-- Header -->
      <header class="sticky top-0 z-30 flex items-center justify-between border-b border-navy-800 bg-navy-950/60 px-4 py-3 backdrop-blur">
        <div class="md:hidden">
          <button @click="open = !open" class="rounded-md bg-white/10 px-2 py-1 text-sm hover:bg-white/15 transition-colors">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div class="flex-1"></div>
        <div class="flex items-center gap-3 text-sm">
          <!-- Notifications (for instructors) -->
          <div v-if="me?.role === 'INSTRUCTOR'" class="relative" ref="notificationMenuRef">
            <button
              @click="notificationMenuOpen = !notificationMenuOpen"
              class="relative rounded-md bg-white/10 p-2 hover:bg-white/15 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="notificationMenuOpen"
                class="absolute right-0 mt-2 w-96 max-h-[600px] overflow-hidden rounded-xl border border-navy-700/50 bg-navy-900/95 backdrop-blur-lg shadow-xl z-50"
              >
                <div class="border-b border-navy-700/50 bg-navy-800/50 px-4 py-3 flex items-center justify-between">
                  <h3 class="font-semibold text-white">Notifications</h3>
                  <button
                    v-if="unreadCount > 0"
                    @click="markAllAsRead"
                    class="text-xs text-navy-400 hover:text-navy-300"
                  >
                    Mark all as read
                  </button>
                </div>
                <div class="max-h-[500px] overflow-y-auto">
                  <div v-if="notificationsLoading" class="p-8 text-center">
                    <div class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-navy-400 border-r-transparent"></div>
                  </div>
                  <div v-else-if="notifications.length === 0" class="p-8 text-center text-navy-400">
                    <p>No notifications</p>
                  </div>
                  <div v-else class="divide-y divide-navy-700/50">
                    <button
                      v-for="notification in notifications"
                      :key="notification.id"
                      @click="handleNotificationClick(notification)"
                      :class="{
                        'bg-navy-800/50': !notification.read,
                        'hover:bg-navy-800/30': true
                      }"
                      class="w-full px-4 py-3 text-left transition-colors"
                    >
                      <div class="flex items-start gap-3">
                        <div
                          :class="{
                            'bg-green-500/20': notification.type === 'COURSE_APPROVED',
                            'bg-red-500/20': notification.type === 'COURSE_REJECTED',
                            'bg-blue-500/20': notification.type === 'COURSE_SUBMITTED',
                            'bg-purple-500/20': !['COURSE_APPROVED', 'COURSE_REJECTED', 'COURSE_SUBMITTED'].includes(notification.type)
                          }"
                          class="rounded-lg p-2"
                        >
                          <svg
                            v-if="notification.type === 'COURSE_APPROVED'"
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
                          <svg
                            v-else
                            class="h-5 w-5 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p :class="{ 'font-semibold': !notification.read, 'font-medium': notification.read }" class="text-sm text-white">
                            {{ notification.title }}
                          </p>
                          <p class="mt-1 text-xs text-navy-400 line-clamp-2">{{ notification.message }}</p>
                          <p class="mt-1 text-xs text-navy-500">
                            {{ formatTime(notification.createdAt) }}
                          </p>
                        </div>
                        <div v-if="!notification.read" class="h-2 w-2 rounded-full bg-blue-500"></div>
                      </div>
                    </button>
                  </div>
                </div>
                <div class="border-t border-navy-700/50 bg-navy-800/50 px-4 py-3">
                  <NuxtLink
                    to="/instructor/notifications"
                    @click="notificationMenuOpen = false"
                    class="block text-center text-sm text-navy-400 hover:text-navy-300"
                  >
                    View all notifications
                  </NuxtLink>
                </div>
              </div>
            </transition>
          </div>
          <!-- User Menu -->
          <div class="relative" ref="userMenuRef">
            <button 
              @click="menuOpen = !menuOpen" 
              class="flex items-center gap-2 rounded-md bg-gradient-to-r from-navy-700/50 to-navy-800/50 px-3 py-1.5 text-xs sm:text-sm hover:from-navy-600/50 hover:to-navy-700/50 transition-all border border-navy-700/50"
            >
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-semibold text-white">
                {{ me?.name?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <span class="hidden sm:inline">
                <span v-if="me?.role === 'STUDENT'">E-Learning Student</span>
                <span v-else-if="me?.role === 'ADMIN'">Admin</span>
                <span v-else>{{ me?.name }}</span>
              </span>
              <svg class="h-4 w-4 transition-transform" :class="{ 'rotate-180': menuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div v-if="menuOpen" class="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-navy-700/50 bg-navy-900/95 backdrop-blur-lg text-sm shadow-xl z-50">
                <!-- User Info Header -->
                <div class="border-b border-navy-700/50 bg-navy-800/50 px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                      {{ me?.name?.charAt(0).toUpperCase() || 'U' }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-white truncate">{{ me?.name }}</div>
                      <div class="text-xs text-navy-300 truncate">{{ me?.email }}</div>
                      <div class="mt-1">
                        <span 
                          :class="{
                            'bg-blue-500/20 text-blue-400 border-blue-500/30': me?.role === 'ADMIN',
                            'bg-purple-500/20 text-purple-400 border-purple-500/30': me?.role === 'STUDENT',
                            'bg-emerald-500/20 text-emerald-400 border-emerald-500/30': me?.role === 'USER'
                          }"
                          class="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
                        >
                          <span v-if="me?.role === 'STUDENT'">E-Learning Student</span>
                          <span v-else-if="me?.role === 'ADMIN'">Admin</span>
                          <span v-else>{{ me?.role }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Menu Items -->
                <div class="py-1">
                  <NuxtLink
                    to="/dashboard"
                    @click="menuOpen = false"
                    class="flex items-center gap-3 px-4 py-2 text-navy-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Dashboard</span>
                  </NuxtLink>
                  
                  <NuxtLink
                    v-if="me?.role === 'STUDENT'"
                    to="/dashboard/learn"
                    @click="menuOpen = false"
                    class="flex items-center gap-3 px-4 py-2 text-navy-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>My Courses</span>
                  </NuxtLink>
                  
                  <NuxtLink
                    v-if="me?.role === 'STUDENT'"
                    to="/dashboard/certificates"
                    @click="menuOpen = false"
                    class="flex items-center gap-3 px-4 py-2 text-navy-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span>My Certificates</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/dashboard/account"
                    @click="menuOpen = false"
                    class="flex items-center gap-3 px-4 py-2 text-navy-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Account Settings</span>
                  </NuxtLink>

                  <NuxtLink
                    v-if="me?.role === 'ADMIN'"
                    to="/admin"
                    @click="menuOpen = false"
                    class="flex items-center gap-3 px-4 py-2 text-navy-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Admin Dashboard</span>
                  </NuxtLink>

                  <div class="border-t border-navy-700/50 my-1"></div>

                  <button
                    @click="handleLogout"
                    class="flex w-full items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>

    <!-- Mobile Sidebar -->
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-40 grid md:hidden">
        <div class="bg-black/50" @click="open=false"></div>
        <div class="absolute left-0 top-0 h-full w-72 border-r border-navy-800 bg-navy-900/95 backdrop-blur-lg p-4 overflow-y-auto">
          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                v-if="logoUrl"
                class="inline-flex items-center justify-center rounded-xl bg-white px-3 py-1.5 shadow-xl border-2 border-white/50 ring-2 ring-white/30"
              >
                <img
                  :src="logoUrl"
                  alt="WeCodeZW Logo"
                  class="h-12 w-auto object-contain"
                />
              </div>
              <span v-else class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">WZ</span>
              <div class="text-xl font-semibold">Dashboard</div>
            </div>
            <button @click="open=false" class="rounded-md p-1 hover:bg-white/10">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="space-y-1">
            <NuxtLink @click="open=false" :to="'/dashboard'" :class="navClass('/dashboard')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Overview</span>
            </NuxtLink>
            
            <div v-if="me?.role === 'STUDENT'" class="pt-2 pb-1">
              <div class="px-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">Learning</div>
            </div>
            <NuxtLink v-if="me?.role === 'STUDENT'" @click="open=false" :to="'/dashboard/learn'" :class="navClass('/dashboard/learn')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>My Courses</span>
            </NuxtLink>
            <NuxtLink v-if="me?.role === 'STUDENT'" @click="open=false" :to="'/dashboard/certificates'" :class="navClass('/dashboard/certificates')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>My Certificates</span>
            </NuxtLink>
            
            <div class="pt-2 pb-1">
              <div class="px-3 text-xs font-semibold text-navy-400 uppercase tracking-wider">Account</div>
            </div>
            <NuxtLink v-if="me?.role !== 'INSTRUCTOR'" @click="open=false" :to="'/dashboard/invoices'" :class="navClass('/dashboard/invoices')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Invoices</span>
            </NuxtLink>
            <NuxtLink v-if="me?.role !== 'INSTRUCTOR'" @click="open=false" :to="'/dashboard/requests'" :class="navClass('/dashboard/requests')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Requests</span>
            </NuxtLink>
            <NuxtLink v-if="me?.role !== 'INSTRUCTOR'" @click="open=false" :to="'/dashboard/clubs'" :class="navClass('/dashboard/clubs')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Clubs</span>
            </NuxtLink>
            <NuxtLink @click="open=false" :to="'/dashboard/account'" :class="navClass('/dashboard/account')">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Account Settings</span>
            </NuxtLink>
          </nav>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const { user: me } = useAuth()
const { logoUrl } = useLogo()
// Redirect admins to admin dashboard
if (me.value && me.value.role === 'ADMIN') {
  await navigateTo('/admin')
}
const open = ref(false)
const menuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const notificationMenuOpen = ref(false)
const notificationMenuRef = ref<HTMLElement | null>(null)

// Fetch notifications for instructors only
const notificationsData = ref<any>(null)
const refreshNotifications = async () => {
  if (me.value?.role === 'INSTRUCTOR') {
    try {
      notificationsData.value = await $fetch('/api/instructor/notifications', {
        query: { limit: 10 }
      })
    } catch (error) {
      console.error('Failed to fetch instructor notifications:', error)
    }
  }
}

// Watch for role changes and fetch if instructor
watch(() => me.value?.role, (role) => {
  if (role === 'INSTRUCTOR') {
    refreshNotifications()
  }
}, { immediate: true })

const notifications = computed(() => notificationsData.value?.notifications || [])
const unreadCount = computed(() => notificationsData.value?.unreadCount || 0)
const notificationsLoading = ref(false)
const route = useRoute()

function isActive(path: string) {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}

function navClass(path: string) {
  const base = 'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors'
  return isActive(path)
    ? `${base} bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-white font-medium`
    : `${base} text-navy-200 hover:bg-white/10 hover:text-white`
}

async function handleLogout() {
  menuOpen.value = false
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    navigateTo('/')
    window.dispatchEvent(new CustomEvent('auth:logout'))
  } catch (error) {
    console.error('Logout error:', error)
  }
}

function formatTime(date: string | Date) {
  const d = new Date(date)
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
      await $fetch(`/api/instructor/notifications/${notification.id}/read`, {
        method: 'POST'
      })
      await refreshNotifications()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Navigate based on notification type
  if (notification.type === 'COURSE_APPROVED' || notification.type === 'COURSE_REJECTED') {
    if (notification.metadata?.courseId) {
      await navigateTo(`/instructor/courses/${notification.metadata.courseId}`)
    } else {
      await navigateTo(`/instructor/courses`)
    }
    notificationMenuOpen.value = false
  } else if (notification.type === 'COURSE_SUBMITTED') {
    await navigateTo(`/instructor/courses`)
    notificationMenuOpen.value = false
  }
}

async function markAllAsRead() {
  try {
    await $fetch('/api/instructor/notifications/read-all', {
      method: 'POST'
    })
    await refreshNotifications()
  } catch (error) {
    console.error('Failed to mark all as read:', error)
  }
}

// Close menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (notificationMenuRef.value && !notificationMenuRef.value.contains(event.target as Node)) {
      notificationMenuOpen.value = false
    }
    if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
      menuOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  // Refresh notifications every 30 seconds for instructors
  if (me.value?.role === 'INSTRUCTOR') {
    const interval = setInterval(() => {
      refreshNotifications()
    }, 30000)

    onUnmounted(() => {
      clearInterval(interval)
    })
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

