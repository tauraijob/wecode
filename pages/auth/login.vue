<template>
  <section class="min-h-screen bg-cream-50 py-16">
    <div class="mx-auto max-w-md px-4 sm:px-6">
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">
          Sign In
        </h1>
        <p class="mt-2 text-gray-600">Welcome back to WeCodeZW</p>
      </div>

      <div class="rounded-2xl bg-white border border-cream-200 p-8 shadow-card">
        <!-- Error Message -->
        <div v-if="error" class="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <p class="text-sm text-red-600">{{ error }}</p>
          <button
            v-if="showResendVerification"
            @click="resendVerification"
            :disabled="resending"
            class="mt-3 text-sm text-primary-600 hover:text-primary-700 underline disabled:opacity-50"
          >
            {{ resending ? 'Sending...' : 'Resend verification email' }}
          </button>
        </div>

        <form @submit.prevent="onSubmit" class="space-y-5">
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
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Password</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-3 text-sm font-semibold text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
          <div class="text-center">
            <NuxtLink to="/auth/forgot-password" class="text-sm text-primary-600 hover:text-primary-700 underline underline-offset-2">
              Forgot your password?
            </NuxtLink>
          </div>
          <div class="text-center text-sm text-gray-600">
            No account? <NuxtLink to="/auth/register" class="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2">Create one</NuxtLink>
          </div>
        </form>
      </div>
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
    
    if (process.client) {
      window.dispatchEvent(new Event('auth:login'))
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    if (me && me.role === 'ADMIN') {
      await navigateTo('/admin')
    } else {
      await navigateTo('/dashboard')
    }
  } catch (err: any) {
    const errorMessage = err.data?.message || 'Login failed'
    error.value = errorMessage
    
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
