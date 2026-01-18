<template>
  <div class="min-h-screen bg-slate-50">
    <section class="mx-auto max-w-2xl px-4 py-6">
      <!-- Loading -->
      <div v-if="pending" class="animate-pulse">
        <div class="h-32 bg-slate-200 rounded-xl mb-4"></div>
        <div class="h-48 bg-slate-200 rounded-xl"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="p-8 rounded-xl bg-white border border-slate-200 text-center">
        <h3 class="text-sm font-semibold text-slate-900 mb-2">Profile Not Found</h3>
        <p class="text-xs text-slate-500 mb-4">This user doesn't exist or their profile is private.</p>
        <NuxtLink to="/community" class="text-primary-600 hover:underline text-xs">Back to Community</NuxtLink>
      </div>

      <!-- Profile -->
      <div v-else-if="profile">
        <!-- Header Card -->
        <div class="p-6 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white mb-5 relative overflow-hidden">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          <div class="relative flex items-start gap-4">
            <!-- Avatar -->
            <div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-4 border-white/30">
              {{ getInitials(profile.user.name) }}
            </div>
            
            <div class="flex-1">
              <h1 class="text-xl font-bold">{{ profile.user.name }}</h1>
              <p class="text-white/80 text-sm">@{{ profile.username }}</p>
              <div class="flex items-center gap-2 mt-2 flex-wrap">
                <span class="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium">
                  {{ experienceLevelLabel }}
                </span>
                <span v-if="profile.profession" class="text-xs text-white/80">
                  {{ profile.profession }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-3 mb-5">
          <div class="p-3 rounded-lg bg-white border border-slate-200 text-center">
            <div class="text-lg font-bold text-primary-600">{{ profile.user.stats.posts }}</div>
            <div class="text-[10px] text-slate-500">Posts</div>
          </div>
          <div class="p-3 rounded-lg bg-white border border-slate-200 text-center">
            <div class="text-lg font-bold text-primary-600">{{ profile.user.stats.comments }}</div>
            <div class="text-[10px] text-slate-500">Comments</div>
          </div>
          <div class="p-3 rounded-lg bg-white border border-slate-200 text-center">
            <div class="text-lg font-bold text-primary-600">{{ memberSince }}</div>
            <div class="text-[10px] text-slate-500">Member Since</div>
          </div>
        </div>

        <!-- Details -->
        <div class="space-y-4">
          <!-- Bio -->
          <div v-if="profile.bio" class="p-4 rounded-xl bg-white border border-slate-200">
            <h2 class="text-xs font-semibold text-slate-800 mb-2">About</h2>
            <p class="text-sm text-slate-600 leading-relaxed">{{ profile.bio }}</p>
          </div>

          <!-- Languages -->
          <div v-if="profile.languages?.length" class="p-4 rounded-xl bg-white border border-slate-200">
            <h2 class="text-xs font-semibold text-slate-800 mb-2">Programming Languages</h2>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="lang in profile.languages"
                :key="lang"
                class="px-2 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-medium"
              >
                {{ lang }}
              </span>
            </div>
          </div>

          <!-- Location -->
          <div v-if="profile.location" class="p-4 rounded-xl bg-white border border-slate-200">
            <h2 class="text-xs font-semibold text-slate-800 mb-2">Location</h2>
            <div class="flex items-center gap-2 text-sm text-slate-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ profile.location }}
            </div>
          </div>

          <!-- Social Links -->
          <div v-if="profile.githubUrl || profile.linkedinUrl || profile.websiteUrl" class="p-4 rounded-xl bg-white border border-slate-200">
            <h2 class="text-xs font-semibold text-slate-800 mb-3">Links</h2>
            <div class="flex flex-wrap gap-2">
              <a
                v-if="profile.githubUrl"
                :href="profile.githubUrl"
                target="_blank"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs hover:bg-slate-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
              <a
                v-if="profile.linkedinUrl"
                :href="profile.linkedinUrl"
                target="_blank"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077B5] text-white text-xs hover:opacity-90 transition-opacity"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
              </a>
              <a
                v-if="profile.websiteUrl"
                :href="profile.websiteUrl"
                target="_blank"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs hover:bg-primary-600 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'community' })

const route = useRoute()

interface PublicProfile {
  username: string
  profession: string | null
  experienceLevel: string
  languages: string[]
  bio: string | null
  location: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  websiteUrl: string | null
  avatarUrl: string | null
  user: {
    id: string
    name: string
    role: string
    joinedAt: string
    stats: {
      posts: number
      comments: number
    }
  }
}

const { data: profile, pending, error } = useFetch<PublicProfile>(`/api/community/profile/${route.params.username}`)

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

const experienceLevelLabel = computed(() => {
  const levels: Record<string, string> = {
    BEGINNER: '🌱 Beginner',
    INTERMEDIATE: '🌿 Intermediate',
    ADVANCED: '🌳 Advanced',
    EXPERT: '🏆 Expert'
  }
  return levels[profile.value?.experienceLevel || 'BEGINNER'] || 'Beginner'
})

const memberSince = computed(() => {
  if (!profile.value?.user.joinedAt) return 'N/A'
  const date = new Date(profile.value.user.joinedAt)
  return date.getFullYear().toString()
})
</script>
