<template>
  <section class="mx-auto max-w-4xl px-3 sm:px-4 py-8">
    <div class="mb-6 sm:mb-8">
      <NuxtLink
        to="/instructor/courses"
        class="inline-flex items-center gap-2 text-sm text-navy-400 hover:text-navy-300 mb-4"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Courses
      </NuxtLink>
      <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">
        Create New Course
      </h1>
      <p class="mt-1 sm:mt-2 text-sm sm:text-base text-navy-300">Fill in the details to create your course</p>
    </div>

    <form @submit.prevent="createCourse" class="space-y-6">
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
                placeholder="e.g., Introduction to Web Development"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Description *</label>
              <textarea
                v-model="form.description"
                required
                rows="5"
                placeholder="Describe what students will learn in this course..."
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              ></textarea>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Prerequisites</label>
              <textarea
                v-model="form.prerequisites"
                rows="3"
                placeholder="No prior experience required..."
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
                placeholder="0.00"
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
              placeholder="30"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <p class="mt-1 text-xs text-navy-400">Default: 30%. This is the percentage the platform takes from each sale.</p>
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
                placeholder="https://example.com/image.jpg"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <p class="mt-1 text-xs text-navy-400">A high-quality image that represents your course</p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Preview Video URL</label>
              <input
                v-model="form.previewVideoUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=... or direct video URL"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <p class="mt-1 text-xs text-navy-400">Supports YouTube, Vimeo, or direct video URLs</p>
            </div>
          </div>
        </div>

        <!-- Exam Configuration (Optional) -->
        <div>
          <h2 class="text-xl font-semibold text-white mb-4">Exam Configuration (Optional)</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Question Count</label>
                <input
                  v-model.number="form.examConfig.questionCount"
                  type="number"
                  min="1"
                  placeholder="20"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Duration (minutes)</label>
                <input
                  v-model.number="form.examConfig.duration"
                  type="number"
                  min="1"
                  placeholder="60"
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
                  placeholder="70"
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Options -->
        <div class="rounded-lg border border-navy-700/50 bg-navy-900/40 p-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              v-model="form.submitForReview"
              type="checkbox"
              class="h-4 w-4 rounded border-navy-600 bg-navy-800 text-purple-600 focus:ring-purple-500"
            />
            <div>
              <span class="text-sm font-medium text-white">Submit for Review</span>
              <p class="text-xs text-navy-400 mt-1">Check this to submit your course for admin review after creation</p>
            </div>
          </label>
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
          type="submit"
          :disabled="loading"
          class="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 text-sm font-medium text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Creating...' : 'Create Course' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const { user } = useAuth()
if (!user.value || user.value.role !== 'INSTRUCTOR') {
  await navigateTo('/dashboard')
}

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
  },
  submitForReview: false
})

const loading = ref(false)

async function createCourse() {
  try {
    loading.value = true
    
    const courseData: any = {
      name: form.name,
      description: form.description,
      price: form.price,
      currency: form.currency,
      prerequisites: form.prerequisites || undefined,
      thumbnailUrl: form.thumbnailUrl || undefined,
      previewVideoUrl: form.previewVideoUrl || undefined,
      platformCommissionPercentage: form.platformCommissionPercentage,
      submitForReview: form.submitForReview
    }

    // Only include exam config if all fields are filled
    if (form.examConfig.questionCount && form.examConfig.duration && form.examConfig.passingScore) {
      courseData.examConfig = form.examConfig
    }

    const course = await $fetch('/api/courses', {
      method: 'POST',
      body: courseData
    })

    if (form.submitForReview) {
      alert('Course created and submitted for review successfully!')
    } else {
      alert('Course created successfully! You can edit it and submit for review later.')
    }

    await navigateTo(`/instructor/courses/${course.id}`)
  } catch (error: any) {
    alert(error.data?.message || 'Failed to create course')
  } finally {
    loading.value = false
  }
}
</script>





