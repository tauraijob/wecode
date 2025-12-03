export const useAuth = () => {
  // Use useFetch but handle 401 errors silently
  const { data: user, refresh, pending } = useFetch('/api/auth/me', {
    lazy: true,
    server: false, // Only run on client side to avoid 401 errors during SSR
    default: () => null,
    // Handle errors silently - especially 401s
    onResponseError({ response, error }) {
      // Silently handle 401 errors (not logged in) - this is expected behavior
      if (response.status === 401) {
        // Return null instead of throwing
        return null
      }
      // For other errors, we can let them through or handle as needed
    },
    // Suppress error logging in console
    transform: (data: any) => data
  })

  // Wrap refresh to handle errors silently
  const safeRefresh = async () => {
    try {
      await refresh()
    } catch (err: any) {
      // Silently ignore 401 errors
      if (err?.statusCode === 401 || err?.status === 401) {
        // This is expected for unauthenticated users
        return
      }
      // Re-throw other errors
      throw err
    }
  }

  // Return user directly (not readonly) to ensure reactivity
  return {
    user,
    refresh: safeRefresh,
    pending,
    isAuthenticated: computed(() => !!user.value)
  }
}

