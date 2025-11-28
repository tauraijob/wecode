<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Users
      </h1>
      <p class="mt-2 text-navy-300">Manage user accounts and roles</p>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="q"
          placeholder="Search name or email"
          class="w-full rounded-lg border border-navy-700 bg-navy-800/50 pl-10 pr-4 py-2 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        />
      </div>
    </div>

    <!-- Users Table -->
    <div class="overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-navy-800/50 border-b border-navy-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Role</th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-navy-200">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-navy-700/50">
            <tr v-for="u in filtered" :key="u.id" class="hover:bg-navy-800/30 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white">{{ u.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-navy-300">{{ u.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  v-model="u.role"
                  @change="updateRole(u)"
                  class="rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-1.5 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                >
                  <option value="INDIVIDUAL">INDIVIDUAL</option>
                  <option value="STUDENT">STUDENT</option>
                  <option value="CORPORATE">CORPORATE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                  @click="impersonate(u)"
                  class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-1.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
                >
                  Impersonate
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filtered.length === 0" class="mt-8 rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
        <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">No users found</h3>
      <p class="text-navy-300">{{ q ? 'Try adjusting your search' : 'No users in the system' }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const q = ref('')
const users = ref<any[]>([])
onMounted(async () => {
  users.value = (await $fetch('/api/admin/users').catch(() => [])) as any[]
})
const filtered = computed(() => users.value.filter(u => `${u.name} ${u.email}`.toLowerCase().includes(q.value.toLowerCase())))

async function updateRole(u: any) {
  await $fetch('/api/admin/users.role', { method: 'POST', body: { userId: u.id, role: u.role } })
}

async function impersonate(u: any) {
  await $fetch('/api/admin/users.impersonate', { method: 'POST', body: { userId: u.id } })
  await navigateTo('/dashboard')
}
</script>
