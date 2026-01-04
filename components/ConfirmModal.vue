<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="cancel"
      >
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isOpen"
            class="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-cream-200 overflow-hidden"
          >
            <!-- Header -->
            <div class="px-6 pt-6 pb-4">
              <div class="flex items-start gap-4">
                <div
                  :class="[
                    'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
                    iconBgClass
                  ]"
                >
                  <svg v-if="type === 'danger'" class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <svg v-else-if="type === 'warning'" class="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <svg v-else class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
                  <p class="mt-1 text-sm text-gray-600">{{ message }}</p>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-3 px-6 py-4 bg-cream-50 border-t border-cream-200">
              <button
                @click="cancel"
                class="flex-1 rounded-xl border border-cream-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-cream-100 transition-colors"
              >
                {{ cancelText }}
              </button>
              <button
                @click="confirm"
                :class="[
                  'flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all shadow-lg hover:shadow-xl',
                  confirmBtnClass
                ]"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  message: string
  type?: 'info' | 'warning' | 'danger'
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm Action',
  type: 'info',
  confirmText: 'Confirm',
  cancelText: 'Cancel'
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:isOpen', value: boolean): void
}>()

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-100'
    case 'warning':
      return 'bg-amber-100'
    default:
      return 'bg-primary-100'
  }
})

const confirmBtnClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-500 hover:bg-red-600'
    case 'warning':
      return 'bg-amber-500 hover:bg-amber-600'
    default:
      return 'bg-primary-500 hover:bg-primary-600'
  }
})

const confirm = () => {
  emit('confirm')
  emit('update:isOpen', false)
}

const cancel = () => {
  emit('cancel')
  emit('update:isOpen', false)
}
</script>
