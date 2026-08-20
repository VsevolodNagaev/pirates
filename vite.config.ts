import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

function spaFallback(): Plugin {
  return {
    name: 'spa-404',
    closeBundle() {
      const index = path.join(rootDir, 'dist', 'index.html')
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, path.join(rootDir, 'dist', '404.html'))
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), spaFallback()],
  resolve: {
    alias: { '@': path.resolve(rootDir, 'src') },
  },
  server: {
    proxy: {
      '/logbook-api': {
        target: 'https://logbook-admin-nine.vercel.app',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/logbook-api/, ''),
      },
    },
  },
})
