<template>
  <button
    v-bind="$attrs"
    :disabled="disabled"
    class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50
      bg-navy-400 text-navy-950 hover:bg-navy-300"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
defineProps<{ disabled?: boolean }>()
</script>

