<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <NuxtLink to="/community/challenges" class="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mb-4 transition-colors">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
      Back to Challenges
    </NuxtLink>

    <div v-if="pending" class="rounded-xl bg-white border border-slate-200 p-6 animate-pulse">
      <div class="h-5 bg-slate-200 rounded w-2/3 mb-4"></div>
      <div class="h-3 bg-slate-100 rounded w-full mb-2"></div>
    </div>

    <template v-else-if="challenge">
      <!-- Challenge Card -->
      <div class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div class="p-6">
          <div class="flex items-center gap-2 mb-3">
            <span :class="difficultyClass(challenge.difficulty)" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /></svg>
              {{ challenge.difficulty === 'EASY' ? 'Easy' : challenge.difficulty === 'MEDIUM' ? 'Medium' : 'Hard' }}
            </span>
            <span :class="isActive ? 'bg-green-100 text-green-700' : isPast ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold">
              <svg v-if="isActive" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              <svg v-else-if="isPast" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {{ isActive ? 'Active' : isPast ? 'Ended' : 'Upcoming' }}
            </span>
          </div>

          <h1 class="text-lg font-bold text-slate-900 mb-2">{{ challenge.title }}</h1>
          <div class="text-xs text-slate-500 mb-4">
            By {{ challenge.createdBy?.name }} · {{ formatDate(challenge.startsAt) }} – {{ formatDate(challenge.endsAt) }}
          </div>

          <div class="prose prose-sm max-w-none text-slate-700 text-xs leading-relaxed whitespace-pre-wrap mb-4">{{ challenge.description }}</div>

          <div v-if="challenge.tags" class="flex flex-wrap gap-1.5 mb-4">
            <span v-for="tag in challenge.tags.split(',')" :key="tag" class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">{{ tag.trim() }}</span>
          </div>
        </div>
      </div>

      <!-- Submit Solution -->
      <div v-if="isActive && user" class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div class="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <h2 class="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
            <svg v-if="challenge.hasSubmitted" class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <svg v-else class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            {{ challenge.hasSubmitted ? 'Update Your Solution' : 'Submit Your Solution' }}
          </h2>
        </div>
        <div class="p-5 space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Language</label>
            <select v-model="submission.language" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 outline-none">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Code *</label>
            <textarea v-model="submission.code" rows="8" required class="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-green-400 text-xs font-mono focus:border-primary-400 outline-none resize-none" placeholder="// Paste your solution here..."></textarea>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Explanation (optional)</label>
            <textarea v-model="submission.description" rows="2" class="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-primary-400 outline-none resize-none" placeholder="Explain your approach..."></textarea>
          </div>
          <button @click="submitSolution" :disabled="submitting || !submission.code.trim()" class="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium transition-all disabled:opacity-50">
            {{ submitting ? 'Submitting...' : 'Submit Solution' }}
          </button>
        </div>
      </div>

      <div v-else-if="isActive && !user" class="rounded-xl bg-primary-50 border border-primary-200 p-5 mb-6 text-center">
        <p class="text-xs text-slate-600 mb-2">Sign in to submit your solution!</p>
        <NuxtLink to="/auth/login?redirect=/community/challenges" class="inline-block px-4 py-2 rounded-lg bg-primary-500 text-white text-xs font-medium hover:bg-primary-600 transition-colors">Sign In</NuxtLink>
      </div>

      <!-- Submissions -->
      <div class="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <h2 class="text-xs font-semibold text-slate-900">Solutions ({{ challenge.submissions?.length || 0 }})</h2>
        </div>
        <div class="divide-y divide-slate-100">
          <div v-if="!challenge.submissions?.length" class="p-8 text-center text-xs text-slate-500">No submissions yet. Be the first!</div>
          <div v-for="sub in challenge.submissions" :key="sub.id" class="p-4">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-[9px] font-bold">{{ sub.user?.name?.charAt(0) }}</div>
                <span class="text-xs font-medium text-slate-900">{{ sub.user?.name }}</span>
                <span class="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500">{{ sub.language }}</span>
              </div>
              <button
                v-if="user && sub.userId !== user.id"
                @click="vote(sub.id)"
                :class="challenge.userVotes?.includes(sub.id) ? 'text-primary-600 bg-primary-50 border-primary-200' : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50'"
                class="flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-medium transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                {{ sub.voteCount }}
              </button>
              <span v-else class="text-[10px] text-slate-400">{{ sub.voteCount }} votes</span>
            </div>
            <pre class="bg-slate-900 text-green-400 text-[11px] p-3 rounded-lg overflow-x-auto font-mono mb-2"><code>{{ sub.code }}</code></pre>
            <p v-if="sub.description" class="text-[10px] text-slate-500 italic">{{ sub.description }}</p>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center py-16 text-sm text-slate-500">Challenge not found.</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'community' })

const route = useRoute()
const { user } = useAuth()
const submitting = ref(false)
const submission = ref({ code: '', language: 'javascript', description: '' })

const { data, pending, refresh } = useFetch(`/api/community/challenges/${route.params.id}`)
const challenge = computed(() => data.value as any)

useHead({ title: computed(() => challenge.value?.title ? `${challenge.value.title} - Challenges` : 'Challenge') })

const now = new Date()
const isActive = computed(() => challenge.value && new Date(challenge.value.startsAt) <= now && new Date(challenge.value.endsAt) >= now)
const isPast = computed(() => challenge.value && new Date(challenge.value.endsAt) < now)

const difficultyClass = (d: string) => {
  if (d === 'EASY') return 'bg-green-100 text-green-700'
  if (d === 'MEDIUM') return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}
const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const submitSolution = async () => {
  submitting.value = true
  try {
    await $fetch(`/api/community/challenges/${route.params.id}/submit`, { method: 'POST', body: submission.value })
    submission.value = { code: '', language: 'javascript', description: '' }
    refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to submit')
  } finally {
    submitting.value = false
  }
}

const vote = async (submissionId: string) => {
  try {
    await $fetch(`/api/community/challenges/${route.params.id}/vote`, { method: 'POST', body: { submissionId } })
    refresh()
  } catch (err: any) {
    alert(err.data?.message || 'Failed to vote')
  }
}
</script>
