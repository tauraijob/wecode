<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900">Community Dashboard</h1>
      <p class="text-slate-500">Overview of your community platform</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="i in 4" :key="i" class="h-28 bg-white rounded-xl animate-pulse"></div>
    </div>

    <template v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Revenue -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2 bg-blue-50 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">Platform Earn</span>
          </div>
          <div class="text-2xl font-bold text-slate-900">${{ stats?.revenue?.total?.toFixed(2) || '0.00' }}</div>
          <div class="text-sm text-slate-500">Total Revenue</div>
          <div class="mt-2 text-xs text-slate-400 flex gap-2">
             <span>Sales: ${{ stats?.revenue?.sales?.toFixed(2) || '0.00' }}</span>
             <span>•</span>
             <span>Comm: ${{ stats?.revenue?.commissions?.toFixed(2) || '0.00' }}</span>
          </div>
        </div>

        <!-- Users -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2 bg-primary-50 rounded-lg">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span class="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">+{{ stats?.users?.thisWeek || 0 }} this week</span>
          </div>
          <div class="text-2xl font-bold text-slate-900">{{ stats?.users?.total || 0 }}</div>
          <div class="text-sm text-slate-500">Total Users</div>
          <div class="mt-2 text-xs text-slate-400">{{ stats?.users?.verified || 0 }} verified</div>
        </div>

        <!-- Mentors -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2 bg-purple-50 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <NuxtLink 
              v-if="stats?.mentors?.pending > 0"
              to="/community/admin/mentors"
              class="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full hover:bg-amber-100"
            >
              {{ stats?.mentors?.pending }} pending
            </NuxtLink>
          </div>
          <div class="text-2xl font-bold text-slate-900">{{ stats?.mentors?.approved || 0 }}</div>
          <div class="text-sm text-slate-500">Active Mentors</div>
        </div>

        <!-- Payouts -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2 bg-emerald-50 rounded-lg">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <NuxtLink 
              v-if="stats?.payouts?.pending > 0"
              to="/community/admin/payouts"
              class="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full hover:bg-amber-100"
            >
              {{ stats?.payouts?.pending }} pending
            </NuxtLink>
          </div>
          <div class="text-2xl font-bold text-slate-900">${{ stats?.payouts?.totalAmount?.toFixed(2) || '0.00' }}</div>
          <div class="text-sm text-slate-500">Total Payouts</div>
        </div>

        <!-- Forum -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <div class="p-2 bg-orange-50 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
          </div>
          <div class="text-2xl font-bold text-slate-900">{{ stats?.forum?.posts || 0 }}</div>
          <div class="text-sm text-slate-500">Forum Posts</div>
          <div class="mt-2 text-xs text-slate-400">{{ stats?.forum?.comments || 0 }} comments</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Pending Mentors -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 class="font-semibold text-slate-900">Pending Mentor Applications</h2>
            <NuxtLink to="/community/admin/mentors" class="text-sm text-primary-600 hover:underline">View All</NuxtLink>
          </div>
          <div v-if="stats?.recentPendingMentors?.length" class="divide-y divide-slate-100">
            <div v-for="mentor in stats.recentPendingMentors" :key="mentor.id" class="px-5 py-3 flex items-center justify-between">
              <div>
                <p class="font-medium text-slate-900">{{ mentor.user.name }}</p>
                <p class="text-sm text-slate-500">{{ mentor.user.email }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="approveMentor(mentor.id)" class="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium rounded-lg transition-colors">
                  Approve
                </button>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center text-slate-500 text-sm">
            No pending applications
          </div>
        </div>

        <!-- Recent Users -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 class="font-semibold text-slate-900">Recent Users</h2>
            <NuxtLink to="/community/admin/users" class="text-sm text-primary-600 hover:underline">View All</NuxtLink>
          </div>
          <div v-if="stats?.recentUsers?.length" class="divide-y divide-slate-100">
            <div v-for="user in stats.recentUsers" :key="user.id" class="px-5 py-3 flex items-center justify-between">
              <div>
                <p class="font-medium text-slate-900">{{ user.name }}</p>
                <p class="text-sm text-slate-500">{{ user.email }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span 
                  class="text-xs px-2 py-1 rounded-full font-medium"
                  :class="user.emailVerified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'"
                >
                  {{ user.emailVerified ? 'Verified' : 'Unverified' }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center text-slate-500 text-sm">
            No users yet
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community-admin',
  middleware: ['community-admin']
})

const { error: toastError, success } = useToast()

const { data: stats, pending, refresh } = useFetch<any>('/api/admin/community/stats')

const approveMentor = async (mentorId: string) => {
  try {
    await $fetch(`/api/admin/community/mentors/${mentorId}/approve`, { method: 'POST' })
    success('Mentor approved successfully')
    refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Failed to approve mentor')
  }
}
</script>
