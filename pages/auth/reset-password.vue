<template>
  <section class="min-h-screen bg-cream-50 py-16">
    <div class="mx-auto max-w-md px-4 sm:px-6">
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">
          Reset Password
        </h1>
        <p v-if="validToken && userEmail" class="mt-2 text-gray-600">
          Reset password for {{ userEmail }}
        </p>
        <p v-else class="mt-2 text-gray-600">Enter your new password</p>
      </div>

      <div class="rounded-2xl bg-white border border-cream-200 p-8 shadow-card">
        <!-- Error Message -->
        <div v-if="error" class="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <p class="text-sm text-red-600">{{ error }}</p>
          <NuxtLink
            v-if="error.includes('expired') || error.includes('Invalid')"
            to="/auth/forgot-password"
            class="mt-3 inline-block text-sm text-primary-600 hover:text-primary-700 underline underline-offset-2"
          >
            Request a new reset link
          </NuxtLink>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mb-5 rounded-lg border border-green-200 bg-green-50 p-4">
          <p class="text-sm text-green-600">{{ success }}</p>
          <NuxtLink
            to="/auth/login"
            class="mt-3 inline-block rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-3 text-sm font-semibold text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
          >
            Go to Sign In
          </NuxtLink>
        </div>

        <form v-if="validToken && !success" @submit.prevent="onSubmit" class="space-y-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">New Password</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              placeholder="••••••••"
              class="w-full rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <p class="mt-1 text-xs text-gray-500">Password must be at least 6 characters</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              placeholder="••••••••"
              class="w-full rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div v-if="passwordMismatch" class="rounded-lg border border-red-200 bg-red-50 p-3">
            <p class="text-sm text-red-600">Passwords do not match</p>
          </div>
          <button
            type="submit"
            :disabled="loading || passwordMismatch"
            class="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-3 text-sm font-semibold text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const toast = useToast()
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
    toast.error(error.value)
  }
})

async function onSubmit() {
  if (passwordMismatch.value) {
    error.value = 'Passwords do not match'
    toast.error('Passwords do not match')
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
    toast.success('Password reset successfully!')
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to reset password. Please try again.'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>
