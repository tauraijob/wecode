<template>
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_-20%,rgba(46,81,141,0.35),rgba(17,28,54,0))]"></div>
    <div class="mx-auto max-w-6xl px-4 py-16">
    <h1 class="text-4xl font-extrabold tracking-tight">School Clubs: Coding & Robotics</h1>
    <p class="mt-4 max-w-2xl text-navy-200">We establish and support clubs to nurture the next generation of tech‑savvy innovators.</p>
    <div class="mt-6 overflow-hidden rounded-xl border border-navy-800">
      <img alt="Students building robots with microcontrollers" src="https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1600&auto=format&fit=crop" class="h-64 w-full object-cover opacity-85" />
    </div>
    <div class="mt-8 grid gap-6 md:grid-cols-3">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 hover:border-navy-600 transition-colors">
        <div class="text-sm text-navy-300">Setup</div>
        <div class="mt-1 text-xl font-semibold">Club launch & curriculum</div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 hover:border-navy-600 transition-colors">
        <div class="text-sm text-navy-300">Training</div>
        <div class="mt-1 text-xl font-semibold">Mentoring & sessions</div>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 hover:border-navy-600 transition-colors">
        <div class="text-sm text-navy-300">Competitions</div>
        <div class="mt-1 text-xl font-semibold">Showcase & challenges</div>
      </div>
    </div>
    <div class="mt-12 grid gap-6 md:grid-cols-3">
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <img alt="Arduino Uno and sensors" src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" class="h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-lg font-semibold">Robotics</div>
        <p class="mt-1 text-sm text-navy-300">Hands‑on robotics, electronics, and competitions.</p>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <img alt="Coding lessons" src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop" class="h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-lg font-semibold">Coding</div>
        <p class="mt-1 text-sm text-navy-300">Creative coding pathways from beginner to advanced.</p>
      </div>
      <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-5">
        <img alt="micro:bit and Bit:Bot robots" src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop" class="h-28 w-full rounded object-cover opacity-85"/>
        <div class="mt-3 text-lg font-semibold">STEM Events</div>
        <p class="mt-1 text-sm text-navy-300">Showcases, hack days, and community partnerships.</p>
      </div>
    </div>
    <div class="mt-10">
      <NuxtLink to="/request" class="rounded-md bg-navy-400 px-5 py-3 font-medium text-navy-950 shadow-sm shadow-navy-900/30 hover:bg-navy-300">Start a club</NuxtLink>
    </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

