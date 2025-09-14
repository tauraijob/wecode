export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const googleAnalyticsId = config.public.googleAnalyticsId

  if (process.client && googleAnalyticsId) {
    // Load Google Analytics script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    window.gtag = gtag

    gtag('js', new Date())
    gtag('config', googleAnalyticsId)

    // Track page views on route changes
    const router = useRouter()
    router.afterEach((to) => {
      gtag('config', googleAnalyticsId, {
        page_path: to.fullPath,
        page_title: document.title
      })
    })
  }
})