<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Users
      </h1>
      <p class="mt-2 text-navy-300">Manage user accounts, roles, and permissions</p>
    </div>

    <!-- Stats -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <div class="text-sm text-navy-400">Total Users</div>
        <div class="mt-1 text-2xl font-bold text-white">{{ users.length }}</div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <div class="text-sm text-navy-400">Students</div>
        <div class="mt-1 text-2xl font-bold text-white">{{ users.filter(u => u.role === 'STUDENT').length }}</div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <div class="text-sm text-navy-400">Instructors</div>
        <div class="mt-1 text-2xl font-bold text-white">{{ users.filter(u => u.role === 'INSTRUCTOR').length }}</div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <div class="text-sm text-navy-400">Verified</div>
        <div class="mt-1 text-2xl font-bold text-white">{{ users.filter(u => u.emailVerified).length }}</div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative max-w-md flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="q"
          placeholder="Search name, email, or phone"
          class="w-full rounded-lg border border-navy-700 bg-navy-800/50 pl-10 pr-4 py-2 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        />
      </div>
      <select
        v-model="roleFilter"
        class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
      >
        <option value="">All Roles</option>
        <option value="INDIVIDUAL">INDIVIDUAL</option>
        <option value="STUDENT">STUDENT</option>
        <option value="INSTRUCTOR">INSTRUCTOR</option>
        <option value="CORPORATE">CORPORATE</option>
        <option value="ADMIN">ADMIN</option>
      </select>
    </div>

    <!-- Users Table -->
    <div class="overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-navy-800/50 border-b border-navy-700/50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">User</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Contact</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Role</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Stats</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Joined</th>
              <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-navy-200">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-navy-700/50">
            <tr v-for="u in filtered" :key="u.id" class="hover:bg-navy-800/30 transition-colors">
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-emerald-600 text-sm font-semibold text-white">
                    {{ u.name?.charAt(0).toUpperCase() || 'U' }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">{{ u.name }}</div>
                    <div class="text-xs text-navy-400">ID: {{ u.id.slice(0, 8) }}...</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="text-sm text-white">{{ u.email }}</div>
                <div v-if="u.phone" class="text-xs text-navy-400">{{ u.phone }}</div>
                <div v-else class="text-xs text-navy-500">No phone</div>
              </td>
              <td class="px-4 py-4">
                <select
                  v-model="u.role"
                  @change="updateRole(u)"
                  class="rounded-lg border border-navy-700 bg-navy-800/50 px-2 py-1 text-xs text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                >
                  <option value="INDIVIDUAL">INDIVIDUAL</option>
                  <option value="STUDENT">STUDENT</option>
                  <option value="INSTRUCTOR">INSTRUCTOR</option>
                  <option value="CORPORATE">CORPORATE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td class="px-4 py-4">
                <div class="flex flex-col gap-1">
                  <span
                    :class="u.emailVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'"
                    class="inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                  >
                    <svg v-if="u.emailVerified" class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ u.emailVerified ? 'Verified' : 'Unverified' }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="text-xs text-navy-300">
                  <div>Enrollments: {{ u._count?.enrollments || 0 }}</div>
                  <div>Courses: {{ u._count?.courses || 0 }}</div>
                  <div>Invoices: {{ u._count?.invoices || 0 }}</div>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="text-xs text-navy-300">{{ formatDate(u.createdAt) }}</div>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewUser(u)"
                    class="rounded-lg border border-navy-600 bg-navy-800/50 p-1.5 text-navy-200 hover:bg-navy-700/50 transition-all"
                    title="View Details"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="editUser(u)"
                    class="rounded-lg border border-blue-600 bg-blue-800/50 p-1.5 text-blue-200 hover:bg-blue-700/50 transition-all"
                    title="Edit User"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="impersonate(u)"
                    class="rounded-lg border border-purple-600 bg-purple-800/50 p-1.5 text-purple-200 hover:bg-purple-700/50 transition-all"
                    title="Impersonate"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(u)"
                    class="rounded-lg border border-red-600 bg-red-800/50 p-1.5 text-red-200 hover:bg-red-700/50 transition-all"
                    title="Delete User"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
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
      <p class="text-navy-300">{{ q || roleFilter ? 'Try adjusting your filters' : 'No users in the system' }}</p>
    </div>

    <!-- User Detail Modal -->
    <div
      v-if="selectedUser"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="selectedUser = null"
    >
      <div class="w-full max-w-2xl rounded-xl border border-navy-700 bg-gradient-to-br from-navy-900 to-navy-800 p-6 max-h-[90vh] overflow-y-auto">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">User Details</h2>
          <button
            @click="selectedUser = null"
            class="rounded-lg p-1 text-navy-400 hover:bg-navy-800 hover:text-white"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="userDetails" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-navy-400">Name</label>
              <div class="mt-1 text-sm text-white">{{ userDetails.name }}</div>
            </div>
            <div>
              <label class="text-xs font-medium text-navy-400">Email</label>
              <div class="mt-1 text-sm text-white">{{ userDetails.email }}</div>
            </div>
            <div>
              <label class="text-xs font-medium text-navy-400">Phone</label>
              <div class="mt-1 text-sm text-white">{{ userDetails.phone || 'Not provided' }}</div>
            </div>
            <div>
              <label class="text-xs font-medium text-navy-400">Role</label>
              <div class="mt-1 text-sm text-white">{{ userDetails.role }}</div>
            </div>
            <div>
              <label class="text-xs font-medium text-navy-400">Email Verified</label>
              <div class="mt-1 text-sm" :class="userDetails.emailVerified ? 'text-green-400' : 'text-yellow-400'">
                {{ userDetails.emailVerified ? 'Yes' : 'No' }}
              </div>
            </div>
            <div>
              <label class="text-xs font-medium text-navy-400">Joined</label>
              <div class="mt-1 text-sm text-white">{{ formatDate(userDetails.createdAt) }}</div>
            </div>
          </div>
          <div class="border-t border-navy-700 pt-4">
            <h3 class="mb-2 text-sm font-semibold text-white">Statistics</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-navy-400">Enrollments:</span>
                <span class="ml-2 text-white">{{ userDetails._count?.enrollments || 0 }}</span>
              </div>
              <div>
                <span class="text-navy-400">Courses Created:</span>
                <span class="ml-2 text-white">{{ userDetails._count?.courses || 0 }}</span>
              </div>
              <div>
                <span class="text-navy-400">Invoices:</span>
                <span class="ml-2 text-white">{{ userDetails._count?.invoices || 0 }}</span>
              </div>
              <div>
                <span class="text-navy-400">Certificates:</span>
                <span class="ml-2 text-white">{{ userDetails._count?.certificates || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-navy-400">Loading...</div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div
      v-if="editingUser"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="editingUser = null"
    >
      <div class="w-full max-w-md rounded-xl border border-navy-700 bg-gradient-to-br from-navy-900 to-navy-800 p-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">Edit User</h2>
          <button
            @click="editingUser = null"
            class="rounded-lg p-1 text-navy-400 hover:bg-navy-800 hover:text-white"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-navy-300">Name</label>
            <input
              v-model="editForm.name"
              type="text"
              class="mt-1 w-full rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-300">Email</label>
            <input
              v-model="editForm.email"
              type="email"
              class="mt-1 w-full rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-300">Phone</label>
            <input
              v-model="editForm.phone"
              type="tel"
              class="mt-1 w-full rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-300">Role</label>
            <select
              v-model="editForm.role"
              class="mt-1 w-full rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            >
              <option value="INDIVIDUAL">INDIVIDUAL</option>
              <option value="STUDENT">STUDENT</option>
              <option value="INSTRUCTOR">INSTRUCTOR</option>
              <option value="CORPORATE">CORPORATE</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="editForm.emailVerified"
              type="checkbox"
              id="emailVerified"
              class="h-4 w-4 rounded border-navy-700 bg-navy-800 text-blue-600 focus:ring-blue-500"
            />
            <label for="emailVerified" class="text-sm text-navy-300">Email Verified</label>
          </div>
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="editingUser = null"
              class="flex-1 rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 rounded-lg bg-gradient-to-r from-accent-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white hover:from-accent-600 hover:to-emerald-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="userToDelete"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="userToDelete = null"
    >
      <div class="w-full max-w-md rounded-xl border border-red-700/50 bg-gradient-to-br from-navy-900 to-navy-800 p-6">
        <div class="mb-4">
          <h2 class="text-2xl font-bold text-white">Delete User</h2>
          <p class="mt-2 text-sm text-navy-300">
            Are you sure you want to delete <strong class="text-white">{{ userToDelete.name }}</strong>? This action cannot be undone.
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="userToDelete = null"
            class="flex-1 rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50"
          >
            Cancel
          </button>
          <button
            @click="deleteUser"
            class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>

    <!-- Impersonate Confirm Modal -->
    <ConfirmModal
      v-model:is-open="showImpersonateModal"
      title="Impersonate User"
      :message="`You will be logged in as ${impersonateTarget?.name}. You can end impersonation from the dashboard.`"
      type="warning"
      confirm-text="Impersonate"
      cancel-text="Cancel"
      @confirm="confirmImpersonate"
    />
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const toast = useToast()

const q = ref('')
const roleFilter = ref('')
const users = ref<any[]>([])
const selectedUser = ref<any>(null)
const userDetails = ref<any>(null)
const editingUser = ref<any>(null)
const userToDelete = ref<any>(null)
const editForm = ref({
  name: '',
  email: '',
  phone: '',
  role: 'INDIVIDUAL' as any,
  emailVerified: false
})
const showImpersonateModal = ref(false)
const impersonateTarget = ref<any>(null)

onMounted(async () => {
  await loadUsers()
})

async function loadUsers() {
  users.value = (await $fetch('/api/admin/users').catch(() => [])) as any[]
}

const filtered = computed(() => {
  let result = users.value
  if (q.value) {
    const query = q.value.toLowerCase()
    result = result.filter(u => 
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.phone?.toLowerCase().includes(query)
    )
  }
  if (roleFilter.value) {
    result = result.filter(u => u.role === roleFilter.value)
  }
  return result
})

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

async function viewUser(user: any) {
  selectedUser.value = user
  try {
    userDetails.value = await $fetch(`/api/admin/users/${user.id}`)
  } catch (error) {
    console.error('Failed to load user details:', error)
  }
}

function editUser(user: any) {
  editingUser.value = user
  editForm.value = {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    emailVerified: user.emailVerified || false
  }
}

async function saveUser() {
  if (!editingUser.value) return
  try {
    await $fetch(`/api/admin/users/${editingUser.value.id}`, {
      method: 'PUT',
      body: editForm.value
    })
    toast.success('User updated successfully')
    await loadUsers()
    editingUser.value = null
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to update user')
  }
}

async function updateRole(u: any) {
  try {
    await $fetch('/api/admin/users.role', {
      method: 'POST',
      body: { userId: u.id, role: u.role }
    })
    toast.success('Role updated successfully')
    await loadUsers()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to update role')
    await loadUsers() // Reload to revert change
  }
}

function impersonate(u: any) {
  impersonateTarget.value = u
  showImpersonateModal.value = true
}

async function confirmImpersonate() {
  if (!impersonateTarget.value) return
  try {
    await $fetch('/api/admin/users.impersonate', {
      method: 'POST',
      body: { userId: impersonateTarget.value.id }
    })
    toast.success(`Now logged in as ${impersonateTarget.value.name}`)
    await navigateTo('/dashboard')
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to impersonate user')
  } finally {
    impersonateTarget.value = null
  }
}

function confirmDelete(u: any) {
  userToDelete.value = u
}

async function deleteUser() {
  if (!userToDelete.value) return
  try {
    await $fetch(`/api/admin/users/${userToDelete.value.id}`, {
      method: 'DELETE'
    })
    toast.success('User deleted successfully')
    await loadUsers()
    userToDelete.value = null
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to delete user')
    userToDelete.value = null
  }
}
</script>
