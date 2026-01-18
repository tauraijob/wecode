<template>
  <div class="p-4 max-w-2xl mx-auto">
    <div class="mb-5">
      <h1 class="text-lg font-bold text-slate-900">Account Settings</h1>
      <p class="text-xs text-slate-600">Manage your profile and preferences</p>
    </div>

    <!-- Profile Section -->
    <div class="rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden mb-4">
      <div class="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h2 class="text-sm font-semibold text-slate-900">Profile Information</h2>
        <NuxtLink 
          to="/community/profile" 
          class="text-xs text-primary-600 hover:underline font-medium"
        >
          Edit Full Profile →
        </NuxtLink>
      </div>
      <div class="p-4">
        <div class="flex items-start gap-4">
          <div class="relative flex-shrink-0">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-lg font-bold">
              {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
            </div>
          </div>
          <div class="flex-1 space-y-3">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input v-model="profile.name" type="text" class="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-slate-900 focus:border-primary-500 outline-none text-xs" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input v-model="profile.email" type="email" disabled class="w-full px-3 py-2 rounded-md bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed text-xs" />
              <p class="text-[10px] text-slate-400 mt-0.5">Email cannot be changed</p>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="updateProfile" :disabled="saving" class="px-4 py-1.5 rounded-md bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-xs font-medium">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Community Profile Section -->
    <div class="rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden mb-4">
      <div class="p-3 border-b border-slate-100 bg-gradient-to-r from-primary-50 to-white">
        <h2 class="text-sm font-semibold text-slate-900">My Community Profile</h2>
        <p class="text-[10px] text-slate-500">This is your public community identity</p>
      </div>
      <div class="p-4">
        <!-- Loading -->
        <div v-if="loadingCommunityProfile" class="animate-pulse space-y-3">
          <div class="h-8 bg-slate-200 rounded"></div>
          <div class="h-8 bg-slate-200 rounded"></div>
        </div>

        <!-- No Profile Yet -->
        <div v-else-if="!communityProfile" class="text-center py-4">
          <p class="text-xs text-slate-500 mb-3">You haven't created your developer profile yet.</p>
          <NuxtLink 
            to="/community/profile" 
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Profile
          </NuxtLink>
        </div>

        <!-- Profile Summary -->
        <div v-else class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="flex-1">
              <p class="text-[10px] text-slate-500">Username</p>
              <p class="text-sm font-medium text-slate-900">@{{ communityProfile.username }}</p>
            </div>
            <div class="flex-1">
              <p class="text-[10px] text-slate-500">Experience</p>
              <p class="text-sm font-medium text-slate-900">{{ experienceLevelLabel }}</p>
            </div>
          </div>
          <div v-if="communityProfile.profession">
            <p class="text-[10px] text-slate-500">Profession</p>
            <p class="text-sm font-medium text-slate-900">{{ communityProfile.profession }}</p>
          </div>
          <div v-if="communityProfile.languages">
            <p class="text-[10px] text-slate-500">Languages</p>
            <div class="flex flex-wrap gap-1 mt-1">
              <span
                v-for="lang in communityProfile.languages.split(',')"
                :key="lang"
                class="px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 text-[10px] font-medium"
              >
                {{ lang.trim() }}
              </span>
            </div>
          </div>
          <div class="pt-2">
            <NuxtLink 
              to="/community/profile" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit My Profile
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Mentor Profile Section (Only if User is a Mentor) -->
    <div v-if="user?.role === 'MENTOR'" class="rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden mb-4">
      <div class="p-3 border-b border-slate-100 bg-gradient-to-r from-primary-50 to-white flex items-center justify-between">
        <div>
          <h2 class="text-sm font-semibold text-slate-900 text-primary-700">Mentor Profile</h2>
          <p class="text-[10px] text-slate-500">Your professional mentorship settings</p>
        </div>
        <div v-if="mentorProfile?.verified" class="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[9px] font-bold uppercase tracking-wider">
          Verified
        </div>
      </div>
      <div class="p-4">
        <div v-if="loadingMentorProfile" class="animate-pulse h-8 bg-slate-200 rounded"></div>
        <div v-else-if="!mentorProfile" class="text-center py-2">
          <p class="text-xs text-slate-500">Loading mentor details...</p>
        </div>
        <div v-else class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-[10px] text-slate-500">Hourly Rate</p>
              <p class="text-sm font-medium text-slate-900">{{ mentorProfile.hourlyRate }} credits/hr</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-slate-500">Status</p>
              <p :class="mentorProfile.available ? 'text-primary-600' : 'text-slate-400'" class="text-sm font-medium">
                {{ mentorProfile.available ? 'Accepting Mentees' : 'Busy / Unavailable' }}
              </p>
            </div>
          </div>
          <div>
            <p class="text-[10px] text-slate-500">Expertise</p>
            <p class="text-sm font-medium text-slate-900 truncate">{{ mentorProfile.skills || 'No skills listed' }}</p>
          </div>
          <div class="pt-2">
            <NuxtLink 
              to="/mentor/profile" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-medium transition-colors border border-primary-100"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Mentor Details
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Credits Section -->
    <div class="rounded-lg bg-white border border-slate-200 shadow-sm overflow-hidden mb-4">
      <div class="p-3 border-b border-slate-100 bg-gradient-to-r from-primary-50 to-primary-100">
        <h2 class="text-sm font-semibold text-slate-900">Credits Balance</h2>
      </div>
      <div class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-2xl font-bold text-primary-600">{{ user?.credits || 0 }}</div>
            <p class="text-xs text-slate-500">Available credits</p>
          </div>
          <button @click="showTopUpModal = true" class="px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium">
            Top Up Credits
          </button>
        </div>
      </div>
    </div>

    <!-- Become a Mentor -->
    <div v-if="user?.role === 'INDIVIDUAL'" class="rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 shadow-sm overflow-hidden mb-4">
      <div class="p-4">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-md bg-primary-100">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-slate-900">Become a Mentor</h3>
            <p class="text-xs text-slate-600 mt-0.5">Share your expertise and earn credits</p>
            <button class="mt-2 px-3 py-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium">Apply Now</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="rounded-lg bg-white border border-red-200 shadow-sm overflow-hidden">
      <div class="p-3 border-b border-red-100 bg-red-50">
        <h2 class="text-sm font-semibold text-red-700">Danger Zone</h2>
      </div>
      <div class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xs font-medium text-slate-900">Delete Account</h3>
            <p class="text-[10px] text-slate-500">Permanently delete your account</p>
          </div>
          <button class="px-3 py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50 text-xs font-medium">Delete</button>
        </div>
      </div>
    </div>

    <TopUpModal v-model="showTopUpModal" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'community', middleware: ['auth'] })

interface CommunityProfileData {
  username: string
  profession: string | null
  experienceLevel: string
  languages: string | null
  bio: string | null
  location: string | null
}

const { user, refresh: refreshAuth } = useAuth()
const { success, error } = useToast()
const showTopUpModal = ref(false)
const saving = ref(false)
const loadingCommunityProfile = ref(true)
const communityProfile = ref<CommunityProfileData | null>(null)
const mentorProfile = ref<any>(null)
const loadingMentorProfile = ref(true)

const profile = reactive({ name: user.value?.name || '', email: user.value?.email || '' })

watch(() => user.value, (newUser) => {
  if (newUser) {
    profile.name = newUser.name || ''
    profile.email = newUser.email || ''
  }
}, { immediate: true })

const experienceLevelLabel = computed(() => {
  const levels: Record<string, string> = {
    BEGINNER: '🌱 Beginner',
    INTERMEDIATE: '🌿 Intermediate',
    ADVANCED: '🌳 Advanced',
    EXPERT: '🏆 Expert'
  }
  return levels[communityProfile.value?.experienceLevel || 'BEGINNER'] || 'Beginner'
})

// Load profiles
onMounted(async () => {
  // Community profile
  try {
    const result = await $fetch<{ profile: CommunityProfileData | null }>('/api/community/profile')
    communityProfile.value = result.profile
  } catch (err) { } 
  finally { loadingCommunityProfile.value = false }

  // Mentor profile (if mentor)
  if (user.value?.role === 'MENTOR') {
    try {
      const result = await $fetch<any>('/api/community/mentors/me')
      mentorProfile.value = result
    } catch (err) { }
    finally { loadingMentorProfile.value = false }
  } else {
    loadingMentorProfile.value = false
  }
})

const updateProfile = async () => {
  if (!profile.name.trim()) return
  saving.value = true
  try {
    await $fetch('/api/auth/profile', { method: 'PATCH', body: { name: profile.name } })
    refreshAuth()
    success('Profile updated!')
  } catch (err: any) {
    error(err.data?.message || 'Failed to update profile')
  } finally {
    saving.value = false
  }
}
</script>
