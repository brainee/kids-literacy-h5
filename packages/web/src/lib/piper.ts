/** Piper 可选引擎：默认不加载；手动或空闲下载；模型走库内 IndexedDB 缓存 */

export type PiperStatus = 'idle' | 'downloading' | 'ready' | 'error'

type Listener = (s: {
  status: PiperStatus
  progress: number
  message: string
  ready: boolean
}) => void

let status: PiperStatus = 'idle'
let progress = 0
let message = ''
let loadPromise: Promise<boolean> | null = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let piperInstance: any = null
const listeners = new Set<Listener>()

const MODEL = 'ayousanz/piper-plus-base'

function emit() {
  const snap = getPiperState()
  listeners.forEach((fn) => fn(snap))
}

export function getPiperState() {
  return { status, progress, message, ready: status === 'ready' }
}

export function subscribePiper(fn: Listener) {
  listeners.add(fn)
  fn(getPiperState())
  return () => {
    listeners.delete(fn)
  }
}

export async function ensurePiper(opts?: { force?: boolean }): Promise<boolean> {
  if (status === 'ready' && piperInstance) return true
  if (loadPromise && !opts?.force) return loadPromise

  loadPromise = (async () => {
    status = 'downloading'
    progress = 0
    message = '正在下载更甜的嗓音…'
    emit()
    try {
      const [{ PiperPlus }, ortMod] = await Promise.all([
        import('piper-plus'),
        import('onnxruntime-web'),
      ])
      const ort = ortMod
      // wasm 必须从 CDN 拉：勿打进 dist（CF 单文件上限 25MiB，ort wasm ~27MB）
      if (ort.env?.wasm) {
        ort.env.wasm.wasmPaths =
          'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/dist/'
      }
      piperInstance = await PiperPlus.initialize({
        model: MODEL,
        ort,
        onProgress: (info) => {
          progress = info.progress ?? 0
          message = info.message || message
          emit()
        },
      })
      status = 'ready'
      progress = 1
      message = '更甜嗓音已就绪（已缓存到本机）'
      emit()
      return true
    } catch (e) {
      console.warn('[piper]', e)
      status = 'error'
      message = '下载失败，先用系统朗读'
      progress = 0
      piperInstance = null
      loadPromise = null
      emit()
      return false
    }
  })()

  return loadPromise
}

export async function speakWithPiper(text: string): Promise<boolean> {
  const ok = await ensurePiper()
  if (!ok || !piperInstance) return false
  try {
    const audio = await piperInstance.synthesize(text, {
      language: 'zh',
      lengthScale: 1.05,
    })
    await audio.play()
    return true
  } catch (e) {
    console.warn('[piper speak]', e)
    return false
  }
}

/** 空闲时预取（不强制切换引擎） */
export function scheduleIdlePiperPrefetch() {
  const run = () => {
    if (status === 'ready' || status === 'downloading') return
    void ensurePiper()
  }
  const ric = (
    globalThis as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    }
  ).requestIdleCallback
  if (typeof ric === 'function') {
    ric(() => run(), { timeout: 12000 })
  } else {
    globalThis.setTimeout(run, 8000)
  }
}
