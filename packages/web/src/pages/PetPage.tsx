import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { speak } from '../lib/speak'
import { useApp } from '../state/AppContext'
import { Shell } from '../ui/Shell'

export function PetPage() {
  const { profile, feed } = useApp()
  const [msg, setMsg] = useState('')

  if (!profile) return <Navigate to="/" replace />

  const pet = profile.pet

  return (
    <Shell title={`${pet.name} · Lv.${pet.level}`}>
      <div className="card stack">
        <div className="hero">🌟</div>
        <p className="muted">饱食度 {pet.hunger}/100 · 胡萝卜 ×{pet.foods.carrot}</p>
        <p>
          用<strong>认真星</strong>喂养（每次 2 星）。认真学习再来喂，比刷金币更公平。
        </p>
        <button
          type="button"
          className="btn btn-sun"
          onClick={() => {
            const r = feed()
            setMsg(r.message)
            speak(r.message)
          }}
        >
          喂一喂（−2⭐）
        </button>
        {msg && <p className="muted">{msg}</p>}
        <Link className="btn btn-ghost" to="/today">
          去上课赚认真星
        </Link>
      </div>
    </Shell>
  )
}
