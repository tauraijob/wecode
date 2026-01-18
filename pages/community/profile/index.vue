<template>
  <div class="min-h-screen bg-slate-50">
    <section class="mx-auto max-w-2xl px-4 py-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-lg font-bold text-slate-900">My Profile</h1>
          <p class="text-xs text-slate-500">Manage your community profile</p>
        </div>
        <NuxtLink
          v-if="profile?.username"
          :to="`/community/profile/${profile.username}`"
          class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
        >
          View Public Profile
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="animate-pulse space-y-4">
        <div class="h-32 bg-slate-200 rounded-xl"></div>
        <div class="h-64 bg-slate-200 rounded-xl"></div>
      </div>

      <!-- Profile Form (Always show, create or edit) -->
      <form v-else @submit.prevent="saveProfile" class="space-y-5">
        <!-- Avatar Selection -->
        <div class="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-800 mb-4">Choose Your Avatar</h2>
          
          <div class="flex items-center gap-4 mb-4">
            <!-- Current Avatar -->
            <div class="relative">
              <div 
                v-if="form.avatarUrl"
                class="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-200"
              >
                <img :src="form.avatarUrl" class="w-full h-full object-cover" alt="Avatar" />
              </div>
              <div 
                v-else
                class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-primary-200"
              >
                {{ getInitials(userData?.name || 'U') }}
              </div>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-900">{{ userData?.name }}</p>
              <p class="text-xs text-slate-500">{{ userData?.email }}</p>
              <p v-if="form.username" class="text-[10px] text-primary-500 mt-1">@{{ form.username }}</p>
            </div>
          </div>

          <!-- Avatar Options -->
          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="(avatar, index) in avatarOptions"
              :key="index"
              type="button"
              @click="form.avatarUrl = avatar"
              class="relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all"
              :class="form.avatarUrl === avatar ? 'border-primary-500 ring-2 ring-primary-200' : 'border-slate-200 hover:border-slate-300'"
            >
              <img :src="avatar" class="w-full h-full object-cover" alt="Avatar option" />
            </button>
            <!-- No Avatar Option -->
            <button
              type="button"
              @click="form.avatarUrl = ''"
              class="w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center"
              :class="!form.avatarUrl ? 'border-primary-500 ring-2 ring-primary-200 bg-primary-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'"
            >
              <span class="text-xs text-slate-500">None</span>
            </button>
          </div>
        </div>

        <!-- Basic Info -->
        <div class="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-800 mb-4">Basic Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Username -->
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Username *</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                <input
                  v-model="form.username"
                  type="text"
                  required
                  minlength="3"
                  pattern="[a-zA-Z0-9_]+"
                  class="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-primary-400 outline-none"
                  placeholder="your_username"
                />
              </div>
            </div>

            <!-- Profession -->
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Profession / Role</label>
              <input
                v-model="form.profession"
                type="text"
                class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-primary-400 outline-none"
                placeholder="Developer, Student, Designer, etc."
              />
            </div>

            <!-- Experience Level -->
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Experience Level</label>
              <select
                v-model="form.experienceLevel"
                class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-primary-400 outline-none"
              >
                <option value="BEGINNER">🌱 Beginner</option>
                <option value="INTERMEDIATE">🌿 Intermediate</option>
                <option value="ADVANCED">🌳 Advanced</option>
                <option value="EXPERT">🏆 Expert</option>
              </select>
            </div>

            <!-- Location -->
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Location</label>
              <input
                v-model="form.location"
                type="text"
                class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-primary-400 outline-none"
                placeholder="Harare, Zimbabwe"
              />
            </div>
          </div>
        </div>

        <!-- Skills & Bio -->
        <div class="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-800 mb-4">About You</h2>
          
          <!-- Languages/Skills -->
          <div class="mb-4">
            <label class="block text-xs font-medium text-slate-700 mb-1">Skills / Languages (optional)</label>
            <input
              v-model="form.languages"
              type="text"
              class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-primary-400 outline-none"
              placeholder="JavaScript, Python, Design, Marketing"
            />
            <p class="text-[10px] text-slate-400 mt-1">Separate with commas</p>
          </div>

          <!-- Bio -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Bio</label>
            <textarea
              v-model="form.bio"
              rows="3"
              class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-primary-400 outline-none resize-none"
              placeholder="Share a bit about yourself, your interests, hobbies, or what you're working on..."
            ></textarea>
          </div>
        </div>

        <!-- Social Links -->
        <div class="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-800 mb-4">Social Links (optional)</h2>
          
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">GitHub</label>
              <input
                v-model="form.githubUrl"
                type="url"
                class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-primary-400 outline-none"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">LinkedIn</label>
              <input
                v-model="form.linkedinUrl"
                type="url"
                class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-primary-400 outline-none"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Website</label>
              <input
                v-model="form.websiteUrl"
                type="url"
                class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-primary-400 outline-none"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-200">
          <p class="text-red-600 text-xs">{{ error }}</p>
        </div>
        <div v-if="success" class="p-3 rounded-lg bg-green-50 border border-green-200">
          <p class="text-green-600 text-xs">{{ success }}</p>
        </div>

        <!-- Save Button -->
        <button
          type="submit"
          :disabled="saving"
          class="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-primary-500/20"
        >
          {{ saving ? 'Saving...' : (profile ? 'Save Profile' : 'Create Profile') }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'community', middleware: ['auth'] })

const { user } = useAuth()

interface ProfileData {
  username: string
  profession: string | null
  experienceLevel: string
  languages: string | null
  bio: string | null
  location: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  websiteUrl: string | null
  avatarUrl: string | null
}

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const success = ref('')
const profile = ref<ProfileData | null>(null)
const userData = ref<any>(null)

// Avatar options - using DiceBear API for diverse avatars
const avatarOptions = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ada',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Kira'
]

const form = reactive({
  username: '',
  profession: '',
  experienceLevel: 'BEGINNER',
  languages: '',
  bio: '',
  location: '',
  githubUrl: '',
  linkedinUrl: '',
  websiteUrl: '',
  avatarUrl: ''
})

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

// Fetch profile on mount
onMounted(async () => {
  try {
    const result = await $fetch<any>('/api/community/profile')
    userData.value = result
    if (result.profile) {
      profile.value = result.profile
      // Populate form
      form.username = result.profile.username || ''
      form.profession = result.profile.profession || ''
      form.experienceLevel = result.profile.experienceLevel || 'BEGINNER'
      form.languages = result.profile.languages || ''
      form.bio = result.profile.bio || ''
      form.location = result.profile.location || ''
      form.githubUrl = result.profile.githubUrl || ''
      form.linkedinUrl = result.profile.linkedinUrl || ''
      form.websiteUrl = result.profile.websiteUrl || ''
      form.avatarUrl = result.profile.avatarUrl || ''
    } else {
      // Generate default username from name
      if (result.name) {
        form.username = result.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
      }
    }
  } catch (err) {
    console.error('Failed to load profile:', err)
  } finally {
    loading.value = false
  }
})

const saveProfile = async () => {
  error.value = ''
  success.value = ''
  
  if (!form.username || form.username.length < 3) {
    error.value = 'Username must be at least 3 characters'
    return
  }

  saving.value = true

  try {
    const result = await $fetch<{ profile: ProfileData }>('/api/community/profile', {
      method: 'PUT',
      body: form
    })
    profile.value = result.profile
    success.value = profile.value ? 'Profile saved successfully!' : 'Profile created successfully!'
    setTimeout(() => success.value = '', 3000)
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to save profile'
  } finally {
    saving.value = false
  }
}
</script>
