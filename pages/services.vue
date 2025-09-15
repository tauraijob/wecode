<template>
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_-20%,rgba(46,81,141,0.35),rgba(17,28,54,0))]"></div>
    <div class="mx-auto max-w-6xl px-4 py-16">
    <h1 class="text-4xl font-extrabold tracking-tight">IT Services in Zimbabwe</h1>
    <p class="mt-4 max-w-2xl text-navy-200">Website & software development, systems management, and cybersecurity solutions for businesses and NGOs across Zimbabwe.</p>
    <div class="mt-6 overflow-hidden rounded-xl border border-navy-800">
      <img alt="Servers and cloud infrastructure" :src="heroSrc" @error="onHeroError" referrerpolicy="no-referrer" decoding="async" class="h-48 w-full object-cover opacity-85 sm:h-56 md:h-64" />
    </div>
    <div class="mt-8 grid gap-6 md:grid-cols-3">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 hover:border-navy-600 transition-colors">
        <div class="text-sm text-navy-300">Web & Apps</div>
        <div class="mt-1 text-xl font-semibold">Design & Development</div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 hover:border-navy-600 transition-colors">
        <div class="text-sm text-navy-300">Ops</div>
        <div class="mt-1 text-xl font-semibold">Systems & Cloud</div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 hover:border-navy-600 transition-colors">
        <div class="text-sm text-navy-300">Security</div>
        <div class="mt-1 text-xl font-semibold">Cybersecurity</div>
      </div>
    </div>

    <section class="mt-12">
      <h2 class="text-2xl font-bold tracking-tight">Short computer courses for teams</h2>
      <p class="mt-2 max-w-3xl text-navy-300">
        Upskill your workforce with <NuxtLink to="/training" class="underline text-navy-200">short computer courses in Harare</NuxtLink> and nationwide. From Microsoft 365 to
        <strong>computer programming</strong> and cybersecurity, we tailor programs to outcomes.
      </p>
    </section>
    <div class="mt-12 grid gap-6 md:grid-cols-3">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <img alt="API development" src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop" class="h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-lg font-semibold">APIs</div>
        <p class="mt-1 text-sm text-navy-300">Robust, secure REST/GraphQL APIs with great DX.</p>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <img alt="Monitoring dashboards" src="https://images.unsplash.com/photo-1555421689-43cad7100751?q=80&w=1200&auto=format&fit=crop" class="h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-lg font-semibold">Observability</div>
        <p class="mt-1 text-sm text-navy-300">Dashboards, alerts, and SLOs for reliability.</p>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <img alt="App security" src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop" class="h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-lg font-semibold">App Security</div>
        <p class="mt-1 text-sm text-navy-300">Secure coding, audits, and remediation plans.</p>
      </div>
    </div>
    <div class="mt-10">
      <NuxtLink to="/request" class="rounded-md bg-navy-400 px-5 py-3 font-medium text-navy-950 shadow-sm shadow-navy-900/30 hover:bg-navy-300">Request services</NuxtLink>
    </div>
    </div>
  </section>
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

