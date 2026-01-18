<template>
  <div class="p-6 max-w-3xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Mentor Profile</h1>
        <p class="text-slate-600">Update your public mentorship details</p>
      </div>
      <NuxtLink 
        to="/mentor" 
        class="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </NuxtLink>
    </div>

    <!-- Alert for non-verified mentors -->
    <div v-if="profile && !profile.verified" class="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
      <div class="p-2 rounded-lg bg-amber-100">
        <svg class="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <h4 class="text-sm font-bold text-amber-900">Profile Pending Verification</h4>
        <p class="text-xs text-amber-700 mt-1">Your profile is currently waiting for admin approval. You can still update your details in the meantime.</p>
      </div>
    </div>

    <!-- Edit Form -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div v-if="pending" class="p-12 text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-50 border-r-transparent"></div>
        <p class="mt-4 text-slate-500">Loading profile...</p>
      </div>

      <form v-else @submit.prevent="updateProfile" class="p-6 space-y-6">
        <!-- Bio -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">Professional Bio</label>
          <textarea
            v-model="form.bio"
            rows="4"
            class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none"
            placeholder="Tell potential mentees about your experience and how you can help them..."
            required
          ></textarea>
          <p class="mt-2 text-xs text-slate-500">This will be displayed on your public mentor card.</p>
        </div>

        <!-- Skills -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">Skills & Expertise</label>
          <input
            v-model="form.skills"
            type="text"
            class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            placeholder="e.g. React, Node.js, Project Management, UI/UX"
            required
          />
          <p class="mt-2 text-xs text-slate-500">Separate skills with commas.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Hourly Rate -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">Hourly Rate (Credits)</label>
            <div class="relative">
              <input
                v-model.number="form.hourlyRate"
                type="number"
                min="0"
                step="10"
                class="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                required
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">c/hr</span>
            </div>
          </div>

          <!-- Availability Toggle -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-4">Availability</label>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.available" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              <span class="ml-3 text-sm font-medium text-slate-700">{{ form.available ? 'Accepting new mentees' : 'Not accepting new mentees' }}</span>
            </label>
          </div>
        </div>

        <!-- Success/Error Message -->
        <div v-if="statusMessage" :class="statusType === 'success' ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-red-50 text-red-700 border-red-200'" class="p-4 rounded-xl border text-sm flex items-center gap-3">
          <svg v-if="statusType === 'success'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {{ statusMessage }}
        </div>

        <!-- Submit -->
        <div class="flex items-center gap-4 pt-4 border-t border-slate-100">
          <button
            type="submit"
            :disabled="saving"
            class="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
          >
            <span v-if="saving" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
            {{ saving ? 'Saving Changes...' : 'Update Mentor Profile' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community',
  middleware: ['auth']
})

const { data: profile, pending, refresh } = useFetch('/api/community/mentors/me')

const form = reactive({
  bio: '',
  skills: '',
  hourlyRate: 50,
  available: true
})

// Update form when data is loaded
watch(profile, (newVal) => {
  if (newVal) {
    form.bio = newVal.bio || ''
    form.skills = newVal.skills || ''
    form.hourlyRate = newVal.hourlyRate || 50
    form.available = newVal.available ?? true
  }
}, { immediate: true })

const saving = ref(false)
const statusMessage = ref('')
const statusType = ref('success')

const updateProfile = async () => {
  saving.value = true
  statusMessage.value = ''
  
  try {
    await $fetch('/api/community/mentors/me', {
      method: 'PUT',
      body: form
    })
    
    statusMessage.value = 'Profile updated successfully!'
    statusType.value = 'success'
    await refresh()
  } catch (err: any) {
    statusMessage.value = err.data?.message || 'Failed to update profile. Please try again.'
    statusType.value = 'error'
  } finally {
    saving.value = false
    // Hide status after 5 seconds if success
    if (statusType.value === 'success') {
      setTimeout(() => {
        statusMessage.value = ''
      }, 5000)
    }
  }
}
</script>
