import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Fix for "global is not defined"
  define: {
    global: 'globalThis',
  },

  // Dev server (local only)
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      }
    }
  },

  // ✅ ADD THIS (for Render deployment)
  preview: {
    host: true,
    allowedHosts: [
      'pastry-point.onrender.com'
    ]
  }
})