<template>
  <div>
    <!-- Header -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-lg font-bold text-slate-900">Coupon Codes</h1>
        <p class="text-xs text-slate-500">Create and manage promotional codes for credits</p>
      </div>
      
      <button 
        @click="showCreateModal = true"
        class="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Coupon
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div class="bg-white rounded-lg border border-slate-200 p-3">
        <div class="text-xs text-slate-500">Active</div>
        <div class="text-xl font-bold text-green-600">{{ data?.stats?.active || 0 }}</div>
      </div>
      <div class="bg-white rounded-lg border border-slate-200 p-3">
        <div class="text-xs text-slate-500">Total Coupons</div>
        <div class="text-xl font-bold text-slate-900">{{ data?.stats?.total || 0 }}</div>
      </div>
      <div class="bg-white rounded-lg border border-slate-200 p-3">
        <div class="text-xs text-slate-500">Redemptions</div>
        <div class="text-xl font-bold text-primary-600">{{ data?.stats?.totalRedemptions || 0 }}</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-16 bg-white rounded-lg animate-pulse"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!coupons?.length" class="bg-white rounded-lg border border-slate-200 p-8 text-center">
      <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      </div>
      <h3 class="text-sm font-semibold text-slate-900 mb-1">No coupons yet</h3>
      <p class="text-slate-500 text-xs">Create your first coupon code to give users free credits</p>
    </div>

    <!-- Coupons List -->
    <div v-else class="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table class="w-full text-xs">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="text-left px-4 py-2 font-medium text-slate-600">Code</th>
            <th class="text-left px-4 py-2 font-medium text-slate-600">Credits</th>
            <th class="text-left px-4 py-2 font-medium text-slate-600 hidden sm:table-cell">Usage</th>
            <th class="text-left px-4 py-2 font-medium text-slate-600 hidden md:table-cell">Expires</th>
            <th class="text-left px-4 py-2 font-medium text-slate-600">Status</th>
            <th class="text-right px-4 py-2 font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="coupon in coupons" :key="coupon.id" class="hover:bg-slate-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <code class="bg-slate-100 px-2 py-0.5 rounded font-mono text-[11px] font-semibold">{{ coupon.code }}</code>
                <button 
                  @click="copyCode(coupon.code)" 
                  class="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600"
                  title="Copy code"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <div v-if="coupon.description" class="text-[10px] text-slate-400 mt-0.5">{{ coupon.description }}</div>
            </td>
            <td class="px-4 py-3">
              <span class="font-semibold text-primary-600">{{ coupon.credits }}</span>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell">
              <span class="text-slate-600">{{ coupon.redemptionCount }}</span>
              <span v-if="coupon.maxUses" class="text-slate-400">/ {{ coupon.maxUses }}</span>
              <span v-else class="text-slate-400">/ ∞</span>
            </td>
            <td class="px-4 py-3 hidden md:table-cell">
              <span v-if="coupon.expiresAt" :class="isExpired(coupon.expiresAt) ? 'text-red-500' : 'text-slate-600'">
                {{ formatDate(coupon.expiresAt) }}
              </span>
              <span v-else class="text-slate-400">Never</span>
            </td>
            <td class="px-4 py-3">
              <span 
                class="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                :class="coupon.active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'"
              >
                {{ coupon.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <button 
                @click="toggleCoupon(coupon.id, coupon.active)"
                :disabled="toggling === coupon.id"
                class="text-[11px] px-2 py-1 rounded transition-colors"
                :class="coupon.active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'"
              >
                {{ coupon.active ? 'Deactivate' : 'Activate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div class="bg-white rounded-lg w-full max-w-sm p-5 shadow-xl">
            <h3 class="text-sm font-semibold text-slate-900 mb-4">Create New Coupon</h3>
            
            <div class="space-y-3">
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Code (optional, auto-generated if empty)</label>
                <input 
                  v-model="form.code"
                  type="text"
                  placeholder="e.g. WELCOME50"
                  class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500 uppercase"
                />
              </div>
              
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Credits to Award *</label>
                <input 
                  v-model="form.credits"
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Max Uses (leave empty for unlimited)</label>
                <input 
                  v-model="form.maxUses"
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Expiry Date (optional)</label>
                <input 
                  v-model="form.expiresAt"
                  type="date"
                  class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Description (optional)</label>
                <input 
                  v-model="form.description"
                  type="text"
                  placeholder="e.g. Welcome bonus for new users"
                  class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div class="flex gap-2 justify-end mt-4">
              <button @click="showCreateModal = false" class="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900">Cancel</button>
              <button 
                @click="createCoupon" 
                :disabled="creating || !form.credits"
                class="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded-lg font-medium disabled:opacity-50"
              >
                {{ creating ? 'Creating...' : 'Create Coupon' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'community-admin',
  middleware: ['community-admin']
})

const { error: toastError, success } = useToast()

const showCreateModal = ref(false)
const creating = ref(false)
const toggling = ref<string | null>(null)

const form = reactive({
  code: '',
  credits: '',
  maxUses: '',
  expiresAt: '',
  description: ''
})

const { data, pending, refresh } = useFetch<any>('/api/admin/community/coupons')

const coupons = computed(() => data.value?.coupons || [])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const isExpired = (date: string) => {
  return new Date(date) < new Date()
}

const copyCode = async (code: string) => {
  await navigator.clipboard.writeText(code)
  success('Code copied to clipboard')
}

const createCoupon = async () => {
  if (!form.credits) return
  
  creating.value = true
  try {
    const response = await $fetch<any>('/api/admin/community/coupons/create', {
      method: 'POST',
      body: {
        code: form.code || undefined,
        credits: parseInt(form.credits),
        maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined,
        description: form.description || undefined
      }
    })
    
    success(`Coupon created: ${response.coupon.code}`)
    showCreateModal.value = false
    Object.assign(form, { code: '', credits: '', maxUses: '', expiresAt: '', description: '' })
    refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Failed to create coupon')
  } finally {
    creating.value = false
  }
}

const toggleCoupon = async (id: string, isActive: boolean) => {
  toggling.value = id
  try {
    await $fetch(`/api/admin/community/coupons/${id}`, { method: 'DELETE' })
    success(isActive ? 'Coupon deactivated' : 'Coupon reactivated')
    refresh()
  } catch (err: any) {
    toastError(err.data?.message || 'Failed to update coupon')
  } finally {
    toggling.value = null
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
