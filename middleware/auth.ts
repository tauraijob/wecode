export default defineNuxtRouteMiddleware(async (to) => {
  const protectedPaths = ['/dashboard', '/admin', '/instructor', '/mentor']
  if (!protectedPaths.some((p) => to.path.startsWith(p))) return

  const me = await $fetch('/api/auth/me').catch(() => null)
  if (!me) return navigateTo('/auth/login?next=' + encodeURIComponent(to.fullPath))

  // Admin redirect
  if (to.path.startsWith('/dashboard') && me.role === 'ADMIN') {
    return navigateTo('/admin')
  }

  // Community members (INDIVIDUAL, MENTOR) should not access /dashboard
  // They have their own community section
  if (to.path.startsWith('/dashboard')) {
    const communityRoles = ['INDIVIDUAL', 'MENTOR']
    if (communityRoles.includes(me.role)) {
      return navigateTo('/community')
    }
  }

  // Only MENTOR role can access /mentor dashboard
  if (to.path.startsWith('/mentor') && me.role !== 'MENTOR') {
    return navigateTo('/community')
  }

  // Only INSTRUCTOR role can access /instructor dashboard
  if (to.path.startsWith('/instructor') && me.role !== 'INSTRUCTOR') {
    return navigateTo('/dashboard')
  }
})

