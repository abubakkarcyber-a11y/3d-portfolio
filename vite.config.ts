import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps the built site portable (works from any folder or subpath)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
  },
})
