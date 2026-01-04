<template>
  <section class="mx-auto max-w-md px-3 sm:px-4 py-16">
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Forgot Password
      </h1>
      <p class="mt-2 text-navy-300">Enter your email to receive a password reset link</p>
    </div>

    <div class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-8 shadow-xl">
      <!-- Success Message -->
      <div v-if="success" class="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
        <p class="text-sm text-green-300">{{ success }}</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
        <p class="text-sm text-red-300">{{ error }}</p>
      </div>

      <form v-if="!success" @submit.prevent="onSubmit" class="space-y-5">
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="[email protected]"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
        <div class="text-center text-sm text-navy-300">
          Remember your password? <NuxtLink to="/auth/login" class="text-blue-400 hover:text-blue-300 underline">Sign in</NuxtLink>
        </div>
      </form>

      <div v-else class="text-center">
        <NuxtLink
          to="/auth/login"
          class="inline-block rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
        >
          Back to Sign In
        </NuxtLink>
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
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to send reset link. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>



