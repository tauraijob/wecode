<template>
  <section class="min-h-screen bg-cream-50 py-16">
    <div class="mx-auto max-w-md px-4 sm:px-6">
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">
          Create Account
        </h1>
        <p class="mt-2 text-gray-600">Join WeCodeZW to access training and services</p>
      </div>

      <div class="rounded-2xl bg-white border border-cream-200 p-8 shadow-card">
        <!-- Verification Message -->
        <div v-if="showVerificationMessage" class="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-6 text-center">
          <div class="mb-4">
            <svg class="mx-auto h-12 w-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
          <p class="text-sm text-gray-600 mb-2">
            We've sent a verification link to <strong class="text-gray-900">{{ registeredEmail }}</strong>
          </p>
          <p class="text-xs text-gray-500 mb-4">
            Click the link in the email to verify your account and start using WeCodeZW.
          </p>
          <div class="flex gap-3 justify-center">
            <NuxtLink
              to="/auth/login"
              class="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 text-sm font-medium text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-md"
            >
              Go to Login
            </NuxtLink>
            <button
              @click="showVerificationMessage = false"
              class="rounded-lg border border-cream-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-cream-50 transition-all"
            >
              Register Another
            </button>
          </div>
        </div>

        <form v-else @submit.prevent="onSubmit" class="space-y-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Full name</label>
            <input
              v-model="name"
              type="text"
              required
              placeholder="Jane Doe"
              class="w-full rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
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
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">I am a</label>
            <select
              v-model="role"
              class="w-full rounded-lg border border-cream-300 bg-white px-4 py-2.5 text-gray-900 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="INDIVIDUAL">Individual / Student</option>
              <option value="CORPORATE">Corporate</option>
              <option value="STUDENT">E-Learning Student</option>
              <option value="INSTRUCTOR">Instructor (Create & Sell Courses)</option>
            </select>
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-3 text-sm font-semibold text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
          <div class="text-center text-sm text-gray-600">
            Have an account? <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2">Sign in</NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref<'INDIVIDUAL'|'STUDENT'|'CORPORATE'|'INSTRUCTOR'>('INDIVIDUAL')
const loading = ref(false)

const showVerificationMessage = ref(false)
const registeredEmail = ref('')

async function onSubmit() {
  try {
    loading.value = true
    const result = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name: name.value, email: email.value, password: password.value, role: role.value }
    })
    registeredEmail.value = email.value
    showVerificationMessage.value = true
    name.value = ''
    email.value = ''
    password.value = ''
    role.value = 'INDIVIDUAL'
  } catch (error: any) {
    alert(error.data?.message || 'Registration failed')
  } finally {
    loading.value = false
  }
}
</script>
