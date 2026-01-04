<template>
  <div class="bg-cream-50 min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-cream-50 to-surface-50 py-16 sm:py-24">
      <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_-20%,rgba(30,58,95,0.08),transparent)]"></div>
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <span class="inline-flex items-center gap-2 rounded-full bg-accent-50 border border-accent-200 px-4 py-1.5 text-xs font-medium text-accent-700">
              <span class="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
              School Programs
            </span>
            <h1 class="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              Coding & Robotics Clubs for <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Schools</span>
            </h1>
            <p class="mt-6 text-lg text-gray-600 leading-relaxed">
              We establish and support coding and robotics clubs in Zimbabwean schools to nurture the next generation of tech-savvy innovators.
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <NuxtLink to="/request" class="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all">
                Start a Club
              </NuxtLink>
              <NuxtLink to="/contact" class="rounded-xl border-2 border-cream-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:border-primary-300 transition-all">
                Learn More
              </NuxtLink>
            </div>
          </div>
          <div class="relative">
            <div class="overflow-hidden rounded-3xl bg-white p-3 shadow-card border-2 border-primary-200">
              <img alt="Students building robots with microcontrollers" src="https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1600&auto=format&fit=crop" class="h-72 lg:h-96 w-full rounded-2xl object-cover" />
            </div>
            <div class="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-card-hover border border-cream-200">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-white">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <div class="font-bold text-gray-900">STEM Focus</div>
                  <div class="text-sm text-gray-500">Future-Ready Skills</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- What We Offer -->
    <section class="py-16 bg-gradient-to-br from-primary-600 to-primary-700">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-white">What We Offer</h2>
          <p class="mt-2 text-primary-100">Complete support for your school's tech journey</p>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:bg-white/15 transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 mb-4">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Setup</h3>
            <p class="text-primary-100">Complete club launch with curriculum and resources.</p>
          </div>
          <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:bg-white/15 transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 mb-4">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Training</h3>
            <p class="text-primary-100">Ongoing mentoring and regular training sessions.</p>
          </div>
          <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:bg-white/15 transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-400/30 mb-4">
              <svg class="h-6 w-6 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Competitions</h3>
            <p class="text-primary-100">Showcase events and coding challenges.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Programs -->
    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">Club Programs</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive programs designed specifically for school environments
          </p>
        </div>
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card overflow-hidden group hover:shadow-card-hover transition-all">
            <div class="h-48 overflow-hidden">
              <img alt="Arduino Uno and sensors" src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Robotics</h3>
              <p class="text-gray-600 mb-4">Hands-on robotics, electronics, and competitions for students of all ages.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Arduino & Sensors
                </li>
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Robot Building
                </li>
              </ul>
            </div>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card overflow-hidden group hover:shadow-card-hover transition-all">
            <div class="h-48 overflow-hidden">
              <img alt="Coding lessons" src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Coding</h3>
              <p class="text-gray-600 mb-4">Creative coding pathways from beginner to advanced levels.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Scratch & Python
                </li>
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Web Development
                </li>
              </ul>
            </div>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card overflow-hidden group hover:shadow-card-hover transition-all">
            <div class="h-48 overflow-hidden">
              <img alt="micro:bit and robots" src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">STEM Events</h3>
              <p class="text-gray-600 mb-4">Showcases, hack days, and community partnerships.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Competitions
                </li>
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Demo Days
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 sm:py-20 bg-white border-t border-cream-200">
      <div class="mx-auto max-w-4xl px-4 sm:px-6">
        <div class="rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 sm:p-12 text-center shadow-xl">
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Start a Club?</h2>
          <p class="text-primary-100 mb-8 max-w-2xl mx-auto">
            Let's bring coding and robotics education to your school with a customized club program.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="/request" class="rounded-xl bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg hover:shadow-xl transition-all">
              Start a Club
            </NuxtLink>
            <NuxtLink to="/contact" class="rounded-xl border-2 border-white/30 px-8 py-3 font-semibold text-white hover:bg-white/10 transition-all">
              Contact Us
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Coding & Robotics Clubs in Zimbabwe | WeCodeZW',
  meta: [
    { name: 'description', content: 'Set up coding and robotics clubs in Zimbabwean schools. Mentoring, curriculum, competitions, and STEM partnerships.' },
    { name: 'keywords', content: 'school coding clubs, robotics clubs, Zimbabwe schools, STEM clubs, coding for kids' },
    { property: 'og:title', content: 'Coding & Robotics Clubs in Zimbabwe | WeCodeZW' },
    { property: 'og:description', content: 'We help schools launch coding & robotics clubs with mentoring and competitions.' }
  ]
})
</script>
