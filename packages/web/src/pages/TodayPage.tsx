import { Link, Navigate } from 'react-router-dom'
import { lessonsForAge } from '../content/lessons'
import { useApp } from '../state/AppContext'
import { Shell } from '../ui/Shell'

export function TodayPage() {
  const { profile } = useApp()
  if (!profile) return <Navigate to="/" replace />
  if (!profile.ageBand) return <Navigate to="/age" replace />

  const list = lessonsForAge(profile.ageBand).slice(0, 3)

  return (
    <Shell title={`今日 · ${profile.name}`}>
      <div className="card">
        <p className="muted">建议完成 2–3 个短课就休息。认真学习会得到认真星 ⭐</p>
      </div>
      {list.map((l) => {
        const done = profile.completedLessons.includes(l.id)
        return (
          <Link
            key={l.id}
            to={`/lesson/${l.id}`}
            className="card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <strong>{l.title}</strong>
                <div className="muted">{l.summary}</div>
              </div>
              <span className="chip">{done ? '会了' : `+${l.reward.earnestStars}⭐`}</span>
            </div>
          </Link>
        )
      })}
      <p className="muted">今日目标差不多了，就可以停下来，很棒。</p>
    </Shell>
  )
}
