<template>
  <section class="mx-auto max-w-md px-3 sm:px-4 py-16">
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Create Account
      </h1>
      <p class="mt-2 text-navy-300">Join WeCodeZW to access training and services</p>
    </div>

    <div class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-8 shadow-xl">
      <!-- Verification Message -->
      <div v-if="showVerificationMessage" class="mb-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-6 text-center">
        <div class="mb-4">
          <svg class="mx-auto h-12 w-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white mb-2">Check Your Email</h3>
        <p class="text-sm text-navy-300 mb-2">
          We've sent a verification link to <strong class="text-white">{{ registeredEmail }}</strong>
        </p>
        <p class="text-xs text-navy-400 mb-4">
          Click the link in the email to verify your account and start using WeCodeZW.
        </p>
        <div class="flex gap-3 justify-center">
          <NuxtLink
            to="/auth/login"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all"
          >
            Go to Login
          </NuxtLink>
          <button
            @click="showVerificationMessage = false"
            class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
          >
            Register Another
          </button>
        </div>
      </div>

      <form v-else @submit.prevent="onSubmit" class="space-y-5">
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">Full name</label>
          <input
            v-model="name"
            type="text"
            required
            placeholder="Jane Doe"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
        </div>
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
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">I am a</label>
          <select
            v-model="role"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          >
            <option value="INDIVIDUAL">Individual / Student</option>
            <option value="CORPORATE">Corporate</option>
            <option value="STUDENT">Student</option>
          </select>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
        <div class="text-center text-sm text-navy-300">
          Have an account? <NuxtLink to="/auth/login" class="text-blue-400 hover:text-blue-300 underline">Sign in</NuxtLink>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref<'INDIVIDUAL'|'STUDENT'|'CORPORATE'>('INDIVIDUAL')
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
    // Clear form
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
