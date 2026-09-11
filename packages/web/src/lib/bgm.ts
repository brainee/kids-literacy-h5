/** 程序化 BGM（无需下载）。重点：用户手势内解锁 + 静音缓冲 kick + 切歌后必续播 */

export const BGM_STYLES = [
  { id: 'none', label: '关闭音乐', emoji: '🔇' },
  { id: 'box', label: '八音盒', emoji: '🎼' },
  { id: 'kids', label: '童趣', emoji: '🎈' },
  { id: 'game', label: '小游戏', emoji: '🎮' },
  { id: 'pop', label: '轻快', emoji: '🌈' },
] as const

export type BgmId = (typeof BGM_STYLES)[number]['id']

type AudioBag = {
  ctx: AudioContext | null
  master: GainNode | null
  bgmGain: GainNode | null
  sfxGain: GainNode | null
  nodes: AudioScheduledSourceNode[]
  timer: ReturnType<typeof setInterval> | null
  style: string
  ducked: boolean
  wantedStyle: string
}

const audio: AudioBag = {
  ctx: null,
  master: null,
  bgmGain: null,
  sfxGain: null,
  nodes: [],
  timer: null,
  style: 'none',
  ducked: false,
  wantedStyle: 'none',
}

function ensureAudio() {
  if (audio.ctx) return audio.ctx
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  audio.ctx = new Ctx()
  audio.master = audio.ctx.createGain()
  audio.master.gain.value = 1
  audio.master.connect(audio.ctx.destination)
  audio.bgmGain = audio.ctx.createGain()
  audio.bgmGain.gain.value = 0.28
  audio.bgmGain.connect(audio.master)
  audio.sfxGain = audio.ctx.createGain()
  audio.sfxGain.gain.value = 0.5
  audio.sfxGain.connect(audio.master)
  return audio.ctx
}

/** Safari/Chrome：用户手势里播一段近静音缓冲，才能真正解锁 */
async function kickContext(ctx: AudioContext) {
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      /* ignore */
    }
  }
  try {
    const buf = ctx.createBuffer(1, 1, ctx.sampleRate)
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.connect(ctx.destination)
    src.start(0)
  } catch {
    /* ignore */
  }
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      /* ignore */
    }
  }
  return (ctx.state as string) === 'running'
}

export async function unlockAudio() {
  const ctx = ensureAudio()
  if (!ctx) return false
  if ((ctx.state as string) === 'running') return true
  return kickContext(ctx)
}

export function duckBgm(on: boolean) {
  if (!audio.bgmGain || !audio.ctx) return
  audio.ducked = on
  const now = audio.ctx.currentTime
  // 压低但不静音，避免「好像没在播」
  const target = on ? 0.1 : 0.28
  try {
    audio.bgmGain.gain.cancelScheduledValues(now)
    audio.bgmGain.gain.setValueAtTime(audio.bgmGain.gain.value, now)
    audio.bgmGain.gain.linearRampToValueAtTime(target, now + 0.12)
  } catch {
    audio.bgmGain.gain.value = target
  }
}

function stopBgmNodes() {
  if (audio.timer) {
    clearInterval(audio.timer)
    audio.timer = null
  }
  for (const n of audio.nodes) {
    try {
      n.stop()
    } catch {
      /* ignore */
    }
    try {
      n.disconnect()
    } catch {
      /* ignore */
    }
  }
  audio.nodes = []
}

function playTone(
  freq: number,
  dur: number,
  type: OscillatorType,
  when: number,
  gainVal: number,
  dest?: GainNode | null,
) {
  if (!audio.ctx) return
  const out = dest || audio.bgmGain
  if (!out) return
  const o = audio.ctx.createOscillator()
  const g = audio.ctx.createGain()
  o.type = type
  o.frequency.value = freq
  const peak = Math.max(0.02, gainVal)
  g.gain.setValueAtTime(0.001, when)
  try {
    g.gain.linearRampToValueAtTime(peak, when + 0.03)
    g.gain.linearRampToValueAtTime(0.001, when + Math.max(0.08, dur))
  } catch {
    g.gain.value = peak
  }
  o.connect(g)
  g.connect(out)
  o.start(when)
  o.stop(when + dur + 0.05)
  audio.nodes.push(o)
  // 防止 nodes 无限增长
  if (audio.nodes.length > 48) {
    const old = audio.nodes.splice(0, 16)
    for (const n of old) {
      try {
        n.disconnect()
      } catch {
        /* ignore */
      }
    }
  }
}

export function sfx(kind: 'correct' | 'coin' | 'feed' | 'wrong' | 'levelup') {
  void unlockAudio().then((ok) => {
    if (!ok || !audio.ctx || !audio.sfxGain) return
    const t = audio.ctx.currentTime
    if (kind === 'correct') {
      playTone(523.25, 0.12, 'triangle', t, 0.14, audio.sfxGain)
      playTone(783.99, 0.18, 'triangle', t + 0.1, 0.12, audio.sfxGain)
    } else if (kind === 'coin') {
      playTone(880, 0.08, 'square', t, 0.08, audio.sfxGain)
      playTone(1174.7, 0.1, 'square', t + 0.07, 0.07, audio.sfxGain)
    } else if (kind === 'feed') {
      playTone(392, 0.1, 'sine', t, 0.1, audio.sfxGain)
      playTone(330, 0.12, 'sine', t + 0.09, 0.09, audio.sfxGain)
    } else if (kind === 'wrong') {
      playTone(220, 0.16, 'triangle', t, 0.06, audio.sfxGain)
    } else if (kind === 'levelup') {
      playTone(523.25, 0.1, 'triangle', t, 0.12, audio.sfxGain)
      playTone(659.25, 0.1, 'triangle', t + 0.1, 0.12, audio.sfxGain)
      playTone(783.99, 0.18, 'triangle', t + 0.2, 0.12, audio.sfxGain)
    }
  })
}

function beginPattern(style: string) {
  stopBgmNodes()
  audio.style = style
  if (!audio.ctx || style === 'none') return false

  const patterns: Record<string, number[]> = {
    box: [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25],
    kids: [392, 440, 494, 523, 587, 523, 494, 440],
    game: [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 261.63],
    pop: [349.23, 392, 440, 523.25, 440, 392],
  }
  const seq = patterns[style] || patterns.box
  const wave: OscillatorType = style === 'game' ? 'square' : style === 'pop' ? 'triangle' : 'sine'
  const stepMs = style === 'kids' ? 260 : 320
  const noteDur = style === 'kids' ? 0.24 : 0.3
  const noteGain = style === 'game' ? 0.08 : 0.11
  let i = 0

  const tick = () => {
    if (!audio.ctx || audio.style === 'none') return
    if ((audio.ctx.state as string) !== 'running') {
      void audio.ctx.resume()
      return
    }
    playTone(seq[i % seq.length], noteDur, wave, audio.ctx.currentTime, noteGain)
    i += 1
  }

  tick()
  audio.timer = setInterval(tick, stepMs)
  return true
}

/** 切换并立即播放。必须在用户点击回调里调用。 */
export async function startBgm(style: string) {
  audio.wantedStyle = style || 'none'
  const ctx = ensureAudio()
  if (!ctx) return false

  const running = await unlockAudio()
  if (!running) return false

  if (audio.wantedStyle === 'none') {
    stopBgmNodes()
    audio.style = 'none'
    return true
  }

  // 切换时恢复音量（避免卡在 duck）
  if (audio.bgmGain) audio.bgmGain.gain.value = 0.28
  audio.ducked = false
  return beginPattern(audio.wantedStyle)
}

/** TTS 结束后 / 回前台：若用户选了 BGM 却没在响，强制续播 */
export async function ensureBgmPlaying() {
  if (audio.wantedStyle === 'none') return false
  const ok = await unlockAudio()
  if (!ok) return false
  if (audio.style === audio.wantedStyle && audio.timer) {
    if (audio.bgmGain && !audio.ducked) audio.bgmGain.gain.value = 0.28
    return true
  }
  if (audio.bgmGain) audio.bgmGain.gain.value = 0.28
  audio.ducked = false
  return beginPattern(audio.wantedStyle)
}

export function getBgmStyle() {
  return audio.wantedStyle || audio.style
}

export function installBgmLifecycle() {
  const onVis = () => {
    if (document.visibilityState !== 'visible') return
    if (audio.wantedStyle && audio.wantedStyle !== 'none') {
      void ensureBgmPlaying()
    }
  }
  document.addEventListener('visibilitychange', onVis)
  return () => document.removeEventListener('visibilitychange', onVis)
}
