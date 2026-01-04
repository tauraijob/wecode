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
            <p class="text-gray-600">Host your videos on YouTube or Vimeo, then use our course builder to create topics, lessons, and quizzes. <a href="#course-guide" class="text-primary-600 font-medium hover:underline">See guide below ↓</a></p>
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

    <!-- Course Creation Guide Section -->
    <section id="course-guide" class="py-16 sm:py-20 bg-surface-50">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-12">
          <span class="inline-flex items-center gap-2 rounded-full bg-accent-50 border border-accent-200 px-4 py-1.5 text-xs font-semibold text-accent-700">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Course Structure Guide
          </span>
          <h2 class="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900">
            How to <span class="bg-gradient-to-r from-accent-600 to-accent-500 bg-clip-text text-transparent">Create Your Course</span>
          </h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform uses externally hosted videos. Host your content on YouTube or Vimeo, then link it to your course.
          </p>
        </div>

        <!-- Course Structure Diagram -->
        <div class="mb-12 rounded-2xl bg-white border border-cream-200 shadow-card p-6 sm:p-8">
          <h3 class="text-xl font-bold text-gray-900 mb-6 text-center">Course Structure Overview</h3>
          <div class="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
            <!-- Course -->
            <div class="w-full lg:w-auto text-center">
              <div class="inline-flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-300">
                <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 text-white mb-3">
                  <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div class="font-bold text-primary-700">Course</div>
                <div class="text-sm text-primary-600 mt-1 max-w-[200px]">Title, description, price, preview video</div>
              </div>
            </div>
            
            <!-- Arrow -->
            <div class="hidden lg:block text-gray-400">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div class="lg:hidden text-gray-400">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <!-- Topics -->
            <div class="w-full lg:w-auto text-center">
              <div class="inline-flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 border-2 border-accent-300">
                <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-500 text-white mb-3">
                  <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div class="font-bold text-accent-700">Topics</div>
                <div class="text-sm text-accent-600 mt-1 max-w-[200px]">(Modules/Sections)</div>
              </div>
            </div>

            <!-- Arrow -->
            <div class="hidden lg:block text-gray-400">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div class="lg:hidden text-gray-400">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <!-- Lessons -->
            <div class="w-full lg:w-auto text-center">
              <div class="inline-flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300">
                <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500 text-white mb-3">
                  <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="font-bold text-purple-700">Lessons</div>
                <div class="text-sm text-purple-600 mt-1 max-w-[200px]">(Videos + Notes)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step-by-Step Guide -->
        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Video Hosting Guide -->
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6 sm:p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">Hosting on YouTube</h3>
            </div>
            
            <ol class="space-y-4 text-gray-600">
              <li class="flex gap-3">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">1</span>
                <span>Upload your video to YouTube</span>
              </li>
              <li class="flex gap-3">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">2</span>
                <span>Set the video to <strong class="text-gray-900">"Unlisted"</strong> (only people with the link can view)</span>
              </li>
              <li class="flex gap-3">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">3</span>
                <span>Copy the video URL (e.g., https://youtube.com/watch?v=...)</span>
              </li>
              <li class="flex gap-3">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">4</span>
                <span>Paste the URL into the lesson's video field</span>
              </li>
            </ol>

            <div class="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4">
              <div class="flex gap-3">
                <svg class="h-5 w-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="text-sm text-amber-800">
                  <strong>Tip:</strong> "Unlisted" videos won't appear in search, but anyone with the link can watch. This keeps your content exclusive to enrolled students.
                </div>
              </div>
            </div>
          </div>

          <!-- Vimeo Hosting Guide -->
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6 sm:p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.807l-.013.001z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">Hosting on Vimeo</h3>
            </div>
            
            <ol class="space-y-4 text-gray-600">
              <li class="flex gap-3">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">1</span>
                <span>Upload your video to Vimeo</span>
              </li>
              <li class="flex gap-3">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">2</span>
                <span>Go to video settings → Privacy → Set to <strong class="text-gray-900">"Hide from Vimeo"</strong></span>
              </li>
              <li class="flex gap-3">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">3</span>
                <span>Optional: Add password protection for extra security</span>
              </li>
              <li class="flex gap-3">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">4</span>
                <span>Copy the video URL and paste it into the lesson</span>
              </li>
            </ol>

            <div class="mt-6 rounded-xl bg-blue-50 border border-blue-200 p-4">
              <div class="flex gap-3">
                <svg class="h-5 w-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div class="text-sm text-blue-800">
                  <strong>Pro Tip:</strong> Vimeo offers more privacy controls and no ads. Great for professional courses!
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Creation Steps -->
        <div class="mt-8 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-6 sm:p-8 text-white">
          <h3 class="text-xl font-bold text-white mb-6 text-center">Step-by-Step: Creating Your First Course</h3>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-lg font-bold mb-3">1</div>
              <div class="font-semibold mb-1">Create Course</div>
              <p class="text-sm text-primary-100">Add title, description, price, and an optional preview video URL.</p>
            </div>
            <div class="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-lg font-bold mb-3">2</div>
              <div class="font-semibold mb-1">Add Topics</div>
              <p class="text-sm text-primary-100">Create topics with detailed descriptions — our AI uses these to generate quizzes!</p>
            </div>
            <div class="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-lg font-bold mb-3">3</div>
              <div class="font-semibold mb-1">Add Lessons</div>
              <p class="text-sm text-primary-100">For each topic, add lessons with video URLs from YouTube/Vimeo and optional notes.</p>
            </div>
            <div class="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-lg font-bold mb-3">4</div>
              <div class="font-semibold mb-1">Submit for Review</div>
              <p class="text-sm text-primary-100">Once complete, submit for admin review. Once approved, your course goes live!</p>
            </div>
          </div>
          
          <!-- AI Quiz Generation Note -->
          <div class="mt-6 rounded-xl bg-white/10 backdrop-blur-sm border border-accent-400/50 p-5">
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-400/30">
                <svg class="h-6 w-6 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div class="font-semibold text-accent-300 mb-1">🤖 AI-Generated Quizzes</div>
                <p class="text-sm text-primary-100">
                  <strong class="text-white">No need to create quizzes manually!</strong> Our AI automatically generates practice quizzes and final exams based on your topic descriptions and lesson notes. Just write detailed descriptions, and our AI does the rest.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Example Course Structure -->
        <div class="mt-8 rounded-2xl bg-white border border-cream-200 shadow-card p-6 sm:p-8">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Example Course Structure</h3>
          <div class="rounded-xl border border-cream-200 overflow-hidden">
            <div class="bg-primary-600 text-white p-4">
              <div class="font-bold">📚 Introduction to Web Development</div>
              <div class="text-sm text-primary-100">$49.00 • 3 Topics • 9 Lessons</div>
            </div>
            <div class="divide-y divide-cream-200">
              <!-- Topic 1 -->
              <div class="p-4 bg-cream-50">
                <div class="font-semibold text-gray-900 flex items-center gap-2">
                  <svg class="h-5 w-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Topic 1: Getting Started
                </div>
              </div>
              <div class="p-4 pl-10 space-y-2">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Lesson 1: What is Web Development? (5 min)
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Lesson 2: Setting Up Your Environment (8 min)
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Lesson 3: Your First HTML Page (12 min)
                </div>
              </div>
              <!-- Topic 2 -->
              <div class="p-4 bg-cream-50">
                <div class="font-semibold text-gray-900 flex items-center gap-2">
                  <svg class="h-5 w-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Topic 2: CSS Styling
                </div>
              </div>
              <div class="p-4 pl-10 space-y-2">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Lesson 4: Introduction to CSS (10 min)
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Lesson 5: Colors & Typography (7 min)
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="h-4 w-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Lesson 6: Flexbox & Grid Layout (15 min)
                </div>
              </div>
            </div>
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
