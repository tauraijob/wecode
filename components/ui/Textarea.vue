<template>
  <textarea
    :rows="rows"
    :value="modelValue"
    :placeholder="placeholder"
    v-bind="$attrs"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    class="block w-full rounded-md border bg-white/5 px-3 py-2 text-sm outline-none transition-colors focus:ring-0 disabled:opacity-60 disabled:cursor-not-allowed
      border-navy-700 text-white placeholder-navy-400 focus:border-navy-500"
    style="color: white !important; background-color: rgba(0, 0, 0, 0.1) !important;"
  />
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ modelValue?: string, rows?: number, placeholder?: string }>()
defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

