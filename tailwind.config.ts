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
      screens: {
        'xs': '475px',
      },
      colors: {
        // Primary brand color - TRUE NAVY BLUE
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1e3a5f',  // Navy blue
          600: '#172d4d',  // Darker navy
          700: '#122340',  // Even darker
          800: '#0d1a30',  // Very dark navy
          900: '#081220',  // Almost black navy
          950: '#040912'
        },
        // Accent color - warm orange from logo
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12'
        },
        // Soft blue-tinted cream backgrounds
        cream: {
          50: '#f7f9ff',
          100: '#f4f6fb',
          200: '#eef1f8',
          300: '#e4e9f2',
          400: '#d5dce8',
          500: '#c1cada'
        },
        // Surface colors for cards
        surface: {
          50: '#fafbfd',
          100: '#f8f9fc',
          200: '#f5f7fa'
        },
        // Navy color palette for backwards compatibility
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0a1929'
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
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        }
      },
      animation: {
        'fade-up': 'fade-up 600ms ease-out both',
        'fade-in': 'fade-in 600ms ease-out both',
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        pulse: 'pulse 2s ease-in-out infinite'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 2px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-xl': '0 20px 50px -12px rgba(0, 0, 0, 0.15)',
        'glow-primary': '0 0 20px rgba(30, 58, 95, 0.3)',
        'glow-accent': '0 0 20px rgba(249, 115, 22, 0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px -4px rgba(0,0,0,0.06)',
        'card-hover': '0 16px 32px -8px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.04)'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
} satisfies Config
