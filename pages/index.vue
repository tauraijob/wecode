<template>
  <!-- Hero Section -->
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_-20%,rgba(46,81,141,0.35),rgba(17,28,54,0))]"></div>
    <div class="mx-auto max-w-7xl px-3 sm:px-4 py-12 sm:py-16 lg:py-24">
      <div class="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">
        <div class="animate-fade-up">
          <span class="inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-900/60 px-3 py-1 text-xs text-navy-300">WeCodeZW • Digital Skills • IT Services</span>
          <h1 class="mt-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight">
            Digital Skills in Zimbabwe: Coding, IT Services, and Training
          </h1>
          <p class="mt-4 sm:mt-5 max-w-xl text-base sm:text-lg text-navy-200">
            Hands‑on training for individuals and teams, modern IT services, and innovative products for Zimbabwe's digital economy.
          </p>
          <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
            <template v-if="!me">
              <NuxtLink to="/courses" class="rounded-md bg-gradient-to-r from-blue-500 to-purple-600 px-4 sm:px-5 py-3 font-medium text-white shadow-sm shadow-blue-900/30 hover:from-blue-600 hover:to-purple-700 text-center">Browse Courses</NuxtLink>
              <NuxtLink to="/services" class="rounded-md border border-navy-700 px-4 sm:px-5 py-3 font-medium hover:border-navy-500 text-center">IT Services</NuxtLink>
            </template>
            <template v-else>
              <NuxtLink v-if="me.role === 'STUDENT'" to="/courses" class="rounded-md bg-gradient-to-r from-blue-500 to-purple-600 px-4 sm:px-5 py-3 font-medium text-white shadow-sm shadow-blue-900/30 hover:from-blue-600 hover:to-purple-700 text-center">Browse Courses</NuxtLink>
              <NuxtLink v-if="me.role === 'STUDENT'" to="/dashboard/learn" class="rounded-md border border-navy-700 bg-navy-800/50 px-4 sm:px-5 py-3 font-medium hover:border-navy-500 hover:bg-navy-700/50 text-center">My Learning</NuxtLink>
              <NuxtLink to="/dashboard" class="rounded-md border border-navy-700 bg-navy-800/50 px-4 sm:px-5 py-3 font-medium hover:border-navy-500 hover:bg-navy-700/50 text-center">Dashboard</NuxtLink>
            </template>
          </div>
          <div v-if="!me" class="mt-3 text-sm text-navy-300">
            New to WeCodeZW? <NuxtLink to="/auth/register" class="underline hover:text-navy-100">Sign up</NuxtLink> to enroll in courses
          </div>
          <div v-else-if="me.role === 'STUDENT'" class="mt-3 text-sm text-navy-300">
            Continue your learning journey or <NuxtLink to="/courses" class="underline hover:text-navy-100">explore new courses</NuxtLink>
          </div>
          <div class="mt-4 sm:mt-6 text-sm text-navy-300">Pricing, invoices, and payments are in USD.</div>
        </div>
        <div class="relative animate-float order-first lg:order-last">
          <div class="overflow-hidden rounded-xl border border-navy-800 bg-gradient-to-br from-navy-900 to-navy-800 p-4 sm:p-6 shadow-2xl">
            <img alt="Code and servers" src="https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1600&auto=format&fit=crop" class="h-48 sm:h-64 lg:h-80 xl:h-full w-full rounded-lg object-cover opacity-75" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Courses Section - Main Focus -->
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-12 sm:py-16 lg:py-20">
    <div class="text-center mb-12">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Featured Courses
      </h2>
      <p class="mt-4 text-lg sm:text-xl text-navy-300 max-w-2xl mx-auto">
        Start your learning journey with our hands-on courses designed for real-world skills
      </p>
    </div>

    <div v-if="coursesLoading" class="mt-8 text-center py-20">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
      <p class="mt-4 text-navy-300">Loading courses...</p>
    </div>
    
    <div v-else-if="courses && courses.length === 0" class="mt-8 text-center py-20">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/50">
        <svg class="h-8 w-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">No courses available</h3>
      <p class="text-navy-300">Check back soon for new courses!</p>
    </div>
    
    <div v-else-if="courses && courses.length > 0" class="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="course in courses.slice(0, 6)"
        :key="course.id"
        class="group relative overflow-hidden rounded-xl border border-navy-800 bg-gradient-to-br from-navy-900/60 to-navy-800/40 p-0 hover:border-navy-600 transition-all hover:shadow-xl"
      >
        <div v-if="course.thumbnailUrl" class="relative h-48 overflow-hidden bg-navy-800">
          <img :src="course.thumbnailUrl" :alt="course.name" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent"></div>
        </div>
        <div v-else class="flex h-48 items-center justify-center bg-gradient-to-br from-navy-700 to-navy-800">
          <svg class="h-12 w-12 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        <div class="p-6">
          <h3 class="text-xl sm:text-2xl font-semibold text-white mb-2 line-clamp-1">{{ course.name }}</h3>
          <p class="text-sm sm:text-base text-navy-300 line-clamp-2 mb-4">{{ course.description }}</p>
          
          <div class="flex items-center justify-between mt-6 pt-4 border-t border-navy-700/50">
            <div>
              <span class="text-2xl font-bold text-white">{{ course.currency }} {{ Number(course.price).toFixed(2) }}</span>
            </div>
            <NuxtLink
              :to="`/courses/${course.id}`"
              class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              View Details
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- View More Courses CTA -->
    <div v-if="courses && courses.length > 0" class="mt-12 text-center">
      <NuxtLink
        to="/courses"
        class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
      >
        View All Courses
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </NuxtLink>
      <p v-if="!me" class="mt-4 text-sm text-navy-300">
        <NuxtLink to="/auth/register" class="text-navy-400 underline hover:text-navy-300">Sign up</NuxtLink> to enroll in courses and start learning today
      </p>
      <p v-else-if="me.role === 'STUDENT'" class="mt-4 text-sm text-navy-300">
        <NuxtLink to="/dashboard/learn" class="text-navy-400 underline hover:text-navy-300">View your enrolled courses</NuxtLink> or explore more
      </p>
    </div>
  </section>

  <!-- Other Services Section -->
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-transparent to-navy-900/20">
    <div class="text-center mb-12">
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Other Services</h2>
      <p class="mt-4 text-lg text-navy-300 max-w-2xl mx-auto">
        Beyond courses, we offer comprehensive IT solutions for individuals, schools, and businesses
      </p>
    </div>
    
    <div class="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 sm:p-8 hover:border-navy-600 transition-all hover:shadow-lg">
        <div class="text-sm text-navy-400 font-medium mb-2">For Individuals & Students</div>
        <div class="text-xl sm:text-2xl font-semibold text-white mb-3">Digital Skills Training</div>
        <p class="text-navy-300 mb-4">Programming, web development, cybersecurity, and hands‑on learning paths tailored to your goals.</p>
        <NuxtLink to="/training" class="inline-flex items-center gap-2 text-navy-400 hover:text-navy-300 font-medium">
          Explore training
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>
      
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 sm:p-8 hover:border-navy-600 transition-all hover:shadow-lg">
        <div class="text-sm text-navy-400 font-medium mb-2">For Schools</div>
        <div class="text-xl sm:text-2xl font-semibold text-white mb-3">Coding & Robotics Clubs</div>
        <p class="text-navy-300 mb-4">Launch clubs that nurture the next generation of tech innovators in your school.</p>
        <NuxtLink to="/schools" class="inline-flex items-center gap-2 text-navy-400 hover:text-navy-300 font-medium">
          Start a club
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>
      
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 sm:p-8 hover:border-navy-600 transition-all hover:shadow-lg sm:col-span-2 lg:col-span-1">
        <div class="text-sm text-navy-400 font-medium mb-2">For Corporates & NGOs</div>
        <div class="text-xl sm:text-2xl font-semibold text-white mb-3">Tailored Upskilling</div>
        <p class="text-navy-300 mb-4">Enhance staff capacity, efficiency, and competitiveness with tailored programs.</p>
        <NuxtLink to="/corporate" class="inline-flex items-center gap-2 text-navy-400 hover:text-navy-300 font-medium">
          Request workshop
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- Request Training Section (Optional) -->
  <section v-if="!me" class="mx-auto max-w-7xl px-3 sm:px-4 py-12 sm:py-16">
    <div class="rounded-xl border border-navy-800 bg-gradient-to-br from-navy-900/60 to-navy-800/40 p-8 sm:p-12">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">Request Training or Workshops</h2>
      <p class="mt-4 text-navy-300">Tell us about your goals. We'll craft a program that fits your schedule and outcomes.</p>
      <div class="mt-6">
        <RequestQuickForm />
      </div>
    </div>
  </section>
  
  <section v-else class="mx-auto max-w-7xl px-3 sm:px-4 py-12 sm:py-16">
    <div class="rounded-xl border border-navy-800 bg-gradient-to-br from-navy-900/60 to-navy-800/40 p-8 sm:p-12 text-center">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">Need More Training?</h2>
      <p class="mt-4 text-navy-300 max-w-2xl mx-auto">Request additional training or workshops from your <NuxtLink to="/dashboard/requests" class="text-navy-400 underline hover:text-navy-300">dashboard</NuxtLink>.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RequestQuickForm from '@/components/requests/RequestQuickForm.vue'

// Get auth state
const { user: me } = useAuth()

// Fetch featured courses first
const { data: featuredCoursesData, pending: featuredLoading, error: featuredError } = await useFetch('/api/courses', {
  query: { status: 'PUBLISHED', featured: true, limit: 6 }
})

// Also fetch all published courses as fallback
const { data: fallbackCoursesData, pending: fallbackLoading } = await useFetch('/api/courses', {
  query: { status: 'PUBLISHED', limit: 6 }
})

const courses = computed(() => {
  const featured = featuredCoursesData.value?.courses || []
  // If we have featured courses, use them
  if (featured.length > 0) {
    return featured
  }
  // Otherwise, use fallback (all published courses)
  return fallbackCoursesData.value?.courses || []
})

const coursesLoading = computed(() => {
  const featured = featuredCoursesData.value?.courses || []
  // If no featured courses, show loading until fallback loads
  if (featured.length === 0 || featuredError.value) {
    return featuredLoading.value || fallbackLoading.value
  }
  return featuredLoading.value
})
</script>
