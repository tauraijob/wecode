export default defineNuxtRouteMiddleware(async (to) => {
    if (!to.path.startsWith('/community/admin')) return

    const me = await $fetch('/api/auth/me').catch(() => null)
    if (!me) return navigateTo('/auth/login?next=' + encodeURIComponent(to.fullPath))

    // Allow ADMIN or COMMUNITY_ADMIN roles
    const allowedRoles = ['ADMIN', 'COMMUNITY_ADMIN']
    if (!allowedRoles.includes(me.role)) {
        return navigateTo('/community')
    }
})
