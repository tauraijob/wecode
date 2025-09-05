export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return
  const me = await $fetch('/api/auth/me').catch(() => null)
  if (!me) return navigateTo('/auth/login?next=' + encodeURIComponent(to.fullPath))
  if (me.role !== 'ADMIN') return navigateTo('/dashboard')
})

