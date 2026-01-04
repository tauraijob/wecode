<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Course Management
          </h1>
          <p class="mt-2 text-navy-300 text-lg">Create and manage courses, topics, and lessons</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/admin/courses/enrollments"
            class="rounded-lg border border-navy-600/50 bg-navy-800/40 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/60 hover:border-navy-500 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="hidden sm:inline">View </span>Enrollments
          </NuxtLink>
          <NuxtLink
            to="/admin/courses/analytics"
            class="rounded-lg border border-navy-600/50 bg-navy-800/40 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/60 hover:border-navy-500 transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </NuxtLink>
          <button
            @click="showCreateModal = true"
            class="rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Course
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/40 to-navy-900/40 backdrop-blur-sm">
        <div class="relative flex-1 min-w-[200px]">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search courses..."
            class="w-full rounded-lg border border-navy-700/50 bg-navy-800/60 backdrop-blur-sm pl-10 pr-4 py-2.5 text-sm text-white placeholder-navy-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <select
          v-model="statusFilter"
          class="rounded-lg border border-navy-700/50 bg-navy-800/60 backdrop-blur-sm px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select
          v-model="sortBy"
          class="rounded-lg border border-navy-700/50 bg-navy-800/60 backdrop-blur-sm px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A-Z</option>
          <option value="enrollments">Most Enrollments</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500/30 border-t-blue-500 border-r-purple-500"></div>
        <p class="mt-6 text-navy-300 text-lg font-medium">Loading courses...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredCourses.length === 0" class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 via-navy-800/60 to-navy-900/80 backdrop-blur-sm p-16 text-center shadow-xl">
      <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-blue-500/30">
        <svg class="h-10 w-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-white mb-3">No courses found</h3>
      <p class="text-navy-300 mb-8 text-lg">{{ searchQuery || statusFilter ? 'Try adjusting your filters' : 'Get started by creating your first course' }}</p>
      <button
        v-if="!searchQuery && !statusFilter"
        @click="showCreateModal = true"
        class="rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 mx-auto"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Your First Course
      </button>
    </div>

    <!-- Courses Grid -->
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="course in filteredCourses"
        :key="course.id"
        class="group relative overflow-hidden rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-800/70 via-navy-800/60 to-navy-900/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
      >
        <!-- Gradient overlay on hover -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 pointer-events-none"></div>
        
        <!-- Thumbnail -->
        <div class="relative h-52 overflow-hidden bg-gradient-to-br from-navy-700 to-navy-800">
          <img
            v-if="course.thumbnailUrl"
            :src="course.thumbnailUrl"
            :alt="course.name"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div v-else class="flex h-full items-center justify-center bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20">
            <svg class="h-16 w-16 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <!-- Dark gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/20 to-transparent pointer-events-none"></div>
          <!-- Status Badge -->
          <div class="absolute top-4 right-4">
            <span
              :class="{
                'bg-amber-500/30 text-amber-300 border-amber-400/50 shadow-lg shadow-amber-500/20': course.status === 'DRAFT',
                'bg-green-500/30 text-green-300 border-green-400/50 shadow-lg shadow-green-500/20': course.status === 'PUBLISHED',
                'bg-navy-500/30 text-navy-300 border-navy-400/50 shadow-lg shadow-navy-500/20': course.status === 'ARCHIVED'
              }"
              class="rounded-lg border px-3 py-1.5 text-xs font-semibold backdrop-blur-md"
            >
              {{ course.status }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="relative p-6">
          <h3 class="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-300 transition-colors">{{ course.name }}</h3>
          <p class="text-sm text-navy-300 line-clamp-2 mb-5 leading-relaxed">{{ course.description }}</p>

          <!-- Stats -->
          <div class="mb-5 flex flex-wrap gap-4 text-xs">
            <div class="flex items-center gap-2 text-navy-300">
              <div class="rounded-lg bg-blue-500/20 p-1.5 border border-blue-500/30">
                <svg class="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span class="font-medium">{{ course._count.topics }} topics</span>
            </div>
            <div class="flex items-center gap-2 text-navy-300">
              <div class="rounded-lg bg-purple-500/20 p-1.5 border border-purple-500/30">
                <svg class="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span class="font-medium">{{ course._count.enrollments }} enrolled</span>
            </div>
            <div class="flex items-center gap-2 text-navy-300">
              <div class="rounded-lg bg-emerald-500/20 p-1.5 border border-emerald-500/30">
                <svg class="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="font-semibold text-white">{{ course.currency }} {{ Number(course.price).toFixed(2) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <NuxtLink
              :to="`/admin/courses/${course.id}`"
              class="flex-1 rounded-lg border border-blue-500/50 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-4 py-2.5 text-center text-sm font-semibold text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/70 transition-all shadow-sm hover:shadow-md"
            >
              Manage
            </NuxtLink>
            <button
              @click="deleteCourse(course.id)"
              class="rounded-lg border border-red-500/50 bg-red-500/10 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20 hover:border-red-400/70 transition-all shadow-sm hover:shadow-md"
              title="Delete course"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Course Modal -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        @click.self="showCreateModal = false"
      >
        <div class="w-full max-w-2xl rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/95 via-navy-800/95 to-navy-900/95 backdrop-blur-xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div class="mb-8 flex items-center justify-between">
            <div>
              <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Create New Course</h2>
              <p class="mt-2 text-sm text-navy-300">Fill in the details to create a new course</p>
            </div>
            <button
              @click="showCreateModal = false"
              class="rounded-lg p-2 hover:bg-navy-800/50 transition-colors text-navy-400 hover:text-white"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="createCourse" class="space-y-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Course Name *</label>
              <input
                v-model="newCourse.name"
                type="text"
                required
                placeholder="e.g., Introduction to Web Development"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Description *</label>
              <textarea
                v-model="newCourse.description"
                required
                rows="4"
                placeholder="Describe what students will learn in this course..."
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Price *</label>
                <input
                  v-model.number="newCourse.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Currency</label>
                <select
                  v-model="newCourse.currency"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
                >
                  <option value="USD">USD</option>
                  <option value="ZWL">ZWL</option>
                </select>
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Thumbnail URL</label>
              <input
                v-model="newCourse.thumbnailUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              />
              <p class="mt-1 text-xs text-navy-400">A high-quality image that represents your course</p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Preview Video URL</label>
              <input
                v-model="newCourse.previewVideoUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or direct video URL"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              />
              <p class="mt-1 text-xs text-navy-400">Supports YouTube, Vimeo, or direct video URLs</p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Prerequisites</label>
              <textarea
                v-model="newCourse.prerequisites"
                rows="3"
                placeholder="No prior experience required..."
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              ></textarea>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Status</label>
              <select
                v-model="newCourse.status"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div class="flex gap-3 justify-end pt-6 border-t border-navy-700/50">
              <button
                type="button"
                @click="showCreateModal = false"
                class="rounded-lg border border-navy-700/50 bg-navy-800/40 backdrop-blur-sm px-6 py-2.5 text-sm font-semibold text-navy-200 hover:bg-navy-700/60 hover:border-navy-600 transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                <span v-if="creating" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ creating ? 'Creating...' : 'Create Course' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Delete Course Confirm Modal -->
    <ConfirmModal
      v-model:is-open="showDeleteModal"
      title="Delete Course"
      message="Are you sure you want to delete this course? This action cannot be undone."
      type="danger"
      confirm-text="Delete Course"
      cancel-text="Cancel"
      @confirm="confirmDeleteCourse"
    />
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
const toast = useToast()
const { data: courses, refresh, pending: loading } = await useFetch('/api/admin/courses')

const showCreateModal = ref(false)
const creating = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('newest')
const showDeleteModal = ref(false)
const courseToDelete = ref<string | null>(null)

const newCourse = ref({
  name: '',
  description: '',
  price: 0,
  currency: 'USD',
  status: 'DRAFT',
  thumbnailUrl: '',
  previewVideoUrl: '',
  prerequisites: ''
})

const filteredCourses = computed(() => {
  let result = courses.value || []

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((course: any) =>
      course.name.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value) {
    result = result.filter((course: any) => course.status === statusFilter.value)
  }

  // Sort
  if (sortBy.value === 'newest') {
    result = [...result].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sortBy.value === 'oldest') {
    result = [...result].sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  } else if (sortBy.value === 'name') {
    result = [...result].sort((a: any, b: any) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'enrollments') {
    result = [...result].sort((a: any, b: any) => (b._count?.enrollments || 0) - (a._count?.enrollments || 0))
  }

  return result
})

const createCourse = async () => {
  try {
    creating.value = true
    await $fetch('/api/courses', {
      method: 'POST',
      body: newCourse.value
    })
    showCreateModal.value = false
    newCourse.value = {
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      status: 'DRAFT',
      thumbnailUrl: '',
      previewVideoUrl: '',
      prerequisites: ''
    }
    await refresh()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to create course')
  } finally {
    creating.value = false
  }
}

const deleteCourse = async (id: string) => {
  courseToDelete.value = id
  showDeleteModal.value = true
}

const confirmDeleteCourse = async () => {
  if (!courseToDelete.value) return
  try {
    await $fetch(`/api/courses/${courseToDelete.value}`, { method: 'DELETE' })
    toast.success('Course deleted successfully')
    await refresh()
  } catch (error: any) {
    toast.error(error.data?.message || 'Failed to delete course')
  } finally {
    courseToDelete.value = null
  }
}
</script>
