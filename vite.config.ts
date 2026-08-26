import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': `${import.meta.dirname}/src`,
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/**',
        'src/tests/**',
        'src/features/**',
        '**/*.d.ts',
      ],
    },
  },

  build: {
    // The app is a single-page application with a deliberately monolithic bundle.
    // The dynamic imports in client.ts are intentional (circular-dep avoidance),
    // not a code-splitting opportunity, so we raise the warning threshold rather
    // than restructure the architecture for marginal gain.
    chunkSizeWarningLimit: 600,
  },
})
