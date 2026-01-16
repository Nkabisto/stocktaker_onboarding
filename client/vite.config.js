import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      // Proxy API requests to our Express server
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      // Proxy auth requests
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
  
