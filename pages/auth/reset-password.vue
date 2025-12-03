<template>
  <section class="mx-auto max-w-md px-3 sm:px-4 py-16">
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Reset Password
      </h1>
      <p v-if="validToken && userEmail" class="mt-2 text-navy-300">
        Reset password for {{ userEmail }}
      </p>
      <p v-else class="mt-2 text-navy-300">Enter your new password</p>
    </div>

    <div class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-8 shadow-xl">
      <!-- Error Message -->
      <div v-if="error" class="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
        <p class="text-sm text-red-300">{{ error }}</p>
        <NuxtLink
          v-if="error.includes('expired') || error.includes('Invalid')"
          to="/auth/forgot-password"
          class="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300 underline"
        >
          Request a new reset link
        </NuxtLink>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
        <p class="text-sm text-green-300">{{ success }}</p>
        <NuxtLink
          to="/auth/login"
          class="mt-3 inline-block rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all"
        >
          Go to Sign In
        </NuxtLink>
      </div>

      <form v-if="validToken && !success" @submit.prevent="onSubmit" class="space-y-5">
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">New Password</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            placeholder="••••••••"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
          <p class="mt-1 text-xs text-navy-400">Password must be at least 6 characters</p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            minlength="6"
            placeholder="••••••••"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
        </div>
        <div v-if="passwordMismatch" class="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p class="text-sm text-red-300">Passwords do not match</p>
        </div>
        <button
          type="submit"
          :disabled="loading || passwordMismatch"
          class="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const token = ref(route.query.token as string || '')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const validToken = ref(false)
const userEmail = ref<string | null>(null)

const passwordMismatch = computed(() => {
  return password.value && confirmPassword.value && password.value !== confirmPassword.value
})

onMounted(async () => {
  if (!token.value) {
    error.value = 'Reset token is required'
    return
  }

  try {
    const result = await $fetch('/api/auth/reset-password', {
      method: 'GET',
      query: { token: token.value }
    })
    
    validToken.value = result.valid
    userEmail.value = result.email
  } catch (err: any) {
    error.value = err.data?.message || 'Invalid or expired reset token'
  }
})

async function onSubmit() {
  if (passwordMismatch.value) {
    error.value = 'Passwords do not match'
    return
  }

  try {
    loading.value = true
    error.value = null
    
    const result = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { 
        token: token.value,
        password: password.value
      }
    })
    
    success.value = result.message || 'Password has been reset successfully!'
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to reset password. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

