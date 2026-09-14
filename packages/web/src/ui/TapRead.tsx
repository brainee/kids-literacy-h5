import { useState } from 'react'
import { speak } from '../lib/speak'
import './tap-read.css'

/** 点一个读一个：汉字/字母可点；空白与纯标点不可点 */
function isTapUnit(ch: string) {
  if (!ch || /\s/.test(ch)) return false
  // 常见中英文标点、引号
  if (/^[\u3000-\u303F\uFF00-\uFFEF.,!?;:'"，。！？；：、…—·「」『』（）()【】《》]$/.test(ch)) {
    return false
  }
  return true
}

type Props = {
  text: string
  className?: string
  /** 整句再听一遍（可选外层按钮旁注） */
  showHint?: boolean
  /** 是否显示「听整句」 */
  wholeSpeak?: boolean
  size?: 'md' | 'sm'
}

export function TapRead({
  text,
  className = '',
  showHint = true,
  wholeSpeak = false,
  size = 'md',
}: Props) {
  const [active, setActive] = useState<number | null>(null)
  const chars = Array.from(text)

  return (
    <div className={`tap-read tap-read-${size} ${className}`.trim()}>
      {(showHint || wholeSpeak) && (
        <div className="tap-read-toolbar">
          {showHint && <div className="tap-read-hint muted">点读</div>}
          {wholeSpeak && (
            <button
              type="button"
              className="tap-read-whole btn btn-ghost"
              onClick={() => speak(text, { rate: 0.92 })}
            >
              听整句
            </button>
          )}
        </div>
      )}
      <p className="tap-read-line" lang="zh-CN">
        {chars.map((ch, i) => {
          if (!isTapUnit(ch)) {
            return (
              <span key={`${i}-${ch}`} className="tap-read-gap">
                {ch}
              </span>
            )
          }
          return (
            <button
              key={`${i}-${ch}`}
              type="button"
              className={`tap-read-unit${active === i ? ' is-active' : ''}`}
              aria-label={`读「${ch}」`}
              onClick={() => {
                setActive(i)
                speak(ch, { rate: 0.82 })
              }}
            >
              {ch}
            </button>
          )
        })}
      </p>
    </div>
  )
}
