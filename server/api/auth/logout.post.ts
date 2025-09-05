export default defineEventHandler((event) => {
  deleteCookie(event, 'token', { path: '/' })
  return { ok: true }
})

