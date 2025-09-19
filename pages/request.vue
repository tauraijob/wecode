<template>
  <section class="mx-auto max-w-4xl px-3 sm:px-4 py-16">
    <h1 class="text-3xl font-extrabold tracking-tight xs:text-4xl">Request a Quote — School Clubs</h1>
    <p class="mt-3 text-navy-200">Fill in your school details and options. We’ll calculate totals and email a professional invoice immediately.</p>
    <div class="mt-8">
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

