import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import { startBgm, unlockAudio } from '../lib/bgm'
import { speak } from '../lib/speak'
import { Shell } from '../ui/Shell'

export function WelcomePage() {
  const { store, selectUser, profile } = useApp()
  const nav = useNavigate()

  if (store.currentUserId && profile?.ageBand) {
    return <Navigate to="/today" replace />
  }
  if (store.currentUserId && !profile?.ageBand) {
    return <Navigate to="/age" replace />
  }

  return (
    <Shell title="选一个小朋友">
      <div className="card kid-card stack">
        <div className="hero" style={{ fontSize: '3.5rem' }}>
          🌟
        </div>
        <p className="muted" style={{ textAlign: 'center' }}>
          点名字开始。数据只存在这台设备上。
        </p>
        <div className="stack">
          {store.users.map((u) => (
            <button
              key={u.id}
              type="button"
              className="btn btn-sky"
              onClick={async () => {
                selectUser(u.id)
                await unlockAudio()
                if (store.bgm && store.bgm !== 'none') await startBgm(store.bgm)
                speak(`${u.name}，你好呀。欢迎来星星思维乐园。`)
                nav('/age')
              }}
            >
              {u.name === '星星' ? '⭐ ' : u.name === '月月' ? '🌙 ' : '🧒 '}
              {u.name}
            </button>
          ))}
        </div>
      </div>
    </Shell>
  )
}
