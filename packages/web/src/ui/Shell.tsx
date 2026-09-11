import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../state/AppContext'
import './shell.css'

export function Shell({ children, title }: { children: ReactNode; title?: string }) {
  const { profile } = useApp()
  return (
    <div className="shell">
      <header className="shell-bar">
        <div>
          <div className="eyebrow">⭐ 星星思维乐园</div>
          <h1>{title || (profile ? `你好，${profile.name}` : '选一个小朋友')}</h1>
        </div>
        <div className="chips">
          {profile?.ageBand && <span className="chip">年龄 {profile.ageBand}</span>}
          <span className="chip">⭐ 认真星 {profile?.earnestStars ?? 0}</span>
        </div>
      </header>
      <nav className="shell-nav">
        <Link to="/today">今日</Link>
        <Link to="/subjects">科目</Link>
        <Link to="/pet">星宝</Link>
        <Link to="/parent">家长</Link>
      </nav>
      <main className="shell-main">{children}</main>
    </div>
  )
}
