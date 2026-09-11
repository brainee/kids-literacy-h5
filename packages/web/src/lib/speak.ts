import { duckBgm, ensureBgmPlaying } from './bgm'
import { ensurePiper, getPiperState, speakWithPiper } from './piper'

export type TtsEngine = 'webspeech' | 'piper'

let preferredEngine: TtsEngine = 'webspeech'
let speakToken = 0

export function setPreferredTtsEngine(engine: TtsEngine) {
  preferredEngine = engine
}

export function getPreferredTtsEngine() {
  return preferredEngine
}

function speakWeb(text: string, opts?: { rate?: number; onend?: () => void }) {
  if (!window.speechSynthesis || !text) {
    opts?.onend?.()
    return
  }
  try {
    speechSynthesis.cancel()
  } catch {
    /* ignore */
  }
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = opts?.rate ?? 0.88
  u.pitch = 1.04
  let done = false
  const once = () => {
    if (done) return
    done = true
    opts?.onend?.()
  }
  u.onend = once
  u.onerror = once
  // 个别浏览器 onend 丢失：超时兜底
  window.setTimeout(once, Math.min(12000, 800 + text.length * 280))
  speechSynthesis.speak(u)
}

export function speak(
  text: string,
  opts?: { rate?: number; onend?: () => void; engine?: TtsEngine; duck?: boolean },
) {
  if (!text) {
    opts?.onend?.()
    return
  }
  const token = ++speakToken
  const shouldDuck = opts?.duck !== false
  if (shouldDuck) duckBgm(true)

  const finish = () => {
    if (token !== speakToken) return
    if (shouldDuck) duckBgm(false)
    void ensureBgmPlaying()
    opts?.onend?.()
  }

  const engine = opts?.engine ?? preferredEngine

  if (engine === 'piper') {
    void (async () => {
      const ready = getPiperState().ready || (await ensurePiper())
      if (token !== speakToken) return
      if (ready) {
        const ok = await speakWithPiper(text)
        if (token !== speakToken) return
        if (ok) {
          finish()
          return
        }
      }
      speakWeb(text, { rate: opts?.rate, onend: finish })
    })()
    return
  }

  speakWeb(text, { rate: opts?.rate, onend: finish })
}

export function stopSpeak() {
  speakToken += 1
  try {
    speechSynthesis.cancel()
  } catch {
    /* ignore */
  }
  duckBgm(false)
  void ensureBgmPlaying()
}
