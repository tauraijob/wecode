<template>
  <section class="mx-auto max-w-4xl px-3 sm:px-4 py-8">
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Request a Quote — School Clubs
      </h1>
      <p class="mt-2 text-navy-300">Fill in your school details and options. We'll calculate totals and email a professional invoice immediately.</p>
    </div>
    <div class="rounded-2xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 shadow-xl">
      <SchoolClubCalculator />
    </div>
  </section>
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
