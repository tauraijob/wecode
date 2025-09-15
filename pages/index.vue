<template>
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
            <NuxtLink to="/request" class="rounded-md bg-navy-400 px-4 sm:px-5 py-3 font-medium text-navy-950 shadow-sm shadow-navy-900/30 hover:bg-navy-300 text-center">Request Training</NuxtLink>
            <NuxtLink to="/services" class="rounded-md border border-navy-700 px-4 sm:px-5 py-3 font-medium hover:border-navy-500 text-center">IT Services</NuxtLink>
            <NuxtLink to="/training" class="underline text-navy-300">short computer courses in Harare</NuxtLink>
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

  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-12 sm:py-16">
    <h2 class="text-xl sm:text-2xl font-bold tracking-tight">Who we serve</h2>
    <div class="mt-6 sm:mt-8 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-4 sm:p-6 hover:border-navy-600 transition-colors">
        <div class="text-sm text-navy-300">Individuals & Students</div>
        <div class="mt-1 text-lg sm:text-xl font-semibold">Digital Skills Training</div>
        <p class="mt-3 text-sm sm:text-base text-navy-200">Programming, web, cybersecurity, and hands‑on learning paths tailored to you.</p>
        <NuxtLink to="/training" class="mt-4 inline-block text-navy-300 underline hover:text-navy-200">Explore training →</NuxtLink>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-4 sm:p-6 hover:border-navy-600 transition-colors">
        <div class="text-sm text-navy-300">Schools</div>
        <div class="mt-1 text-lg sm:text-xl font-semibold">Coding & Robotics Clubs</div>
        <p class="mt-3 text-sm sm:text-base text-navy-200">Launch clubs that nurture the next generation of tech innovators in your school.</p>
        <NuxtLink to="/schools" class="mt-4 inline-block text-navy-300 underline hover:text-navy-200">Start a club →</NuxtLink>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-4 sm:p-6 hover:border-navy-600 transition-colors sm:col-span-2 lg:col-span-1">
        <div class="text-sm text-navy-300">Corporates & NGOs</div>
        <div class="mt-1 text-lg sm:text-xl font-semibold">Tailored Upskilling</div>
        <p class="mt-3 text-sm sm:text-base text-navy-200">Enhance staff capacity, efficiency, and competitiveness with tailored programs.</p>
        <NuxtLink to="/corporate" class="mt-4 inline-block text-navy-300 underline hover:text-navy-200">Request workshop →</NuxtLink>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-12 sm:py-16">
    <h2 class="text-xl sm:text-2xl font-bold tracking-tight">Capabilities</h2>
    <p class="mt-2 max-w-2xl text-sm sm:text-base text-navy-300">From code to cloud, security to operations—WeCodeZW delivers end‑to‑end value.</p>
    <div class="mt-6 sm:mt-8 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-4 sm:p-5">
        <img alt="Modern web apps" src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop" class="h-24 sm:h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-base sm:text-lg font-semibold">Web & Apps</div>
        <p class="mt-1 text-xs sm:text-sm text-navy-300">Design, build, and deploy modern, responsive products.</p>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-4 sm:p-5">
        <img alt="Cloud infrastructure" src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop" class="h-24 sm:h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-base sm:text-lg font-semibold">Cloud & DevOps</div>
        <p class="mt-1 text-xs sm:text-sm text-navy-300">Automation, CI/CD, observability, and reliable operations.</p>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-4 sm:p-5">
        <img alt="Cybersecurity" src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop" class="h-24 sm:h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-base sm:text-lg font-semibold">Cybersecurity</div>
        <p class="mt-1 text-xs sm:text-sm text-navy-300">Security reviews, hardening, and ongoing protection.</p>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-4 sm:p-5">
        <img alt="Dashboards and analytics" src="https://images.unsplash.com/photo-1551281044-8fb89f0747b1?q=80&w=1200&auto=format&fit=crop" class="h-24 sm:h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-base sm:text-lg font-semibold">Data & Dashboards</div>
        <p class="mt-1 text-xs sm:text-sm text-navy-300">Metrics that matter: clear, actionable insights.</p>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 pb-20">
    <div class="overflow-hidden rounded-xl border border-navy-800">
      <img alt="Team dashboard overview" src="https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=1600&auto=format&fit=crop" class="h-48 w-full object-cover opacity-90 sm:h-64 md:h-72"/>
    </div>
    <div class="mt-6 grid gap-6 md:grid-cols-3">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <div class="text-lg font-semibold">Outcome‑driven</div>
        <p class="mt-2 text-navy-300">We align programs and services to measurable business outcomes.</p>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <div class="text-lg font-semibold">Hands‑on learning</div>
        <p class="mt-2 text-navy-300">Build real projects, not just slides. Learn by doing with expert guidance.</p>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <div class="text-lg font-semibold">Secure by design</div>
        <p class="mt-2 text-navy-300">We bake security into products, processes, and training.</p>
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-16">
    <h2 class="text-2xl font-bold tracking-tight">Showcase</h2>
    <p class="mt-2 max-w-2xl text-navy-300">A snapshot of what we build and teach—code, cloud, robotics, and analytics.</p>
    <div class="mt-8 grid gap-4 md:grid-cols-4">
      <div class="group overflow-hidden rounded-xl border border-navy-800 bg-navy-900/40">
        <img alt="Code editors and components" src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop" class="h-40 w-full object-cover transition-all duration-500 group-hover:scale-105" />
      </div>
      <div class="group overflow-hidden rounded-xl border border-navy-800 bg-navy-900/40">
        <img alt="Cloud and infrastructure" src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop" class="h-40 w-full object-cover transition-all duration-500 group-hover:scale-105" />
      </div>
      <div class="group overflow-hidden rounded-xl border border-navy-800 bg-navy-900/40">
        <img alt="Robotics and STEM" src="https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1200&auto=format&fit=crop" class="h-40 w-full object-cover transition-all duration-500 group-hover:scale-105" />
      </div>
      <div class="group overflow-hidden rounded-xl border border-navy-800 bg-navy-900/40">
        <img alt="Dashboards and insights" src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop" class="h-40 w-full object-cover transition-all duration-500 group-hover:scale-105" />
      </div>
    </div>
  </section>

  <section class="mx-auto max-w-7xl px-4 py-16">
    <h2 class="text-2xl font-bold tracking-tight">Request training or workshops</h2>
    <p class="mt-2 max-w-2xl text-navy-300">Tell us about your goals. We’ll craft a program that fits your schedule and outcomes.</p>
    <RequestQuickForm />
  </section>
</template>

<script setup lang="ts">
import RequestQuickForm from '@/components/requests/RequestQuickForm.vue'
</script>

