import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: isProduction ? 'https://localhost:3002' : 'http://localhost:3001',
        changeOrigin: true,
        secure: isProduction,
      }
    }
  }
})
