<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 py-8">
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
        <p class="mt-4 text-navy-300">Loading course...</p>
      </div>
    </div>

    <div v-else-if="course">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-start justify-between mb-4">
          <NuxtLink to="/dashboard/learn" class="text-navy-400 hover:text-navy-300 text-sm inline-block">← Back to My Courses</NuxtLink>
          <button
            v-if="course.enrollment && course.enrollment.status !== 'COMPLETED'"
            @click="handleUnenroll(course.enrollment.id, course.name)"
            :disabled="unenrolling"
            class="rounded-lg border border-red-700/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Unenroll from this course"
          >
            <svg v-if="!unenrolling" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span v-else class="h-4 w-4 inline-block animate-spin rounded-full border-2 border-red-400 border-t-transparent"></span>
            <span class="hidden sm:inline">{{ unenrolling ? 'Unenrolling...' : 'Unenroll' }}</span>
          </button>
        </div>
        <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
          {{ course.name }}
        </h1>
        <div class="mt-4 flex items-center justify-between">
          <div class="flex-1">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-navy-300">Progress</span>
              <span class="text-white font-medium">{{ Number(course.enrollment?.progressPercent || 0).toFixed(0) }}%</span>
            </div>
            <div class="h-3 w-full overflow-hidden rounded-full bg-navy-800">
              <div
                class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                :style="{ width: `${Number(course.enrollment?.progressPercent || 0)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-4">
        <!-- Course Content Sidebar -->
        <div class="lg:col-span-1">
          <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-4 sticky top-4">
            <h2 class="text-lg font-semibold text-white mb-4">Course Content</h2>
            <div class="space-y-4">
              <div v-for="topic in course.topics" :key="topic.id" class="space-y-2">
                <h3 class="text-sm font-medium text-navy-300">{{ topic.name }}</h3>
                <ul class="space-y-1">
                  <li
                    v-for="lesson in topic.lessons"
                    :key="lesson.id"
                    @click="selectLesson(lesson)"
                    :class="[
                      'cursor-pointer rounded-lg px-3 py-2 text-sm transition-all',
                      currentLesson?.id === lesson.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'hover:bg-navy-800/50 text-navy-200 border border-navy-700/50'
                    ]"
                  >
                    {{ lesson.title }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="lg:col-span-3">
          <div v-if="!currentLesson" class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-12 text-center">
            <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
              <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Select a lesson to begin</h3>
            <p class="text-navy-300">Choose a lesson from the sidebar to start learning</p>
          </div>

          <div v-else class="space-y-6">
            <!-- Video Player -->
            <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
              <h2 class="text-2xl font-semibold text-white mb-4">{{ currentLesson.title }}</h2>
              <div v-if="currentLesson.description" class="mb-4 text-navy-300">
                {{ currentLesson.description }}
              </div>
              <div class="aspect-video rounded-lg overflow-hidden bg-navy-900">
                <VideoPlayer
                  :video-url="currentLesson.videoUrl"
                  @ended="handleVideoEnd"
                />
              </div>
              <button
                v-if="!lessonCompleted"
                @click="markComplete"
                :disabled="completing"
                class="mt-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="completing" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ completing ? 'Marking...' : 'Mark as Complete' }}
              </button>
              <div v-else class="mt-4 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Lesson completed
              </div>
            </div>

            <!-- Practice Quiz -->
            <div
              v-if="lessonCompleted && !quizStarted"
              class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6"
            >
              <h3 class="text-xl font-semibold text-white mb-4">Practice Quiz</h3>
              <p class="text-navy-300 mb-4">
                Test your understanding with a practice quiz based on this lesson.
              </p>
              <button
                @click="startQuiz"
                :disabled="generatingQuiz"
                class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="generatingQuiz" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ generatingQuiz ? 'Generating Quiz...' : 'Start Quiz' }}
              </button>
            </div>

            <!-- Quiz Interface -->
            <div v-if="quizStarted && quizQuestions.length > 0" class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
              <h3 class="text-xl font-semibold text-white mb-4">Practice Quiz</h3>
              <div v-for="(question, index) in quizQuestions" :key="question.id" class="mb-6">
                <p class="mb-3 font-medium text-white">{{ index + 1 }}. {{ question.question }}</p>
                <div v-if="question.type === 'multiple-choice'" class="space-y-2">
                  <label
                    v-for="option in question.options"
                    :key="option"
                    class="flex items-center space-x-3 cursor-pointer rounded-lg border border-navy-700/50 bg-navy-800/30 px-4 py-3 hover:bg-navy-800/50 transition-colors"
                  >
                    <input
                      type="radio"
                      :name="`question-${index}`"
                      :value="option"
                      v-model="quizAnswers[index]"
                      class="text-blue-500"
                    />
                    <span class="text-navy-200">{{ option }}</span>
                  </label>
                </div>
                <div v-else class="space-y-2">
                  <label class="flex items-center space-x-3 cursor-pointer rounded-lg border border-navy-700/50 bg-navy-800/30 px-4 py-3 hover:bg-navy-800/50 transition-colors">
                    <input
                      type="radio"
                      :name="`question-${index}`"
                      :value="true"
                      v-model="quizAnswers[index]"
                      class="text-blue-500"
                    />
                    <span class="text-navy-200">True</span>
                  </label>
                  <label class="flex items-center space-x-3 cursor-pointer rounded-lg border border-navy-700/50 bg-navy-800/30 px-4 py-3 hover:bg-navy-800/50 transition-colors">
                    <input
                      type="radio"
                      :name="`question-${index}`"
                      :value="false"
                      v-model="quizAnswers[index]"
                      class="text-blue-500"
                    />
                    <span class="text-navy-200">False</span>
                  </label>
                </div>
              </div>
              <button
                @click="submitQuiz"
                :disabled="submittingQuiz || quizAnswers.length < quizQuestions.length"
                class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="submittingQuiz" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ submittingQuiz ? 'Submitting...' : 'Submit Quiz' }}
              </button>
            </div>

            <!-- Quiz Results -->
            <div v-if="quizResult" class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6">
              <h3 class="text-xl font-semibold text-white mb-4">Quiz Results</h3>
              <div class="text-4xl font-bold text-white mb-2">{{ quizResult.score.toFixed(0) }}%</div>
              <p class="text-navy-300 mb-4">
                You got {{ quizResult.correct }} out of {{ quizResult.total }} questions correct.
              </p>
              <button
                @click="resetQuiz"
                class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
              >
                Retake Quiz
              </button>
            </div>

            <!-- Final Exam Button -->
            <div
              v-if="course.enrollment?.status === 'COMPLETED' && !examStarted"
              class="rounded-xl border border-green-700/50 bg-gradient-to-br from-green-900/40 to-emerald-900/40 p-6"
            >
              <h3 class="text-xl font-semibold text-green-400 mb-4">Final Exam Available</h3>
              <p class="text-navy-300 mb-4">
                You've completed all lessons! Take the final exam to earn your certificate.
              </p>
              <button
                @click="startExam"
                :disabled="startingExam"
                class="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span v-if="startingExam" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {{ startingExam ? 'Starting...' : 'Start Final Exam' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parseVideoUrl } from '~/composables/useVideoUrl'

definePageMeta({ layout: 'dashboard' })
const route = useRoute()
const courseId = route.params.id as string

const { data: course, refresh, pending: loading } = await useFetch(`/api/courses/${courseId}`)

const currentLesson = ref<any>(null)
const lessonCompleted = ref(false)
const completing = ref(false)

const quizStarted = ref(false)
const generatingQuiz = ref(false)
const quizQuestions = ref<any[]>([])
const quizAnswers = ref<any[]>([])
const submittingQuiz = ref(false)
const quizResult = ref<any>(null)
const quizTemplateId = ref<string | null>(null)

const examStarted = ref(false)
const startingExam = ref(false)
const unenrolling = ref(false)

const selectLesson = (lesson: any) => {
  currentLesson.value = lesson
  lessonCompleted.value = false
  quizStarted.value = false
  quizResult.value = null
  checkLessonCompletion()
}

const checkLessonCompletion = async () => {
  if (!currentLesson.value || !course.value?.enrollment) return

  const progress = course.value.enrollment.progress?.find(
    (p: any) => p.lesson.id === currentLesson.value.id
  )
  lessonCompleted.value = progress?.completed || false
}

const handleVideoEnd = () => {
  // Video ended, user can mark as complete
}

const markComplete = async () => {
  if (!currentLesson.value || !course.value?.enrollment) return

  try {
    completing.value = true
    await $fetch(`/api/lessons/${currentLesson.value.id}/complete`, {
      method: 'POST',
      body: {
        enrollmentId: course.value.enrollment.id
      }
    })
    lessonCompleted.value = true
    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to mark lesson as complete')
  } finally {
    completing.value = false
  }
}

const startQuiz = async () => {
  if (!currentLesson.value || !course.value?.enrollment) return

  try {
    generatingQuiz.value = true
    const { questions, templateId } = await $fetch(
      `/api/lessons/${currentLesson.value.id}/quiz/generate`,
      {
        method: 'POST',
        body: {
          enrollmentId: course.value.enrollment.id
        }
      }
    )
    quizQuestions.value = questions
    quizTemplateId.value = templateId
    quizStarted.value = true
    quizAnswers.value = new Array(questions.length).fill(null)
  } catch (error: any) {
    alert(error.data?.message || 'Failed to generate quiz')
  } finally {
    generatingQuiz.value = false
  }
}

const submitQuiz = async () => {
  if (!currentLesson.value || !course.value?.enrollment || !quizTemplateId.value) return

  try {
    submittingQuiz.value = true
    const result = await $fetch(`/api/lessons/${currentLesson.value.id}/quiz/submit`, {
      method: 'POST',
      body: {
        enrollmentId: course.value.enrollment.id,
        templateId: quizTemplateId.value,
        questions: quizQuestions.value,
        answers: quizAnswers.value
      }
    })
    quizResult.value = result
    quizStarted.value = false
  } catch (error: any) {
    alert(error.data?.message || 'Failed to submit quiz')
  } finally {
    submittingQuiz.value = false
  }
}

const resetQuiz = () => {
  quizStarted.value = false
  quizQuestions.value = []
  quizAnswers.value = []
  quizResult.value = null
  quizTemplateId.value = null
}

const startExam = async () => {
  if (!course.value?.enrollment) return

  try {
    startingExam.value = true
    // Navigate to exam page
    navigateTo(`/courses/${courseId}/exam`)
  } catch (error: any) {
    alert(error.data?.message || 'Failed to start exam')
  } finally {
    startingExam.value = false
  }
}

watch(() => course.value?.enrollment, () => {
  if (course.value?.enrollment) {
    checkLessonCompletion()
  }
}, { immediate: true })

const handleUnenroll = async (enrollmentId: string, courseName: string) => {
  if (!confirm(`Are you sure you want to unenroll from "${courseName}"? This action cannot be undone.`)) {
    return
  }

  try {
    unenrolling.value = true
    await $fetch(`/api/enrollments/${enrollmentId}/unenroll`, {
      method: 'DELETE'
    })
    
    // Redirect to My Learning page after unenrollment
    navigateTo('/dashboard/learn')
  } catch (error: any) {
    alert(error.data?.message || 'Failed to unenroll. Please try again.')
  } finally {
    unenrolling.value = false
  }
}
</script>
