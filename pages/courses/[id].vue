<template>
  <div class="bg-cream-50 min-h-screen">
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
        <p class="mt-4 text-gray-600">Loading course details...</p>
      </div>
    </div>

    <div v-else-if="course">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink to="/courses" class="text-primary-600 hover:text-primary-700 text-sm mb-4 inline-flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Courses
        </NuxtLink>
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">
          {{ course.name }}
        </h1>
        <p class="mt-2 text-lg text-gray-600">{{ course.description }}</p>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Thumbnail -->
          <div v-if="course.thumbnailUrl" class="rounded-2xl bg-white border-2 border-primary-200 shadow-card overflow-hidden">
            <img :src="course.thumbnailUrl" :alt="course.name" class="w-full h-64 object-cover" />
          </div>

          <!-- Course Content -->
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Course Content</h2>
            <div v-for="topic in course.topics" :key="topic.id" class="mb-6 last:mb-0">
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ topic.name }}</h3>
              <p v-if="topic.description" class="text-sm text-gray-500 mb-3">{{ topic.description }}</p>
              <ul class="space-y-2">
                <li
                  v-for="lesson in topic.lessons"
                  :key="lesson.id"
                  class="flex items-center justify-between rounded-xl border border-cream-200 bg-cream-50 p-3 hover:bg-cream-100 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <svg class="h-5 w-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm text-gray-900">{{ lesson.title }}</span>
                  </div>
                  <span v-if="lesson.videoDuration" class="text-xs text-gray-500">
                    {{ formatDuration(lesson.videoDuration) }}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Prerequisites -->
          <div v-if="course.prerequisites" class="rounded-2xl bg-white border border-cream-200 shadow-card p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Prerequisites</h2>
            <p class="text-sm text-gray-600">{{ course.prerequisites }}</p>
          </div>

          <!-- Reviews Section -->
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Reviews & Ratings</h2>
            
            <!-- Review Form (only if enrolled) -->
            <div v-if="course.enrollment && course.enrollment.status === 'ACTIVE'" class="mb-6">
              <ReviewForm
                :course-id="courseId"
                :existing-rating="userRating"
                @submitted="handleReviewSubmitted"
                @deleted="handleReviewDeleted"
              />
            </div>
            
            <!-- Reviews List -->
            <CourseReviews
              ref="reviewsRef"
              :course-id="courseId"
            />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <!-- Enrollment Card -->
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6 sticky top-4">
            <!-- Rating Display -->
            <div v-if="course.averageRating && course.averageRating > 0" class="mb-4">
              <RatingStars
                :model-value="course.averageRating"
                :readonly="true"
                :show-value="true"
                :show-count="true"
                :total-ratings="course.totalRatings || 0"
              />
            </div>
            
            <div class="text-3xl font-bold text-gray-900 mb-2">
              {{ course.currency }} {{ Number(course.price).toFixed(2) }}
            </div>
            <div v-if="course.enrollment && course.enrollment.status === 'ACTIVE'" class="mt-6">
              <div class="mb-4">
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-600">Progress</span>
                  <span class="text-gray-900 font-medium">{{ Number(course.enrollment.progressPercent).toFixed(0) }}%</span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full bg-cream-200">
                  <div
                    class="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all"
                    :style="{ width: `${Number(course.enrollment.progressPercent)}%` }"
                  ></div>
                </div>
              </div>
              <NuxtLink
                :to="`/dashboard/learn/${course.id}`"
                class="block w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-3 text-center text-sm font-semibold text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
              >
                Continue Learning
              </NuxtLink>
            </div>
            <div v-else-if="course.enrollment && (course.enrollment.status === 'PENDING' || (course.enrollment.status !== 'ACTIVE' && course.enrollment.status !== 'CANCELLED'))" class="mt-6">
              <div class="mb-4 rounded-xl bg-accent-50 border border-accent-200 p-4">
                <p class="text-sm text-accent-700 mb-1 font-medium">Enrollment pending payment</p>
                <p class="text-xs text-accent-600">Complete your payment to access the course.</p>
              </div>
              <div class="flex gap-3">
                <NuxtLink
                  :to="`/checkout/${course.id}`"
                  class="flex-1 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-5 py-3 text-center text-sm font-semibold text-white hover:from-accent-600 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Complete Payment
                </NuxtLink>
                <button
                  @click="handleCancelEnrollment"
                  :disabled="cancelling"
                  class="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  title="Cancel enrollment"
                >
                  <svg v-if="!cancelling" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span v-else class="h-5 w-5 inline-block animate-spin rounded-full border-2 border-red-400 border-t-transparent"></span>
                  <span v-if="!cancelling">Cancel</span>
                </button>
              </div>
            </div>
            <div v-else>
              <button
                @click="handleEnroll"
                :disabled="enrolling"
                class="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-3 text-sm font-semibold text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="enrolling" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ enrolling ? 'Processing...' : 'Enroll Now' }}
              </button>
            </div>
          </div>

          <!-- Preview Video -->
          <div v-if="course.previewVideoUrl" class="mt-6 rounded-2xl bg-white border border-cream-200 shadow-card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Preview</h3>
            <div class="aspect-video rounded-xl overflow-hidden bg-gray-100">
              <VideoPlayer :video-url="course.previewVideoUrl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const courseId = route.params.id as string

const { data: course, refresh, pending: loading } = await useFetch(`/api/courses/${courseId}`)

const enrolling = ref(false)
const cancelling = ref(false)
const reviewsRef = ref<any>(null)
const userRating = ref<any>(null)

// Fetch user's rating
const { data: ratingsData } = await useFetch(`/api/courses/${courseId}/ratings`, {
  query: { page: 1, limit: 10 }
})

if (ratingsData.value?.userRating) {
  userRating.value = ratingsData.value.userRating
}

const handleReviewSubmitted = async () => {
  if (reviewsRef.value) {
    await reviewsRef.value.refresh()
  }
  // Reload user rating
  const updated = await $fetch(`/api/courses/${courseId}/ratings`, {
    query: { page: 1, limit: 10 }
  })
  userRating.value = updated.userRating || null
}

const handleReviewDeleted = async () => {
  userRating.value = null
  if (reviewsRef.value) {
    await reviewsRef.value.refresh()
  }
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const toast = useToast()

const handleEnroll = async () => {
  if (enrolling.value) return

  try {
    enrolling.value = true
    
    // For free courses, enroll directly
    if (Number(course.value?.price) === 0) {
      const result = await $fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' })
      const data = result as any
      
      console.log('Free course enrollment response:', data)
      
      if (data.enrollment) {
        await refresh()
        navigateTo(`/dashboard/learn/${courseId}`)
        return
      }
    }
    
    // For paid courses, redirect to checkout page
    console.log('Redirecting to checkout page for paid course')
    navigateTo(`/checkout/${courseId}`)
  } catch (error: any) {
    console.error('Enrollment error:', error)
    const errorMessage = error.data?.message || error.message || 'Failed to proceed. Please try again.'
    toast.error(errorMessage)
  } finally {
    enrolling.value = false
  }
}

const handleCancelEnrollment = async () => {
  if (cancelling.value || !course.value?.enrollment) return

  try {
    cancelling.value = true
    
    toast.warning('Cancelling enrollment...')
    
    await $fetch(`/api/enrollments/${course.value.enrollment.id}/unenroll`, {
      method: 'DELETE'
    })
    
    // Refresh course data to remove enrollment
    await refresh()
    
    toast.success('Enrollment cancelled successfully.')
  } catch (error: any) {
    console.error('Cancel enrollment error:', error)
    toast.error(error.data?.message || 'Failed to cancel enrollment. Please try again.')
  } finally {
    cancelling.value = false
  }
}
</script>
