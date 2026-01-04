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
              IT Solutions
            </span>
            <h1 class="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              IT Services in <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Zimbabwe</span>
            </h1>
            <p class="mt-6 text-lg text-gray-600 leading-relaxed">
              Website & software development, systems management, and cybersecurity solutions for businesses and NGOs across Zimbabwe.
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <NuxtLink to="/request" class="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all">
                Request Services
              </NuxtLink>
              <NuxtLink to="/contact" class="rounded-xl border-2 border-cream-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:border-primary-300 transition-all">
                Get a Quote
              </NuxtLink>
            </div>
          </div>
          <div class="relative">
            <div class="overflow-hidden rounded-3xl bg-white p-3 shadow-card border-2 border-primary-200">
              <img alt="Servers and cloud infrastructure" :src="heroSrc" @error="onHeroError" class="h-72 lg:h-96 w-full rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Overview -->
    <section class="py-16 bg-gradient-to-br from-primary-600 to-primary-700">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-white">Our Services</h2>
          <p class="mt-2 text-primary-100">End-to-end IT solutions for your business</p>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:bg-white/15 transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 mb-4">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Web & Apps</h3>
            <p class="text-primary-100">Custom websites, web apps, and mobile applications built with modern technologies.</p>
          </div>
          <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:bg-white/15 transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 mb-4">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Systems & Cloud</h3>
            <p class="text-primary-100">Cloud infrastructure, DevOps, and systems management for reliable operations.</p>
          </div>
          <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:bg-white/15 transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-400/30 mb-4">
              <svg class="h-6 w-6 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Cybersecurity</h3>
            <p class="text-primary-100">Security audits, secure coding practices, and compliance solutions.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Services -->
    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">Our Expertise</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We deliver high-quality IT solutions tailored to your business needs
          </p>
        </div>
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card overflow-hidden group hover:shadow-card-hover transition-all">
            <div class="h-48 overflow-hidden">
              <img alt="API development" src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">API Development</h3>
              <p class="text-gray-600 mb-4">Robust, secure REST & GraphQL APIs with excellent documentation and developer experience.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  RESTful & GraphQL APIs
                </li>
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Authentication & Authorization
                </li>
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  API Documentation
                </li>
              </ul>
            </div>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card overflow-hidden group hover:shadow-card-hover transition-all">
            <div class="h-48 overflow-hidden">
              <img alt="Monitoring dashboards" src="https://images.unsplash.com/photo-1555421689-43cad7100751?q=80&w=1200&auto=format&fit=crop" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Observability</h3>
              <p class="text-gray-600 mb-4">Comprehensive monitoring, dashboards, alerts, and SLOs for system reliability.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Real-time Monitoring
                </li>
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Custom Dashboards
                </li>
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Alerting & Notifications
                </li>
              </ul>
            </div>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card overflow-hidden group hover:shadow-card-hover transition-all">
            <div class="h-48 overflow-hidden">
              <img alt="App security" src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Application Security</h3>
              <p class="text-gray-600 mb-4">Secure coding practices, security audits, and vulnerability remediation.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Security Audits
                </li>
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Penetration Testing
                </li>
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Compliance Support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Training CTA -->
    <section class="py-16 sm:py-20 bg-white border-y border-cream-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">Short Computer Courses for Teams</h2>
            <p class="mt-4 text-lg text-gray-600">
              Upskill your workforce with <NuxtLink to="/training" class="text-primary-600 font-medium underline underline-offset-2">short computer courses in Harare</NuxtLink> and nationwide. From Microsoft 365 to <strong>computer programming</strong> and cybersecurity, we tailor programs to outcomes.
            </p>
            <ul class="mt-6 space-y-3">
              <li class="flex items-center gap-3 text-gray-600">
                <svg class="h-5 w-5 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Microsoft 365 & Productivity Tools
              </li>
              <li class="flex items-center gap-3 text-gray-600">
                <svg class="h-5 w-5 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Programming & Web Development
              </li>
              <li class="flex items-center gap-3 text-gray-600">
                <svg class="h-5 w-5 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Cybersecurity Awareness
              </li>
              <li class="flex items-center gap-3 text-gray-600">
                <svg class="h-5 w-5 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                Data Analysis & Visualization
              </li>
            </ul>
            <div class="mt-8">
              <NuxtLink to="/corporate" class="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all">
                Learn About Corporate Training
              </NuxtLink>
            </div>
          </div>
          <div class="rounded-2xl bg-cream-50 border border-cream-200 p-8">
            <div class="flex items-center gap-4 mb-6">
              <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div class="text-3xl font-bold text-gray-900">100+</div>
                <div class="text-gray-600">Professionals Trained</div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
                <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <div class="text-3xl font-bold text-gray-900">25+</div>
                <div class="text-gray-600">Partner Organizations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6">
        <div class="rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 sm:p-12 text-center shadow-xl">
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p class="text-primary-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how our IT services can help your organization achieve its goals.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="/request" class="rounded-xl bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg hover:shadow-xl transition-all">
              Request Services
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
const primary = 'https://images.unsplash.com/photo-1581091870622-7f3cba5a2c82?q=80&w=1600&auto=format&fit=crop'
const fallback = 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop'
const heroSrc = ref(primary)
function onHeroError() {
  if (heroSrc.value !== fallback) heroSrc.value = fallback
}

useHead({
  title: 'IT Services in Zimbabwe | WeCodeZW',
  meta: [
    { name: 'description', content: 'IT services in Zimbabwe: web & app development, cloud & systems management, and cybersecurity for businesses and NGOs.' },
    { name: 'keywords', content: 'IT services, software development, systems management, cybersecurity, Zimbabwe, Harare' },
    { property: 'og:title', content: 'IT Services in Zimbabwe | WeCodeZW' },
    { property: 'og:description', content: 'Web & app development, cloud operations, and cybersecurity solutions across Zimbabwe.' }
  ]
})
</script>
