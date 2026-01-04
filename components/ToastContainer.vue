<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-8 scale-95"
        enter-to-class="opacity-100 translate-x-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0 scale-100"
        leave-to-class="opacity-0 translate-x-8 scale-95"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto max-w-sm w-full rounded-xl shadow-2xl backdrop-blur-lg border px-4 py-3.5 flex items-start gap-3',
            getToastClasses(toast.type)
          ]"
        >
          <!-- Icon -->
          <div :class="['flex-shrink-0 mt-0.5 rounded-lg p-1.5', getIconBgClasses(toast.type)]">
            <svg v-if="toast.type === 'success'" :class="['h-5 w-5', getIconClasses(toast.type)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="toast.type === 'error'" :class="['h-5 w-5', getIconClasses(toast.type)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="toast.type === 'warning'" :class="['h-5 w-5', getIconClasses(toast.type)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else :class="['h-5 w-5', getIconClasses(toast.type)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <!-- Message -->
          <div class="flex-1 min-w-0 ">
            <p :class="['text-sm font-medium leading-relaxed', getTextClasses(toast.type)]">{{ toast.message }}</p>
          </div>
          
          <!-- Close button -->
          <button
            @click="remove(toast.id)"
            class="flex-shrink-0 rounded-lg p-1.5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()

const getToastClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-br from-emerald-900/95 to-emerald-800/95 border-emerald-500/30'
    case 'error':
      return 'bg-gradient-to-br from-red-900/95 to-red-800/95 border-red-500/30'
    case 'warning':
      return 'bg-gradient-to-br from-amber-900/95 to-amber-800/95 border-amber-500/30'
    default:
      return 'bg-gradient-to-br from-blue-900/95 to-blue-800/95 border-blue-500/30'
  }
}

const getIconBgClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-500/20 border border-emerald-500/30'
    case 'error':
      return 'bg-red-500/20 border border-red-500/30'
    case 'warning':
      return 'bg-amber-500/20 border border-amber-500/30'
    default:
      return 'bg-blue-500/20 border border-blue-500/30'
  }
}

const getIconClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-emerald-400'
    case 'error':
      return 'text-red-400'
    case 'warning':
      return 'text-amber-400'
    default:
      return 'text-blue-400'
  }
}

const getTextClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-emerald-100'
    case 'error':
      return 'text-red-100'
    case 'warning':
      return 'text-amber-100'
    default:
      return 'text-blue-100'
  }
}
</script>
