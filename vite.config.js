import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to avoid CORS issues in development
      // All requests to /api/* will be proxied to the target server
      '/api': {
        target: 'https://relsofttims-001-site1.gtempurl.com', // Use HTTPS directly
        changeOrigin: true, // Change the origin header to match target
        secure: true, // Use secure connection for HTTPS
        ws: false, // Disable WebSocket proxying
      }
    }
  }
})

