<template>
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_-20%,rgba(46,81,141,0.35),rgba(17,28,54,0))]"></div>
    <div class="mx-auto max-w-6xl px-4 py-16">
    <h1 class="text-4xl font-extrabold tracking-tight">Corporate Training in Zimbabwe</h1>
    <p class="mt-4 max-w-2xl text-navy-200">Tailored corporate training and workshops to enhance staff capability, efficiency, and competitiveness in the digital economy.</p>
    <div class="mt-6 overflow-hidden rounded-xl border border-navy-800">
      <img alt="Corporate training session" src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop" class="h-64 w-full object-cover opacity-85" />
    </div>
    <div class="mt-8 grid gap-6 md:grid-cols-3">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 hover:border-navy-600 transition-colors">
        <div class="text-sm text-navy-300">Accelerators</div>
        <div class="mt-1 text-xl font-semibold">Intensive bootcamps</div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 hover:border-navy-600 transition-colors">
        <div class="text-sm text-navy-300">Workshops</div>
        <div class="mt-1 text-xl font-semibold">Half‑day to multi‑day</div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 hover:border-navy-600 transition-colors">
        <div class="text-sm text-navy-300">Advisory</div>
        <div class="mt-1 text-xl font-semibold">Capability building</div>
      </div>
    </div>
    <div class="mt-12 grid gap-6 md:grid-cols-3">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <img alt="Cloud strategy" src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" class="h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-lg font-semibold">Cloud Strategy</div>
        <p class="mt-1 text-sm text-navy-300">Roadmaps, governance, and cost‑efficient modernization.</p>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <img alt="Security operations" src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?q=80&w=1200&auto=format&fit=crop" class="h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-lg font-semibold">Security Ops</div>
        <p class="mt-1 text-sm text-navy-300">Hardening, SOC guidance, incident readiness & response.</p>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <img alt="Data dashboards" src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop" class="h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-lg font-semibold">Analytics</div>
        <p class="mt-1 text-sm text-navy-300">Executive dashboards and operational insights that scale.</p>
      </div>
    </div>
    <div class="mt-10">
      <NuxtLink to="/request" class="rounded-md bg-navy-400 px-5 py-3 font-medium text-navy-950 shadow-sm shadow-navy-900/30 hover:bg-navy-300">Request a workshop</NuxtLink>
    </div>
    </div>
  </section>
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

