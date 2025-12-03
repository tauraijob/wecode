<template>
  <section class="mx-auto max-w-4xl px-4 py-16">
    <h1 class="text-4xl font-extrabold tracking-tight mb-8">Checkout</h1>

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

    <form v-else @submit.prevent="placeOrder" class="grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <!-- Shipping Address -->
        <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Shipping Address</h2>
          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Full Name *</label>
              <input
                v-model="form.shippingAddress.name"
                type="text"
                required
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Phone *</label>
              <input
                v-model="form.shippingAddress.phone"
                type="tel"
                required
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Address *</label>
              <input
                v-model="form.shippingAddress.address"
                type="text"
                required
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">City *</label>
                <input
                  v-model="form.shippingAddress.city"
                  type="text"
                  required
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-navy-200">Country *</label>
                <input
                  v-model="form.shippingAddress.country"
                  type="text"
                  required
                  class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-navy-200">Postal Code</label>
              <input
                v-model="form.shippingAddress.postalCode"
                type="text"
                class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Payment Method</h2>
          <select
            v-model="form.paymentMethod"
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">Select payment method</option>
            <option value="PAYNOW">PayNow</option>
            <option value="PAYPAL">PayPal</option>
            <option value="CASH">Cash on Delivery</option>
          </select>
        </div>

        <!-- Notes -->
        <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6">
          <h2 class="text-xl font-semibold text-white mb-4">Order Notes</h2>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Any special instructions..."
            class="w-full rounded-lg border border-navy-700 bg-navy-800/50 px-4 py-2.5 text-white placeholder-navy-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          ></textarea>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="rounded-xl border border-navy-800 bg-navy-900/40 p-6 sticky top-4">
          <h2 class="text-xl font-semibold text-white mb-4">Order Summary</h2>
          <div class="space-y-3 mb-4">
            <div
              v-for="item in cart.items"
              :key="item.id"
              class="flex justify-between text-sm"
            >
              <span class="text-navy-300">{{ item.product.name }} x{{ item.quantity }}</span>
              <span class="text-white">{{ item.product.currency }} {{ (Number(item.product.price) * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
          <div class="border-t border-navy-700 pt-4 mb-4">
            <div class="flex justify-between text-xl font-bold text-white">
              <span>Total</span>
              <span>{{ cart.items[0]?.product.currency || 'USD' }} {{ subtotal.toFixed(2) }}</span>
            </div>
          </div>
          <button
            type="submit"
            :disabled="placingOrder"
            class="w-full rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-medium text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {{ placingOrder ? 'Placing Order...' : 'Place Order' }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data: cart, pending: loading } = await useFetch('/api/cart')
const placingOrder = ref(false)

const form = reactive({
  shippingAddress: {
    name: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  },
  billingAddress: null as any,
  paymentMethod: '',
  notes: ''
})

const subtotal = computed(() => {
  if (!cart.value) return 0
  return cart.value.items.reduce((sum, item) => {
    return sum + (Number(item.product.price) * item.quantity)
  }, 0)
})

async function placeOrder() {
  try {
    placingOrder.value = true
    const order = await $fetch('/api/orders', {
      method: 'POST',
      body: form
    })

    await navigateTo(`/orders/${order.orderNumber}`)
  } catch (error: any) {
    alert(error.data?.message || 'Failed to place order')
  } finally {
    placingOrder.value = false
  }
}
</script>



