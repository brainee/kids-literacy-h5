/** 说一说：本地麦克风录音 + 音量检测（不上传） */

export type RecStatus = 'idle' | 'recording' | 'done' | 'error'

export type RecResult = {
  ok: boolean
  blob?: Blob
  url?: string
  peak: number
  message: string
}

let mediaStream: MediaStream | null = null
let recorder: MediaRecorder | null = null
let chunks: BlobPart[] = []
let peak = 0
let analyseTimer: ReturnType<typeof setInterval> | null = null
let audioCtx: AudioContext | null = null
let lastUrl: string | null = null

function cleanupAnalyse() {
  if (analyseTimer) {
    clearInterval(analyseTimer)
    analyseTimer = null
  }
  if (audioCtx) {
    try {
      void audioCtx.close()
    } catch {
      /* ignore */
    }
    audioCtx = null
  }
}

function revokeLast() {
  if (lastUrl) {
    URL.revokeObjectURL(lastUrl)
    lastUrl = null
  }
}

export async function startRecording(): Promise<{ ok: boolean; message: string }> {
  stopRecordingQuick()
  peak = 0
  chunks = []
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch {
    return { ok: false, message: '没法用麦克风。请在浏览器里允许麦克风，我们再试。' }
  }

  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audioCtx = new Ctx()
    const src = audioCtx.createMediaStreamSource(mediaStream)
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 512
    src.connect(analyser)
    const data = new Uint8Array(analyser.fftSize)
    analyseTimer = setInterval(() => {
      analyser.getByteTimeDomainData(data)
      let sum = 0
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128
        sum += v * v
      }
      const rms = Math.sqrt(sum / data.length)
      if (rms > peak) peak = rms
    }, 80)
  } catch {
    /* 没有分析也允许录，结束时用时长兜底 */
  }

  const mime = MediaRecorder.isTypeSupported('audio/webm')
    ? 'audio/webm'
    : MediaRecorder.isTypeSupported('audio/mp4')
      ? 'audio/mp4'
      : ''
  try {
    recorder = mime ? new MediaRecorder(mediaStream, { mimeType: mime }) : new MediaRecorder(mediaStream)
  } catch {
    mediaStream.getTracks().forEach((t) => t.stop())
    mediaStream = null
    cleanupAnalyse()
    return { ok: false, message: '这个浏览器还不支持录音。换个系统浏览器试试吧。' }
  }

  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) chunks.push(ev.data)
  }
  recorder.start(200)
  return { ok: true, message: '开始啦，大声说出来！' }
}

function stopRecordingQuick() {
  try {
    if (recorder && recorder.state !== 'inactive') recorder.stop()
  } catch {
    /* ignore */
  }
  recorder = null
  if (mediaStream) {
    mediaStream.getTracks().forEach((t) => t.stop())
    mediaStream = null
  }
  cleanupAnalyse()
}

export function stopRecording(): Promise<RecResult> {
  return new Promise((resolve) => {
    if (!recorder) {
      cleanupAnalyse()
      resolve({ ok: false, peak, message: '还没有开始录音哦。' })
      return
    }
    const rec = recorder
    rec.onstop = () => {
      cleanupAnalyse()
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop())
        mediaStream = null
      }
      recorder = null
      const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' })
      chunks = []
      revokeLast()
      // 音量阈值：孩子靠近说一般 > 0.02；过低判定没声音
      const voiced = peak >= 0.02 && blob.size > 800
      if (!voiced) {
        resolve({
          ok: false,
          peak,
          message: '好像没录上声音。靠近麦克风，再大声说一次好不好。',
        })
        return
      }
      const url = URL.createObjectURL(blob)
      lastUrl = url
      resolve({ ok: true, blob, url, peak, message: '录好啦！可以听自己的声音。' })
    }
    try {
      if (rec.state !== 'inactive') rec.stop()
      else rec.onstop(new Event('stop'))
    } catch {
      resolve({ ok: false, peak, message: '录音没停下来，再试一次。' })
    }
  })
}

export function playRecording(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const a = new Audio(url)
    a.onended = () => resolve()
    a.onerror = () => reject(new Error('play failed'))
    void a.play().catch(reject)
  })
}

export function clearRecording() {
  stopRecordingQuick()
  revokeLast()
  peak = 0
  chunks = []
}
