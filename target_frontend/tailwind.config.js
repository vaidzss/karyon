/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fintech: {
          bg: '#0A0E17',
          surface: '#111827',
          surfaceHover: '#182133',
          border: '#1F2937',
          borderHover: '#374151',
          text: '#F9FAFB',
          secondary: '#9CA3AF',
          muted: '#6B7280',
          emerald: '#059669',
          emeraldSoft: 'rgba(5, 150, 105, 0.12)',
          blue: '#2563EB',
          blueSoft: 'rgba(37, 99, 235, 0.12)',
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
