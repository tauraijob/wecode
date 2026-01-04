import { ref, reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
    const show = (message: string, type: ToastType = 'info', duration: number = 4000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        toasts.value.push({ id, message, type, duration })

        if (duration > 0) {
            setTimeout(() => {
                remove(id)
            }, duration)
        }

        return id
    }

    const remove = (id: string) => {
        const index = toasts.value.findIndex(t => t.id === id)
        if (index > -1) {
            toasts.value.splice(index, 1)
        }
    }

    const success = (message: string, duration?: number) => show(message, 'success', duration)
    const error = (message: string, duration?: number) => show(message, 'error', duration ?? 6000)
    const warning = (message: string, duration?: number) => show(message, 'warning', duration)
    const info = (message: string, duration?: number) => show(message, 'info', duration)

    return {
        toasts,
        show,
        remove,
        success,
        error,
        warning,
        info
    }
}
