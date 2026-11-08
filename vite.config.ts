import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'vendor-react', test: /node_modules[\\/](react|react-dom|react-router)[\\/]/ },
            { name: 'vendor-icons', test: /node_modules[\\/]lucide-react[\\/]/ },
            { name: 'vendor-umituz-core', test: /node_modules[\\/]@umituz[\\/](web-design-system|web-localization)[\\/]/ },
            { name: 'vendor-umituz-dashboard', test: /node_modules[\\/]@umituz[\\/]web-dashboard[\\/]/ },
            { name: 'vendor-umituz-auth', test: /node_modules[\\/]@umituz[\\/]web-auth[\\/]/ },
            { name: 'vendor-umituz-other', test: /node_modules[\\/]@umituz[\\/]/ },
          ],
        },
      },
    },
  },
  define: {
    'process.env.I18NEXT_NO_SUPPORT_NOTICE': JSON.stringify('1'),
  },
  server: {
    port: 5190,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8792',
        changeOrigin: true,
      },
    },
  },
})
