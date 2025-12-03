<template>
  <div class="relative">
    <svg
      class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      v-model="localSearch"
      type="text"
      placeholder="Search courses..."
      class="w-full rounded-lg border border-navy-700 bg-navy-800/50 pl-10 pr-4 py-2.5 text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
      @input="handleSearch"
    />
    <button
      v-if="localSearch"
      @click="clearSearch"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-300"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  search: string
}>()

const emit = defineEmits<{
  'update:search': [search: string]
}>()

const localSearch = ref(props.search)

let searchTimeout: NodeJS.Timeout | null = null

function handleSearch() {
  // Debounce search
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    emit('update:search', localSearch.value)
  }, 300)
}

function clearSearch() {
  localSearch.value = ''
  emit('update:search', '')
}

watch(() => props.search, (newSearch) => {
  localSearch.value = newSearch
})
</script>

