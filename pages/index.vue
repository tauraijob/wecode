<template>
  <!-- Hero Section -->
  <section class="relative overflow-hidden bg-cream-50">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_-20%,rgba(72,101,129,0.06),transparent)]"></div>
    <!-- Decorative elements -->
    <div class="absolute top-20 right-10 w-72 h-72 bg-primary-100/40 rounded-full blur-3xl"></div>
    <div class="absolute bottom-10 left-10 w-72 h-72 bg-accent-100/30 rounded-full blur-3xl"></div>
    
    <div class="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
      <div class="grid items-center gap-12 lg:gap-16 lg:grid-cols-2">
        <div class="animate-fade-up">
          <span class="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-200 px-4 py-1.5 text-xs font-medium text-primary-600">
            <span class="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            WeCodeZW • Digital Skills • IT Services
          </span>
          <h1 class="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
            Digital Skills in Zimbabwe: 
            <span class="bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">Coding, IT Services</span>, and Training
          </h1>
          <p class="mt-6 max-w-xl text-lg text-gray-600 leading-relaxed">
            Hands‑on training for individuals and teams, modern IT services, and innovative products for Zimbabwe's digital economy.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <template v-if="!me">
              <NuxtLink to="/courses" class="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:from-primary-700 hover:to-primary-800 text-center transition-all">
                Browse Courses
              </NuxtLink>
              <NuxtLink to="/services" class="rounded-xl border-2 border-cream-300 bg-surface-50 px-6 py-3.5 font-semibold text-gray-700 hover:border-primary-300 hover:bg-primary-50 text-center transition-all shadow-soft">
                IT Services
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink v-if="me.role === 'STUDENT'" to="/courses" class="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:from-primary-600 hover:to-primary-700 text-center transition-all">
                Browse Courses
              </NuxtLink>
              <NuxtLink v-if="me.role === 'STUDENT'" to="/dashboard/learn" class="rounded-xl border-2 border-navy-200 bg-white px-6 py-3.5 font-semibold text-navy-700 hover:border-primary-300 hover:bg-primary-50 text-center transition-all shadow-soft">
                My Learning
              </NuxtLink>
              <NuxtLink to="/dashboard" class="rounded-xl border-2 border-navy-200 bg-white px-6 py-3.5 font-semibold text-navy-700 hover:border-primary-300 hover:bg-primary-50 text-center transition-all shadow-soft">
                Dashboard
              </NuxtLink>
            </template>
          </div>
          <div v-if="!me" class="mt-4 text-sm text-gray-500">
            New to WeCodeZW? <NuxtLink to="/auth/register" class="text-primary-700 font-medium hover:text-primary-800 underline underline-offset-2">Sign up</NuxtLink> to enroll in courses
          </div>
          <div v-else-if="me.role === 'STUDENT'" class="mt-4 text-sm text-gray-500">
            Continue your learning journey or <NuxtLink to="/courses" class="text-primary-700 font-medium hover:text-primary-800 underline underline-offset-2">explore new courses</NuxtLink>
          </div>
        </div>
        <div class="relative animate-float order-first lg:order-last">
          <div class="overflow-hidden rounded-3xl bg-white p-3 shadow-card border-2 border-primary-200">
            <img alt="Code and servers" src="https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1600&auto=format&fit=crop" class="h-56 sm:h-72 lg:h-96 w-full rounded-2xl object-cover" />
          </div>
          <!-- Floating accent card -->
          <div class="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-card-hover border border-cream-200">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div class="font-bold text-navy-900">100+</div>
                <div class="text-sm text-navy-500">Students Learning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section class="py-16 bg-gradient-to-br from-primary-600 to-primary-700">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-white">25+</div>
          <div class="mt-1 text-sm text-primary-100">Courses Available</div>
        </div>
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-white">100+</div>
          <div class="mt-1 text-sm text-primary-100">Students Enrolled</div>
        </div>
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-accent-300">95%</div>
          <div class="mt-1 text-sm text-primary-100">Success Rate</div>
        </div>
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-accent-300">4.8★</div>
          <div class="mt-1 text-sm text-primary-100">Average Rating</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Courses Section -->
  <section class="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
    <div class="text-center mb-12">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
        Featured <span class="bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">Courses</span>
      </h2>
      <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Start your learning journey with our hands-on courses designed for real-world skills
      </p>
    </div>

    <div v-if="coursesLoading" class="mt-8 text-center py-20">
      <div class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
      <p class="mt-4 text-navy-500">Loading courses...</p>
    </div>
    
    <div v-else-if="courses && courses.length === 0" class="mt-8 text-center py-20">
      <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-cream-100 border border-cream-300">
        <svg class="h-10 w-10 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-navy-800 mb-2">No courses available</h3>
      <p class="text-navy-500">Check back soon for new courses!</p>
    </div>
    
    <div v-else-if="courses && courses.length > 0" class="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="course in courses.slice(0, 6)"
        :key="course.id"
        class="group relative overflow-hidden rounded-2xl bg-white border border-cream-200 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
      >
        <div v-if="course.thumbnailUrl" class="relative h-48 overflow-hidden">
          <img :src="course.thumbnailUrl" :alt="course.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div v-else class="flex h-48 items-center justify-center bg-gradient-to-br from-primary-50 to-cream-100">
          <svg class="h-16 w-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        <div class="p-6">
          <h3 class="text-xl font-bold text-navy-900 mb-2 line-clamp-1">{{ course.name }}</h3>
          <p class="text-sm text-navy-500 line-clamp-2 mb-4">{{ course.description }}</p>
          
          <div class="flex items-center justify-between pt-4 border-t border-cream-200">
            <div>
              <span class="text-2xl font-bold text-navy-900">{{ course.currency }} {{ Number(course.price).toFixed(2) }}</span>
            </div>
            <NuxtLink
              :to="`/courses/${course.id}`"
              class="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-md hover:shadow-lg"
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
        class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-4 text-lg font-semibold text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
      >
        View All Courses
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </NuxtLink>
      <p v-if="!me" class="mt-4 text-sm text-navy-400">
        <NuxtLink to="/auth/register" class="text-primary-600 font-medium hover:text-primary-700 underline underline-offset-2">Sign up</NuxtLink> to enroll in courses and start learning today
      </p>
    </div>
  </section>

  <!-- Other Services Section -->
  <section class="bg-gradient-to-br from-navy-900 to-primary-900 py-16 sm:py-20 lg:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Other Services</h2>
        <p class="mt-4 text-lg text-navy-200 max-w-2xl mx-auto">
          Beyond courses, we offer comprehensive IT solutions for individuals, schools, and businesses
        </p>
      </div>
      
      <div class="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300">
          <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 text-white shadow-lg mb-6">
            <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="text-xs font-semibold text-primary-300 uppercase tracking-wide mb-2">For Individuals & Students</div>
          <div class="text-xl font-bold text-white mb-3">Digital Skills Training</div>
          <p class="text-navy-200 mb-4">Programming, web development, cybersecurity, and hands‑on learning paths tailored to your goals.</p>
          <NuxtLink to="/training" class="inline-flex items-center gap-2 text-primary-300 hover:text-white font-semibold group">
            Explore training
            <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>
        
        <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300">
          <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 text-white shadow-lg mb-6">
            <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="text-xs font-semibold text-accent-300 uppercase tracking-wide mb-2">For Schools</div>
          <div class="text-xl font-bold text-white mb-3">Coding & Robotics Clubs</div>
          <p class="text-navy-200 mb-4">Launch clubs that nurture the next generation of tech innovators in your school.</p>
          <NuxtLink to="/schools" class="inline-flex items-center gap-2 text-accent-300 hover:text-white font-semibold group">
            Start a club
            <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>
        
        <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-500 text-white shadow-lg mb-6">
            <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="text-xs font-semibold text-primary-300 uppercase tracking-wide mb-2">For Corporates & NGOs</div>
          <div class="text-xl font-bold text-white mb-3">Tailored Upskilling</div>
          <p class="text-navy-200 mb-4">Enhance staff capacity, efficiency, and competitiveness with tailored programs.</p>
          <NuxtLink to="/corporate" class="inline-flex items-center gap-2 text-primary-300 hover:text-white font-semibold group">
            Request workshop
            <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>

  <!-- Request Training Section -->
  <section v-if="!me" class="mx-auto max-w-7xl px-4 sm:px-6 py-16">
    <div class="rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 sm:p-12 shadow-xl">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white">Request Training or Workshops</h2>
      <p class="mt-4 text-primary-100">Tell us about your goals. We'll craft a program that fits your schedule and outcomes.</p>
      <div class="mt-6">
        <RequestQuickForm />
      </div>
    </div>
  </section>
  
  <section v-else class="mx-auto max-w-7xl px-4 sm:px-6 py-16">
    <div class="rounded-3xl bg-gradient-to-br from-cream-50 to-white border border-cream-200 p-8 sm:p-12 text-center shadow-card">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-navy-900">Need More Training?</h2>
      <p class="mt-4 text-navy-500 max-w-2xl mx-auto">Request additional training or workshops from your <NuxtLink to="/dashboard/requests" class="text-primary-600 font-medium hover:text-primary-700 underline underline-offset-2">dashboard</NuxtLink>.</p>
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
