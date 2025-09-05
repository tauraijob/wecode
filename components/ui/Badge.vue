<template>
  <span :class="badgeClass"><slot /></span>
  
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' }>(), {
  variant: 'default'
})

const base = 'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors'
const variants: Record<string, string> = {
  default: 'bg-navy-400 text-navy-950',
  secondary: 'bg-white/10 text-white',
  success: 'bg-emerald-400 text-emerald-950',
  warning: 'bg-amber-400 text-amber-950',
  destructive: 'bg-rose-500 text-white',
  outline: 'border border-navy-700 text-navy-200'
}
const badgeClass = computed(() => `${base} ${variants[props.variant] || variants.default}`)
</script>

