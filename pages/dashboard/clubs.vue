<template>
  <section class="mx-auto max-w-5xl px-3 sm:px-4 py-16">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-extrabold tracking-tight xs:text-4xl">Clubs</h1>
      <UiButton @click="open = true" class="bg-navy-400 text-navy-950 hover:bg-navy-300">Create Club</UiButton>
    </div>
    <ul class="mt-6 divide-y divide-navy-800 rounded-xl border border-navy-800">
      <li v-for="c in clubs" :key="c.id" class="flex items-center justify-between p-4">
        <div>
          <div class="font-medium">{{ c.name }}</div>
          <div class="text-sm text-navy-300">{{ c.level }} • {{ c.students }} students • {{ c.status }}</div>
        </div>
      </li>
    </ul>

    <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div class="w-full max-w-md rounded-xl border border-navy-800 bg-navy-900 p-5">
        <h2 class="text-lg font-semibold">Create Club</h2>
        <div class="mt-4 grid gap-3">
          <UiInput v-model="form.name" placeholder="e.g. Core Coding Club" class="bg-navy-900 border-navy-700 text-navy-100 placeholder-navy-400" />
          <UiInput v-model="form.level" placeholder="primary | high" class="bg-navy-900 border-navy-700 text-navy-100 placeholder-navy-400" />
          <UiInput v-model="form.planId" placeholder="plan id (e.g. high-core)" class="bg-navy-900 border-navy-700 text-navy-100 placeholder-navy-400" />
          <UiInput v-model.number="form.students" type="number" min="1" placeholder="students" class="bg-navy-900 border-navy-700 text-navy-100 placeholder-navy-400" />
        </div>
        <div class="mt-5 flex justify-end gap-3">
          <UiButton variant="secondary" @click="open = false">Cancel</UiButton>
          <UiButton @click="create">Create</UiButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import UiButton from '@/components/ui/Button.vue'
import UiInput from '@/components/ui/Input.vue'

const clubs = ref<any[]>([])
const open = ref(false)
const form = reactive({ name: '', level: '', planId: '', students: 1 })

onMounted(async () => {
  clubs.value = (await $fetch('/api/dashboard/clubs').catch(() => [])) as any[]
})

async function create() {
  const res = await $fetch('/api/dashboard/clubs', { method: 'POST', body: { ...form, students: Number(form.students) } }).catch(() => null)
  if ((res as any)?.ok) {
    open.value = false
    form.name = ''; form.level = ''; form.planId = ''; form.students = 1
    clubs.value = (await $fetch('/api/dashboard/clubs').catch(() => [])) as any[]
  }
}
</script>


