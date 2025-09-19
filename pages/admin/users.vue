<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-16">
    <h1 class="text-3xl font-extrabold tracking-tight xs:text-4xl">Users</h1>
    <div class="mt-5 flex items-center gap-3">
      <input v-model="q" placeholder="Search name or email" class="w-full max-w-md rounded-md border border-navy-700 bg-navy-900 px-3 py-2 text-sm outline-none" />
    </div>
    <table class="mt-6 w-full table-auto overflow-hidden rounded-xl border border-navy-800">
      <thead class="bg-navy-900/40">
        <tr>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Name</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Email</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-navy-200">Role</th>
          <th class="px-4 py-2 text-right text-sm font-medium text-navy-200">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in filtered" :key="u.id" class="hover:bg-white/5">
          <td class="px-4 py-2 text-sm">{{ u.name }}</td>
          <td class="px-4 py-2 text-sm">{{ u.email }}</td>
          <td class="px-4 py-2 text-sm">
            <select v-model="u.role" @change="updateRole(u)" class="rounded-md border border-navy-700 bg-navy-900 px-2 py-1 text-sm">
              <option value="INDIVIDUAL">INDIVIDUAL</option>
              <option value="STUDENT">STUDENT</option>
              <option value="CORPORATE">CORPORATE</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </td>
          <td class="px-4 py-2 text-right text-sm">
            <button class="rounded-md border border-navy-700 px-3 py-1 hover:border-navy-500" @click="impersonate(u)">Impersonate</button>
          </td>
        </tr>
      </tbody>
    </table>
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


