<template>
  <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-900/80 to-navy-800/40 p-6">
    <h3 class="text-lg font-semibold text-white mb-4">Filters</h3>
    
    <div class="space-y-4">
      <!-- Price Range -->
      <div>
        <label class="mb-2 block text-sm font-medium text-navy-200">Price Range</label>
        <div class="grid grid-cols-2 gap-2">
          <input
            v-model.number="localFilters.minPrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="Min"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-2 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
          <input
            v-model.number="localFilters.maxPrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="Max"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-2 text-sm text-white placeholder-navy-400 focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
          />
        </div>
      </div>

      <!-- Minimum Rating -->
      <div>
        <label class="mb-2 block text-sm font-medium text-navy-200">Minimum Rating</label>
        <select
          v-model.number="localFilters.minRating"
          class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        >
          <option :value="undefined">Any Rating</option>
          <option :value="4.5">4.5+ Stars</option>
          <option :value="4.0">4.0+ Stars</option>
          <option :value="3.5">3.5+ Stars</option>
          <option :value="3.0">3.0+ Stars</option>
        </select>
      </div>

      <!-- Sort By -->
      <div>
        <label class="mb-2 block text-sm font-medium text-navy-200">Sort By</label>
        <select
          v-model="localFilters.sortBy"
          class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-3 py-2 text-sm text-white focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A-Z</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="enrollments">Most Enrollments</option>
        </select>
      </div>

      <!-- Clear Filters -->
      <button
        @click="clearFilters"
        class="w-full rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-sm font-medium text-navy-200 hover:bg-navy-700/50 transition-all"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  filters: {
    minPrice?: number
    maxPrice?: number
    minRating?: number
    sortBy?: string
  }
}>()

const emit = defineEmits<{
  'update:filters': [filters: typeof props.filters]
}>()

const localFilters = ref({ ...props.filters })

watch(localFilters, (newFilters) => {
  emit('update:filters', newFilters)
}, { deep: true })

function clearFilters() {
  localFilters.value = {
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    sortBy: 'newest'
  }
}
</script>



