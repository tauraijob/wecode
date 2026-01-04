<template>
  <div class="bg-cream-50 min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-cream-50 to-surface-50 py-16 sm:py-24">
      <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_80%_-10%,rgba(30,58,95,0.08),transparent)]"></div>
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <span class="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-200 px-4 py-1.5 text-xs font-medium text-primary-700">
              <span class="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              Now Accepting Instructor Applications
            </span>
            <h1 class="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              Share Your Knowledge, <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Earn Revenue</span>
            </h1>
            <p class="mt-6 text-lg text-gray-600 leading-relaxed">
              Join WeCodeZW as an instructor and reach thousands of eager learners across Zimbabwe and beyond. Create courses, set your prices, and earn while making an impact.
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <NuxtLink 
                to="/auth/register?role=INSTRUCTOR" 
                class="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              >
                Become an Instructor
              </NuxtLink>
              <a 
                href="#how-it-works" 
                class="rounded-xl border-2 border-cream-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:border-primary-300 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
          <div class="relative">
            <div class="overflow-hidden rounded-3xl bg-white p-3 shadow-card border-2 border-primary-200">
              <img alt="Instructor teaching online" src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600&auto=format&fit=crop" class="h-72 lg:h-96 w-full rounded-2xl object-cover" />
            </div>
            <div class="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-card-hover border border-cream-200">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div class="font-bold text-gray-900">70%</div>
                  <div class="text-sm text-gray-500">Revenue Share</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-16 sm:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
            How It <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started as an instructor is simple. Follow these steps to launch your first course.
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-3">
          <div class="relative text-center p-8 rounded-2xl bg-white border border-cream-200 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-lg font-bold text-white shadow-lg">1</div>
            <div class="mt-4 mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Sign Up</h3>
            <p class="text-gray-600">Register as an instructor with your details. It's free and takes less than 2 minutes.</p>
          </div>

          <div class="relative text-center p-8 rounded-2xl bg-white border border-cream-200 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-lg font-bold text-white shadow-lg">2</div>
            <div class="mt-4 mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-accent-100 text-accent-600">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Create Your Course</h3>
            <p class="text-gray-600">Use our intuitive course builder and AI assistant to create engaging lessons and content.</p>
          </div>

          <div class="relative text-center p-8 rounded-2xl bg-white border border-cream-200 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="absolute -top-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-lg font-bold text-white shadow-lg">3</div>
            <div class="mt-4 mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Earn Revenue</h3>
            <p class="text-gray-600">Set your price, receive up to 70% of each sale, and cash out easily via mobile money or bank transfer.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Revenue Split Section -->
    <section class="py-16 sm:py-20 bg-gradient-to-br from-primary-600 to-primary-700">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Transparent <span class="text-accent-300">Revenue Sharing</span>
            </h2>
            <p class="mt-6 text-lg text-primary-100 leading-relaxed">
              We believe in fair compensation for your expertise. You earn the majority of every course sale, and our platform only takes a small share to cover hosting, payment processing, and support.
            </p>
            
            <div class="mt-8 space-y-4">
              <div class="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-400/30 text-white text-xl font-bold">70%</div>
                <div>
                  <div class="font-semibold text-white">Your Earnings</div>
                  <div class="text-sm text-primary-100">Keep up to 70% of each sale</div>
                </div>
              </div>
              <div class="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-white text-xl font-bold">30%</div>
                <div>
                  <div class="font-semibold text-white">Platform Fee</div>
                  <div class="text-sm text-primary-100">Covers hosting, support & payments</div>
                </div>
              </div>
            </div>

            <p class="mt-6 text-primary-200 text-sm">
              <span class="text-accent-300 font-medium">Note:</span> Commission rates may vary. Contact us for enterprise or high-volume instructor partnerships.
            </p>
          </div>

          <div class="relative">
            <div class="rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-8">
              <h3 class="text-xl font-bold text-white mb-6">Example Earnings</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center py-3 border-b border-white/10">
                  <span class="text-primary-100">Course Price</span>
                  <span class="text-white font-bold">$50</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-white/10">
                  <span class="text-primary-100">Monthly Students</span>
                  <span class="text-white font-bold">20</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-white/10">
                  <span class="text-primary-100">Gross Revenue</span>
                  <span class="text-white font-bold">$1,000</span>
                </div>
                <div class="flex justify-between items-center py-3">
                  <span class="text-accent-300 font-semibold">Your Earnings (70%)</span>
                  <span class="text-accent-300 text-2xl font-bold">$700</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Features Section -->
    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-12">
          <span class="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-200 px-4 py-1.5 text-xs font-semibold text-primary-700">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI-Powered
          </span>
          <h2 class="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900">
            Create Courses <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Faster with AI</span>
          </h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI assistant helps you generate course outlines, lesson descriptions, quiz questions, and more — so you can focus on what you do best: teaching.
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div class="p-6 rounded-2xl bg-white border border-cream-200 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Course Outline Generation</h3>
            <p class="text-gray-600">Describe your topic and get a ready-to-use course structure with topics and lessons.</p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-cream-200 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Lesson Content Writing</h3>
            <p class="text-gray-600">Get AI-drafted lesson text, explanations, and summaries that you can edit and personalize.</p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-cream-200 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Quiz & Exam Questions</h3>
            <p class="text-gray-600">Automatically generate multiple-choice questions and assessments for your lessons.</p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-cream-200 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Course Descriptions</h3>
            <p class="text-gray-600">Generate compelling course descriptions and marketing copy that attracts students.</p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-cream-200 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Prerequisites & Objectives</h3>
            <p class="text-gray-600">AI suggests course prerequisites and learning objectives based on your content.</p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-cream-200 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">SEO Optimization</h3>
            <p class="text-gray-600">Get suggestions for keywords and tags to help your course rank higher in search.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6">
        <div class="rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 sm:p-12 text-center shadow-xl">
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Start Teaching?</h2>
          <p class="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our growing community of instructors and share your expertise with learners across Zimbabwe and beyond.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink 
              to="/auth/register?role=INSTRUCTOR" 
              class="rounded-xl bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg hover:shadow-xl transition-all"
            >
              Register as an Instructor
            </NuxtLink>
            <NuxtLink 
              to="/contact" 
              class="rounded-xl border-2 border-white/30 px-8 py-3 font-semibold text-white hover:bg-white/10 transition-all"
            >
              Contact Us
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Become an Instructor — WeCodeZW',
  description: 'Join WeCodeZW as an instructor. Create courses, reach thousands of learners, and earn up to 70% revenue share. AI-powered course creation tools included.'
})
</script>
