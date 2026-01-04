<template>
  <div class="bg-cream-50 min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-cream-50 to-surface-50 py-16 sm:py-24">
      <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_-20%,rgba(30,58,95,0.08),transparent)]"></div>
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <span class="inline-flex items-center gap-2 rounded-full bg-primary-50 border border-primary-200 px-4 py-1.5 text-xs font-medium text-primary-700">
              <span class="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              Individual Training
            </span>
            <h1 class="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              Coding Academy in <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Zimbabwe</span>
            </h1>
            <p class="mt-6 text-lg text-gray-600 leading-relaxed">
              Hands‑on coding courses and short computer courses in Harare and across Zimbabwe. Learn computer programming, web development, cybersecurity, data, and more—built to get you job‑ready.
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <NuxtLink to="/courses" class="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all">
                Browse Courses
              </NuxtLink>
              <NuxtLink to="/request" class="rounded-xl border-2 border-cream-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:border-primary-300 transition-all">
                Request Custom Training
              </NuxtLink>
            </div>
          </div>
          <div class="relative">
            <div class="overflow-hidden rounded-3xl bg-white p-3 shadow-card">
              <img alt="Code editor and learning" src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop" class="h-72 lg:h-96 w-full rounded-2xl object-cover" />
            </div>
            <div class="absolute -bottom-6 -right-6 rounded-2xl bg-white p-4 shadow-card-hover border border-cream-200">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-white">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <div class="font-bold text-gray-900">Certificates</div>
                  <div class="text-sm text-gray-500">Upon Completion</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Learn With Us -->
    <section class="py-12 bg-white border-y border-cream-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="grid gap-6 md:grid-cols-4">
          <div class="text-center p-6">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">Hands-On Learning</h3>
            <p class="text-sm text-gray-600">Real projects, not just theory</p>
          </div>
          <div class="text-center p-6">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
              <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">Self-Paced</h3>
            <p class="text-sm text-gray-600">Learn at your own speed</p>
          </div>
          <div class="text-center p-6">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">Expert Instructors</h3>
            <p class="text-sm text-gray-600">Learn from industry pros</p>
          </div>
          <div class="text-center p-6">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
              <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-1">Certificates</h3>
            <p class="text-sm text-gray-600">Shareable credentials</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Curriculum -->
    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">Digital Skills Curriculum</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Foundational to advanced tracks for individuals and teams. Pick a pathway or mix topics to match your goals.
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Computer Basics</h3>
            <p class="text-sm text-gray-600">Using a computer, files & folders, OS navigation, settings, and updates.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Typing & Productivity</h3>
            <p class="text-sm text-gray-600">Typing speed & accuracy, time management, shortcuts, and workflows.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Microsoft 365</h3>
            <p class="text-sm text-gray-600">Word, Excel, PowerPoint, Outlook, Teams—practical, workplace‑ready skills.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Google Workspace</h3>
            <p class="text-sm text-gray-600">Docs, Sheets, Slides, Gmail, Drive—collaboration and cloud storage.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Web Development</h3>
            <p class="text-sm text-gray-600">HTML, CSS, JavaScript, Vue/Nuxt, and practical real-world projects.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Robotics & IoT</h3>
            <p class="text-sm text-gray-600">Electronics fundamentals, sensors & motors, Arduino/Raspberry Pi.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">AI Foundations</h3>
            <p class="text-sm text-gray-600">AI/ML concepts, prompts & LLMs, ethical use, and practical tooling.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Online Safety</h3>
            <p class="text-sm text-gray-600">Cyber hygiene, privacy, digital footprints, and internet ethics.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Data Analysis</h3>
            <p class="text-sm text-gray-600">Data collection, cleaning, spreadsheets, dashboards, and storytelling.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 sm:py-20 bg-white border-t border-cream-200">
      <div class="mx-auto max-w-4xl px-4 sm:px-6">
        <div class="rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 sm:p-12 text-center shadow-xl">
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p class="text-primary-100 mb-8 max-w-2xl mx-auto">
            Browse our courses or request a custom training program tailored to your goals.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="/courses" class="rounded-xl bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg hover:shadow-xl transition-all">
              Browse Courses
            </NuxtLink>
            <NuxtLink to="/request" class="rounded-xl border-2 border-white/30 px-8 py-3 font-semibold text-white hover:bg-white/10 transition-all">
              Request Training
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Coding Academy in Zimbabwe | WeCodeZW',
  meta: [
    { name: 'description', content: 'Hands-on coding courses and short computer courses in Harare and across Zimbabwe. Learn programming, web development, cybersecurity, data analysis, and more.' },
    { name: 'keywords', content: 'coding courses, computer training, programming, Zimbabwe, Harare, web development' }
  ]
})
</script>
