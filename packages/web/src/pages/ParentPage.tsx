import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import type { AgeBand } from '../domain/types'
import { BGM_STYLES, ensureBgmPlaying } from '../lib/bgm'
import { ensurePiper, getPiperState, subscribePiper } from '../lib/piper'
import { speak } from '../lib/speak'
import { useApp } from '../state/AppContext'
import { Shell } from '../ui/Shell'

const BANDS: AgeBand[] = ['L0', 'L1', 'L2']

export function ParentPage() {
  const {
    profile,
    setBand,
    store,
    selectUser,
    setBgm,
    setTtsEngine,
    setPiperAutoPrefetch,
    addUser,
  } = useApp()
  const [piper, setPiper] = useState(getPiperState())
  const [bgmMsg, setBgmMsg] = useState('')
  const [newName, setNewName] = useState('')

  useEffect(() => subscribePiper(setPiper), [])

  if (!profile) return <Navigate to="/" replace />

  const tags = Object.entries(profile.capabilityXp)

  return (
    <Shell title="家长角">
      <div className="card stack kid-card">
        <p className="muted">数据只存在本机。可切换 / 新增小朋友。</p>
        <div className="stack">
          {store.users.map((u) => (
            <button
              key={u.id}
              type="button"
              className={`btn ${store.currentUserId === u.id ? 'btn-sky' : 'btn-ghost'}`}
              onClick={() => {
                selectUser(u.id)
                speak(`切换到${u.name}`, {
                  onend: () => {
                    void ensureBgmPlaying()
                  },
                })
              }}
            >
              {u.name}
            </button>
          ))}
        </div>
        <div className="stack" style={{ gridTemplateColumns: '1fr auto', display: 'grid', gap: 8 }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="新名字"
            maxLength={8}
            style={{
              borderRadius: 16,
              border: '3px solid rgba(31,42,55,0.12)',
              padding: '12px 14px',
              fontSize: '1.05rem',
              fontWeight: 700,
            }}
          />
          <button
            type="button"
            className="btn btn-mint"
            onClick={() => {
              const r = addUser(newName)
              speak(r.message)
              if (r.ok) setNewName('')
            }}
          >
            添加
          </button>
        </div>
      </div>

      <div className="card stack kid-card">
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

      <div className="card stack kid-card">
        <strong>背景音乐</strong>
        <p className="muted">
          点选后应马上听到<strong>不同</strong>旋律（本机合成，不是下载的歌）。关掉后旋律应立刻停。听不到请再点一次，并确认手机没静音。
        </p>
        <div className="stack">
          {BGM_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`btn ${store.bgm === s.id ? 'btn-sky' : 'btn-ghost'}`}
              onClick={async () => {
                const ok = await setBgm(s.id)
                if (s.id === 'none') {
                  setBgmMsg(ok ? '已关闭背景音乐（旋律应已停下）。' : '关闭失败，请再点一次。')
                  speak('好，背景音乐关掉啦。', {
                    duck: false,
                    onend: () => {
                      void ensureBgmPlaying()
                    },
                  })
                  return
                }
                if (!ok) {
                  setBgmMsg('音乐没启动。请再点一次这一项。')
                  speak('音乐还没准备好。再点一次试试。', { duck: false })
                  return
                }
                const line = `好呀，我们换成${s.label}。`
                setBgmMsg(`${line}（应听到与刚才不同的旋律）`)
                // 先让新曲风响约 1 秒，再轻声提示，避免旁白盖住差异
                window.setTimeout(() => {
                  speak(line, {
                    duck: true,
                    onend: () => {
                      void ensureBgmPlaying()
                    },
                  })
                }, 900)
              }}
            >
              {s.emoji} {s.label}
              {store.bgm === s.id ? ' · 当前' : ''}
            </button>
          ))}
        </div>
        {bgmMsg && <p className="muted">{bgmMsg}</p>}
      </div>

      <div className="card stack kid-card">
        <strong>朗读嗓音</strong>
        <p className="muted">
          默认系统朗读。Piper 为可选下载（可缓存）。背景音乐与 Piper 无关，不需要下载。
        </p>
        <div className="grid-2">
          <button
            type="button"
            className={`btn ${store.ttsEngine === 'webspeech' ? 'btn-mint' : 'btn-ghost'}`}
            onClick={() => {
              setTtsEngine('webspeech')
              speak('好，用系统朗读。')
            }}
          >
            系统朗读
          </button>
          <button
            type="button"
            className={`btn ${store.ttsEngine === 'piper' ? 'btn-mint' : 'btn-ghost'}`}
            onClick={async () => {
              const ok = await ensurePiper()
              if (ok) {
                setTtsEngine('piper')
                speak('好呀，换成更甜的嗓音。')
              } else {
                speak('还没下好，先用系统朗读。')
              }
            }}
          >
            更甜嗓音 Piper
          </button>
        </div>
        <button
          type="button"
          className="btn btn-sun"
          disabled={piper.status === 'downloading' || piper.status === 'ready'}
          onClick={() => void ensurePiper()}
        >
          {piper.status === 'ready'
            ? '已缓存到本机 ✓'
            : piper.status === 'downloading'
              ? `下载中 ${Math.round(piper.progress * 100)}%`
              : '手动下载 Piper 模型'}
        </button>
        <label className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={store.piperAutoPrefetch}
            onChange={(e) => setPiperAutoPrefetch(e.target.checked)}
          />
          空闲时自动预下载 Piper（不自动切换引擎）
        </label>
        {piper.message && <p className="muted">{piper.message}</p>}
      </div>

      <div className="card stack kid-card">
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
          认真星 {profile.earnestStars} · 会认字 {profile.knownChars.join('、') || '还没有'}
        </p>
      </div>
    </Shell>
  )
}
