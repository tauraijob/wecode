<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
    <section class="mx-auto max-w-4xl px-4 py-5">
      <!-- Header with gradient text -->
      <div class="mb-5">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h1 class="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Community Forum
          </h1>
        </div>
        <p class="text-xs text-slate-500 ml-10">Share ideas, ask questions, and connect with mentors</p>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Feed Column -->
        <main class="lg:col-span-2 space-y-4">
          <!-- Create Post Card -->
          <div class="rounded-xl bg-white border border-slate-200 shadow-sm p-4">
            <div v-if="isAuthenticated" class="flex gap-3">
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <button
                @click="showNewPostModal = true"
                class="flex-1 px-4 py-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs text-slate-500 hover:text-slate-700 transition-all"
              >
                What's on your mind?
              </button>
            </div>
            <div v-else class="flex flex-col sm:flex-row gap-3">
              <NuxtLink
                to="/auth/login?redirect=/community"
                class="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-xs font-medium transition-all shadow-sm hover:shadow"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign in to join
              </NuxtLink>
              <NuxtLink
                to="/community/register"
                class="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg border-2 border-primary-500 text-primary-600 hover:bg-primary-50 text-xs font-medium transition-colors"
              >
                Create Account
              </NuxtLink>
            </div>
          </div>

          <!-- Sort/Filter Bar -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button class="px-3 py-1.5 rounded-full bg-primary-500 text-white text-[10px] font-medium shadow-sm">
                Latest
              </button>
              <button class="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-700 text-[10px] font-medium transition-colors">
                Popular
              </button>
              <button class="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-700 text-[10px] font-medium transition-colors">
                Unanswered
              </button>
            </div>
            <span class="text-[10px] text-slate-400">{{ postsData?.pagination?.total || 0 }} discussions</span>
          </div>

          <!-- Loading State -->
          <div v-if="postsPending" class="space-y-3">
            <div v-for="i in 4" :key="i" class="rounded-xl bg-white border border-slate-200 p-4 animate-pulse">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-8 h-8 rounded-full bg-slate-200"></div>
                <div class="h-3 bg-slate-200 rounded w-24"></div>
              </div>
              <div class="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-slate-100 rounded w-full mb-1"></div>
              <div class="h-3 bg-slate-100 rounded w-2/3"></div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!postsData?.posts?.length" class="rounded-xl bg-white border border-slate-200 p-10 text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
              <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-slate-800 mb-1">No discussions yet</h3>
            <p class="text-xs text-slate-500 mb-4">Be the first to start a conversation!</p>
            <button
              v-if="isAuthenticated"
              @click="showNewPostModal = true"
              class="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-medium shadow-sm hover:shadow transition-shadow"
            >
              Start a Discussion
            </button>
          </div>

          <!-- Posts Feed -->
          <div v-else class="space-y-3">
            <ForumPostCard
              v-for="post in postsData.posts"
              :key="post.id"
              :post="post"
            />
          </div>

          <!-- Pagination -->
          <div v-if="postsData?.pagination && postsData.pagination.totalPages > 1" class="flex justify-center gap-1 pt-2">
            <button
              v-for="p in postsData.pagination.totalPages"
              :key="p"
              @click="page = p"
              class="w-8 h-8 rounded-lg text-xs font-medium transition-all"
              :class="page === p 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
            >
              {{ p }}
            </button>
          </div>
        </main>

        <!-- Sidebar -->
        <aside class="space-y-4">
          <FeaturedMentors />
          
          <!-- Courses Promo Ad -->
          <div class="rounded-xl bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 p-4 text-white shadow-lg overflow-hidden relative">
            <!-- Background pattern -->
            <div class="absolute inset-0 opacity-10">
              <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
            
            <div class="relative">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 class="text-sm font-bold text-white">Learn to Code</h3>
              </div>
              
              <p class="text-[11px] text-white mb-3 leading-relaxed">
                Master in-demand skills with our structured courses. From web dev to data science!
              </p>
              
              <ul class="space-y-1.5 mb-4">
                <li class="flex items-center gap-2 text-[10px]">
                  <svg class="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-white">Video lessons & projects</span>
                </li>
                <li class="flex items-center gap-2 text-[10px]">
                  <svg class="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-white">Certificates on completion</span>
                </li>
                <li class="flex items-center gap-2 text-[10px]">
                  <svg class="w-3 h-3 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-white">Learn at your own pace</span>
                </li>
              </ul>
              
              <NuxtLink
                to="/courses"
                class="block w-full py-2 px-3 rounded-lg bg-white text-primary-600 text-xs font-semibold text-center hover:bg-white/90 transition-colors shadow-sm"
              >
                Browse Courses →
              </NuxtLink>
            </div>
          </div>

          <!-- Tags/Topics -->
          <div class="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
            <h3 class="text-xs font-semibold text-slate-800 mb-3">Popular Topics</h3>
            <div class="flex flex-wrap gap-1.5">
              <span class="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors">JavaScript</span>
              <span class="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors">React</span>
              <span class="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors">Python</span>
              <span class="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors">Career</span>
              <span class="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors">Interview</span>
              <span class="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors">Design</span>
            </div>
          </div>
        </aside>
      </div>
    </section>

    <!-- New Post Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showNewPostModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showNewPostModal = false"></div>
          <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <!-- Header -->
            <div class="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div class="flex items-center justify-between">
                <h2 class="text-sm font-bold text-slate-800">Start a Discussion</h2>
                <button @click="showNewPostModal = false" class="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form @submit.prevent="createPost" class="p-4 space-y-4">
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1.5">Title</label>
                <input
                  v-model="newPost.title"
                  type="text"
                  required
                  minlength="5"
                  maxlength="200"
                  class="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
                  placeholder="What would you like to discuss?"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-700 mb-1.5">Content</label>
                <textarea
                  v-model="newPost.content"
                  required
                  minlength="10"
                  rows="5"
                  class="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none transition-all text-sm"
                  placeholder="Share your thoughts, questions, or ideas..."
                ></textarea>
              </div>
              <div class="flex gap-2 pt-2">
                <button
                  type="button"
                  @click="showNewPostModal = false"
                  class="flex-1 py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="postingPost"
                  class="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 text-white text-xs font-medium transition-all shadow-sm hover:shadow"
                >
                  {{ postingPost ? 'Publishing...' : 'Publish' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <TopUpModal v-model="showTopUpModal" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community'
})

const { user, isAuthenticated, refresh: refreshAuth } = useAuth()
const route = useRoute()
const { success, error } = useToast()

const page = ref(1)
const showNewPostModal = ref(false)
const showTopUpModal = ref(false)
const postingPost = ref(false)

const newPost = reactive({
  title: '',
  content: ''
})

if (route.query.credits === 'success') {
  refreshAuth()
}

const { data: postsData, pending: postsPending, refresh: refreshPosts } = useFetch('/api/community/posts', {
  query: { page },
  watch: [page]
})

const createPost = async () => {
  if (!newPost.title.trim() || !newPost.content.trim()) return

  postingPost.value = true
  try {
    await $fetch('/api/community/posts', {
      method: 'POST',
      body: {
        title: newPost.title,
        content: newPost.content
      }
    })

    newPost.title = ''
    newPost.content = ''
    showNewPostModal.value = false
    refreshPosts()
    success('Discussion started!')
  } catch (err: any) {
    error(err.data?.message || 'Failed to create post')
  } finally {
    postingPost.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>
