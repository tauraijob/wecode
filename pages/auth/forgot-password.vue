<template>
  <section class="min-h-screen bg-cream-50 py-16">
    <div class="mx-auto max-w-md px-4 sm:px-6">
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">
          Forgot Password
        </h1>
        <p class="mt-2 text-gray-600">Enter your email to receive a password reset link</p>
      </div>

      <div class="rounded-2xl bg-white border border-cream-200 p-8 shadow-card">
        <!-- Success Message -->
        <div v-if="success" class="mb-5 rounded-lg border border-green-200 bg-green-50 p-4">
          <p class="text-sm text-green-600">{{ success }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <form v-if="!success" @submit.prevent="onSubmit" class="space-y-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="[email protected]"
              class="w-full rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-3 text-sm font-semibold text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>
          <div class="text-center text-sm text-gray-600">
            Remember your password? <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2">Sign in</NuxtLink>
          </div>
        </form>

        <div v-else class="text-center">
          <NuxtLink
            to="/auth/login"
            class="inline-block rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-3 text-sm font-semibold text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
          >
            Back to Sign In
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const toast = useToast()

async function onSubmit() {
  try {
    loading.value = true
    error.value = null
    success.value = null
    
    const result = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    
    success.value = result.message || 'Password reset link has been sent to your email!'
    toast.success('Reset link sent! Check your email.')
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to send reset link. Please try again.'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>
