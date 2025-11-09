// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    globals: true,

    // Ключевой параметр: включает CSS-пайплайн витеста
    pool: 'vmThreads', // или 'vmForks'

    // Явно оставим включённым (по умолчанию true, но пусть будет явно)
    deps: {
      web: {
        transformCss: true,
      },
      // если понадобится, можно добавить inline пакета:
      // server: { deps: { inline: [/^@hexlet\/chatbot-v2/] } }  <-- обычно не требуется
    },
  },
})
