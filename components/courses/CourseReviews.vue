<template>
  <div class="space-y-6">
    <!-- Stats -->
    <div v-if="stats" class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <RatingStars
              :model-value="stats.averageRating"
              :readonly="true"
              :show-value="true"
            />
          </div>
          <p class="text-sm text-navy-300">
            Based on {{ stats.totalRatings }} {{ stats.totalRatings === 1 ? 'review' : 'reviews' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="space-y-4">
      <div
        v-for="rating in ratings"
        :key="rating.id"
        class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-6"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-navy-700 text-navy-300">
              {{ rating.user.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="font-medium text-white">{{ rating.user.name }}</p>
              <p class="text-xs text-navy-400">{{ formatDate(rating.createdAt) }}</p>
            </div>
          </div>
          <RatingStars
            :model-value="rating.rating"
            :readonly="true"
          />
        </div>
        <p v-if="rating.review" class="text-sm text-navy-300 mt-3 whitespace-pre-wrap">
          {{ rating.review }}
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="ratings.length === 0" class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-12 text-center">
      <p class="text-navy-300">No reviews yet. Be the first to review this course!</p>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.totalPages > 1" class="flex items-center justify-center gap-2">
      <button
        @click="loadPage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-sm text-navy-300 hover:bg-navy-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="text-sm text-navy-300">
        Page {{ pagination.page }} of {{ pagination.totalPages }}
      </span>
      <button
        @click="loadPage(pagination.page + 1)"
        :disabled="pagination.page >= pagination.totalPages"
        class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2 text-sm text-navy-300 hover:bg-navy-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  courseId: string
}>()

const ratings = ref<any[]>([])
const stats = ref<{ averageRating: number; totalRatings: number } | null>(null)
const pagination = ref<{ page: number; limit: number; total: number; totalPages: number } | null>(null)
const loading = ref(false)
const currentPage = ref(1)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function loadReviews(page = 1) {
  try {
    loading.value = true
    currentPage.value = page

    const result = await $fetch(`/api/courses/${props.courseId}/ratings`, {
      query: { page, limit: 10 }
    })

    ratings.value = result.ratings
    stats.value = result.stats
    pagination.value = result.pagination
  } catch (err: any) {
    console.error('Failed to load reviews:', err)
  } finally {
    loading.value = false
  }
}

function loadPage(page: number) {
  loadReviews(page)
}

onMounted(() => {
  loadReviews()
})

defineExpose({
  refresh: () => loadReviews(currentPage.value)
})
</script>



