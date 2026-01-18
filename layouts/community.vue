<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr] bg-slate-50 text-slate-900">
    <!-- Sidebar -->
    <aside class="hidden md:block border-r border-slate-200 bg-white">
      <div class="flex items-center gap-2 p-3 border-b border-slate-200">
        <div
          v-if="logoUrl"
          class="inline-flex items-center justify-center rounded-lg px-1.5 py-0.5"
        >
          <img
            :src="logoUrl"
            alt="WeCodeZW Logo"
            class="h-8 w-auto object-contain"
          />
        </div>
        <span v-else class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 font-semibold text-white text-sm">WZ</span>
        <div>
          <div class="font-semibold text-slate-900 text-sm">Community</div>
          <div class="text-[10px] text-slate-500">{{ me ? (me.role === 'MENTOR' ? 'Mentor Hub' : 'Member Hub') : 'Welcome' }}</div>
        </div>
      </div>
      
      <nav class="mt-1.5 space-y-0.5 px-2">
        <!-- Mentor Section -->
        <template v-if="me?.role === 'MENTOR'">
          <div class="pt-1.5 pb-0.5">
            <div class="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Mentor Tools</div>
          </div>
          <NuxtLink to="/mentor" :class="navClass('/mentor')">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </NuxtLink>
          <NuxtLink to="/mentor/sessions" :class="navClass('/mentor/sessions')">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>My Sessions</span>
          </NuxtLink>
          <NuxtLink to="/mentor/active" :class="navClass('/mentor/active')">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Active Sessions</span>
          </NuxtLink>
          <NuxtLink to="/mentor/earnings" :class="navClass('/mentor/earnings')">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Earnings</span>
          </NuxtLink>
          <NuxtLink to="/mentor/profile" :class="navClass('/mentor/profile')">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>My Profile</span>
          </NuxtLink>
        </template>

        <!-- Community Section -->
        <div class="pt-3 pb-0.5">
          <div class="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Community</div>
        </div>
        <NuxtLink to="/community" :class="navClass('/community', true)">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span>Forum Feed</span>
        </NuxtLink>
        <NuxtLink to="/community/mentors" :class="navClass('/community/mentors')">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Browse Mentors</span>
        </NuxtLink>
        <template v-if="me">
          <NuxtLink to="/community/bookings" :class="navClass('/community/bookings')">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>My Bookings</span>
          </NuxtLink>
        </template>


        <!-- Account Section (Auth only) -->
        <template v-if="me">
          <div class="pt-3 pb-0.5">
            <div class="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Account</div>
          </div>
          <NuxtLink to="/community/settings" :class="navClass('/community/settings')">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </NuxtLink>

          <!-- Credits Card -->
          <div class="mt-4 p-3 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs text-slate-600">Your Credits</span>
              <span class="text-lg font-bold text-primary-600">{{ me?.credits || 0 }}</span>
            </div>
            <button
              @click="showTopUpModal = true"
              class="w-full py-1.5 px-3 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors"
            >
              Top Up Credits
            </button>
          </div>
        </template>

        <!-- Guest Login Prompt -->
        <div v-if="!me" class="mt-4 p-3 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
          <p class="text-xs text-slate-600 mb-2">Join the community to book mentors and participate!</p>
          <NuxtLink
            to="/auth/login?redirect=/community"
            class="block w-full py-2 px-3 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium text-center transition-colors mb-2"
          >
            Sign In
          </NuxtLink>
          <NuxtLink
            to="/community/register"
            class="block w-full py-2 px-3 rounded-md border border-primary-300 text-primary-600 text-xs font-medium text-center hover:bg-primary-50 transition-colors"
          >
            Create Account
          </NuxtLink>
        </div>
      </nav>
    </aside>
    
    <div class="flex flex-col">
      <!-- Header -->
      <header class="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-3 py-2 backdrop-blur-lg">
        <div class="md:hidden">
          <button @click="open = !open" class="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs hover:bg-slate-50 transition-colors">
            <svg class="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <div class="flex-1 flex items-center gap-3 ml-3">
          <NuxtLink to="/community" class="text-xs text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1">
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Forum
          </NuxtLink>
        </div>
        
        <div class="flex items-center gap-2 text-xs">
          <!-- Credits Badge (Auth only) -->
          <div v-if="me" class="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary-50 border border-primary-200">
            <svg class="h-3 w-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="font-semibold text-primary-700">{{ me?.credits || 0 }}</span>
          </div>

          <!-- Notifications (Auth only) -->
          <div v-if="me" class="relative" ref="notificationMenuRef">
            <button 
              @click="notificationOpen = !notificationOpen"
              class="relative rounded-md border border-slate-300 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white">
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
              <div v-if="notificationOpen" class="absolute right-0 mt-1.5 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl z-50">
                <div class="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2">
                  <h3 class="text-xs font-semibold text-slate-900">Notifications</h3>
                  <button @click="refreshNotifications" class="text-slate-400 hover:text-slate-600">
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                <div class="max-h-80 overflow-y-auto">
                  <div v-if="!notifications?.length" class="p-6 text-center text-xs text-slate-500">
                    No notifications yet.
                  </div>
                  <div v-else class="divide-y divide-slate-100">
                    <div 
                      v-for="notification in notifications" 
                      :key="notification.id"
                      class="block p-3 hover:bg-slate-50 transition-colors"
                      :class="{ 'bg-blue-50/50': !notification.read }"
                    >
                      <div class="flex items-start gap-3">
                        <div class="flex-1 space-y-1">
                          <p class="text-xs font-medium text-slate-900">{{ notification.title }}</p>
                          <p class="text-[10px] text-slate-500">{{ notification.message }}</p>
                          <p class="text-[9px] text-slate-400">{{ new Date(notification.createdAt).toLocaleString() }}</p>
                        </div>
                        <button 
                          v-if="!notification.read" 
                          @click.stop="markAsRead(notification.id)"
                          class="h-2 w-2 rounded-full bg-blue-500 hover:bg-blue-600 ring-2 ring-blue-100"
                          title="Mark as read"
                        ></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- User Menu (Auth) / Guest Buttons -->
          <template v-if="me">
          <div class="relative" ref="userMenuRef">
            <button 
              @click="menuOpen = !menuOpen" 
              class="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50 transition-all"
            >
              <div class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-[10px] font-semibold text-white">
                {{ me?.name?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <span class="hidden sm:inline text-slate-700">{{ me?.name }}</span>
              <svg class="h-3 w-3 text-slate-400 transition-transform" :class="{ 'rotate-180': menuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div v-if="menuOpen" class="absolute right-0 mt-1.5 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white text-xs shadow-lg z-50">
                <!-- User Info Header -->
                <div class="border-b border-slate-100 bg-slate-50 px-3 py-2">
                  <div class="flex items-center gap-2">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-semibold text-white">
                      {{ me?.name?.charAt(0).toUpperCase() || 'U' }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-slate-900 truncate text-xs">{{ me?.name }}</div>
                      <div class="text-[10px] text-slate-500 truncate">{{ me?.email }}</div>
                      <div class="mt-0.5">
                        <span 
                          :class="{
                            'bg-primary-100 text-primary-700': me?.role === 'MENTOR',
                            'bg-slate-100 text-slate-600': me?.role !== 'MENTOR'
                          }"
                          class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium"
                        >
                          {{ me?.role === 'MENTOR' ? 'Mentor' : 'Member' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Menu Items -->
                <div class="py-0.5">
                  <NuxtLink
                    v-if="me?.role === 'MENTOR'"
                    to="/mentor"
                    @click="menuOpen = false"
                    class="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Mentor Dashboard</span>
                  </NuxtLink>
                  
                  <NuxtLink
                    to="/community"
                    @click="menuOpen = false"
                    class="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Community</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/community/settings"
                    @click="menuOpen = false"
                    class="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                  </NuxtLink>

                  <div class="border-t border-slate-100 my-0.5"></div>

                  <button
                    @click="handleLogout"
                    class="flex w-full items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
          </template>

          <!-- Guest Login Buttons -->
          <template v-else>
            <NuxtLink
              to="/auth/login?redirect=/community"
              class="px-3 py-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/community/register"
              class="px-3 py-1.5 rounded-md border border-primary-300 text-primary-600 hover:bg-primary-50 text-xs font-medium transition-colors"
            >
              Register
            </NuxtLink>
          </template>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="flex-1 overflow-auto bg-slate-50">
        <slot />
      </main>
    </div>

    <!-- Mobile Sidebar -->
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-40 grid md:hidden">
        <div class="bg-black/30" @click="open=false"></div>
        <div class="absolute left-0 top-0 h-full w-60 border-r border-slate-200 bg-white p-3 overflow-y-auto">
          <div class="mb-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div
                v-if="logoUrl"
                class="inline-flex items-center justify-center rounded-lg px-1.5 py-0.5"
              >
                <img :src="logoUrl" alt="WeCodeZW Logo" class="h-8 w-auto object-contain" />
              </div>
              <span v-else class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 font-semibold text-white text-sm">WZ</span>
              <div class="text-sm font-semibold text-slate-900">Community</div>
            </div>
            <button @click="open=false" class="rounded p-0.5 hover:bg-slate-100">
              <svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Mobile Nav Links -->
          <nav class="space-y-0.5">
            <template v-if="me?.role === 'MENTOR'">
              <div class="pt-1.5 pb-0.5">
                <div class="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Mentor Tools</div>
              </div>
              <NuxtLink @click="open=false" to="/mentor" :class="navClass('/mentor')">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </NuxtLink>
              <NuxtLink @click="open=false" to="/mentor/sessions" :class="navClass('/mentor/sessions')">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>My Sessions</span>
              </NuxtLink>
              <NuxtLink @click="open=false" to="/mentor/active" :class="navClass('/mentor/active')">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Active Sessions</span>
              </NuxtLink>
              <NuxtLink @click="open=false" to="/mentor/earnings" :class="navClass('/mentor/earnings')">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Earnings</span>
              </NuxtLink>
            </template>

            <div class="pt-3 pb-0.5">
              <div class="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Community</div>
            </div>
            <NuxtLink @click="open=false" to="/community" :class="navClass('/community', true)">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span>Forum Feed</span>
            </NuxtLink>
            <NuxtLink @click="open=false" to="/community/mentors" :class="navClass('/community/mentors')">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Browse Mentors</span>
            </NuxtLink>
            <NuxtLink @click="open=false" to="/community/bookings" :class="navClass('/community/bookings')">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>My Bookings</span>
            </NuxtLink>
          </nav>

          <!-- Mobile Credits Card -->
          <div class="mt-4 p-3 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs text-slate-600">Your Credits</span>
              <span class="text-lg font-bold text-primary-600">{{ me?.credits || 0 }}</span>
            </div>
            <button
              @click="showTopUpModal = true; open = false"
              class="w-full py-1.5 px-3 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors"
            >
              Top Up Credits
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Top Up Modal -->
    <TopUpModal v-model="showTopUpModal" />
    
    <!-- Toast Notifications -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
const { user: me } = useAuth()
const { logoUrl } = useLogo()

const open = ref(false)
const menuOpen = ref(false)
const notificationOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const notificationMenuRef = ref<HTMLElement | null>(null)
const showTopUpModal = ref(false)
const route = useRoute()

// Notifications Logic
const { data: notificationData, refresh: refreshNotifications } = useFetch('/api/notifications', {
  key: 'notifications-polling',
  server: false
})

const notifications = computed(() => notificationData.value?.notifications || [])
const unreadCount = computed(() => notificationData.value?.unreadCount || 0)

const markAsRead = async (id: string) => {
  try {
    await $fetch(`/api/notifications/${id}`, { method: 'PATCH' })
    // Optimistic update
    if (notificationData.value) {
      const notif = notificationData.value.notifications.find((n: any) => n.id === id)
      if (notif) notif.read = true
      notificationData.value.unreadCount = Math.max(0, notificationData.value.unreadCount - 1)
    }
  } catch (err) {
    console.error('Failed to mark read:', err)
  }
}

let notificationInterval: any = null

onMounted(() => {
  // Poll notifications
  refreshNotifications()
  notificationInterval = setInterval(refreshNotifications, 30000)
  
  const handleClickOutside = (event: MouseEvent) => {
    if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
      menuOpen.value = false
    }
    if (notificationMenuRef.value && !notificationMenuRef.value.contains(event.target as Node)) {
      notificationOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    if (notificationInterval) clearInterval(notificationInterval)
  })
})
function isActive(path: string, exact = false) {
  if (exact) {
    return route.path === path
  }
  return route.path.startsWith(path)
}

function navClass(path: string, exact = false) {
  const base = 'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors'
  return isActive(path, exact)
    ? `${base} bg-primary-50 border border-primary-200 text-primary-700 font-medium`
    : `${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900`
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


</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
