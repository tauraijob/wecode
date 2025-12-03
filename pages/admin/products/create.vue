<template>
  <section class="mx-auto max-w-4xl px-3 sm:px-4 py-8">
    <div class="mb-8">
      <NuxtLink
        to="/admin/products"
        class="inline-flex items-center gap-2 text-sm text-navy-400 hover:text-navy-300 mb-4"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </NuxtLink>
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Create Product
      </h1>
    </div>

    <form @submit.prevent="createProduct" class="space-y-6">
      <div class="rounded-xl border border-navy-700/50 bg-gradient-to-br from-navy-800/60 to-navy-900/40 p-6 space-y-6">
        <!-- Basic Information -->
        <div>
          <h2 class="text-xl font-semibold text-white mb-4">Basic Information</h2>
          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Product Name *</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="e.g., WeCodeZW Dev Hoodie"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                @input="generateSlug"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Slug *</label>
              <input
                v-model="form.slug"
                type="text"
                required
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                placeholder="wecodezw-dev-hoodie"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <p class="mt-1 text-xs text-navy-400">URL-friendly identifier (lowercase, hyphens only)</p>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Description *</label>
              <textarea
                v-model="form.description"
                required
                rows="5"
                placeholder="Describe your product..."
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              ></textarea>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">SKU</label>
              <input
                v-model="form.sku"
                type="text"
                placeholder="PROD-001"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <!-- Pricing & Inventory -->
        <div>
          <h2 class="text-xl font-semibold text-white mb-4">Pricing & Inventory</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Price *</label>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Currency</label>
              <select
                v-model="form.currency"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="USD">USD</option>
                <option value="ZWL">ZWL</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Stock *</label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                required
                placeholder="0"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Status</label>
              <select
                v-model="form.status"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Media -->
        <div>
          <h2 class="text-xl font-semibold text-white mb-4">Images</h2>
          <div class="space-y-4">
            <!-- Image Preview/Input List -->
            <div v-for="(image, index) in form.images" :key="index" class="space-y-2">
              <div class="flex gap-2 items-start">
                <div class="flex-1">
                  <input
                    v-model="form.images[index]"
                    type="text"
                    placeholder="https://example.com/image.jpg or /uploads/image.jpg"
                    class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div class="flex gap-2">
                  <label class="cursor-pointer rounded-lg border border-purple-600/50 bg-purple-500/10 px-4 py-2.5 text-purple-400 hover:bg-purple-500/20">
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="(e) => handleFileUpload(e, index)"
                    />
                    Upload
                  </label>
                  <button
                    type="button"
                    @click="removeImage(index)"
                    class="rounded-lg border border-red-600/50 bg-red-500/10 px-4 py-2.5 text-red-400 hover:bg-red-500/20"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div v-if="image" class="mt-2">
                <img
                  :src="image"
                  alt="Preview"
                  class="max-w-xs max-h-32 rounded-lg border border-navy-700 object-cover"
                  @error="handleImageError(index)"
                />
              </div>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                @click="addImage"
                class="rounded-lg border border-navy-600 bg-navy-800/50 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-700/50"
              >
                + Add Image URL
              </button>
              <label class="cursor-pointer rounded-lg border border-purple-600/50 bg-purple-500/10 px-4 py-2.5 text-sm font-medium text-purple-400 hover:bg-purple-500/20">
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                  multiple
                />
                📤 Upload Images
              </label>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div>
          <h2 class="text-xl font-semibold text-white mb-4">Additional Information</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Category</label>
              <input
                v-model="form.category"
                type="text"
                placeholder="e.g., Clothing, Accessories"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Tags</label>
              <input
                v-model="form.tags"
                type="text"
                placeholder="tag1, tag2, tag3"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Weight (kg)</label>
              <input
                v-model.number="form.weight"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Dimensions</label>
              <input
                v-model="form.dimensions"
                type="text"
                placeholder="10x5x2"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
          <div class="mt-4">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                v-model="form.featured"
                type="checkbox"
                class="h-4 w-4 rounded border-navy-600 bg-navy-800 text-purple-600 focus:ring-purple-500"
              />
              <span class="text-sm font-medium text-white">Featured Product</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-4 justify-end">
        <NuxtLink
          to="/admin/products"
          class="rounded-lg border border-navy-600 bg-navy-800/50 px-6 py-3 text-sm font-medium text-white hover:bg-navy-700/50 transition-colors"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading || uploading"
          class="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 text-sm font-medium text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Creating...' : uploading ? 'Uploading...' : 'Create Product' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const form = reactive({
  name: '',
  slug: '',
  description: '',
  price: 0,
  currency: 'USD',
  status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'OUT_OF_STOCK',
  stock: 0,
  sku: '',
  category: '',
  tags: '',
  images: [] as string[],
  featured: false,
  weight: null as number | null,
  dimensions: ''
})

const loading = ref(false)
const uploading = ref(false)

function generateSlug() {
  form.slug = form.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function addImage() {
  form.images.push('')
}

function removeImage(index: number) {
  form.images.splice(index, 1)
}

function handleImageError(index: number) {
  // Remove invalid image URL
  form.images[index] = ''
}

async function handleFileUpload(event: Event, index?: number) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  uploading.value = true
  try {
    for (const file of Array.from(files)) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`)
        continue
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`)
        continue
      }

      // Upload file
      const formData = new FormData()
      formData.append('image', file)

      const result = await $fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      // Add uploaded image URL to form
      if (index !== undefined) {
        form.images[index] = result.url
      } else {
        form.images.push(result.url)
      }
    }
  } catch (error: any) {
    alert(error.data?.message || 'Failed to upload image')
  } finally {
    uploading.value = false
    // Reset input
    target.value = ''
  }
}

async function createProduct() {
  try {
    loading.value = true
    
    const productData: any = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: form.price,
      currency: form.currency,
      status: form.status,
      stock: form.stock,
      sku: form.sku || null,
      category: form.category || null,
      tags: form.tags || null,
      images: form.images.filter(img => img.trim() !== '') || null,
      featured: form.featured,
      weight: form.weight || null,
      dimensions: form.dimensions || null
    }

    const product = await $fetch('/api/admin/products', {
      method: 'POST',
      body: productData
    })

    await navigateTo(`/admin/products/${product.id}`)
  } catch (error: any) {
    alert(error.data?.message || 'Failed to create product')
  } finally {
    loading.value = false
  }
}
</script>

