<template>
  <div class="bg-cream-50 min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-cream-50 to-surface-50 py-16 sm:py-20">
      <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_-20%,rgba(30,58,95,0.08),transparent)]"></div>
      <div class="mx-auto max-w-4xl px-4 sm:px-6">
        <div class="text-center mb-10">
          <span class="inline-flex items-center gap-2 rounded-full bg-accent-50 border border-accent-200 px-4 py-1.5 text-xs font-medium text-accent-700">
            <span class="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
            Get Started
          </span>
          <h1 class="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            Request a <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Quote</span>
          </h1>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Fill in your school details and options. We'll calculate totals and email a professional invoice immediately.
          </p>
        </div>
      </div>
    </section>

    <!-- Form Section -->
    <section class="py-12 sm:py-16 bg-gradient-to-br from-primary-600 to-primary-700">
      <div class="mx-auto max-w-4xl px-4 sm:px-6">
        <div class="rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 sm:p-8 shadow-xl">
          <SchoolClubCalculator />
        </div>
      </div>
    </section>

    <!-- Info Section -->
    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6">
        <div class="grid gap-6 md:grid-cols-3">
          <div class="rounded-2xl bg-white border border-cream-200 p-6 shadow-card text-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mx-auto mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Instant Quote</h3>
            <p class="text-sm text-gray-600">Get pricing calculated automatically based on your selections.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 p-6 shadow-card text-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mx-auto mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Email Invoice</h3>
            <p class="text-sm text-gray-600">Receive a professional invoice directly to your inbox.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 p-6 shadow-card text-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mx-auto mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Quick Response</h3>
            <p class="text-sm text-gray-600">Our team will follow up within 24 hours.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import SchoolClubCalculator from '@/components/requests/SchoolClubCalculator.vue'

useHead({
  title: 'Request a Quote — Coding & Robotics Clubs | WeCodeZW',
  meta: [
    { name: 'description', content: 'Get pricing for coding, robotics & digital skills clubs for primary and high school. Generate a professional invoice instantly.' },
    { property: 'og:title', content: 'Request a Quote — Coding & Robotics Clubs | WeCodeZW' },
    { property: 'og:description', content: 'Get pricing for coding, robotics & digital skills clubs for primary and high school.' },
    { property: 'og:url', content: 'https://wecode.co.zw/request' }
  ],
  link: [{ rel: 'canonical', href: 'https://wecode.co.zw/request' }]
})
</script>
