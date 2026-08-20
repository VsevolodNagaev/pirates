import fs from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const refsDir = path.resolve(rootDir, '../референсы-фракций')

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
}

function serveRefs() {
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const raw = req.url?.split('?')[0] ?? ''
    const rel = decodeURIComponent(raw).replace(/^\/+/, '')
    if (!rel) {
      next()
      return
    }
    const file = path.resolve(refsDir, rel)
    if (file !== refsDir && !file.startsWith(refsDir + path.sep)) {
      res.statusCode = 403
      res.end()
      return
    }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      next()
      return
    }
    const ext = path.extname(file).toLowerCase()
    res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    fs.createReadStream(file).pipe(res)
  }
}

function refsPlugin(): Plugin {
  return {
    name: 'serve-faction-refs',
    configureServer(server) {
      server.middlewares.use('/refs', serveRefs())
    },
    configurePreviewServer(server) {
      server.middlewares.use('/refs', serveRefs())
    },
  }
}

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
  plugins: [react(), tailwindcss(), refsPlugin(), spaFallback()],
  resolve: {
    alias: { '@': path.resolve(rootDir, 'src') },
  },
  server: {
    fs: { allow: [rootDir, refsDir] },
    proxy: {
      '/logbook-api': {
        target: 'https://logbook-admin-nine.vercel.app',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/logbook-api/, ''),
      },
    },
  },
})
