<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 grid place-items-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('update:open', false)"></div>
      <div class="relative z-10 w-full max-w-lg scale-100 rounded-xl border border-navy-800 bg-navy-900 p-6 shadow-2xl shadow-navy-950/40 transition-transform animate-in fade-in-0 zoom-in-95">
        <div class="mb-3 text-lg font-semibold"><slot name="title" /></div>
        <div class="text-navy-200"><slot /></div>
        <div class="mt-6 flex justify-end gap-2">
          <UiButton @click="emit('update:open', false)" class="bg-white/10 text-white hover:bg-white/15">Close</UiButton>
          <slot name="actions" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import UiButton from '@/components/ui/Button.vue'
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()
</script>

