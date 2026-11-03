import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: './',
  cacheDir: './.vite',
  server: {
    port: 3000,
    strictPort: true,
    host: '0.0.0.0',
  },
})
