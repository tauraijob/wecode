<template>
  <div class="max-w-5xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-bold text-slate-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        Leaderboard
      </h1>
      <p class="text-xs text-slate-500 mt-0.5">Top community contributors ranked by XP</p>
    </div>

    <!-- Your Rank Card -->
    <div v-if="myRank" class="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 mb-6 shadow-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
            #{{ myRank.rank }}
          </div>
          <div>
            <div class="text-sm font-semibold">Your Rank</div>
            <div class="text-xs text-white/80">{{ myRank.name }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg font-bold">{{ myRank.xp.toLocaleString() }}</div>
          <div class="text-[10px] text-white/70">XP Points</div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-2">
      <div v-for="i in 5" :key="i" class="rounded-xl bg-white border border-slate-200 p-4 animate-pulse flex items-center gap-4">
        <div class="w-8 h-8 bg-slate-200 rounded-full"></div>
        <div class="flex-1"><div class="h-3 bg-slate-200 rounded w-1/3"></div></div>
        <div class="h-4 w-12 bg-slate-200 rounded"></div>
      </div>
    </div>

    <!-- Leaderboard Table -->
    <div v-else-if="leaderboard?.length" class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
      <div class="divide-y divide-slate-100">
        <div
          v-for="(user, index) in leaderboard"
          :key="user.id"
          :class="index < 3 ? 'bg-gradient-to-r from-amber-50/50 to-white' : ''"
          class="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors"
        >
          <!-- Rank -->
          <div class="w-8 text-center">
            <svg v-if="index === 0" class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            <svg v-else-if="index === 1" class="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            <svg v-else-if="index === 2" class="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            <span v-else class="text-sm font-bold text-slate-400">#{{ index + 1 }}</span>
          </div>

          <!-- Avatar & Name -->
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {{ user.name?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="min-w-0">
              <div class="text-xs font-semibold text-slate-900 truncate">{{ user.name }}</div>
              <div class="text-[10px] text-slate-500">
                {{ user.profile?.profession || user.role }}
                <span v-if="user.profile?.username" class="text-slate-400">@{{ user.profile.username }}</span>
              </div>
            </div>
          </div>

          <!-- Activity Stats -->
          <div class="hidden sm:flex items-center gap-3 text-[10px] text-slate-400">
            <span title="Posts" class="inline-flex items-center gap-0.5"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> {{ user.stats.posts }}</span>
            <span title="Comments" class="inline-flex items-center gap-0.5"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> {{ user.stats.comments }}</span>
            <span title="Challenges" class="inline-flex items-center gap-0.5"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> {{ user.stats.challenges }}</span>
          </div>

          <!-- XP -->
          <div class="text-right">
            <div class="text-sm font-bold text-primary-600">{{ user.xp.toLocaleString() }}</div>
            <div class="text-[10px] text-slate-400">XP</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
      </div>
      <h3 class="text-sm font-semibold text-slate-900 mb-1">No rankings yet</h3>
      <p class="text-xs text-slate-500">Start contributing to earn XP and climb the leaderboard!</p>
    </div>

    <!-- Badges Section -->
    <div class="mt-8">
      <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
        Badges &amp; Achievements
      </h2>

      <div v-if="badgesPending" class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="i in 4" :key="i" class="rounded-xl bg-white border border-slate-200 p-4 animate-pulse">
          <div class="w-10 h-10 bg-slate-200 rounded-full mx-auto mb-2"></div>
          <div class="h-3 bg-slate-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>

      <div v-else-if="badges?.length" class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          v-for="badge in badges"
          :key="badge.id"
          :class="badge.earned ? 'border-amber-200 bg-amber-50/50' : 'border-slate-200 bg-white opacity-60'"
          class="rounded-xl border p-4 text-center transition-all hover:shadow-sm"
        >
          <div class="text-2xl mb-2">{{ badge.icon }}</div>
          <div class="text-xs font-semibold text-slate-900 mb-0.5">{{ badge.name }}</div>
          <div class="text-[10px] text-slate-500 mb-1">{{ badge.description }}</div>
          <div v-if="badge.earned" class="text-[10px] text-amber-600 font-medium inline-flex items-center gap-0.5"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Earned</div>
          <div v-else class="text-[10px] text-slate-400">{{ badge.earnedCount }} users earned</div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-xs text-slate-500">No badges available yet.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'community' })
useHead({ title: 'Leaderboard - WeCode Community' })

const { data: leaderboardData, pending } = useFetch('/api/community/leaderboard')
const { data: badgesData, pending: badgesPending } = useFetch('/api/community/badges')

const leaderboard = computed(() => (leaderboardData.value as any)?.leaderboard || [])
const myRank = computed(() => (leaderboardData.value as any)?.myRank)
const badges = computed(() => (badgesData.value as any)?.badges || [])
</script>
