<template>
  <div class="relative">
    <select
      v-bind="$attrs"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="block w-full appearance-none rounded-md border bg-white/5 px-3 py-2 text-sm outline-none transition-colors focus:ring-0 disabled:opacity-60 disabled:cursor-not-allowed
        border-navy-700 text-white placeholder-navy-400 focus:border-navy-500"
      style="color: white !important; background-color: rgba(0, 0, 0, 0.1) !important;"
    >
      <option value="" disabled style="color: #94a3b8; background-color: #1e293b;">Select an option</option>
      <slot />
    </select>
    <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-navy-300">▾</span>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ modelValue?: string }>()
defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

