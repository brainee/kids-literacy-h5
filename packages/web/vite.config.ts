import { defineConfig, type Plugin } from 'vite'
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

/** onnx wasm ~27MB，超 CF 单文件 25MiB；运行时走 CDN（见 piper.ts） */
function stripOrtWasm(): Plugin {
  return {
    name: 'strip-ort-wasm',
    generateBundle(_opts, bundle) {
      for (const fileName of Object.keys(bundle)) {
        if (/\.wasm$/i.test(fileName) && /ort-wasm/i.test(fileName)) {
          delete bundle[fileName]
        }
      }
    },
  }
}

export default defineConfig(({ command }) => ({
  base: resolveBase(command),
  plugins: [react(), stripOrtWasm()],
  optimizeDeps: {
    exclude: ['piper-plus', 'onnxruntime-web'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 2500,
  },
}))
