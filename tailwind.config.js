/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        background: 'var(--color-background)', /* black */
        foreground: 'var(--color-foreground)', /* white */
        surface: 'var(--color-surface)', /* gray-900 */
        primary: {
          DEFAULT: 'var(--color-primary)', /* teal-600 */
          foreground: 'var(--color-primary-foreground)', /* white */
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', /* teal-700 */
          foreground: 'var(--color-secondary-foreground)', /* white */
        },
        accent: {
          DEFAULT: 'var(--color-accent)', /* mint-400 */
          foreground: 'var(--color-accent-foreground)', /* black */
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', /* red-400 */
          foreground: 'var(--color-destructive-foreground)', /* white */
        },
        success: {
          DEFAULT: 'var(--color-success)', /* mint-400 */
          foreground: 'var(--color-success-foreground)', /* black */
        },
        warning: {
          DEFAULT: 'var(--color-warning)', /* yellow-400 */
          foreground: 'var(--color-warning-foreground)', /* black */
        },
        error: {
          DEFAULT: 'var(--color-error)', /* red-400 */
          foreground: 'var(--color-error-foreground)', /* white */
        },
        muted: {
          DEFAULT: 'var(--color-muted)', /* gray-400 */
          foreground: 'var(--color-muted-foreground)', /* gray-500 */
        },
        card: {
          DEFAULT: 'var(--color-card)', /* gray-900 */
          foreground: 'var(--color-card-foreground)', /* white */
        },
        popover: {
          DEFAULT: 'var(--color-popover)', /* gray-900 */
          foreground: 'var(--color-popover-foreground)', /* white */
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'heading-1': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'heading-2': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'heading-3': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-medium': ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        'caption': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'data': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
      },
      boxShadow: {
        'glow': '0 4px 20px rgba(72, 214, 176, 0.1)',
        'glow-md': '0 4px 20px rgba(72, 214, 176, 0.15)',
        'glow-lg': '0 4px 20px rgba(72, 214, 176, 0.2)',
        'inset-glow': 'inset 0 0 0 1px rgba(72, 214, 176, 0.3)',
        'inset-glow-active': 'inset 0 0 0 1px rgba(72, 214, 176, 0.5)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(72, 214, 176, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(72, 214, 176, 0.5)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-in': 'slide-in 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fade-in 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}