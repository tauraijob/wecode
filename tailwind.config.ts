import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './composables/**/*.{js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f5f7fb',
          100: '#e8edf7',
          200: '#cfdaf0',
          300: '#a6bde3',
          400: '#7899d1',
          500: '#456dac',
          600: '#2e518d',
          700: '#213c6d',
          800: '#182a4e',
          900: '#111c36',
          950: '#0b1224'
        }
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 600ms ease-out both',
        'fade-in': 'fade-in 600ms ease-out both',
        float: 'float 5s ease-in-out infinite'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config

