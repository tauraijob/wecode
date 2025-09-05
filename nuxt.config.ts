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
        { name: 'description', content: 'WeCodeZW empowers individuals, schools, and corporates with digital skills training, IT services, and innovative products.' }
      ]
    }
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  }
})
