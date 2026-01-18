<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Students
      </h1>
      <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">Manage e-learning students, view their progress and enrollments</p>
    </div>

    <!-- Stats -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <div class="text-sm text-navy-400">Total Students</div>
        <div class="mt-1 text-2xl font-bold text-white">{{ students.length }}</div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <div class="text-sm text-navy-400">Active Enrollments</div>
        <div class="mt-1 text-2xl font-bold text-white">{{ totalActiveEnrollments }}</div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <div class="text-sm text-navy-400">Certificates Issued</div>
        <div class="mt-1 text-2xl font-bold text-white">{{ totalCertificates }}</div>
      </div>
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4">
        <div class="text-sm text-navy-400">Verified Email</div>
        <div class="mt-1 text-2xl font-bold text-white">{{ students.filter(s => s.emailVerified).length }}</div>
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
      <div class="flex gap-2">
        <select
          v-model="statusFilter"
          class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        >
          <option value="">All Status</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
        <select
          v-model="sortBy"
          class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A-Z</option>
          <option value="enrollments">Most Enrollments</option>
        </select>
      </div>
    </div>

    <!-- Students Table -->
    <div class="overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-navy-800/50 border-b border-navy-700/50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Student</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Contact</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Enrollments</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Progress</th>
              <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-navy-200">Joined</th>
              <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-navy-200">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-navy-700/50">
            <tr v-for="student in filtered" :key="student.id" class="hover:bg-navy-800/30 transition-colors">
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-sm font-semibold text-white">
                    {{ student.name?.charAt(0).toUpperCase() || 'S' }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white">{{ student.name }}</div>
                    <div class="text-xs text-navy-400">ID: {{ student.id.slice(0, 8) }}...</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <div class="text-sm text-white">{{ student.email }}</div>
                <div v-if="student.phone" class="text-xs text-navy-400">{{ student.phone }}</div>
                <div v-else class="text-xs text-navy-500">No phone</div>
              </td>
              <td class="px-4 py-4">
                <span
                  :class="student.emailVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'"
                  class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                >
                  <svg v-if="student.emailVerified" class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ student.emailVerified ? 'Verified' : 'Unverified' }}
                </span>
              </td>
              <td class="px-4 py-4">
                <div class="text-sm text-white">{{ student._count?.enrollments || 0 }} courses</div>
                <div class="text-xs text-navy-400">{{ getActiveEnrollments(student) }} active</div>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-2 bg-navy-700 rounded-full overflow-hidden max-w-[100px]">
                    <div 
                      class="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      :style="{ width: getAverageProgress(student) + '%' }"
                    ></div>
                  </div>
                  <span class="text-xs text-navy-300">{{ getAverageProgress(student) }}%</span>
                </div>
                <div class="text-xs text-navy-400 mt-1">{{ student._count?.certificates || 0 }} certificates</div>
              </td>
              <td class="px-4 py-4">
                <div class="text-xs text-navy-300">{{ formatDate(student.createdAt) }}</div>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewStudent(student)"
                    class="rounded-lg border border-navy-600 bg-navy-800/50 p-1.5 text-navy-200 hover:bg-navy-700/50 transition-all"
                    title="View Details"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="editStudent(student)"
                    class="rounded-lg border border-blue-600 bg-blue-800/50 p-1.5 text-blue-200 hover:bg-blue-700/50 transition-all"
                    title="Edit Student"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(student)"
                    class="rounded-lg border border-red-600 bg-red-800/50 p-1.5 text-red-200 hover:bg-red-700/50 transition-all"
                    title="Delete Student"
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
      <h3 class="text-xl font-semibold text-white mb-2">No students found</h3>
      <p class="text-navy-300">{{ q || statusFilter ? 'Try adjusting your filters' : 'No students registered yet' }}</p>
    </div>

    <!-- Student Detail Modal -->
    <div
      v-if="selectedStudent"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="selectedStudent = null"
    >
      <div class="w-full max-w-3xl rounded-xl border border-navy-700 bg-gradient-to-br from-navy-900 to-navy-800 p-6 max-h-[90vh] overflow-y-auto">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">Student Details</h2>
          <button
            @click="selectedStudent = null"
            class="rounded-lg p-1 text-navy-400 hover:bg-navy-800 hover:text-white"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div v-if="studentDetails" class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-medium text-navy-400">Name</label>
              <div class="mt-1 text-sm text-white">{{ studentDetails.name }}</div>
            </div>
            <div>
              <label class="text-xs font-medium text-navy-400">Email</label>
              <div class="mt-1 text-sm text-white">{{ studentDetails.email }}</div>
            </div>
            <div>
              <label class="text-xs font-medium text-navy-400">Phone</label>
              <div class="mt-1 text-sm text-white">{{ studentDetails.phone || 'Not provided' }}</div>
            </div>
            <div>
              <label class="text-xs font-medium text-navy-400">Joined</label>
              <div class="mt-1 text-sm text-white">{{ formatDate(studentDetails.createdAt) }}</div>
            </div>
          </div>

          <!-- Enrollments -->
          <div class="border-t border-navy-700 pt-4">
            <h3 class="mb-3 text-sm font-semibold text-white">Course Enrollments ({{ studentDetails.enrollments?.length || 0 }})</h3>
            <div v-if="studentDetails.enrollments?.length" class="space-y-2">
              <div
                v-for="enrollment in studentDetails.enrollments"
                :key="enrollment.id"
                class="flex items-center justify-between rounded-lg border border-navy-700/50 bg-navy-800/30 p-3"
              >
                <div>
                  <div class="font-medium text-white text-sm">{{ enrollment.course?.name }}</div>
                  <div class="text-xs text-navy-400 mt-1">
                    Progress: {{ enrollment.progressPercent || 0 }}% • 
                    Status: <span :class="enrollment.status === 'ACTIVE' ? 'text-green-400' : 'text-yellow-400'">{{ enrollment.status }}</span>
                  </div>
                </div>
                <div class="text-xs text-navy-400">
                  {{ formatDate(enrollment.enrolledAt) }}
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-navy-400">No enrollments yet</div>
          </div>

          <!-- Certificates -->
          <div class="border-t border-navy-700 pt-4">
            <h3 class="mb-3 text-sm font-semibold text-white">Certificates ({{ studentDetails.certificates?.length || 0 }})</h3>
            <div v-if="studentDetails.certificates?.length" class="space-y-2">
              <div
                v-for="cert in studentDetails.certificates"
                :key="cert.id"
                class="flex items-center justify-between rounded-lg border border-navy-700/50 bg-navy-800/30 p-3"
              >
                <div>
                  <div class="font-medium text-white text-sm">{{ cert.course?.name }}</div>
                  <div class="text-xs text-navy-400 mt-1">Certificate #{{ cert.id.slice(0, 8) }}</div>
                </div>
                <div class="text-xs text-navy-400">
                  {{ formatDate(cert.issuedAt) }}
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-navy-400">No certificates yet</div>
          </div>
        </div>
        <div v-else class="text-center text-navy-400 py-8">Loading...</div>
      </div>
    </div>

    <!-- Edit Student Modal -->
    <div
      v-if="editingStudent"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="editingStudent = null"
    >
      <div class="w-full max-w-md rounded-xl border border-navy-700 bg-gradient-to-br from-navy-900 to-navy-800 p-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">Edit Student</h2>
          <button
            @click="editingStudent = null"
            class="rounded-lg p-1 text-navy-400 hover:bg-navy-800 hover:text-white"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveStudent" class="space-y-4">
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
              @click="editingStudent = null"
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
      v-if="studentToDelete"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="studentToDelete = null"
    >
      <div class="w-full max-w-md rounded-xl border border-red-700/50 bg-gradient-to-br from-navy-900 to-navy-800 p-6">
        <div class="mb-4">
          <h2 class="text-2xl font-bold text-white">Delete Student</h2>
          <p class="mt-2 text-sm text-navy-300">
            Are you sure you want to delete <strong class="text-white">{{ studentToDelete.name }}</strong>? This will also remove all their enrollments and certificates. This action cannot be undone.
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="studentToDelete = null"
            class="flex-1 rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50"
          >
            Cancel
          </button>
          <button
            @click="deleteStudent"
            class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete Student
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const toast = useToast()

const q = ref('')
const statusFilter = ref('')
const sortBy = ref('newest')
const students = ref<any[]>([])
const selectedStudent = ref<any>(null)
const studentDetails = ref<any>(null)
const editingStudent = ref<any>(null)
const studentToDelete = ref<any>(null)
const editForm = ref({
  name: '',
  email: '',
  phone: '',
  emailVerified: false
})

onMounted(async () => {
  await loadStudents()
})

async function loadStudents() {
  try {
    const data = await $fetch('/api/admin/students')
    students.value = (data as any)?.students || []
  } catch (error) {
    console.error('Failed to load students:', error)
    students.value = []
  }
}

const totalActiveEnrollments = computed(() => {
  return students.value.reduce((sum, s) => sum + (s.activeEnrollments || 0), 0)
})

const totalCertificates = computed(() => {
  return students.value.reduce((sum, s) => sum + (s._count?.certificates || 0), 0)
})

const filtered = computed(() => {
  let result = students.value

  // Search filter
  if (q.value) {
    const query = q.value.toLowerCase()
    result = result.filter(s => 
      s.name?.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query) ||
      s.phone?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value) {
    if (statusFilter.value === 'verified') {
      result = result.filter(s => s.emailVerified)
    } else if (statusFilter.value === 'unverified') {
      result = result.filter(s => !s.emailVerified)
    }
  }

  // Sorting
  result = [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'name':
        return (a.name || '').localeCompare(b.name || '')
      case 'enrollments':
        return (b._count?.enrollments || 0) - (a._count?.enrollments || 0)
      default:
        return 0
    }
  })

  return result
})

function getActiveEnrollments(student: any) {
  return student.activeEnrollments || 0
}

function getAverageProgress(student: any) {
  return student.averageProgress || 0
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

async function viewStudent(student: any) {
  selectedStudent.value = student
  studentDetails.value = null
  try {
    studentDetails.value = await $fetch(`/api/admin/students/${student.id}`)
  } catch (error) {
    console.error('Failed to load student details:', error)
    toast.error('Failed to load student details')
  }
}

function editStudent(student: any) {
  editingStudent.value = student
  editForm.value = {
    name: student.name,
    email: student.email,
    phone: student.phone || '',
    emailVerified: student.emailVerified || false
  }
}

async function saveStudent() {
  if (!editingStudent.value) return
  try {
    await $fetch(`/api/admin/users/${editingStudent.value.id}`, {
      method: 'PUT',
      body: {
        ...editForm.value,
        role: 'STUDENT' // Keep student role
      }
    })
    toast.success('Student updated successfully')
    await loadStudents()
    editingStudent.value = null
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to update student')
  }
}

function confirmDelete(student: any) {
  studentToDelete.value = student
}

async function deleteStudent() {
  if (!studentToDelete.value) return
  try {
    await $fetch(`/api/admin/users/${studentToDelete.value.id}`, {
      method: 'DELETE'
    })
    toast.success('Student deleted successfully')
    await loadStudents()
    studentToDelete.value = null
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to delete student')
    studentToDelete.value = null
  }
}
</script>
