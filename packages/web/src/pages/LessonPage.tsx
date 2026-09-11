import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { getLesson } from '../content/lessons'
import type { LessonBeat } from '../domain/types'
import { speak } from '../lib/speak'
import { useApp } from '../state/AppContext'
import { Shell } from '../ui/Shell'
import { TapRead } from '../ui/TapRead'

const BEATS: LessonBeat[] = ['listen', 'play', 'speak', 'review']

export function LessonPage() {
  const { id = '' } = useParams()
  const lesson = getLesson(id)
  const { profile, finishLesson } = useApp()
  const nav = useNavigate()
  const [beatIdx, setBeatIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [playOk, setPlayOk] = useState(false)
  const [done, setDone] = useState(false)
  const [hint, setHint] = useState('')

  const beat = BEATS[beatIdx]

  useEffect(() => {
    if (!lesson) return
    setBeatIdx(0)
    setPicked(null)
    setPlayOk(false)
    setDone(false)
    setHint('')
  }, [lesson?.id])

  useEffect(() => {
    if (!lesson) return
    if (beat === 'listen') speak(lesson.beats.listen.speak)
    if (beat === 'play') speak(lesson.beats.play.prompt)
    if (beat === 'speak') speak(lesson.beats.speak.prompt)
    if (beat === 'review') speak(lesson.beats.review.speak)
  }, [beat, lesson?.id])

  if (!profile) return <Navigate to="/" replace />
  if (!profile.ageBand) return <Navigate to="/age" replace />
  if (!lesson) {
    return (
      <Shell title="找不到这课">
        <div className="card">
          <p>这节课好像不见了。</p>
          <Link className="btn btn-sky" to="/today">
            回今日
          </Link>
        </div>
      </Shell>
    )
  }

  const alreadyDone = profile.completedLessons.includes(lesson.id)

  const next = () => {
    if (beatIdx < BEATS.length - 1) {
      setBeatIdx((i) => i + 1)
      setHint('')
      return
    }
    if (!done) {
      const known =
        lesson.subject === 'chinese' && lesson.beats.listen.show.includes('星') ? '星' : undefined
      finishLesson(lesson.id, lesson.capabilityTags, lesson.reward.earnestStars, known)
      setDone(true)
      if (alreadyDone) {
        speak('这课你已经会过啦。再练一遍也很棒。')
      } else {
        speak(`拿到 ${lesson.reward.earnestStars} 颗认真星。可以去喂星宝啦。`)
      }
    }
  }

  return (
    <Shell title={lesson.title}>
      <div className="card muted">
        第 {beatIdx + 1}/{BEATS.length} 拍 ·{' '}
        {{ listen: '听一听', play: '玩一玩', speak: '说一说', review: '想一想' }[beat]}
      </div>

      {beat === 'listen' && (
        <div className="card stack">
          <div className="hero">{lesson.beats.listen.show}</div>
          <TapRead text={lesson.beats.listen.speak} />
          <button type="button" className="btn btn-ghost" onClick={() => speak(lesson.beats.listen.speak)}>
            再听整句
          </button>
          <button type="button" className="btn btn-sky" onClick={next}>
            下一拍
          </button>
        </div>
      )}

      {beat === 'play' && (
        <div className="card stack">
          <TapRead text={lesson.beats.play.prompt} />
          <div className="grid-2">
            {lesson.beats.play.options.map((opt, i) => (
              <button
                key={`${opt}-${i}`}
                type="button"
                className={`btn ${picked === i ? (i === lesson.beats.play.answer ? 'btn-mint' : 'btn-coral') : 'btn-ghost'}`}
                onClick={() => {
                  setPicked(i)
                  speak(opt, { rate: 0.82 })
                  if (i === lesson.beats.play.answer) {
                    setPlayOk(true)
                    setHint('对啦！')
                    window.setTimeout(() => speak('对啦，真棒。'), 350)
                  } else {
                    setHint('再试一次哦')
                    window.setTimeout(() => speak('再试一次哦'), 350)
                  }
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          {hint && <p className="muted">{hint}</p>}
          <button type="button" className="btn btn-sky" disabled={!playOk} onClick={next}>
            下一拍
          </button>
        </div>
      )}

      {beat === 'speak' && (
        <div className="card stack">
          <div className="hero" style={{ fontSize: '2.5rem' }}>
            🗣️
          </div>
          <TapRead text={lesson.beats.speak.prompt} />
          <div>
            <p className="muted" style={{ marginBottom: 4 }}>
              可以说：
            </p>
            <TapRead text={lesson.beats.speak.sample} showHint={false} />
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => speak(lesson.beats.speak.sample)}
          >
            听整句示范
          </button>
          <button type="button" className="btn btn-mint" onClick={next}>
            我说完了
          </button>
        </div>
      )}

      {beat === 'review' && (
        <div className="card stack">
          <TapRead text={lesson.beats.review.capabilityLine} />
          {!done ? (
            <button type="button" className="btn btn-sun" onClick={next}>
              {alreadyDone ? '练完啦' : `收下 ${lesson.reward.earnestStars} 颗认真星 ⭐`}
            </button>
          ) : (
            <div className="stack">
              <p className="muted">已记入今日进度。</p>
              <button type="button" className="btn btn-sky" onClick={() => nav('/pet')}>
                去喂星宝
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => nav('/today')}>
                回今日
              </button>
            </div>
          )}
        </div>
      )}
    </Shell>
  )
}
