<template>
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_-20%,rgba(46,81,141,0.35),rgba(17,28,54,0))]"></div>
    <div class="mx-auto max-w-7xl px-4 py-16">
      <div class="mb-8">
        <h1 class="text-4xl font-extrabold tracking-tight">Products</h1>
        <p class="mt-4 max-w-2xl text-navy-200">Shop our curated catalog for learners and developers — coding merch, computer accessories, and vision gear for comfortable, productive sessions (USD pricing).</p>
      </div>

      <!-- Search Bar -->
      <div class="mb-8">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full rounded-lg border border-navy-800 bg-navy-900/40 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      <div class="grid gap-8 lg:grid-cols-4">
        <!-- Categories Sidebar -->
        <aside class="lg:col-span-1">
          <!-- Mobile Category Toggle -->
          <button
            @click="mobileCategoriesOpen = !mobileCategoriesOpen"
            class="lg:hidden w-full flex items-center justify-between rounded-lg border border-navy-800 bg-navy-900/40 px-4 py-3 mb-4"
          >
            <span class="font-medium text-white">Categories</span>
            <svg
              class="h-5 w-5 text-navy-400 transition-transform"
              :class="{ 'rotate-180': mobileCategoriesOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            :class="{
              'hidden lg:block': !mobileCategoriesOpen,
              'block': mobileCategoriesOpen
            }"
            class="sticky top-4 rounded-xl border border-navy-800 bg-navy-900/40 p-6"
          >
            <h2 class="text-lg font-semibold text-white mb-4">Categories</h2>
            <nav class="space-y-2">
              <button
                @click="selectCategory('')"
                :class="{
                  'bg-purple-500/20 border-purple-500/50 text-purple-300': !categoryFilter,
                  'border-navy-700 text-navy-300 hover:bg-navy-800/50': categoryFilter
                }"
                class="w-full text-left rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors"
              >
                All Products
                <span v-if="!categoryFilter" class="ml-2 text-xs text-purple-400">({{ allProductsCount }})</span>
              </button>
              <button
                v-for="cat in categories"
                :key="cat"
                @click="selectCategory(cat)"
                :class="{
                  'bg-purple-500/20 border-purple-500/50 text-purple-300': categoryFilter === cat,
                  'border-navy-700 text-navy-300 hover:bg-navy-800/50': categoryFilter !== cat
                }"
                class="w-full text-left rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between"
              >
                <span>{{ cat }}</span>
                <span class="text-xs text-navy-400">({{ getCategoryCount(cat) }})</span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- Products Grid -->
        <div class="lg:col-span-3">
          <div v-if="loading" class="text-center py-20">
            <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
          </div>

          <div v-else-if="products.length === 0" class="text-center py-20 text-navy-400">
            <p>No products found</p>
            <button
              v-if="categoryFilter || searchQuery"
              @click="clearFilters"
              class="mt-4 text-purple-400 hover:text-purple-300"
            >
              Clear filters
            </button>
          </div>

          <div v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/products/${product.slug}`"
          class="group rounded-xl border border-navy-800 bg-navy-900/40 p-4 hover:border-navy-600 hover:bg-navy-900/60 transition-all"
        >
          <div class="mb-4 aspect-square w-full overflow-hidden rounded-lg bg-navy-800/50">
            <img
              v-if="(product.images as any)?.[0]"
              :src="(product.images as any)[0]"
              :alt="product.name"
              class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="flex h-full w-full items-center justify-center">
              <svg class="h-12 w-12 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="mb-2 flex items-start justify-between">
            <h3 class="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">{{ product.name }}</h3>
            <span v-if="product.featured" class="rounded-full bg-purple-500/20 border border-purple-500/30 px-2 py-1 text-xs font-medium text-purple-400">
              Featured
            </span>
          </div>
          <p class="mb-3 text-sm text-navy-300 line-clamp-2">{{ product.description }}</p>
          <div class="flex items-center justify-between">
            <span class="text-lg font-bold text-white">{{ product.currency }} {{ Number(product.price).toFixed(2) }}</span>
            <span v-if="product.stock > 0" class="text-xs text-navy-400">{{ product.stock }} in stock</span>
            <span v-else class="text-xs text-red-400">Out of stock</span>
          </div>
        </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const categoryFilter = ref('')
const mobileCategoriesOpen = ref(false)

const { data: products, refresh, pending: loading } = await useFetch('/api/products', {
  query: computed(() => ({
    search: searchQuery.value || undefined,
    category: categoryFilter.value || undefined
  }))
})

// Fetch all products to get categories (without filters)
const { data: allProducts } = await useFetch('/api/products')

const categories = computed(() => {
  if (!allProducts.value) return []
  const cats = new Set<string>()
  allProducts.value.forEach((p: any) => {
    if (p.category) cats.add(p.category)
  })
  return Array.from(cats).sort()
})

const allProductsCount = computed(() => {
  return allProducts.value?.length || 0
})

function getCategoryCount(category: string) {
  if (!allProducts.value) return 0
  return allProducts.value.filter((p: any) => p.category === category).length
}

function selectCategory(category: string) {
  categoryFilter.value = category
  mobileCategoriesOpen.value = false
}

function clearFilters() {
  searchQuery.value = ''
  categoryFilter.value = ''
  mobileCategoriesOpen.value = false
}

watch([searchQuery, categoryFilter], () => {
  refresh()
})
</script>
