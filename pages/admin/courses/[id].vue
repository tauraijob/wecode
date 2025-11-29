<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-16">
    <div class="mb-6">
      <NuxtLink to="/admin/courses" class="text-navy-400 hover:text-navy-300 text-sm">← Back to Courses</NuxtLink>
    </div>

    <div v-if="loading" class="text-center text-navy-300">Loading course...</div>
    <div v-else-if="!course" class="text-center text-navy-300">Course not found</div>
    <div v-else>
      <!-- Course Header -->
      <div class="mb-8 rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h1 class="text-3xl font-extrabold tracking-tight text-white">{{ course.name }}</h1>
            <p class="mt-2 text-navy-300">{{ course.description }}</p>
            <div class="mt-4 flex flex-wrap gap-4 text-sm">
              <span class="text-navy-300">Status: 
                <span 
                  :class="{
                    'text-amber-400': course.status === 'DRAFT',
                    'text-green-400': course.status === 'PUBLISHED',
                    'text-navy-400': course.status === 'ARCHIVED'
                  }"
                  class="font-semibold"
                >{{ course.status }}</span>
              </span>
              <span class="text-navy-300">Price: <span class="font-semibold text-white">{{ course.currency }} {{ Number(course.price).toFixed(2) }}</span></span>
              <span class="text-navy-300">Enrollments: <span class="font-semibold text-white">{{ course._count?.enrollments || 0 }}</span></span>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="showEditModal = true"
              class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
            >
              Edit Course
            </button>
            <button
              @click="showTopicModal = true"
              class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              Add Topic
            </button>
          </div>
        </div>
      </div>

      <!-- Course Settings -->
      <div class="mb-8 rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Course Settings</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Thumbnail URL</label>
            <input
              v-model="course.thumbnailUrl"
              type="url"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              @blur="updateCourse"
            />
            <div v-if="course.thumbnailUrl" class="mt-2">
              <img :src="course.thumbnailUrl" :alt="course.name" class="h-32 w-full object-cover rounded-lg" />
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Preview Video URL</label>
            <input
              v-model="course.previewVideoUrl"
              type="url"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              @blur="updateCourse"
            />
          </div>
          <div class="md:col-span-2">
            <label class="mb-2 block text-sm font-medium text-navy-200">Prerequisites</label>
            <textarea
              v-model="course.prerequisites"
              rows="3"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              @blur="updateCourse"
            ></textarea>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Exam Question Count</label>
            <input
              v-model.number="examConfig.questionCount"
              type="number"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              @blur="updateExamConfig"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Exam Duration (minutes)</label>
            <input
              v-model.number="examConfig.duration"
              type="number"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              @blur="updateExamConfig"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Passing Score (%)</label>
            <input
              v-model.number="examConfig.passingScore"
              type="number"
              min="0"
              max="100"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              @blur="updateExamConfig"
            />
          </div>
        </div>
      </div>

      <!-- Topics and Lessons -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-white">Topics & Lessons</h2>
        <div
          v-for="topic in course.topics"
          :key="topic.id"
          class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-white">{{ topic.name }}</h3>
              <p v-if="topic.description" class="mt-1 text-sm text-navy-300">{{ topic.description }}</p>
            </div>
            <div class="flex gap-2">
              <button
                @click="editTopic(topic)"
                class="rounded-lg border border-navy-600 bg-navy-800/50 px-3 py-1.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
              >
                Edit
              </button>
              <button
                @click="showLessonModal = true; selectedTopicId = topic.id"
                class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
              >
                Add Lesson
              </button>
              <button
                @click="deleteTopic(topic.id)"
                class="rounded-lg border border-red-700/50 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <div
              v-for="lesson in topic.lessons"
              :key="lesson.id"
              class="flex items-center justify-between rounded-lg border border-navy-700/50 bg-navy-800/40 p-3 hover:bg-navy-800/60 transition-colors"
            >
              <div class="flex-1">
                <div class="font-medium text-white">{{ lesson.title }}</div>
                <div v-if="lesson.description" class="text-sm text-navy-300 mt-1">{{ lesson.description }}</div>
                <div class="text-xs text-navy-400 mt-1">
                  Order: {{ lesson.order }} • Duration: {{ formatDuration(lesson.videoDuration || 0) }}
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="generateQuiz(lesson)"
                  :disabled="generatingQuiz === lesson.id"
                  class="rounded-lg border border-green-600/50 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  title="Generate AI Quiz"
                >
                  <span v-if="generatingQuiz === lesson.id" class="h-3 w-3 animate-spin rounded-full border-2 border-green-400 border-t-transparent"></span>
                  <svg v-else class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Quiz
                </button>
                <button
                  @click="editLesson(lesson, topic.id)"
                  class="rounded-lg border border-navy-600 bg-navy-800/50 px-3 py-1.5 text-xs font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
                >
                  Edit
                </button>
                <button
                  @click="deleteLesson(lesson.id)"
                  class="rounded-lg border border-red-700/50 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
            <div v-if="topic.lessons.length === 0" class="text-sm text-navy-400 text-center py-4">
              No lessons yet. Click "Add Lesson" to create one.
            </div>
          </div>
        </div>
        <div v-if="course.topics.length === 0" class="text-center text-navy-300 py-8 rounded-xl border border-navy-800 bg-navy-900/40">
          No topics yet. Click "Add Topic" to create one.
        </div>
      </div>
    </div>

    <!-- Edit Course Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      @click.self="showEditModal = false"
    >
      <div class="w-full max-w-3xl rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/95 to-navy-800/95 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white">Edit Course</h2>
            <p class="mt-1 text-sm text-navy-300">Update course details</p>
          </div>
          <button
            @click="showEditModal = false"
            class="rounded-lg p-2 hover:bg-navy-800/50 transition-colors"
          >
            <svg class="h-5 w-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveCourse" class="space-y-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Course Name *</label>
            <input
              v-model="editForm.name"
              type="text"
              required
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Description *</label>
            <textarea
              v-model="editForm.description"
              required
              rows="4"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            ></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Price *</label>
              <input
                v-model.number="editForm.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Currency</label>
              <select
                v-model="editForm.currency"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              >
                <option value="USD">USD</option>
                <option value="ZWL">ZWL</option>
              </select>
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Status</label>
            <select
              v-model="editForm.status"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Thumbnail URL</label>
            <input
              v-model="editForm.thumbnailUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            />
            <p class="mt-1 text-xs text-navy-400">A high-quality image that represents your course</p>
            <div v-if="editForm.thumbnailUrl" class="mt-2">
              <img :src="editForm.thumbnailUrl" :alt="editForm.name" class="h-32 w-full object-cover rounded-lg" />
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Preview Video URL</label>
            <input
              v-model="editForm.previewVideoUrl"
              type="url"
              placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or direct video URL"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            />
            <p class="mt-1 text-xs text-navy-400">Supports YouTube, Vimeo, or direct video URLs</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Prerequisites</label>
            <textarea
              v-model="editForm.prerequisites"
              rows="3"
              placeholder="No prior experience required..."
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            ></textarea>
          </div>
          <div class="flex gap-3 justify-end pt-4 border-t border-navy-700/50">
            <button
              type="button"
              @click="showEditModal = false"
              class="rounded-lg border border-navy-700 bg-navy-800/50 px-5 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="saving" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Topic Modal -->
    <div
      v-if="showTopicModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      @click.self="showTopicModal = false"
    >
      <div class="w-full max-w-lg rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/95 to-navy-800/95 p-6 shadow-2xl">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">{{ editingTopic ? 'Edit Topic' : 'Add Topic' }}</h2>
          <button
            @click="showTopicModal = false; editingTopic = null"
            class="rounded-lg p-2 hover:bg-navy-800/50 transition-colors"
          >
            <svg class="h-5 w-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveTopic" class="space-y-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Topic Name *</label>
            <input
              v-model="topicForm.name"
              type="text"
              required
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Description</label>
            <textarea
              v-model="topicForm.description"
              rows="3"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            ></textarea>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Order *</label>
            <input
              v-model.number="topicForm.order"
              type="number"
              required
              min="0"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            />
          </div>
          <div class="flex gap-3 justify-end pt-4 border-t border-navy-700/50">
            <button
              type="button"
              @click="showTopicModal = false; editingTopic = null"
              class="rounded-lg border border-navy-700 bg-navy-800/50 px-5 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="savingTopic"
              class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="savingTopic" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {{ savingTopic ? 'Saving...' : (editingTopic ? 'Update Topic' : 'Create Topic') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Lesson Modal -->
    <div
      v-if="showLessonModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      @click.self="showLessonModal = false"
    >
      <div class="w-full max-w-2xl rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-900/95 to-navy-800/95 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">{{ editingLesson ? 'Edit Lesson' : 'Add Lesson' }}</h2>
          <button
            @click="showLessonModal = false; editingLesson = null; selectedTopicId = null"
            class="rounded-lg p-2 hover:bg-navy-800/50 transition-colors"
          >
            <svg class="h-5 w-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveLesson" class="space-y-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Lesson Title *</label>
            <input
              v-model="lessonForm.title"
              type="text"
              required
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            />
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Description</label>
            <textarea
              v-model="lessonForm.description"
              rows="2"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            ></textarea>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Video URL *</label>
            <input
              v-model="lessonForm.videoUrl"
              type="text"
              required
              placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or direct video URL"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            />
            <p class="mt-1 text-xs text-navy-400">
              Supports YouTube, Vimeo, or direct video URLs (e.g., .mp4, .webm)
            </p>
            <!-- Video Preview -->
            <div v-if="lessonForm.videoUrl && videoPreviewInfo.type !== 'unknown'" class="mt-4 rounded-lg border border-navy-700/50 bg-navy-800/30 p-3">
              <p class="text-xs text-navy-300 mb-2">
                <span class="font-medium">Detected:</span> {{ getVideoPlatformName(videoPreviewInfo.type) }}
              </p>
              <div class="aspect-video rounded overflow-hidden bg-navy-900">
                <VideoPlayer :video-url="lessonForm.videoUrl" />
              </div>
            </div>
            <div v-else-if="lessonForm.videoUrl && videoPreviewInfo.type === 'unknown'" class="mt-2 rounded-lg border border-amber-700/50 bg-amber-500/10 p-2">
              <p class="text-xs text-amber-400">
                ⚠️ Could not detect video platform. Please verify the URL is correct.
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Video Duration (seconds)</label>
              <input
                v-model.number="lessonForm.videoDuration"
                type="number"
                min="0"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Order *</label>
              <input
                v-model.number="lessonForm.order"
                type="number"
                required
                min="0"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
              />
            </div>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Transcript (for AI quiz generation)</label>
            <textarea
              v-model="lessonForm.transcript"
              rows="4"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            ></textarea>
            <p class="mt-1 text-xs text-navy-400">Provide a transcript of the video content for AI-powered quiz generation</p>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium text-navy-200">Notes (for AI quiz generation)</label>
            <textarea
              v-model="lessonForm.notes"
              rows="3"
              class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
            ></textarea>
            <p class="mt-1 text-xs text-navy-400">Additional notes or key points for quiz generation</p>
          </div>
          <div class="flex gap-3 justify-end pt-4 border-t border-navy-700/50">
            <button
              type="button"
              @click="showLessonModal = false; editingLesson = null; selectedTopicId = null"
              class="rounded-lg border border-navy-700 bg-navy-800/50 px-5 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="savingLesson"
              class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span v-if="savingLesson" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              {{ savingLesson ? 'Saving...' : (editingLesson ? 'Update Lesson' : 'Create Lesson') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Quiz Preview Modal -->
    <div
      v-if="showQuizModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showQuizModal = false"
    >
      <div class="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/90 to-navy-900/90 p-6">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white">Generated Quiz Preview</h2>
            <p class="text-sm text-navy-300 mt-1">
              {{ quizPreview.lesson?.title }} • {{ quizPreview.questions?.length || 0 }} questions
            </p>
          </div>
          <button
            @click="showQuizModal = false"
            class="rounded-lg border border-navy-700 bg-navy-800/50 p-2 text-navy-400 hover:bg-navy-700/50 transition-all"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="quizPreview.questions && quizPreview.questions.length > 0" class="space-y-4">
          <div
            v-for="(question, index) in quizPreview.questions"
            :key="question.id || index"
            class="rounded-lg border border-navy-700/50 bg-navy-800/40 p-4"
          >
            <div class="mb-3 flex items-start gap-2">
              <span class="flex h-6 w-6 items-center justify-center rounded bg-blue-500/20 text-xs font-semibold text-blue-400">
                {{ index + 1 }}
              </span>
              <div class="flex-1">
                <p class="font-medium text-white">{{ question.question }}</p>
                <span class="mt-1 inline-block rounded bg-navy-700/50 px-2 py-0.5 text-xs text-navy-300">
                  {{ question.type === 'multiple-choice' ? 'Multiple Choice' : 'True/False' }}
                </span>
              </div>
            </div>

            <div v-if="question.type === 'multiple-choice' && question.options" class="ml-8 space-y-2">
              <div
                v-for="(option, optIndex) in question.options"
                :key="optIndex"
                :class="{
                  'border-green-500/50 bg-green-500/10': option === question.correctAnswer,
                  'border-navy-700/50 bg-navy-800/30': option !== question.correctAnswer
                }"
                class="rounded border p-2 text-sm"
              >
                <div class="flex items-center gap-2">
                  <span class="font-medium text-navy-300">{{ String.fromCharCode(65 + optIndex) }}.</span>
                  <span :class="option === question.correctAnswer ? 'text-green-400 font-semibold' : 'text-navy-200'">
                    {{ option }}
                  </span>
                  <span v-if="option === question.correctAnswer" class="ml-auto text-xs text-green-400">✓ Correct</span>
                </div>
              </div>
            </div>

            <div v-else class="ml-8">
              <div
                :class="{
                  'border-green-500/50 bg-green-500/10': question.correctAnswer === true,
                  'border-navy-700/50 bg-navy-800/30': question.correctAnswer !== true
                }"
                class="rounded border p-2 text-sm"
              >
                <span :class="question.correctAnswer === true ? 'text-green-400 font-semibold' : 'text-navy-200'">
                  {{ question.correctAnswer === true ? 'True' : 'False' }}
                </span>
                <span class="ml-2 text-xs text-green-400">✓ Correct Answer</span>
              </div>
            </div>

            <div v-if="question.explanation" class="mt-3 ml-8 rounded bg-navy-900/50 p-2 text-xs text-navy-300">
              <span class="font-medium text-navy-400">Explanation:</span> {{ question.explanation }}
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-navy-300">
          No questions generated. Please check that the lesson has transcript, notes, or description.
        </div>

        <div class="mt-6 flex justify-end gap-3 border-t border-navy-700/50 pt-4">
          <button
            @click="showQuizModal = false"
            class="rounded-lg border border-navy-700 bg-navy-800/50 px-5 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
import { parseVideoUrl, getVideoPlatformName } from '~/composables/useVideoUrl'

const route = useRoute()
const courseId = route.params.id as string

const { data: course, refresh, pending: loading } = await useFetch(`/api/courses/${courseId}`)

const showEditModal = ref(false)
const showTopicModal = ref(false)
const showLessonModal = ref(false)
const showQuizModal = ref(false)
const saving = ref(false)
const savingTopic = ref(false)
const savingLesson = ref(false)
const generatingQuiz = ref<string | null>(null)
const editingTopic = ref<any>(null)
const editingLesson = ref<any>(null)
const selectedTopicId = ref<string | null>(null)
const quizPreview = ref<any>({ questions: [], lesson: null })

const editForm = ref({
  name: '',
  description: '',
  price: 0,
  currency: 'USD',
  status: 'DRAFT',
  thumbnailUrl: '',
  previewVideoUrl: '',
  prerequisites: ''
})

const topicForm = ref({
  name: '',
  description: '',
  order: 0
})

const lessonForm = ref({
  title: '',
  description: '',
  videoUrl: '',
  videoDuration: 0,
  transcript: '',
  notes: '',
  order: 0
})

const examConfig = computed(() => {
  if (course.value?.examConfig && typeof course.value.examConfig === 'object') {
    return {
      questionCount: (course.value.examConfig as any).questionCount || 20,
      duration: (course.value.examConfig as any).duration || 60,
      passingScore: (course.value.examConfig as any).passingScore || 70
    }
  }
  return { questionCount: 20, duration: 60, passingScore: 70 }
})

const videoPreviewInfo = computed(() => parseVideoUrl(lessonForm.value.videoUrl))

watch(course, (newCourse) => {
  if (newCourse) {
    editForm.value = {
      name: newCourse.name,
      description: newCourse.description,
      price: Number(newCourse.price),
      currency: newCourse.currency || 'USD',
      status: newCourse.status,
      thumbnailUrl: newCourse.thumbnailUrl || '',
      previewVideoUrl: newCourse.previewVideoUrl || '',
      prerequisites: newCourse.prerequisites || ''
    }
  }
}, { immediate: true })

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const updateCourse = async () => {
  try {
    await $fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: {
        thumbnailUrl: course.value?.thumbnailUrl,
        previewVideoUrl: course.value?.previewVideoUrl,
        prerequisites: course.value?.prerequisites
      }
    })
    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to update course')
  }
}

const updateExamConfig = async () => {
  try {
    await $fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: {
        examConfig: examConfig.value
      }
    })
    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to update exam config')
  }
}

const saveCourse = async () => {
  try {
    saving.value = true
    await $fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: editForm.value
    })
    showEditModal.value = false
    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to update course')
  } finally {
    saving.value = false
  }
}

const saveTopic = async () => {
  try {
    savingTopic.value = true
    if (editingTopic.value) {
      await $fetch(`/api/courses/${courseId}/topics/${editingTopic.value.id}`, {
        method: 'PUT',
        body: topicForm.value
      })
    } else {
      await $fetch(`/api/courses/${courseId}/topics`, {
        method: 'POST',
        body: topicForm.value
      })
    }
    showTopicModal.value = false
    editingTopic.value = null
    topicForm.value = { name: '', description: '', order: 0 }
    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to save topic')
  } finally {
    savingTopic.value = false
  }
}

const editTopic = (topic: any) => {
  editingTopic.value = topic
  topicForm.value = {
    name: topic.name,
    description: topic.description || '',
    order: topic.order
  }
  showTopicModal.value = true
}

const deleteTopic = async (topicId: string) => {
  if (!confirm('Are you sure you want to delete this topic? All lessons will be deleted too.')) return
  try {
    await $fetch(`/api/courses/${courseId}/topics/${topicId}`, {
      method: 'DELETE'
    })
    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to delete topic')
  }
}

const saveLesson = async () => {
  if (!selectedTopicId.value) return
  try {
    savingLesson.value = true
    if (editingLesson.value) {
      await $fetch(`/api/courses/${courseId}/topics/${selectedTopicId.value}/lessons/${editingLesson.value.id}`, {
        method: 'PUT',
        body: lessonForm.value
      })
    } else {
      await $fetch(`/api/courses/${courseId}/topics/${selectedTopicId.value}/lessons`, {
        method: 'POST',
        body: lessonForm.value
      })
    }
    showLessonModal.value = false
    editingLesson.value = null
    selectedTopicId.value = null
    lessonForm.value = {
      title: '',
      description: '',
      videoUrl: '',
      videoDuration: 0,
      transcript: '',
      notes: '',
      order: 0
    }
    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to save lesson')
  } finally {
    savingLesson.value = false
  }
}

const editLesson = (lesson: any, topicId: string) => {
  editingLesson.value = lesson
  selectedTopicId.value = topicId
  lessonForm.value = {
    title: lesson.title,
    description: lesson.description || '',
    videoUrl: lesson.videoUrl,
    videoDuration: lesson.videoDuration || 0,
    transcript: lesson.transcript || '',
    notes: lesson.notes || '',
    order: lesson.order
  }
  showLessonModal.value = true
}

const generateQuiz = async (lesson: any) => {
  if (!lesson.transcript && !lesson.notes && !lesson.description) {
    alert('Please add transcript, notes, or description to the lesson before generating a quiz.')
    return
  }

  try {
    generatingQuiz.value = lesson.id
    const result = await $fetch(`/api/admin/lessons/${lesson.id}/quiz/generate`, {
      method: 'POST',
      body: {
        questionCount: 10,
        difficulty: 'medium'
      }
    })
    
    quizPreview.value = result
    showQuizModal.value = true
  } catch (error: any) {
    console.error('Error generating quiz:', error)
    alert(error.data?.message || 'Failed to generate quiz. Please check your GEMINI_API_KEY environment variable.')
  } finally {
    generatingQuiz.value = null
  }
}

const deleteLesson = async (lessonId: string) => {
  if (!confirm('Are you sure you want to delete this lesson?')) return
  try {
    // Find the topic ID for this lesson
    const topic = course.value?.topics.find(t => t.lessons.some(l => l.id === lessonId))
    if (!topic) {
      alert('Topic not found')
      return
    }
    await $fetch(`/api/courses/${courseId}/topics/${topic.id}/lessons/${lessonId}`, {
      method: 'DELETE'
    })
    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to delete lesson')
  }
}
</script>

