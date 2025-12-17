<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
        <p class="mt-4 text-navy-300">Loading course details...</p>
      </div>
    </div>

    <div v-else-if="course">
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink to="/courses" class="text-navy-400 hover:text-navy-300 text-sm mb-4 inline-block">← Back to Courses</NuxtLink>
        <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
          {{ course.name }}
        </h1>
        <p class="mt-2 text-lg text-navy-300">{{ course.description }}</p>
      </div>

      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Thumbnail -->
          <div v-if="course.thumbnailUrl" class="rounded-xl border border-navy-700/50 bg-navy-800/30 overflow-hidden">
            <img :src="course.thumbnailUrl" :alt="course.name" class="w-full h-64 object-cover" />
          </div>

          <!-- Course Content -->
          <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Course Content</h2>
            <div v-for="topic in course.topics" :key="topic.id" class="mb-6 last:mb-0">
              <h3 class="text-lg font-medium text-white mb-2">{{ topic.name }}</h3>
              <p v-if="topic.description" class="text-sm text-navy-300 mb-3">{{ topic.description }}</p>
              <ul class="space-y-2">
                <li
                  v-for="lesson in topic.lessons"
                  :key="lesson.id"
                  class="flex items-center justify-between rounded-lg border border-navy-700/50 bg-navy-800/30 p-3 hover:bg-navy-800/50 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <svg class="h-5 w-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm text-white">{{ lesson.title }}</span>
                  </div>
                  <span v-if="lesson.videoDuration" class="text-xs text-navy-400">
                    {{ formatDuration(lesson.videoDuration) }}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Prerequisites -->
          <div v-if="course.prerequisites" class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
            <h2 class="text-xl font-semibold text-white mb-2">Prerequisites</h2>
            <p class="text-sm text-navy-300">{{ course.prerequisites }}</p>
          </div>

          <!-- Reviews Section -->
          <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
            <h2 class="text-xl font-semibold text-white mb-4">Reviews & Ratings</h2>
            
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
          <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 sticky top-4">
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
            
            <div class="text-3xl font-bold text-white mb-2">
              {{ course.currency }} {{ Number(course.price).toFixed(2) }}
            </div>
            <div v-if="course.enrollment && course.enrollment.status === 'ACTIVE'" class="mt-6">
              <div class="mb-4">
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-navy-300">Progress</span>
                  <span class="text-white font-medium">{{ Number(course.enrollment.progressPercent).toFixed(0) }}%</span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full bg-navy-800">
                  <div
                    class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                    :style="{ width: `${Number(course.enrollment.progressPercent)}%` }"
                  ></div>
                </div>
              </div>
              <NuxtLink
                :to="`/dashboard/learn/${course.id}`"
                class="block w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 text-center text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Continue Learning
              </NuxtLink>
            </div>
            <div v-else-if="course.enrollment && (course.enrollment.status === 'PENDING' || (course.enrollment.status !== 'ACTIVE' && course.enrollment.status !== 'CANCELLED'))" class="mt-6">
              <div class="mb-4 rounded-lg bg-amber-500/20 border border-amber-500/30 p-4">
                <p class="text-sm text-amber-300 mb-2">Enrollment pending payment</p>
                <p class="text-xs text-amber-400">Complete your payment to access the course.</p>
              </div>
              <div class="flex gap-3">
                <NuxtLink
                  :to="`/checkout/${course.id}`"
                  class="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 text-center text-sm font-medium text-white hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Complete Payment
                </NuxtLink>
                <button
                  @click="handleCancelEnrollment"
                  :disabled="cancelling"
                  class="rounded-lg border border-red-700/50 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                class="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="enrolling" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ enrolling ? 'Processing...' : 'Enroll Now' }}
              </button>
            </div>
          </div>

          <!-- Preview Video -->
          <div v-if="course.previewVideoUrl" class="mt-6 rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
            <h3 class="text-lg font-semibold text-white mb-3">Preview</h3>
            <div class="aspect-video rounded-lg overflow-hidden bg-navy-900">
              <VideoPlayer :video-url="course.previewVideoUrl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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

const handleEnroll = async () => {
  if (enrolling.value) return

  try {
    enrolling.value = true
    const result = await $fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' })
    const data = result as any
    
    console.log('Enrollment response:', data)
    
    // If free course, redirect to course page
    if (data.redirectUrl === null && data.enrollment) {
      console.log('Free course enrolled, redirecting to course page')
      await refresh()
      navigateTo(`/dashboard/learn/${courseId}`)
      return
    }
    
    // If paid course with redirect URL, go directly to Paynow
    if (data.redirectUrl) {
      console.log('Redirecting to Paynow payment:', data.redirectUrl)
      
      // Store pollUrl in localStorage for later use when user returns
      if (data.pollUrl && data.invoice?.number) {
        try {
          const stored = localStorage.getItem('paynow_pollUrls') || '{}'
          const pollUrls = JSON.parse(stored)
          pollUrls[data.invoice.number] = data.pollUrl
          localStorage.setItem('paynow_pollUrls', JSON.stringify(pollUrls))
        } catch (e) {
          console.warn('Failed to store pollUrl:', e)
        }
      }
      
      window.location.href = data.redirectUrl // Use window.location for external redirect
      return
    }
    
    // Fallback: if no redirect URL but invoice exists, show payment page
    if (data.invoice && data.invoice.number) {
      console.log('No Paynow redirect, showing payment page:', data.invoice.number)
      navigateTo(`/pay/${data.invoice.number}`)
      return
    }
    
    // If already enrolled, redirect to course
    if (data.enrollment) {
      await refresh()
      navigateTo(`/dashboard/learn/${courseId}`)
    } else {
      throw new Error('Enrollment response was invalid')
    }
  } catch (error: any) {
    console.error('Enrollment error:', error)
    const errorMessage = error.data?.message || error.message || 'Failed to enroll. Please try again.'
    
    // If already enrolled, redirect to course
    if (error.data?.statusCode === 409) {
      await refresh()
      navigateTo(`/dashboard/learn/${courseId}`)
    } else {
      alert(errorMessage)
    }
  } finally {
    enrolling.value = false
  }
}

const handleCancelEnrollment = async () => {
  if (cancelling.value || !course.value?.enrollment) return

  if (!confirm(`Are you sure you want to cancel your enrollment? You can enroll again later.`)) {
    return
  }

  try {
    cancelling.value = true
    await $fetch(`/api/enrollments/${course.value.enrollment.id}/unenroll`, {
      method: 'DELETE'
    })
    
    // Refresh course data to remove enrollment
    await refresh()
    
    alert('Enrollment cancelled successfully.')
  } catch (error: any) {
    console.error('Cancel enrollment error:', error)
    alert(error.data?.message || 'Failed to cancel enrollment. Please try again.')
  } finally {
    cancelling.value = false
  }
}
</script>
