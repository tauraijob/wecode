// https://nuxt.com/docs/api/configuration/nuxt-config
import { join } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: '.',
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt'
  ],
  components: [
    {
      path: '~/components/community',
      pathPrefix: false
    },
    '~/components'
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
        { name: 'keywords', content: 'wecode, we code, computer courses in zimbabwe, computer programming, short computer courses in harare, programming courses in zimbabwe, computer lessons in harare, short computer courses in zimbabwe, coding classes, coding courses, coding academy in zimbabwe, wecode company, digital skills, programming, web development, cybersecurity, IT services, coding clubs, corporate training, Zimbabwe, Harare, technology education' },
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
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'apple-touch-icon', href: '/logo.png' },
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
    componentDir: 'components/ui'
  },
  runtimeConfig: {
    // Server-side only (private)
    groqApiKey: process.env.GROQ_API_KEY || '',
    brevoSmtpUser: process.env.BREVO_SMTP_USER || '',
    brevoSmtpKey: process.env.BREVO_SMTP_KEY || '',
    mailFrom: process.env.MAIL_FROM || '',
    mailTo: process.env.MAIL_TO || '' || 'info@wecode.co.zw',
    // Public (available on client)
    public: {
      googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
      siteUrl: process.env.SITE_URL || 'https://wecode.co.zw',
      adminWhatsapp: process.env.ADMIN_WHATSAPP || ''
    }
  },
  nitro: {
    experimental: {
      wasm: true
    },
    esbuild: {
      options: {
        target: 'node18',
        platform: 'node'
      }
    },
    // Help with circular dependency resolution
    minify: false,
    sourceMap: false,
    // Exclude Prisma completely from bundling - must be external
    // Prisma should not be bundled by Nitro
    // Don't bundle node_modules - use them as externals
    noExternals: false,
    // Explicitly mark Prisma packages as external
    externals: {
      inline: []
    },
    // Preserve node_modules for Prisma
    nodeModulesDirs: ['node_modules'],
    // Ensure proper build output
    prerender: {
      crawlLinks: false
    }
  },
  // Don't transpile Prisma - it should remain external
  build: {
    transpile: []
  },
  vite: {
    optimizeDeps: {
      exclude: ['@prisma/client', '.prisma']
    },
    resolve: {
      // Fix Windows path issues for shadcn components
      alias: {
        '@': process.cwd(),
        // Resolve Prisma relative imports to actual paths
        '.prisma/client/default': join(process.cwd(), 'node_modules/.prisma/client/default.js'),
        '.prisma/client': join(process.cwd(), 'node_modules/.prisma/client')
      }
    },
    ssr: {
      noExternal: []
    }
  }
})
