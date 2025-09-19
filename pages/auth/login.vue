<template>
  <div class="mx-auto grid max-w-md gap-6 px-4 py-16">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Sign in</h1>
      <p class="mt-2 text-navy-300">Welcome back to WeCodeZW.</p>
    </div>
    <form @submit.prevent="onSubmit" class="grid gap-4 rounded-xl border border-navy-800 bg-navy-900/40 p-6">
      <div class="grid gap-2">
        <UiLabel>Email</UiLabel>
        <UiInput v-model="email" type="email" required placeholder="[email protected]" />
      </div>
      <div class="grid gap-2">
        <UiLabel>Password</UiLabel>
        <UiInput v-model="password" type="password" required placeholder="••••••••" />
      </div>
      <UiButton :disabled="loading">Sign in</UiButton>
      <div class="text-sm text-navy-300">No account? <NuxtLink to="/auth/register" class="underline">Create one</NuxtLink></div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UiInput from '@/components/ui/Input.vue'
import UiLabel from '@/components/ui/Label.vue'
import UiButton from '@/components/ui/Button.vue'
const email = ref('')
const password = ref('')
const loading = ref(false)

async function onSubmit() {
  try {
    loading.value = true
    const me = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    if (me && me.role === 'ADMIN') {
      await navigateTo('/admin')
    } else {
      await navigateTo('/dashboard')
    }
  } finally {
    loading.value = false
  }
}
</script>