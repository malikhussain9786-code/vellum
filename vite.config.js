import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    // The PDF export feature (@react-pdf/renderer) is intentionally
    // code-split into its own lazy-loaded chunk (see Builder.jsx's dynamic
    // import) so it never loads for visitors who don't use it. That chunk
    // is legitimately large; raising the warning threshold reflects that
    // this is an accepted, deliberate tradeoff, not an oversight.
    chunkSizeWarningLimit: 1600,
  },
})
