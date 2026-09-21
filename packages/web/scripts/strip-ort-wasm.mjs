/**
 * 双保险：删掉 dist 里超大的 onnxruntime wasm（运行时 piper.ts 用 CDN）。
 * Cloudflare 单文件上限 25 MiB；ort-wasm-*.jsep.wasm ≈ 27 MiB。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const distAssets = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'assets')
if (!fs.existsSync(distAssets)) {
  console.log('strip-ort-wasm: no dist/assets, skip')
  process.exit(0)
}

let n = 0
for (const name of fs.readdirSync(distAssets)) {
  if (/\.wasm$/i.test(name) && /ort-wasm/i.test(name)) {
    const full = path.join(distAssets, name)
    const mb = (fs.statSync(full).size / (1024 * 1024)).toFixed(1)
    fs.unlinkSync(full)
    console.log(`strip-ort-wasm: removed ${name} (${mb} MiB)`)
    n += 1
  }
}
if (!n) console.log('strip-ort-wasm: nothing to remove')
