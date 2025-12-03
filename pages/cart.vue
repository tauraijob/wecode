<template>
  <section class="mx-auto max-w-7xl px-4 py-16">
    <h1 class="text-4xl font-extrabold tracking-tight mb-8">Shopping Cart</h1>

    <div v-if="loading" class="text-center py-20">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy-400 border-r-transparent"></div>
    </div>

    <div v-else-if="!cart || cart.items.length === 0" class="text-center py-20">
      <p class="text-navy-400 mb-4">Your cart is empty</p>
      <NuxtLink
        to="/products"
        class="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-medium text-white hover:from-purple-600 hover:to-purple-700"
      >
        Continue Shopping
      </NuxtLink>
    </div>

    <div v-else class="grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="rounded-xl border border-navy-800 bg-navy-900/40 p-6"
        >
          <div class="flex gap-4">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-navy-800/50">
              <img
                v-if="(item.product.images as any)?.[0]"
                :src="(item.product.images as any)[0]"
                :alt="item.product.name"
                class="h-full w-full object-cover"
              />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-white mb-1">{{ item.product.name }}</h3>
              <p class="text-sm text-navy-300 mb-3">{{ item.product.currency }} {{ Number(item.product.price).toFixed(2) }}</p>
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    :disabled="updating === item.id"
                    class="rounded-lg border border-navy-600 bg-navy-800/50 px-2 py-1 text-white hover:bg-navy-700/50 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span class="w-12 text-center text-white">{{ item.quantity }}</span>
                  <button
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    :disabled="updating === item.id || item.quantity >= item.product.stock"
                    class="rounded-lg border border-navy-600 bg-navy-800/50 px-2 py-1 text-white hover:bg-navy-700/50 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <button
                  @click="removeItem(item.id)"
                  :disabled="removing === item.id"
                  class="text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-white">
                {{ item.product.currency }} {{ (Number(item.product.price) * item.quantity).toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 sticky top-4">
          <h2 class="text-xl font-semibold text-white mb-4">Order Summary</h2>
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-navy-300">
              <span>Subtotal</span>
              <span>{{ cart.items[0]?.product.currency || 'USD' }} {{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-navy-300">
              <span>Items</span>
              <span>{{ totalItems }}</span>
            </div>
          </div>
          <div class="border-t border-navy-700 pt-4 mb-4">
            <div class="flex justify-between text-xl font-bold text-white">
              <span>Total</span>
              <span>{{ cart.items[0]?.product.currency || 'USD' }} {{ subtotal.toFixed(2) }}</span>
            </div>
          </div>
          <NuxtLink
            to="/checkout"
            class="block w-full rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 text-center font-medium text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Proceed to Checkout
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data: cart, refresh, pending: loading } = await useFetch('/api/cart')
const updating = ref<string | null>(null)
const removing = ref<string | null>(null)

const subtotal = computed(() => {
  if (!cart.value) return 0
  return cart.value.items.reduce((sum, item) => {
    return sum + (Number(item.product.price) * item.quantity)
  }, 0)
})

const totalItems = computed(() => {
  if (!cart.value) return 0
  return cart.value.items.reduce((sum, item) => sum + item.quantity, 0)
})

async function updateQuantity(itemId: string, newQuantity: number) {
  if (newQuantity < 1) return

  try {
    updating.value = itemId
    await $fetch(`/api/cart/items/${itemId}`, {
      method: 'PUT',
      body: { quantity: newQuantity }
    })
    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to update quantity')
  } finally {
    updating.value = null
  }
}

async function removeItem(itemId: string) {
  try {
    removing.value = itemId
    await $fetch(`/api/cart/items/${itemId}`, {
      method: 'DELETE'
    })
    await refresh()
  } catch (error: any) {
    alert(error.data?.message || 'Failed to remove item')
  } finally {
    removing.value = null
  }
}
</script>



