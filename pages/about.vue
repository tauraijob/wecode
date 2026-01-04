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
              About Us
            </span>
            <h1 class="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              Empowering Zimbabwe's <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Digital Future</span>
            </h1>
            <p class="mt-6 text-lg text-gray-600 leading-relaxed">
              WeCodeZW bridges knowledge, technology, and innovation—helping learners, professionals, and organizations thrive in today's digital‑first world.
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <NuxtLink to="/courses" class="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all">
                Explore Courses
              </NuxtLink>
              <NuxtLink to="/contact" class="rounded-xl border-2 border-cream-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:border-primary-300 transition-all">
                Get in Touch
              </NuxtLink>
            </div>
          </div>
          <div class="relative">
            <div class="overflow-hidden rounded-3xl bg-white p-3 shadow-card border-2 border-primary-200">
              <img alt="Team collaborating on technology" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop" class="h-72 lg:h-96 w-full rounded-2xl object-cover" />
            </div>
            <div class="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-card-hover border border-cream-200">
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <div class="font-bold text-gray-900">Est. 2020</div>
                  <div class="text-sm text-gray-500">Building the Future</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-16 sm:py-20 bg-gradient-to-br from-primary-600 to-primary-700">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-white">Our Purpose</h2>
          <p class="mt-2 text-primary-100">What drives us every day</p>
        </div>
        <div class="grid gap-8 md:grid-cols-2">
          <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 hover:bg-white/15 transition-all">
            <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 mb-6">
              <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p class="text-primary-100 leading-relaxed">
              To democratize technology education and empower every Zimbabwean with the digital skills they need to succeed in the modern economy. We believe that access to quality tech education should not be a privilege but a right.
            </p>
          </div>
          <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-8 hover:bg-white/15 transition-all">
            <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-400/30 mb-6">
              <svg class="h-7 w-7 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p class="text-primary-100 leading-relaxed">
              To be the leading technology education and IT services provider in Zimbabwe, recognized for producing skilled professionals who drive innovation and economic growth across industries.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- What We Offer -->
    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">What We Offer</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions for individuals, schools, and businesses
          </p>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-2xl bg-white border border-cream-200 p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Online Courses</h3>
            <p class="text-sm text-gray-600">Self-paced learning with expert-led video content, quizzes, and certificates.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">School Clubs</h3>
            <p class="text-sm text-gray-600">Coding and robotics programs designed specifically for schools.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Corporate Training</h3>
            <p class="text-sm text-gray-600">Tailored upskilling programs for teams and organizations.</p>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 mb-4">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">IT Services</h3>
            <p class="text-sm text-gray-600">Web development, software solutions, and technical consulting.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-16 sm:py-20 bg-white border-y border-cream-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">Our Values</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>
        <div class="grid gap-8 md:grid-cols-3">
          <div class="text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
            <p class="text-gray-600">We embrace new technologies and methodologies to deliver cutting-edge education.</p>
          </div>
          <div class="text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-100 text-accent-600 mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Community</h3>
            <p class="text-gray-600">We believe in building a supportive community of learners and professionals.</p>
          </div>
          <div class="text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 mb-4">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
            <p class="text-gray-600">We are committed to delivering the highest quality education and services.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6">
        <div class="rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 sm:p-12 text-center shadow-xl">
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p class="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are building their skills and advancing their careers with WeCodeZW.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="/courses" class="rounded-xl bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg hover:shadow-xl transition-all">
              Browse Courses
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
  title: 'About Us - WeCodeZW',
  meta: [
    { name: 'description', content: 'Learn about WeCodeZW - Zimbabwe\'s leading technology education and IT services provider. We empower individuals, schools, and businesses with digital skills.' }
  ]
})
</script>
