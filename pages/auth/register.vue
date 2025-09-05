<template>
  <div class="mx-auto grid max-w-md gap-6 px-4 py-16">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Create account</h1>
      <p class="mt-2 text-navy-300">Join WeCodeZW to access training and services.</p>
    </div>
    <form @submit.prevent="onSubmit" class="grid gap-4 rounded-xl border border-navy-800 bg-navy-900/40 p-6">
      <div class="grid gap-2">
        <UiLabel>Full name</UiLabel>
        <UiInput v-model="name" required placeholder="Jane Doe" />
      </div>
      <div class="grid gap-2">
        <UiLabel>Email</UiLabel>
        <UiInput v-model="email" type="email" required placeholder="[email protected]" />
      </div>
      <div class="grid gap-2">
        <UiLabel>Password</UiLabel>
        <UiInput v-model="password" type="password" required placeholder="••••••••" />
      </div>
      <div class="grid gap-2">
        <UiLabel>I am a</UiLabel>
        <UiSelect v-model="role">
          <option value="INDIVIDUAL">Individual / Student</option>
          <option value="CORPORATE">Corporate</option>
          <option value="STUDENT">Student</option>
        </UiSelect>
      </div>
      <UiButton :disabled="loading">Create account</UiButton>
      <div class="text-sm text-navy-300">Have an account? <NuxtLink to="/auth/login" class="underline">Sign in</NuxtLink></div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UiInput from '@/components/ui/Input.vue'
import UiLabel from '@/components/ui/Label.vue'
import UiSelect from '@/components/ui/Select.vue'
import UiButton from '@/components/ui/Button.vue'
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref<'INDIVIDUAL'|'STUDENT'|'CORPORATE'>('INDIVIDUAL')
const loading = ref(false)

async function onSubmit() {
  try {
    loading.value = true
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name: name.value, email: email.value, password: password.value, role: role.value }
    })
    await navigateTo('/dashboard')
  } finally {
    loading.value = false
  }
}
</script>