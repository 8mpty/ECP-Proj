import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 4321,
    proxy: {
      '/api/documents': {
        target: 'http://52.77.190.113:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})