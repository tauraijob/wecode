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
              Corporate Solutions
            </span>
            <h1 class="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              Corporate Training in <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Zimbabwe</span>
            </h1>
            <p class="mt-6 text-lg text-gray-600 leading-relaxed">
              Tailored corporate training and workshops to enhance staff capability, efficiency, and competitiveness in the digital economy.
            </p>
            <div class="mt-8 flex flex-wrap gap-4">
              <NuxtLink to="/request" class="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all">
                Request a Workshop
              </NuxtLink>
              <NuxtLink to="/contact" class="rounded-xl border-2 border-cream-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:border-primary-300 transition-all">
                Get a Quote
              </NuxtLink>
            </div>
          </div>
          <div class="relative">
            <div class="overflow-hidden rounded-3xl bg-white p-3 shadow-card border-2 border-primary-200">
              <img alt="Corporate training session" src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop" class="h-72 lg:h-96 w-full rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Training Types -->
    <section class="py-16 bg-gradient-to-br from-primary-600 to-primary-700">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-white">Training Types</h2>
          <p class="mt-2 text-primary-100">Choose the format that works best for your team</p>
        </div>
        <div class="grid gap-6 md:grid-cols-3">
          <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:bg-white/15 transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 mb-4">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Accelerators</h3>
            <p class="text-primary-100">Intensive bootcamps to fast-track your team's skills in weeks.</p>
          </div>
          <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:bg-white/15 transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 mb-4">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Workshops</h3>
            <p class="text-primary-100">Half-day to multi-day sessions focused on specific skills.</p>
          </div>
          <div class="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:bg-white/15 transition-all">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-400/30 mb-4">
              <svg class="h-6 w-6 text-accent-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Advisory</h3>
            <p class="text-primary-100">Strategic guidance for long-term capability building.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Expertise Areas -->
    <section class="py-16 sm:py-20">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">Training Areas</h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We offer specialized training across key technology domains
          </p>
        </div>
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card overflow-hidden group hover:shadow-card-hover transition-all">
            <div class="h-48 overflow-hidden">
              <img alt="Cloud strategy" src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Cloud Strategy</h3>
              <p class="text-gray-600 mb-4">Roadmaps, governance, and cost-efficient modernization for your organization.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Cloud Migration Planning
                </li>
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Cost Optimization
                </li>
              </ul>
            </div>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card overflow-hidden group hover:shadow-card-hover transition-all">
            <div class="h-48 overflow-hidden">
              <img alt="Security operations" src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?q=80&w=1200&auto=format&fit=crop" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Security Operations</h3>
              <p class="text-gray-600 mb-4">Hardening, SOC guidance, incident readiness & response training.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Cybersecurity Awareness
                </li>
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Incident Response
                </li>
              </ul>
            </div>
          </div>
          <div class="rounded-2xl bg-white border border-cream-200 shadow-card overflow-hidden group hover:shadow-card-hover transition-all">
            <div class="h-48 overflow-hidden">
              <img alt="Data dashboards" src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">Data & Analytics</h3>
              <p class="text-gray-600 mb-4">Executive dashboards and operational insights that scale with your business.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Data Visualization
                </li>
                <li class="flex items-center gap-2">
                  <svg class="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Business Intelligence
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 sm:py-20 bg-gradient-to-br from-navy-900 to-primary-900">
      <div class="mx-auto max-w-4xl px-4 sm:px-6">
        <div class="rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 p-8 sm:p-12 text-center shadow-xl">
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Upskill Your Team?</h2>
          <p class="text-primary-100 mb-8 max-w-2xl mx-auto">
            Let's design a custom training program that meets your organization's unique needs.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="/request" class="rounded-xl bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg hover:shadow-xl transition-all">
              Request a Workshop
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
  title: 'Corporate Training in Zimbabwe | WeCodeZW',
  meta: [
    { name: 'description', content: 'Corporate training in Zimbabwe: accelerators, workshops, and advisory in cloud, security, analytics, and digital skills.' },
    { name: 'keywords', content: 'corporate training, workshops, digital skills, Zimbabwe, Harare, cloud, security, analytics' },
    { property: 'og:title', content: 'Corporate Training in Zimbabwe | WeCodeZW' },
    { property: 'og:description', content: 'Accelerators, workshops, and advisory to upskill teams in cloud, security, and analytics.' }
  ]
})
</script>
