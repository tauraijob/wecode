<template>
  <section class="mx-auto max-w-5xl px-3 sm:px-4 py-16">
    <h1 class="text-3xl font-extrabold tracking-tight xs:text-4xl">Invoices</h1>
    <ul class="mt-6 divide-y divide-navy-800 rounded-xl border border-navy-800">
      <li v-for="i in invoices" :key="i.id" class="flex items-center justify-between p-4">
        <div>
          <div class="font-medium">{{ i.number }}</div>
          <div class="text-sm text-navy-300">USD {{ Number(i.amountUsd).toFixed(2) }} • {{ i.status }}</div>
        </div>
        <NuxtLink :to="`/pay/${i.number}`" class="rounded-md border border-navy-700 px-4 py-2 text-sm hover:border-navy-500">Pay</NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const invoices = ref<any[]>([])
onMounted(async () => {
  invoices.value = (await $fetch('/api/dashboard/invoices').catch(() => [])) as any[]
})
</script>

