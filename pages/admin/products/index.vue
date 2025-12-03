<template>
  <section class="mx-auto max-w-7xl px-3 sm:px-4 py-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
          Products
        </h1>
        <p class="mt-2 text-navy-300">Manage your e-commerce products</p>
      </div>
      <NuxtLink
        to="/admin/products/create"
        class="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 text-sm font-medium text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
      >
        + Create Product
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>
      <select
        v-model="statusFilter"
        class="rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
      >
        <option value="">All Status</option>
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
        <option value="ARCHIVED">Archived</option>
        <option value="OUT_OF_STOCK">Out of Stock</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-20">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
    </div>

    <div v-else-if="products.length === 0" class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-12 text-center">
      <p class="text-navy-400">No products found</p>
      <NuxtLink
        to="/admin/products/create"
        class="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
      >
        Create your first product
      </NuxtLink>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="product in products"
        :key="product.id"
        class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 hover:border-navy-600 transition-all"
      >
        <div class="mb-4">
          <div v-if="(product.images as any)?.[0]" class="aspect-square w-full overflow-hidden rounded-lg">
            <img
              :src="(product.images as any)[0]"
              :alt="product.name"
              class="h-full w-full object-cover"
            />
          </div>
          <div v-else class="aspect-square w-full rounded-lg bg-navy-800/50 flex items-center justify-center">
            <svg class="h-12 w-12 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="mb-2 flex items-start justify-between">
          <h3 class="text-lg font-semibold text-white">{{ product.name }}</h3>
          <span
            :class="{
              'bg-green-500/20 text-green-400 border-green-500/30': product.status === 'PUBLISHED',
              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30': product.status === 'DRAFT',
              'bg-red-500/20 text-red-400 border-red-500/30': product.status === 'OUT_OF_STOCK',
              'bg-gray-500/20 text-gray-400 border-gray-500/30': product.status === 'ARCHIVED'
            }"
            class="rounded-full border px-2 py-1 text-xs font-medium"
          >
            {{ product.status }}
          </span>
        </div>
        <p class="mb-3 text-sm text-navy-300 line-clamp-2">{{ product.description }}</p>
        <div class="mb-4 flex items-center justify-between text-sm">
          <span class="font-semibold text-white">{{ product.currency }} {{ Number(product.price).toFixed(2) }}</span>
          <span class="text-navy-400">Stock: {{ product.stock }}</span>
        </div>
        <div class="flex gap-2">
          <NuxtLink
            :to="`/admin/products/${product.id}`"
            class="flex-1 rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2 text-center text-sm font-medium text-white hover:bg-navy-700/50 transition-colors"
          >
            Edit
          </NuxtLink>
          <button
            @click="deleteProduct(product.id)"
            :disabled="deleting === product.id"
            class="rounded-lg border border-red-600/50 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            {{ deleting === product.id ? '...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const searchQuery = ref('')
const statusFilter = ref('')
const deleting = ref<string | null>(null)

const { data: products, refresh, pending: loading } = await useFetch('/api/admin/products', {
  query: computed(() => ({
    search: searchQuery.value || undefined,
    status: statusFilter.value || undefined
  }))
})

watch([searchQuery, statusFilter], () => {
  refresh()
})

async function deleteProduct(productId: string) {
  if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
    return
  }

  try {
    deleting.value = productId
    await $fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE'
    })
    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to delete product')
  } finally {
    deleting.value = null
  }
}
</script>



