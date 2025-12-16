<template>
  <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-6">
    <h3 class="text-xl font-semibold text-white mb-4">
      {{ existingRating ? 'Update Your Review' : 'Write a Review' }}
    </h3>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Rating -->
      <div>
        <label class="mb-2 block text-sm font-medium text-navy-200">Your Rating</label>
        <RatingStars
          v-model="form.rating"
          :readonly="false"
        />
      </div>

      <!-- Review Text -->
      <div>
        <label class="mb-2 block text-sm font-medium text-navy-200">Your Review (Optional)</label>
        <textarea
          v-model="form.review"
          rows="4"
          placeholder="Share your experience with this course..."
          class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        ></textarea>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
        <p class="text-sm text-red-300">{{ error }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
        <p class="text-sm text-green-300">{{ success }}</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button
          type="submit"
          :disabled="loading || !form.rating"
          class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          {{ loading ? 'Submitting...' : existingRating ? 'Update Review' : 'Submit Review' }}
        </button>
        <button
          v-if="existingRating"
          type="button"
          @click="onDelete"
          :disabled="deleting"
          class="rounded-lg border border-red-500/50 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ deleting ? 'Deleting...' : 'Delete Review' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  courseId: string
  existingRating?: {
    id: string
    rating: number
    review?: string | null
  }
}>()

const emit = defineEmits<{
  submitted: []
  deleted: []
}>()

const form = ref({
  rating: props.existingRating?.rating || 0,
  review: props.existingRating?.review || ''
})

const loading = ref(false)
const deleting = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

async function onSubmit() {
  if (!form.value.rating) {
    error.value = 'Please select a rating'
    return
  }

  try {
    loading.value = true
    error.value = null
    success.value = null

    const endpoint = props.existingRating
      ? `/api/courses/${props.courseId}/rating`
      : `/api/courses/${props.courseId}/rating`

    const method = props.existingRating ? 'PUT' : 'POST'

    await $fetch(endpoint, {
      method,
      body: {
        rating: form.value.rating,
        review: form.value.review || undefined
      }
    })

    success.value = props.existingRating ? 'Review updated successfully!' : 'Review submitted successfully!'
    emit('submitted')
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = null
    }, 3000)
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to submit review. Please try again.'
  } finally {
    loading.value = false
  }
}

async function onDelete() {
  if (!confirm('Are you sure you want to delete your review?')) {
    return
  }

  try {
    deleting.value = true
    error.value = null

    await $fetch(`/api/courses/${props.courseId}/rating`, {
      method: 'DELETE'
    })

    emit('deleted')
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to delete review. Please try again.'
  } finally {
    deleting.value = false
  }
}
</script>



