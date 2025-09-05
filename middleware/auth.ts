export default defineNuxtRouteMiddleware(async (to) => {
  const protectedPaths = ['/dashboard', '/admin']
  if (!protectedPaths.some((p) => to.path.startsWith(p))) return
  const me = await $fetch('/api/auth/me').catch(() => null)
  if (!me) return navigateTo('/auth/login?next=' + encodeURIComponent(to.fullPath))
  if (to.path.startsWith('/dashboard') && me.role === 'ADMIN') {
    return navigateTo('/admin/dashboard')
  }
})

