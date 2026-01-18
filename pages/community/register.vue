<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#1e293b" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo/Header -->
      <div class="text-center mb-6">
        <NuxtLink to="/" class="inline-block">
          <div v-if="logoUrl" class="flex justify-center mb-3">
            <img :src="logoUrl" alt="WeCode" class="h-12 w-auto" />
          </div>
          <div v-else class="flex items-center justify-center gap-2 mb-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              W
            </div>
            <span class="text-2xl font-bold text-slate-800">WeCode</span>
          </div>
        </NuxtLink>
        <h2 class="text-lg font-semibold text-slate-800">Join the Community</h2>
        <p class="text-sm text-slate-500 mt-1">Connect with developers, get mentored, level up your skills</p>
      </div>

      <!-- Registration Form -->
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div class="p-5 border-b border-slate-100 bg-gradient-to-r from-primary-500 to-primary-600">
          <h2 class="text-base font-bold text-white">Create Your Account</h2>
          <p class="text-xs text-white/80 mt-0.5">It's free and takes less than a minute</p>
        </div>

        <form @submit.prevent="register" class="p-5 space-y-3.5">
          <!-- Two columns for Name and Username -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <!-- Username -->
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Username *</label>
              <div class="relative">
                <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                <input
                  v-model="form.username"
                  type="text"
                  required
                  minlength="3"
                  pattern="[a-zA-Z0-9_]+"
                  class="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all"
                  placeholder="johndoe"
                />
              </div>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Password *</label>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all"
              placeholder="••••••••"
            />
            <p class="text-[10px] text-slate-500 mt-0.5">At least 6 characters</p>
          </div>

          <!-- Experience Level and Profession -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Experience</label>
              <select
                v-model="form.experienceLevel"
                class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all"
              >
                <option value="BEGINNER">🌱 Beginner</option>
                <option value="INTERMEDIATE">🌿 Intermediate</option>
                <option value="ADVANCED">🌳 Advanced</option>
                <option value="EXPERT">🏆 Expert</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Profession</label>
              <input
                v-model="form.profession"
                type="text"
                class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all"
                placeholder="Developer, Student..."
              />
            </div>
          </div>

          <!-- Skills -->
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Skills (Optional)</label>
            <input
              v-model="form.languages"
              type="text"
              class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all"
              placeholder="JavaScript, Python, Design..."
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 rounded-lg bg-red-50 border border-red-200">
            <p class="text-red-600 text-xs">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg"
          >
            {{ loading ? 'Creating Account...' : 'Join Community' }}
          </button>
        </form>

        <!-- Footer -->
        <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 text-center">
          <p class="text-xs text-slate-600">
            Already have an account? 
            <NuxtLink to="/auth/login?redirect=/community" class="text-primary-600 hover:text-primary-500 font-medium">Sign in</NuxtLink>
          </p>
        </div>
      </div>

      <!-- Benefits -->
      <div class="mt-5 grid grid-cols-3 gap-2">
        <div class="p-3 rounded-xl bg-white shadow-sm border border-slate-100 text-center">
          <div class="text-xl mb-1">💬</div>
          <p class="text-[10px] text-slate-600 font-medium">Forum & Q&A</p>
        </div>
        <div class="p-3 rounded-xl bg-white shadow-sm border border-slate-100 text-center">
          <div class="text-xl mb-1">🤖</div>
          <p class="text-[10px] text-slate-600 font-medium">AI Assistant</p>
        </div>
        <div class="p-3 rounded-xl bg-white shadow-sm border border-slate-100 text-center">
          <div class="text-xl mb-1">👨‍🏫</div>
          <p class="text-[10px] text-slate-600 font-medium">1:1 Mentoring</p>
        </div>
      </div>

      <!-- Back Link -->
      <div class="mt-4 text-center">
        <NuxtLink to="/community" class="text-xs text-slate-500 hover:text-slate-700 transition-colors">
          ← Back to Forum
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const router = useRouter()
const { refresh } = useAuth()
const { logoUrl } = useLogo()

const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  profession: '',
  experienceLevel: 'BEGINNER',
  languages: ''
})

const loading = ref(false)
const error = ref('')

const register = async () => {
  error.value = ''
  loading.value = true

  try {
    await $fetch('/api/community/auth/register', {
      method: 'POST',
      body: form
    })

    // Refresh auth state
    await refresh()
    
    // Redirect to community
    router.push('/community')
  } catch (err: any) {
    error.value = err.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
