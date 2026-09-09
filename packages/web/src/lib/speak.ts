export function speak(text: string, opts?: { rate?: number; onend?: () => void }) {
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
  u.onend = () => opts?.onend?.()
  u.onerror = () => opts?.onend?.()
  speechSynthesis.speak(u)
}
