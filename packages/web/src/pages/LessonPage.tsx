import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { getLesson } from '../content/lessons'
import type { LessonBeat } from '../domain/types'
import { sfx } from '../lib/bgm'
import {
  clearRecording,
  playRecording,
  startRecording,
  stopRecording,
  type RecStatus,
} from '../lib/record'
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
  const [replayText, setReplayText] = useState('')
  const [recStatus, setRecStatus] = useState<RecStatus>('idle')
  const [recUrl, setRecUrl] = useState<string | null>(null)
  const [recMsg, setRecMsg] = useState('')
  const [speakOk, setSpeakOk] = useState(false)
  const [reviewOk, setReviewOk] = useState(false)
  const [reviewPicked, setReviewPicked] = useState<number | null>(null)

  const beat = BEATS[beatIdx]

  useEffect(() => {
    if (!lesson) return
    setBeatIdx(0)
    setPicked(null)
    setPlayOk(false)
    setDone(false)
    setHint('')
    setSpeakOk(false)
    setReviewOk(false)
    setReviewPicked(null)
    setRecStatus('idle')
    setRecUrl(null)
    setRecMsg('')
    clearRecording()
  }, [lesson?.id])

  useEffect(() => {
    if (!lesson) return
    let text = ''
    if (beat === 'listen') text = lesson.beats.listen.speak
    if (beat === 'play') text = lesson.beats.play.prompt
    if (beat === 'speak') text = lesson.beats.speak.prompt
    if (beat === 'review') text = lesson.beats.review.speak
    setReplayText(text)
    speak(text)
    if (beat === 'speak') {
      setSpeakOk(false)
      setRecStatus('idle')
      setRecUrl(null)
      setRecMsg('先点「开始说」，大声读出来。')
      clearRecording()
    }
    if (beat === 'review') {
      setReviewOk(!lesson.beats.review.recall)
      setReviewPicked(null)
      setHint('')
    }
  }, [beat, lesson?.id])

  useEffect(() => () => clearRecording(), [])

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

  const goPrev = () => {
    if (beatIdx <= 0) {
      nav('/today')
      return
    }
    setHint('')
    setBeatIdx((i) => i - 1)
  }

  const next = () => {
    if (beat === 'speak' && !speakOk) {
      setRecMsg('要先开始说、录到声音，才能进入下一步哦。')
      speak('要先点开始说，再大声读出来。')
      return
    }
    if (beat === 'review' && lesson.beats.review.recall && !reviewOk) {
      setHint('先选一选再收星哦')
      speak('想一想，再选一次。')
      return
    }
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
      sfx(alreadyDone ? 'coin' : 'levelup')
      if (alreadyDone) {
        speak('这课你已经会过啦。再练一遍也很棒。')
      } else {
        speak(`拿到 ${lesson.reward.earnestStars} 颗认真星。可以去喂星宝啦。`)
      }
    }
  }

  return (
    <Shell title={lesson.title}>
      <div className="beat-pill">
        第 {beatIdx + 1}/{BEATS.length} 拍 ·{' '}
        {{ listen: '听一听', play: '玩一玩', speak: '说一说', review: '想一想' }[beat]}
      </div>

      <div className="grid-2">
        <button type="button" className="btn btn-ghost" onClick={goPrev}>
          ← {beatIdx === 0 ? '回今日' : '上一拍'}
        </button>
        <button
          type="button"
          className="btn btn-replay"
          onClick={() => replayText && speak(replayText)}
          disabled={!replayText}
        >
          🔊 再听一遍
        </button>
      </div>

      {beat === 'listen' && (
        <div className="card stack kid-card">
          <div className="hero bounce-in">{lesson.beats.listen.show}</div>
          <TapRead text={lesson.beats.listen.speak} />
          <button type="button" className="btn btn-sky" onClick={next}>
            下一拍
          </button>
        </div>
      )}

      {beat === 'play' && (
        <div className="card stack kid-card">
          <TapRead text={lesson.beats.play.prompt} />
          <div className="grid-2">
            {lesson.beats.play.options.map((opt, i) => (
              <button
                key={`${opt}-${i}`}
                type="button"
                className={`btn opt-btn ${picked === i ? (i === lesson.beats.play.answer ? 'btn-mint' : 'btn-coral') : 'btn-ghost'}`}
                onClick={() => {
                  setPicked(i)
                  speak(opt, { rate: 0.82 })
                  if (i === lesson.beats.play.answer) {
                    setPlayOk(true)
                    setHint('对啦！')
                    sfx('correct')
                    window.setTimeout(() => speak('对啦，真棒。'), 350)
                  } else {
                    setHint('再试一次哦')
                    sfx('wrong')
                    window.setTimeout(() => speak('再试一次哦'), 350)
                  }
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          {hint && <p className="celebrate">{hint}</p>}
          <button type="button" className="btn btn-sky" disabled={!playOk} onClick={next}>
            下一拍
          </button>
        </div>
      )}

      {beat === 'speak' && (
        <div className="card stack kid-card">
          <div className="hero" style={{ fontSize: '2.5rem' }}>
            {recStatus === 'recording' ? '🎤' : '🗣️'}
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
            onClick={() => {
              setReplayText(lesson.beats.speak.sample)
              speak(lesson.beats.speak.sample)
            }}
          >
            听整句示范
          </button>

          {recStatus !== 'recording' ? (
            <button
              type="button"
              className="btn btn-coral"
              onClick={async () => {
                setSpeakOk(false)
                setRecUrl(null)
                const r = await startRecording()
                setRecMsg(r.message)
                speak(r.message)
                if (r.ok) setRecStatus('recording')
                else setRecStatus('error')
              }}
            >
              🎙 开始说
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sun"
              onClick={async () => {
                const r = await stopRecording()
                setRecMsg(r.message)
                speak(r.message)
                if (r.ok && r.url) {
                  setRecUrl(r.url)
                  setSpeakOk(true)
                  setRecStatus('done')
                  sfx('correct')
                } else {
                  setSpeakOk(false)
                  setRecStatus('error')
                  sfx('wrong')
                }
              }}
            >
              ⏹ 说完了，停
            </button>
          )}

          {recUrl && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                void playRecording(recUrl).catch(() => speak('这段录音听不了啦，我们再录一次。'))
              }}
            >
              听我的录音
            </button>
          )}

          {recMsg && <p className="muted">{recMsg}</p>}

          <button type="button" className="btn btn-mint" disabled={!speakOk} onClick={next}>
            进入下一拍
          </button>
        </div>
      )}

      {beat === 'review' && (
        <div className="card stack kid-card">
          {lesson.beats.review.recall?.show && (
            <div className="hero bounce-in">{lesson.beats.review.recall.show}</div>
          )}
          <TapRead text={lesson.beats.review.speak} />
          {lesson.beats.review.recall && (
            <>
              <TapRead text={lesson.beats.review.recall.prompt} showHint={false} size="sm" />
              <div className="grid-2">
                {lesson.beats.review.recall.options.map((opt, i) => (
                  <button
                    key={`review-${opt}-${i}`}
                    type="button"
                    className={`btn opt-btn ${
                      reviewPicked === i
                        ? i === lesson.beats.review.recall!.answer
                          ? 'btn-mint'
                          : 'btn-coral'
                        : 'btn-ghost'
                    }`}
                    onClick={() => {
                      const recall = lesson.beats.review.recall!
                      setReviewPicked(i)
                      speak(opt, { rate: 0.82 })
                      if (i === recall.answer) {
                        setReviewOk(true)
                        setHint('对啦！你还记得。')
                        sfx('correct')
                        window.setTimeout(() => speak('对啦，你还记得。'), 350)
                      } else {
                        setReviewOk(false)
                        setHint('再想一想？')
                        sfx('wrong')
                        window.setTimeout(() => speak('再想一想？'), 350)
                      }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
          {hint && <p className="celebrate">{hint}</p>}
          <TapRead text={lesson.beats.review.capabilityLine} showHint={false} size="sm" />
          {!done ? (
            <button
              type="button"
              className="btn btn-sun"
              disabled={Boolean(lesson.beats.review.recall) && !reviewOk}
              onClick={next}
            >
              {alreadyDone ? '练完啦' : `收下 ${lesson.reward.earnestStars} 颗认真星 ⭐`}
            </button>
          ) : (
            <div className="stack">
              <p className="celebrate">真棒！今日又进步啦</p>
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
