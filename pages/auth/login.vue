<template>
  <section class="mx-auto max-w-md px-3 sm:px-4 py-16">
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Sign In
      </h1>
      <p class="mt-2 text-navy-300">Welcome back to WeCodeZW</p>
    </div>

    <div class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-8 shadow-xl">
      <!-- Error Message -->
      <div v-if="error" class="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
        <p class="text-sm text-red-300">{{ error }}</p>
        <button
          v-if="showResendVerification"
          @click="resendVerification"
          :disabled="resending"
          class="mt-3 text-sm text-blue-400 hover:text-blue-300 underline disabled:opacity-50"
        >
          {{ resending ? 'Sending...' : 'Resend verification email' }}
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-5">
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
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        <div class="text-center">
          <NuxtLink to="/auth/forgot-password" class="text-sm text-blue-400 hover:text-blue-300 underline">
            Forgot your password?
          </NuxtLink>
        </div>
        <div class="text-center text-sm text-navy-300">
          No account? <NuxtLink to="/auth/register" class="text-blue-400 hover:text-blue-300 underline">Create one</NuxtLink>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const showResendVerification = ref(false)
const resending = ref(false)

async function onSubmit() {
  try {
    loading.value = true
    error.value = null
    showResendVerification.value = false
    
    const me = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    
    // Trigger auth refresh event to update header
    if (process.client) {
      window.dispatchEvent(new Event('auth:login'))
      // Small delay to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Navigate to appropriate dashboard
    if (me && me.role === 'ADMIN') {
      await navigateTo('/admin')
    } else {
      await navigateTo('/dashboard')
    }
  } catch (err: any) {
    const errorMessage = err.data?.message || 'Login failed'
    error.value = errorMessage
    
    // Show resend verification option if email not verified
    if (errorMessage.includes('verify your email') || errorMessage.includes('verification')) {
      showResendVerification.value = true
    }
  } finally {
    loading.value = false
  }
}

async function resendVerification() {
  if (!email.value) {
    alert('Please enter your email address first')
    return
  }
  
  try {
    resending.value = true
    const result = await $fetch('/api/auth/resend-verification', {
      method: 'POST',
      body: { email: email.value }
    })
    alert(result.message || 'Verification email sent! Please check your inbox.')
    showResendVerification.value = false
  } catch (err: any) {
    alert(err.data?.message || 'Failed to resend verification email')
  } finally {
    resending.value = false
  }
}
</script>
