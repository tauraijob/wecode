<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Course Catalog
      </h1>
      <p class="mt-2 text-navy-300">Browse our available courses and start your learning journey</p>
    </div>

    <!-- Search and Filters -->
    <div class="mb-8 grid gap-6 lg:grid-cols-4">
      <!-- Search -->
      <div class="lg:col-span-3">
        <CourseSearch v-model:search="searchQuery" />
      </div>
      
      <!-- Filters Toggle (Mobile) -->
      <div class="lg:hidden">
        <button
          @click="showFilters = !showFilters"
          class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all flex items-center justify-center gap-2"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-4">
      <!-- Filters Sidebar -->
      <div :class="filterSidebarClasses">
        <CourseFilters v-model:filters="filters" />
      </div>

      <!-- Courses Grid -->
      <div class="lg:col-span-3">

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
            <p class="mt-4 text-navy-300">Loading courses...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!courses || courses.length === 0" class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
            <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">No courses found</h3>
          <p class="text-navy-300">Try adjusting your filters or search terms.</p>
        </div>

        <!-- Courses Grid -->
        <div v-else class="grid gap-6 sm:grid-cols-2">
          <div
            v-for="course in courses"
            :key="course.id"
            class="group relative overflow-hidden rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 transition-all hover:border-navy-600 hover:shadow-xl"
          >
            <!-- Thumbnail -->
            <div v-if="course.thumbnailUrl" class="relative h-48 overflow-hidden bg-navy-800">
              <img
                :src="course.thumbnailUrl"
                :alt="course.name"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div v-else class="flex h-48 items-center justify-center bg-gradient-to-br from-navy-700 to-navy-800">
              <svg class="h-12 w-12 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>

            <!-- Content -->
            <div class="p-6">
              <h3 class="text-xl font-semibold text-white mb-2 line-clamp-1">{{ course.name }}</h3>
              <!-- Instructor Badge -->
              <div v-if="course.instructor" class="mb-2 flex items-center gap-2">
                <span class="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-2.5 py-1 text-xs font-medium text-purple-300 border border-purple-500/30">
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ course.instructor.name }}
                </span>
              </div>
              
              <!-- Rating -->
              <div v-if="course.averageRating && course.averageRating > 0" class="mb-2">
                <RatingStars
                  :model-value="course.averageRating"
                  :readonly="true"
                  :show-value="true"
                  :show-count="true"
                  :total-ratings="course.totalRatings || 0"
                />
              </div>
              
              <p class="text-sm text-navy-300 line-clamp-2 mb-4">{{ course.description }}</p>

              <!-- Enrollment Status -->
              <div v-if="course.enrollment" class="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-green-400 font-medium">Enrolled</span>
                  <span v-if="course.enrollment.progressPercent > 0" class="text-green-300">
                    {{ Number(course.enrollment.progressPercent).toFixed(0) }}% Complete
                  </span>
                </div>
                <div v-if="course.enrollment.progressPercent > 0" class="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy-800">
                  <div
                    class="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all"
                    :style="{ width: `${Number(course.enrollment.progressPercent)}%` }"
                  ></div>
                </div>
              </div>

              <!-- Price and Action -->
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-white">{{ course.currency }} {{ Number(course.price).toFixed(2) }}</span>
                <NuxtLink
                  :to="`/courses/${course.id}`"
                  class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {{ course.enrollment ? 'Continue' : 'View Details' }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
          <button
            @click="loadPage(pagination.page - 1)"
            :disabled="pagination.page === 1 || loading"
            class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-sm text-navy-300 hover:bg-navy-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="text-sm text-navy-300">
            Page {{ pagination.page }} of {{ pagination.totalPages }}
          </span>
          <button
            @click="loadPage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages || loading"
            class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-sm text-navy-300 hover:bg-navy-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const searchQuery = ref('')
const showFilters = ref(false)
const filters = ref({
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  minRating: undefined as number | undefined,
  sortBy: 'newest' as string
})
const currentPage = ref(1)

const queryParams = computed(() => ({
  search: searchQuery.value || undefined,
  minPrice: filters.value.minPrice?.toString(),
  maxPrice: filters.value.maxPrice?.toString(),
  minRating: filters.value.minRating?.toString(),
  sortBy: filters.value.sortBy,
  page: currentPage.value.toString(),
  limit: '12'
}))

const { data: coursesData, pending: loading, refresh } = await useFetch('/api/courses', {
  query: queryParams
})

const courses = computed(() => coursesData.value?.courses || [])
const pagination = computed(() => coursesData.value?.pagination)
const filterSidebarClasses = computed(() => [
  'lg:col-span-1',
  showFilters.value ? 'block' : 'hidden lg:block'
])

// Reset to page 1 when filters change
watch([searchQuery, filters], () => {
  currentPage.value = 1
  refresh()
}, { deep: true })

function loadPage(page: number) {
  currentPage.value = page
  refresh()
}
</script>
