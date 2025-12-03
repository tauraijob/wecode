<template>
  <section class="mx-auto max-w-7xl px-4 py-16">
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
      <p class="mt-4 text-navy-300">Loading product...</p>
    </div>

    <div v-else-if="error || !product" class="text-center py-20">
      <p class="text-navy-400 mb-4">Product not found</p>
      <p v-if="error" class="text-sm text-red-400 mb-4">{{ error.message || error.statusMessage || 'Failed to load product' }}</p>
      <NuxtLink to="/products" class="mt-4 inline-block rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700">
        Back to Products
      </NuxtLink>
    </div>

    <div v-else class="grid gap-8 lg:grid-cols-2">
      <!-- Product Images -->
      <div>
        <div v-if="(product.images as any)?.[0]" class="mb-4 aspect-square w-full overflow-hidden rounded-xl bg-navy-800/50">
          <img
            :src="selectedImage || (product.images as any)[0]"
            :alt="product.name"
            class="h-full w-full object-cover"
          />
        </div>
        <div v-else class="mb-4 aspect-square w-full rounded-xl bg-navy-800/50 flex items-center justify-center">
          <svg class="h-24 w-24 text-navy-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <!-- Image Gallery -->
        <div v-if="(product.images as any)?.length > 1" class="grid grid-cols-4 gap-2">
          <button
            v-for="(image, index) in (product.images as any)"
            :key="index"
            @click="selectedImage = image"
            :class="{
              'ring-2 ring-purple-500': selectedImage === image || (!selectedImage && index === 0)
            }"
            class="aspect-square overflow-hidden rounded-lg border border-navy-700 bg-navy-800/50 hover:border-purple-500 transition-colors"
          >
            <img
              :src="image"
              :alt="`${product.name} - Image ${index + 1}`"
              class="h-full w-full object-cover"
            />
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div>
        <NuxtLink to="/products" class="inline-flex items-center gap-2 text-sm text-navy-400 hover:text-navy-300 mb-4">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </NuxtLink>

        <h1 class="text-4xl font-extrabold tracking-tight text-white mb-4">{{ product.name }}</h1>
        
        <div class="mb-6 flex items-center gap-4">
          <span class="text-3xl font-bold text-white">{{ product.currency }} {{ Number(product.price).toFixed(2) }}</span>
          <span v-if="product.featured" class="rounded-full bg-purple-500/20 border border-purple-500/30 px-3 py-1 text-sm font-medium text-purple-400">
            Featured
          </span>
        </div>

        <div class="mb-6">
          <p class="text-navy-300 whitespace-pre-wrap">{{ product.description }}</p>
        </div>

        <!-- Product Details -->
        <div class="mb-6 rounded-lg border border-navy-700/50 bg-navy-800/30 p-4 space-y-3">
          <h3 class="text-lg font-semibold text-white mb-3">Product Details</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div v-if="product.category" class="flex flex-col">
              <span class="text-navy-400 font-medium mb-1">Category</span>
              <span class="text-white">{{ product.category }}</span>
            </div>
            <div v-if="product.sku" class="flex flex-col">
              <span class="text-navy-400 font-medium mb-1">SKU</span>
              <span class="text-white">{{ product.sku }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-navy-400 font-medium mb-1">Availability</span>
              <span :class="product.stock > 0 ? 'text-green-400' : 'text-red-400'">
                {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
              </span>
            </div>
            <div v-if="product.weight" class="flex flex-col">
              <span class="text-navy-400 font-medium mb-1">Weight</span>
              <span class="text-white">{{ Number(product.weight).toFixed(2) }} kg</span>
            </div>
            <div v-if="product.dimensions" class="flex flex-col">
              <span class="text-navy-400 font-medium mb-1">Dimensions</span>
              <span class="text-white">{{ product.dimensions }}</span>
            </div>
          </div>
          
          <div v-if="product.tags" class="mt-4 pt-4 border-t border-navy-700/50">
            <span class="text-navy-400 font-medium text-sm mb-2 block">Tags</span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in product.tags.split(',').map(t => t.trim())"
                :key="tag"
                class="rounded-full bg-purple-500/20 border border-purple-500/30 px-3 py-1 text-xs text-purple-400"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="product.stock > 0" class="mb-6">
          <div class="flex items-center gap-4 mb-4">
            <label class="text-sm font-medium text-navy-200">Quantity:</label>
            <div class="flex items-center gap-2">
              <button
                @click="quantity > 1 ? quantity-- : null"
                class="rounded-lg border border-navy-600 bg-navy-800/50 px-3 py-1.5 text-white hover:bg-navy-700/50"
              >
                -
              </button>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                :max="product.stock"
                class="w-20 rounded-lg border border-navy-600 bg-navy-800/50 px-3 py-1.5 text-center text-white"
              />
              <button
                @click="quantity < product.stock ? quantity++ : null"
                class="rounded-lg border border-navy-600 bg-navy-800/50 px-3 py-1.5 text-white hover:bg-navy-700/50"
              >
                +
              </button>
            </div>
          </div>

          <button
            @click="addToCart"
            :disabled="addingToCart"
            class="w-full rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-medium text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {{ addingToCart ? 'Adding...' : 'Add to Cart' }}
          </button>
        </div>

        <div v-else class="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <p class="text-red-400">This product is currently out of stock.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Disable SSR for this page to avoid auth issues
definePageMeta({
  ssr: false
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Only check auth on client side when needed
const user = ref<any>(null)

// Product data - fetch client-side only
const product = ref<any>(null)
const loading = ref(true)
const error = ref<any>(null)

// Fetch product on mount and when slug changes
async function fetchProduct() {
  const currentSlug = route.params.slug as string
  if (!currentSlug) return
  loading.value = true
  error.value = null
  try {
    product.value = await $fetch(`/api/products/${currentSlug}`)
  } catch (err: any) {
    error.value = err
    console.error('Product fetch error:', err)
  } finally {
    loading.value = false
  }
}

// Watch for route changes (including slug changes)
watch(() => route.params.slug, async (newSlug) => {
  if (newSlug && process.client) {
    await fetchProduct()
  }
}, { immediate: false })

// Fetch product and check auth on mount (client-side only)
onMounted(async () => {
  // Fetch product
  await fetchProduct()
  
  // Check auth (optional, won't block page)
  try {
    const auth = useAuth()
    user.value = auth.user.value
    watch(auth.user, (newUser) => {
      user.value = newUser
    })
  } catch {
    user.value = null
  }
})

const quantity = ref(1)
const addingToCart = ref(false)
const selectedImage = ref<string | null>(null)

// Set SEO meta tags
useHead({
  title: computed(() => product.value ? `${product.value.name} - WeCodeZW` : 'Product - WeCodeZW'),
  meta: [
    {
      name: 'description',
      content: computed(() => product.value?.description || 'Product details')
    }
  ]
})

async function addToCart() {
  if (!user.value) {
    await navigateTo('/auth/login?redirect=' + encodeURIComponent(route.fullPath))
    return
  }

  try {
    addingToCart.value = true
    await $fetch('/api/cart', {
      method: 'POST',
      body: {
        productId: product.value.id,
        quantity: quantity.value
      }
    })
    alert('Product added to cart!')
    quantity.value = 1
  } catch (error: any) {
    alert(error.data?.message || 'Failed to add to cart')
  } finally {
    addingToCart.value = false
  }
}
</script>

