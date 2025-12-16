<template>
  <section class="mx-auto max-w-4xl px-3 sm:px-4 py-8">
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
    </div>

    <div v-else-if="!course" class="text-center py-20">
      <p class="text-navy-400">Course not found</p>
      <NuxtLink to="/instructor/courses" class="mt-4 inline-block text-purple-400 hover:text-purple-300">
        Back to Courses
      </NuxtLink>
    </div>

    <div v-else>
      <div class="mb-8">
        <NuxtLink
          to="/instructor/courses"
          class="inline-flex items-center gap-2 text-sm text-navy-400 hover:text-navy-300 mb-4"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </NuxtLink>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">
              {{ course.name }}
            </h1>
            <div class="mt-2 flex items-center gap-3">
              <span
                :class="{
                  'bg-green-500/20 text-green-400 border-green-500/30': course.status === 'PUBLISHED',
                  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30': course.status === 'DRAFT',
                  'bg-gray-500/20 text-gray-400 border-gray-500/30': course.status === 'ARCHIVED'
                }"
                class="rounded-full border px-2.5 py-1 text-xs font-medium"
              >
                {{ course.status }}
              </span>
              <span
                :class="{
                  'bg-blue-500/20 text-blue-400 border-blue-500/30': course.reviewStatus === 'PENDING_REVIEW',
                  'bg-green-500/20 text-green-400 border-green-500/30': course.reviewStatus === 'APPROVED',
                  'bg-red-500/20 text-red-400 border-red-500/30': course.reviewStatus === 'REJECTED'
                }"
                class="rounded-full border px-2.5 py-1 text-xs font-medium"
              >
                {{ course.reviewStatus.replace('_', ' ') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rejection Reason -->
      <div v-if="course.rejectionReason" class="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
        <h3 class="text-sm font-semibold text-red-400 mb-2">Rejection Reason</h3>
        <p class="text-sm text-red-300">{{ course.rejectionReason }}</p>
      </div>

      <form @submit.prevent="updateCourse" class="space-y-6">
        <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 space-y-6">
          <!-- Basic Information -->
          <div>
            <h2 class="text-xl font-semibold text-white mb-4">Basic Information</h2>
            <div class="space-y-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Course Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Description *</label>
                <textarea
                  v-model="form.description"
                  required
                  rows="5"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                ></textarea>
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Prerequisites</label>
                <textarea
                  v-model="form.prerequisites"
                  rows="3"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div>
            <h2 class="text-xl font-semibold text-white mb-4">Pricing</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Price *</label>
                <input
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Currency</label>
                <select
                  v-model="form.currency"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="USD">USD</option>
                  <option value="ZWL">ZWL</option>
                </select>
              </div>
            </div>
            <div class="mt-4">
              <label class="mb-2 block text-sm font-medium text-navy-200">Platform Commission (%)</label>
              <input
                v-model.number="form.platformCommissionPercentage"
                type="number"
                step="0.1"
                min="0"
                max="100"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <!-- Media -->
          <div>
            <h2 class="text-xl font-semibold text-white mb-4">Media</h2>
            <div class="space-y-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Thumbnail URL</label>
                <input
                  v-model="form.thumbnailUrl"
                  type="url"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Preview Video URL</label>
                <input
                  v-model="form.previewVideoUrl"
                  type="url"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <!-- Exam Configuration -->
          <div>
            <h2 class="text-xl font-semibold text-white mb-4">Exam Configuration</h2>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Question Count</label>
                <input
                  v-model.number="form.examConfig.questionCount"
                  type="number"
                  min="1"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Duration (minutes)</label>
                <input
                  v-model.number="form.examConfig.duration"
                  type="number"
                  min="1"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Passing Score (%)</label>
                <input
                  v-model.number="form.examConfig.passingScore"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 justify-end">
          <NuxtLink
            to="/instructor/courses"
            class="rounded-lg border border-navy-600 bg-navy-800/50 px-6 py-3 text-sm font-medium text-white hover:bg-navy-700/50 transition-colors"
          >
            Cancel
          </NuxtLink>
          <button
            v-if="course.reviewStatus !== 'PENDING_REVIEW' && course.reviewStatus !== 'APPROVED'"
            @click="submitForReview"
            :disabled="submitting"
            type="button"
            class="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {{ submitting ? 'Submitting...' : 'Submit for Review' }}
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 text-sm font-medium text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { user } = useAuth()
if (!user.value || user.value.role !== 'INSTRUCTOR') {
  await navigateTo('/dashboard')
}

const route = useRoute()
const courseId = route.params.id as string

const { data: course, refresh, pending: loading } = await useFetch(`/api/instructor/courses/${courseId}`)

const form = reactive({
  name: '',
  description: '',
  price: 0,
  currency: 'USD',
  prerequisites: '',
  thumbnailUrl: '',
  previewVideoUrl: '',
  platformCommissionPercentage: 30,
  examConfig: {
    questionCount: 20,
    duration: 60,
    passingScore: 70
  }
})

// Populate form when course loads
watch(course, (newCourse) => {
  if (newCourse) {
    form.name = newCourse.name
    form.description = newCourse.description
    form.price = Number(newCourse.price)
    form.currency = newCourse.currency || 'USD'
    form.prerequisites = newCourse.prerequisites || ''
    form.thumbnailUrl = newCourse.thumbnailUrl || ''
    form.previewVideoUrl = newCourse.previewVideoUrl || ''
    form.platformCommissionPercentage = Number(newCourse.platformCommissionPercentage || 30)
    if (newCourse.examConfig) {
      form.examConfig = {
        questionCount: (newCourse.examConfig as any).questionCount || 20,
        duration: (newCourse.examConfig as any).duration || 60,
        passingScore: (newCourse.examConfig as any).passingScore || 70
      }
    }
  }
}, { immediate: true })

const saving = ref(false)
const submitting = ref(false)

async function updateCourse() {
  try {
    saving.value = true
    
    const courseData: any = {
      name: form.name,
      description: form.description,
      price: form.price,
      currency: form.currency,
      prerequisites: form.prerequisites || null,
      thumbnailUrl: form.thumbnailUrl || null,
      previewVideoUrl: form.previewVideoUrl || null,
      platformCommissionPercentage: form.platformCommissionPercentage
    }

    if (form.examConfig.questionCount && form.examConfig.duration && form.examConfig.passingScore) {
      courseData.examConfig = form.examConfig
    }

    await $fetch(`/api/instructor/courses/${courseId}`, {
      method: 'PUT',
      body: courseData
    })

    await refresh()
    alert('Course updated successfully!')
  } catch (error: any) {
    alert(error.data?.message || 'Failed to update course')
  } finally {
    saving.value = false
  }
}

async function submitForReview() {
  try {
    submitting.value = true
    await $fetch(`/api/courses/${courseId}/submit-review`, {
      method: 'POST'
    })
    await refresh()
    alert('Course submitted for review successfully!')
  } catch (error: any) {
    alert(error.data?.message || 'Failed to submit course for review')
  } finally {
    submitting.value = false
  }
}
</script>





