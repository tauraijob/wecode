<template>
  <section class="mx-auto max-w-3xl px-3 sm:px-4 py-16">
    <h1 class="text-3xl font-extrabold tracking-tight xs:text-4xl">Pay Invoice {{ invoiceId }}</h1>
    <p class="mt-3 text-navy-200">Choose a payment option below. Paynow will open in a new tab.</p>
    <div class="mt-6 grid gap-3">
      <UiButton @click="payNow" class="bg-navy-400 text-navy-950 hover:bg-navy-300">Pay with Paynow</UiButton>
      <NuxtLink :to="'mailto:info@wecode.co.zw?subject=Payment%20for%20' + invoiceId" class="rounded-md border border-navy-700 px-5 py-3 font-medium hover:border-navy-500">Email Us</NuxtLink>
      <a href="https://wa.me/263778456168" target="_blank" class="rounded-md border border-navy-700 px-5 py-3 font-medium hover:border-navy-500">WhatsApp +263778456168</a>
    </div>
  </section>
</template>

<script setup lang="ts">
import UiButton from '@/components/ui/Button.vue'
const route = useRoute()
const invoiceId = computed(() => route.params.invoice as string)
const amount = ref<number | null>(null)

onMounted(() => {
  // Optionally read amount from query string or fetch from backend by invoiceId
  const q = route.query.amount
  amount.value = q ? Number(q) : null
})

useHead({
  title: 'Pay Invoice | WeCodeZW',
  link: [{ rel: 'canonical', href: `https://wecode.co.zw/pay/${invoiceId.value}` }]
})

async function payNow() {
  try {
    const res = await $fetch('/api/paynow/initiate', { method: 'POST', body: { invoiceNumber: invoiceId.value, amount: amount?.value || 0 } })
    const redirectUrl = (res as any)?.redirectUrl
    if (redirectUrl) {
      window.open(redirectUrl, '_blank')
    }
  } catch (e) {
    // no-op for now
  }
}
</script>


