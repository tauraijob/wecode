<template>
  <div
    class="p-4 rounded-lg border transition-all bg-white"
    :class="mentor.verified
      ? 'border-primary-200 hover:border-primary-300 shadow-sm hover:shadow'
      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'"
  >
    <div class="flex items-start gap-3">
      <!-- Avatar -->
      <div class="relative flex-shrink-0">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
          {{ getInitials(mentor.name) }}
        </div>
        <!-- Verification Badge -->
        <div
          v-if="mentor.verified"
          class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center border-2 border-white"
          title="Verified Mentor"
        >
          <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5 flex-wrap">
          <h3 class="text-sm font-semibold text-slate-900">{{ mentor.name }}</h3>
          <span
            v-if="mentor.verified"
            class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-primary-100 text-primary-700 text-[10px] font-medium"
          >
            <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Verified
          </span>
        </div>

        <!-- Stats Row -->
        <div class="flex items-center gap-3 mt-0.5 text-[10px] text-slate-500">
          <span class="flex items-center gap-0.5">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ mentor.sessionsCount }} sessions
          </span>
          <span class="flex items-center gap-0.5">
            <svg class="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-primary-600 font-medium">{{ mentor.hourlyRate }} cr/hr</span>
          </span>
        </div>

        <!-- Bio -->
        <p class="mt-2 text-xs text-slate-600 line-clamp-2">
          {{ mentor.bio }}
        </p>

        <!-- Skills -->
        <div class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="skill in displaySkills"
            :key="skill"
            class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]"
          >
            {{ skill }}
          </span>
          <span
            v-if="remainingSkillsCount > 0"
            class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 text-[10px]"
          >
            +{{ remainingSkillsCount }} more
          </span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-3 flex items-center gap-2">
      <NuxtLink
        :to="`/community/mentors/${mentor.id}`"
        class="flex-1 py-1.5 px-3 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium text-center transition-colors"
      >
        View Profile
      </NuxtLink>
      <button
        @click="handleBook"
        class="flex-1 py-1.5 px-3 rounded-md bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!mentor.available"
      >
        {{ mentor.available ? 'Book Session' : 'Unavailable' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Mentor {
  id: string
  userId: string
  name: string
  bio: string
  skills: string[]
  hourlyRate: number
  available: boolean
  verified: boolean
  sessionsCount: number
}

const props = defineProps<{
  mentor: Mentor
}>()

const emit = defineEmits<{
  (e: 'book', mentor: Mentor): void
  (e: 'openTopUpModal'): void
}>()

const { user, isAuthenticated } = useAuth()

const displaySkills = computed(() => {
  const skills = Array.isArray(props.mentor.skills) ? props.mentor.skills : []
  return skills.slice(0, 3)
})

const remainingSkillsCount = computed(() => {
  const skills = Array.isArray(props.mentor.skills) ? props.mentor.skills : []
  return Math.max(0, skills.length - 3)
})

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const handleBook = () => {
  if (!isAuthenticated.value) {
    navigateTo('/auth/login?redirect=/community/mentors/' + props.mentor.id)
    return
  }

  const userCredits = user.value?.credits || 0
  if (userCredits < props.mentor.hourlyRate) {
    emit('openTopUpModal')
  } else {
    emit('book', props.mentor)
  }
}
</script>
