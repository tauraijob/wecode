<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 py-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Account Settings
      </h1>
      <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">Manage your profile information and password</p>
    </div>

    <!-- Profile Form -->
    <div class="mb-8 rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 shadow-xl">
      <h2 class="text-xl font-semibold text-white mb-4">Profile Information</h2>
      <form @submit.prevent="save" class="space-y-5">
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">Full name</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">Email</label>
          <input
            v-model="email"
            type="email"
            disabled
            class="w-full rounded-lg border border-navy-700 bg-navy-800/30 px-4 py-2.5 text-navy-400 cursor-not-allowed"
          />
          <p class="mt-1 text-xs text-navy-400">Email cannot be changed</p>
        </div>
        <button
          type="submit"
          :disabled="saving"
          class="w-full rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="saving" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </form>
    </div>

    <!-- Password Form -->
    <div class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 shadow-xl">
      <h2 class="text-xl font-semibold text-white mb-4">Change Password</h2>
      <form @submit.prevent="changePassword" class="space-y-5">
        <div>
          <label class="mb-2 block text-sm font-medium text-navy-200">New password</label>
          <input
            v-model="newPassword"
            type="password"
            required
            placeholder="••••••••"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
        </div>
        <button
          type="submit"
          :disabled="saving || !newPassword"
          class="w-full rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="saving" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          {{ saving ? 'Changing...' : 'Change Password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

// Redirect admins to admin dashboard
const { user: me } = useAuth()
if (me.value && me.value.role === 'ADMIN') {
  await navigateTo('/admin')
}

const name = ref(me?.name || '')
const email = ref(me?.email || '')
const newPassword = ref('')
const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await $fetch('/api/account/profile', { method: 'POST', body: { name: name.value } })
    alert('Profile updated successfully')
  } catch (error: any) {
    alert(error.data?.message || 'Failed to update profile')
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  saving.value = true
  try {
    await $fetch('/api/account/password', { method: 'POST', body: { password: newPassword.value } })
    newPassword.value = ''
    alert('Password changed successfully')
  } catch (error: any) {
    alert(error.data?.message || 'Failed to change password')
  } finally {
    saving.value = false
  }
}
</script>
