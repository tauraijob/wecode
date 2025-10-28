// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: '.',
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt'
  ],
  css: ['@/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  app: {
    head: {
      title: 'WeCodeZW — Digital Skills, IT Services, and Innovation',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'WeCodeZW empowers individuals, schools, and corporates with digital skills training, IT services, and innovative products for Zimbabwe\'s digital economy.' },
        { name: 'keywords', content: 'wecode, we code, coding academy in zimbabwe, short computer courses in harare, short computer courses in zimbabwe, coding courses, computer programming, wecode company, computer courses in zimbabwe, programming courses, digital skills, programming, web development, cybersecurity, IT services, coding clubs, corporate training, Zimbabwe, Harare, technology education' },
        { name: 'author', content: 'WeCodeZW' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'WeCodeZW — Digital Skills, IT Services, and Innovation' },
        { property: 'og:description', content: 'Empowering Zimbabwe with digital skills training, coding classes, IT services, and innovative products for a digital-first world.' },
        { property: 'og:url', content: 'https://wecode.co.zw' },
        { property: 'og:site_name', content: 'WeCodeZW' },
        { property: 'og:locale', content: 'en_ZW' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'WeCodeZW — Digital Skills, IT Services, and Innovation' },
        { name: 'twitter:description', content: 'Empowering Zimbabwe with digital skills training, IT services, and innovative products.' },
        { name: 'theme-color', content: '#213c6d' },
        { name: 'msapplication-TileColor', content: '#213c6d' }
      ],
      link: [
        { rel: 'canonical', href: 'https://wecode.co.zw' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-M23K15M8H2',
          async: true
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M23K15M8H2');
          `,
          type: 'text/javascript'
        }
      ]
    }
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  runtimeConfig: {
    public: {
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
      siteUrl: process.env.SITE_URL || 'https://wecode.co.zw'
    }
  },
  nitro: {
    experimental: {
      wasm: true
    }
  },
  build: {
    transpile: ['@prisma/client']
  }
})
