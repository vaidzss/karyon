/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        karyon: {
          blue: '#0866FF',
          blueDark: '#0055D6',
          blueSoft: 'rgba(8, 102, 255, 0.08)',
          lightBg: '#FFFFFF',
          lightSurface: '#F8FAFC',
          lightBorder: '#E2E8F0',
          darkBg: '#0A0D14',
          darkCard: '#101522',
          darkCardHover: '#151C2C',
          darkBorder: '#1E2638',
          textDark: '#0F172A',
          textMuted: '#64748B',
          textLight: '#F8FAFC',
          textLightMuted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
