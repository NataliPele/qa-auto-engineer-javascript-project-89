import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    globals: true,
    coverage: { reporter: ['text', 'lcov'], reportsDirectory: 'coverage' },
    pool: 'vmThreads',
    deps: {
      web: {
        transformCss: true,
      },
    },
  },
})
