// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// ESM-аналог __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const emptyCss = path.resolve(__dirname, 'src/__mocks__/empty.css')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hexlet/chatbot-v2/dist/init.css': emptyCss,
      '@hexlet/chatbot-v2/styles': emptyCss,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    globals: true,
    css: true,
    transformMode: {
      web: [/node_modules\/@hexlet\/chatbot-v2/],
    },
    server: {
      deps: {
        inline: ['@hexlet/chatbot-v2'],
      },
    },
  },
})
