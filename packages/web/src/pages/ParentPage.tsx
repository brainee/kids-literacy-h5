import { Navigate } from 'react-router-dom'
import type { AgeBand } from '../domain/types'
import { speak } from '../lib/speak'
import { useApp } from '../state/AppContext'
import { Shell } from '../ui/Shell'

const BANDS: AgeBand[] = ['L0', 'L1', 'L2']

export function ParentPage() {
  const { profile, setBand, store, selectUser } = useApp()
  if (!profile) return <Navigate to="/" replace />

  const tags = Object.entries(profile.capabilityXp)

  return (
    <Shell title="家长角">
      <div className="card stack">
        <p className="muted">数据只存在本机。可切换小朋友或调整年龄带。</p>
        <label className="muted">当前小朋友</label>
        <div className="stack">
          {store.users.map((u) => (
            <button
              key={u.id}
              type="button"
              className={`btn ${store.currentUserId === u.id ? 'btn-sky' : 'btn-ghost'}`}
              onClick={() => {
                selectUser(u.id)
                speak(`切换到${u.name}`)
              }}
            >
              {u.name}
            </button>
          ))}
        </div>
      </div>

      <div className="card stack">
        <strong>年龄带</strong>
        <div className="grid-2">
          {BANDS.map((b) => (
            <button
              key={b}
              type="button"
              className={`btn ${profile.ageBand === b ? 'btn-mint' : 'btn-ghost'}`}
              onClick={() => {
                setBand(b)
                speak(`已改为${b}`)
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="card stack">
        <strong>能力小账本</strong>
        {tags.length === 0 ? (
          <p className="muted">完成一课后会出现能力标签。</p>
        ) : (
          <ul>
            {tags.map(([k, v]) => (
              <li key={k}>
                {k} · {v}
              </li>
            ))}
          </ul>
        )}
        <p className="muted">
          认真星 {profile.earnestStars} · 会认字 {profile.knownChars.join('、') || '还没有'} · 旧金币遗留{' '}
          {profile.coinsLegacy}
        </p>
      </div>

      <div className="card">
        <p className="muted">
          旧版 ESM 玩法：仓库根 `legacy.html`（本地静态服务）。线上以本 2.0 壳为准。
        </p>
      </div>
    </Shell>
  )
}
