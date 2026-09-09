import { Navigate, useNavigate } from 'react-router-dom'
import type { AgeBand } from '../domain/types'
import { useApp } from '../state/AppContext'
import { speak } from '../lib/speak'
import { Shell } from '../ui/Shell'

const BANDS: { id: AgeBand; label: string; hint: string }[] = [
  { id: 'L0', label: '我大概 3–4 岁', hint: '大按钮，多听听' },
  { id: 'L1', label: '我大概 4–6 岁', hint: '听听玩玩再说说' },
  { id: 'L2', label: '我大概 6–8 岁', hint: '可以多想一想' },
]

export function AgePage() {
  const { profile, setBand } = useApp()
  const nav = useNavigate()

  if (!profile) return <Navigate to="/" replace />

  return (
    <Shell title="你几岁啦？">
      <div className="card stack">
        <p className="muted">选一个最像你的。以后家长也可以改。</p>
        {BANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            className="btn btn-mint"
            onClick={() => {
              setBand(b.id)
              speak(`好呀。我们按${b.label}来玩。`)
              nav('/today')
            }}
          >
            <span>
              {b.label}
              <br />
              <small className="muted">{b.hint}</small>
            </span>
          </button>
        ))}
      </div>
    </Shell>
  )
}
