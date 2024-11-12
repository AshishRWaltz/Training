import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/users': {
        target: 'https://playground.mockoon.com',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react()],
})
