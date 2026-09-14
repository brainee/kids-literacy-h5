/** 程序化 BGM（无需下载）。关必须真静音；切曲必须听得出差别。 */

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
  /** 切曲/关闭时递增，作废旧 interval 回调 */
  gen: number
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
  gen: 0,
}

const BGM_VOL = 0.32

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
  audio.bgmGain.gain.value = 0
  audio.bgmGain.connect(audio.master)
  audio.sfxGain = audio.ctx.createGain()
  audio.sfxGain.gain.value = 0.5
  audio.sfxGain.connect(audio.master)
  return audio.ctx
}

function setBgmGain(value: number) {
  if (!audio.bgmGain || !audio.ctx) return
  const now = audio.ctx.currentTime
  try {
    audio.bgmGain.gain.cancelScheduledValues(now)
    audio.bgmGain.gain.setValueAtTime(audio.bgmGain.gain.value, now)
    audio.bgmGain.gain.linearRampToValueAtTime(value, now + 0.08)
  } catch {
    audio.bgmGain.gain.value = value
  }
}

function liveBgmLevel() {
  if (audio.wantedStyle === 'none' || audio.style === 'none') return 0
  return audio.ducked ? 0.08 : BGM_VOL
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
  // 已关闭时绝不因 TTS 结束把音量拉回来
  setBgmGain(liveBgmLevel())
}

function stopBgmNodes() {
  audio.gen += 1
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

function silenceBgm() {
  stopBgmNodes()
  audio.style = 'none'
  audio.ducked = false
  setBgmGain(0)
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
    g.gain.linearRampToValueAtTime(peak, when + 0.02)
    g.gain.exponentialRampToValueAtTime(0.001, when + Math.max(0.06, dur))
  } catch {
    g.gain.value = peak
  }
  o.connect(g)
  g.connect(out)
  o.start(when)
  o.stop(when + dur + 0.05)
  audio.nodes.push(o)
  if (audio.nodes.length > 64) {
    const old = audio.nodes.splice(0, 24)
    for (const n of old) {
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

type StyleEngine = {
  stepMs: number
  tick: (i: number, t0: number) => void
}

/** 四种曲风：音色 + 节奏 + 音高明显不同，避免「怎么切都一样」 */
function styleEngine(style: string): StyleEngine | null {
  if (style === 'box') {
    // 八音盒：高音正弦、慢、上行琶音
    const seq = [1046.5, 1318.5, 1568.0, 2093.0, 1568.0, 1318.5, 1174.7, 1046.5]
    return {
      stepMs: 480,
      tick: (i, t0) => {
        playTone(seq[i % seq.length], 0.55, 'sine', t0, 0.1)
      },
    }
  }
  if (style === 'kids') {
    // 童趣：中速跳音 + 五度叠音，像儿歌
    const seq = [392.0, 440.0, 523.25, 440.0, 349.23, 392.0, 523.25, 587.33]
    return {
      stepMs: 220,
      tick: (i, t0) => {
        const f = seq[i % seq.length]
        playTone(f, 0.18, 'triangle', t0, 0.11)
        playTone(f * 1.5, 0.14, 'sine', t0, 0.05)
      },
    }
  }
  if (style === 'game') {
    // 小游戏：方波底鼓感 + 短促主音
    const bass = [130.81, 130.81, 146.83, 130.81]
    const lead = [523.25, 0, 659.25, 523.25, 784.0, 0, 659.25, 523.25]
    return {
      stepMs: 160,
      tick: (i, t0) => {
        playTone(bass[i % bass.length], 0.12, 'square', t0, 0.05)
        const f = lead[i % lead.length]
        if (f > 0) playTone(f, 0.1, 'square', t0, 0.06)
      },
    }
  }
  if (style === 'pop') {
    // 轻快：锯齿亮音、切分（隔拍加重）
    const seq = [349.23, 440.0, 523.25, 659.25, 587.33, 523.25, 440.0, 392.0]
    return {
      stepMs: 280,
      tick: (i, t0) => {
        const accent = i % 2 === 0
        playTone(seq[i % seq.length], accent ? 0.22 : 0.12, 'sawtooth', t0, accent ? 0.07 : 0.04)
      },
    }
  }
  return null
}

function beginPattern(style: string) {
  stopBgmNodes()
  audio.style = style
  if (!audio.ctx || style === 'none') {
    setBgmGain(0)
    return false
  }

  const engine = styleEngine(style)
  if (!engine) {
    setBgmGain(0)
    audio.style = 'none'
    return false
  }

  const gen = audio.gen
  let i = 0
  setBgmGain(liveBgmLevel())

  const tick = () => {
    if (gen !== audio.gen) return
    if (!audio.ctx || audio.wantedStyle === 'none' || audio.style === 'none') return
    if (audio.style !== style) return
    if ((audio.ctx.state as string) !== 'running') {
      void audio.ctx.resume()
      return
    }
    engine.tick(i, audio.ctx.currentTime)
    i += 1
  }

  tick()
  audio.timer = setInterval(tick, engine.stepMs)
  return true
}

/** 切换并立即播放。必须在用户点击回调里调用。 */
export async function startBgm(style: string) {
  audio.wantedStyle = style || 'none'
  const ctx = ensureAudio()
  if (!ctx) return false

  if (audio.wantedStyle === 'none') {
    // 关：先停节点再硬静音；不依赖 TTS 时机
    silenceBgm()
    await unlockAudio()
    silenceBgm()
    return true
  }

  const running = await unlockAudio()
  if (!running) return false

  audio.ducked = false
  return beginPattern(audio.wantedStyle)
}

/** TTS 结束后 / 回前台：若用户选了 BGM 却没在响，强制续播；关闭则保持静音 */
export async function ensureBgmPlaying() {
  if (audio.wantedStyle === 'none') {
    silenceBgm()
    return false
  }
  const ok = await unlockAudio()
  if (!ok) return false
  if (audio.style === audio.wantedStyle && audio.timer) {
    setBgmGain(liveBgmLevel())
    return true
  }
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
    } else {
      silenceBgm()
    }
  }
  document.addEventListener('visibilitychange', onVis)
  return () => document.removeEventListener('visibilitychange', onVis)
}
