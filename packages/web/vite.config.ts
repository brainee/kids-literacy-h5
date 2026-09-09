import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * serve → `/`（本地 http://localhost:5173）
 * build → `/kids-literacy-h5/`（GitHub project Pages）
 * 覆盖：在 shell 里设 VITE_BASE 后构建（CI 已设置）
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
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}))
