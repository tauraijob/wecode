export const useAuth = () => {
  const { data: user, refresh, pending } = useFetch('/api/auth/me', {
    lazy: true,
    default: () => null,
    onResponseError({ response }) {
      // Silently handle 401 errors (not logged in)
      if (response.status === 401) {
        return null
      }
    }
  })

  // Return user directly (not readonly) to ensure reactivity
  return {
    user,
    refresh,
    pending,
    isAuthenticated: computed(() => !!user.value)
  }
}

