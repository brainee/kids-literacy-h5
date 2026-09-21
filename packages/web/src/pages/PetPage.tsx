import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  adoptCost,
  levelsToNextStage,
  MAX_PETS,
  PET_FOODS,
  PET_KINDS,
  petDecor,
  petMood,
  petMoodBadge,
  petStageFace,
  petStageIndex,
  petStageLabel,
  type FoodId,
  type PetKindId,
} from '../content/petFoods'
import { getActivePet } from '../domain/store'
import { sfx } from '../lib/bgm'
import { speak } from '../lib/speak'
import { useApp } from '../state/AppContext'
import { Shell } from '../ui/Shell'
import './pet.css'

export function PetPage() {
  const { profile, buyFood, feedFood, adopt, switchPet, convertCoins } = useApp()
  const [msg, setMsg] = useState('')
  const [faceAnim, setFaceAnim] = useState('')
  const [celebrate, setCelebrate] = useState(false)
  const [showAdopt, setShowAdopt] = useState(false)
  const [pickKind, setPickKind] = useState<PetKindId>('chick')
  const [petName, setPetName] = useState('小星星')

  useEffect(() => {
    if (!profile) return
    if (!profile.pets.length) {
      setShowAdopt(true)
      speak('来选一只你喜欢的小动物，带回家养吧。')
    } else {
      const a = getActivePet(profile)
      speak(a ? `${a.name}等你来玩啦。` : '星宝等你来喂养啦。')
    }
  }, [])

  if (!profile) return <Navigate to="/" replace />

  const active = getActivePet(profile)
  const costNext = adoptCost(profile.pets.length)
  const canAdoptMore = profile.pets.length < MAX_PETS

  const flash = (leveled: boolean) => {
    setFaceAnim(leveled ? 'bounce' : 'eat')
    window.setTimeout(() => setFaceAnim(''), 700)
    setCelebrate(true)
    window.setTimeout(() => setCelebrate(false), 1100)
  }

  const onBuy = (id: FoodId) => {
    const r = buyFood(id)
    setMsg(r.message)
    speak(r.message)
    if (r.ok) sfx('coin')
    else sfx('wrong')
  }

  const onFeed = (id: FoodId) => {
    const r = feedFood(id)
    setMsg(r.message)
    speak(r.message)
    if (r.ok) {
      sfx(r.leveled ? 'levelup' : 'feed')
      flash(r.leveled)
    } else sfx('wrong')
  }

  const onAdopt = () => {
    const r = adopt(pickKind, petName)
    setMsg(r.message)
    speak(r.message)
    if (r.ok) {
      sfx('levelup')
      flash(true)
      setShowAdopt(false)
    } else sfx('wrong')
  }

  const hunger = active ? Math.max(0, Math.min(100, active.hunger)) : 0
  const kind = PET_KINDS.find((k) => k.id === (active?.kind || pickKind)) || PET_KINDS[0]
  const stage = active ? petStageIndex(active.level) : 0
  const stageName = active ? petStageLabel(active.level) : ''
  const toNext = active ? levelsToNextStage(active.level) : 0
  const decor = active ? petDecor(active.level) : []
  const face = active ? petStageFace(active.kind, active.level) : kind.emoji

  return (
    <Shell title={active ? `${active.name} · Lv.${active.level}` : '我的小动物'}>
      {celebrate && (
        <div className="pet-celebrate" aria-hidden>
          <span>⭐</span>
          <span>{face}</span>
          <span>🎉</span>
          <span>⭐</span>
          <span>💖</span>
        </div>
      )}

      {/* 我的小伙伴们 */}
      <div className="card kid-card stack">
        <strong>我的小伙伴（{profile.pets.length}/{MAX_PETS}）</strong>
        <p className="muted">每个小朋友只养自己的。养得越多，认养越贵，要更努力上课哦。</p>
        {profile.pets.length === 0 ? (
          <p className="celebrate">还没有小动物，先选一只吧！</p>
        ) : (
          <div className="pet-roster">
            {profile.pets.map((p) => {
              const meta = PET_KINDS.find((k) => k.id === p.kind) || PET_KINDS[0]
              const on = p.id === profile.activePetId
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`pet-chip ${on ? 'is-on' : ''}`}
                  style={{ background: on ? meta.color : '#fff' }}
                  onClick={() => {
                    const r = switchPet(p.id)
                    setMsg(r.message)
                    speak(r.message)
                    sfx('coin')
                  }}
                >
                  <span className="pet-chip-face">{petStageFace(p.kind, p.level)}</span>
                  <span>
                    {p.name}
                    <small className="pet-chip-lv">Lv.{p.level}</small>
                  </span>
                </button>
              )
            })}
          </div>
        )}
        {canAdoptMore && (
          <button
            type="button"
            className="btn btn-sun"
            onClick={() => {
              setShowAdopt(true)
              speak(
                costNext === 0
                  ? '选一只你喜欢的小动物吧。'
                  : `再养一只要 ${costNext} 颗认真星。加油上课就能迎新伙伴。`,
              )
            }}
          >
            ＋ 迎新伙伴{costNext > 0 ? `（${costNext}⭐）` : '（免费）'}
          </button>
        )}
      </div>

      {active && (
        <div
          className={`card kid-card stack pet-hero stage-${stage}`}
          style={{ background: `linear-gradient(180deg, ${kind.color} 0%, #fff 70%)` }}
        >
          <div className="pet-stage-pill">
            {stageName}形态 · Lv.{active.level}
            {toNext > 0 ? ` · 再升${toNext}级更闪亮` : ' · 最闪亮啦'}
          </div>
          <div className={`pet-stage-ring stage-${stage}`}>
            <div className={`hero pet-face ${faceAnim}`}>{face}</div>
            <span className="pet-mood-badge" title="心情">
              {petMoodBadge(hunger)}
            </span>
            {decor.map((d, i) => (
              <span key={`${d}-${i}`} className={`pet-decor d${i}`} aria-hidden>
                {d}
              </span>
            ))}
          </div>
          <p className="celebrate" style={{ margin: 0 }}>
            {petMood(hunger)}
          </p>
          <div className="hunger-wrap">
            <div className="hunger-bar" style={{ width: `${hunger}%` }} />
          </div>
          <p className="muted" style={{ textAlign: 'center', margin: 0 }}>
            饱食 {Math.round(hunger)}/100 · 认真星 ⭐ {profile.earnestStars}
          </p>
          <p className="muted" style={{ textAlign: 'center', margin: 0, fontSize: '0.9rem' }}>
            多喂会升级变好看；饿了只是心情，不会变回宝宝哦。
          </p>
        </div>
      )}

      {active && (
        <>
          <div className="card kid-card stack">
            <strong>小商店</strong>
            <p className="muted">用认真星买吃的，喂给当前这只。</p>
            {PET_FOODS.map((f) => (
              <div key={f.id} className="pet-row">
                <div>
                  <strong>
                    {f.emoji} {f.name}
                  </strong>
                  <div className="muted">
                    {f.price}⭐ · +{f.hunger} 饱
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sun"
                  disabled={profile.earnestStars < f.price}
                  onClick={() => onBuy(f.id)}
                >
                  购买
                </button>
              </div>
            ))}
          </div>

          <div className="card kid-card stack">
            <strong>{active.name} 的背包</strong>
            {PET_FOODS.map((f) => {
              const count = active.foods[f.id] || 0
              return (
                <div key={f.id} className="pet-row">
                  <strong>
                    {f.emoji} {f.name} × {count}
                  </strong>
                  <button
                    type="button"
                    className="btn btn-mint"
                    disabled={count <= 0}
                    onClick={() => onFeed(f.id)}
                  >
                    喂养
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {profile.coinsLegacy > 0 && (
        <div className="card kid-card stack">
          <strong>旧金币兑换</strong>
          <p className="muted">还留着 {profile.coinsLegacy} 旧金币。2 币 = 1⭐</p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              const r = convertCoins()
              setMsg(r.message)
              speak(r.message)
              if (r.ok) sfx('coin')
            }}
          >
            兑换认真星
          </button>
        </div>
      )}

      {msg && <p className="celebrate">{msg}</p>}

      <Link className="btn btn-sky" to="/today">
        去上课赚认真星 ⭐
      </Link>

      {showAdopt && (
        <div className="pet-modal" role="dialog" aria-label="认养小动物">
          <div className="pet-modal-card stack">
            <strong style={{ fontSize: '1.25rem' }}>选一只带回家</strong>
            <p className="muted">
              {costNext === 0
                ? '第一只免费！点一个你最喜欢的。'
                : `这一只要 ${costNext}⭐，养得越多越要加油上课。`}
            </p>
            <div className="pet-kind-grid">
              {PET_KINDS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  className={`pet-kind ${pickKind === k.id ? 'is-on' : ''}`}
                  style={{ background: k.color }}
                  onClick={() => {
                    setPickKind(k.id)
                    setPetName(k.name)
                    speak(`选${k.name}。${k.blurb}`)
                    sfx('coin')
                  }}
                >
                  <span className="pet-kind-emoji">{k.emoji}</span>
                  <span>{k.name}</span>
                </button>
              ))}
            </div>
            <label className="muted">给它起名字</label>
            <input
              className="pet-name-input"
              value={petName}
              maxLength={6}
              onChange={(e) => setPetName(e.target.value)}
            />
            <div className="grid-2">
              {profile.pets.length > 0 && (
                <button type="button" className="btn btn-ghost" onClick={() => setShowAdopt(false)}>
                  先不要
                </button>
              )}
              <button
                type="button"
                className="btn btn-mint"
                style={{ gridColumn: profile.pets.length ? undefined : '1 / -1' }}
                disabled={profile.earnestStars < costNext}
                onClick={onAdopt}
              >
                {costNext === 0 ? '带回家' : `花 ${costNext}⭐ 迎回家`}
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  )
}
