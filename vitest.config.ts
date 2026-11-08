import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['shared/**/*.test.ts', 'src/**/*.test.ts', 'api/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
  define: {
    'process.env.I18NEXT_NO_SUPPORT_NOTICE': JSON.stringify('1'),
  },
})
