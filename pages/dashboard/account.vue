<template>
  <div class="mx-auto max-w-2xl px-4 py-10">
    <h2 class="text-2xl font-semibold">Account settings</h2>
    <p class="mt-1 text-sm text-navy-300">Manage your profile information and password.</p>

    <form @submit.prevent="save" class="mt-6 grid gap-4 rounded-xl border border-navy-800 bg-navy-900/40 p-4">
      <div class="grid gap-2">
        <UiLabel>Full name</UiLabel>
        <UiInput v-model="name" />
      </div>
      <div class="grid gap-2">
        <UiLabel>Email</UiLabel>
        <UiInput v-model="email" type="email" disabled />
      </div>
      <UiButton :disabled="saving">Save changes</UiButton>
    </form>

    <form @submit.prevent="changePassword" class="mt-6 grid gap-4 rounded-xl border border-navy-800 bg-navy-900/40 p-4">
      <div class="grid gap-2">
        <UiLabel>New password</UiLabel>
        <UiInput v-model="newPassword" type="password" placeholder="••••••••" />
      </div>
      <UiButton :disabled="saving || !newPassword">Change password</UiButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import UiInput from '@/components/ui/Input.vue'
import UiLabel from '@/components/ui/Label.vue'
import UiButton from '@/components/ui/Button.vue'
const me = await $fetch('/api/auth/me')
const name = ref(me?.name || '')
const email = ref(me?.email || '')
const newPassword = ref('')
const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await $fetch('/api/account/profile', { method: 'POST', body: { name: name.value } })
  } finally {
    saving.value = false
  }
}
async function changePassword() {
  saving.value = true
  try {
    await $fetch('/api/account/password', { method: 'POST', body: { password: newPassword.value } })
    newPassword.value = ''
  } finally {
    saving.value = false
  }
}
</script>

