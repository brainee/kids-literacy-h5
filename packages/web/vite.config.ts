import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * serve → `/`（本地 http://localhost:5173）
 * build 默认 → `/kids-literacy-h5/`（GitHub project Pages）
 * Cloudflare Pages → `VITE_BASE=/` 或 `npm run build:cf`
 */
function resolveBase(command: 'build' | 'serve') {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env?.VITE_BASE
  if (env) return env
  return command === 'serve' ? '/' : '/kids-literacy-h5/'
}

export default defineConfig(({ command }) => ({
  base: resolveBase(command),
  plugins: [react()],
  optimizeDeps: {
    exclude: ['piper-plus'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2500,
  },
}))
