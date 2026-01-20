<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Users</h1>
        <p class="text-slate-500">Manage community users</p>
      </div>
      
      <!-- Search -->
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          v-model="search" 
          type="text" 
          placeholder="Search users..." 
          class="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
        />
      </div>
    </div>

    <!-- Filter -->
    <div class="mb-4 flex gap-2">
      <button 
        v-for="tab in filterTabs" :key="tab.value"
        @click="verifiedFilter = tab.value"
        :class="[
          'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
          verifiedFilter === tab.value ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div v-for="i in 5" :key="i" class="h-16 border-b border-slate-100 animate-pulse"></div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Credits</th>
              <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50">
              <td class="px-5 py-4">
                <div>
                  <p class="font-medium text-slate-900">{{ user.name }}</p>
                  <p class="text-sm text-slate-500">{{ user.email }}</p>
                  <p v-if="user.communityProfile?.username" class="text-xs text-slate-400">@{{ user.communityProfile.username }}</p>
                </div>
              </td>
              <td class="px-5 py-4">
                <span 
                  class="text-xs px-2 py-1 rounded-full font-medium"
                  :class="{
                    'bg-purple-50 text-purple-600': user.role === 'ADMIN',
                    'bg-primary-50 text-primary-600': user.role === 'COMMUNITY_ADMIN',
                    'bg-blue-50 text-blue-600': user.role === 'MENTOR',
                    'bg-slate-100 text-slate-600': user.role === 'INDIVIDUAL'
                  }"
                >
                  {{ user.role }}
                </span>
                <span 
                  v-if="user.mentorProfile && !user.mentorProfile.isApproved" 
                  class="ml-1 text-xs text-amber-600"
                >(pending)</span>
              </td>
              <td class="px-5 py-4">
                <span 
                  class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                  :class="user.emailVerified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="user.emailVerified ? 'bg-green-500' : 'bg-amber-500'"></span>
                  {{ user.emailVerified ? 'Verified' : 'Unverified' }}
                </span>
              </td>
              <td class="px-5 py-4 text-sm text-slate-700 font-medium">{{ user.credits }}</td>
              <td class="px-5 py-4 text-sm text-slate-500">{{ formatDate(user.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="!users?.length" class="py-12 text-center text-slate-500">
        No users found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community-admin',
  middleware: ['community-admin']
})

const search = ref('')
const verifiedFilter = ref<'all' | 'verified' | 'unverified'>('all')

const filterTabs = [
  { label: 'All', value: 'all' },
  { label: 'Verified', value: 'verified' },
  { label: 'Unverified', value: 'unverified' }
]

const queryParams = computed(() => {
  const params: any = {}
  if (search.value) params.search = search.value
  if (verifiedFilter.value === 'verified') params.verified = 'true'
  if (verifiedFilter.value === 'unverified') params.verified = 'false'
  return new URLSearchParams(params).toString()
})

const { data, pending } = useFetch<any>(() => `/api/admin/community/users?${queryParams.value}`, {
  watch: [queryParams]
})

const users = computed(() => data.value?.users || [])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
