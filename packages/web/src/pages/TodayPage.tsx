import { Link, Navigate } from 'react-router-dom'
import { lessonsForAge } from '../content/lessons'
import { buildTodayCoach } from '../content/todayCoach'
import { isLessonDoneToday } from '../domain/progress'
import { ensureBgmPlaying } from '../lib/bgm'
import { speak } from '../lib/speak'
import { useApp } from '../state/AppContext'
import { Shell } from '../ui/Shell'
import { TapRead } from '../ui/TapRead'
import './today.css'

export function TodayPage() {
  const { profile } = useApp()
  if (!profile) return <Navigate to="/" replace />
  if (!profile.ageBand) return <Navigate to="/age" replace />

  const list = lessonsForAge(profile.ageBand).slice(0, 3)
  const coach = buildTodayCoach(
    profile,
    list.map((l) => l.id),
  )
  const whole = coach.lines.join('')

  return (
    <Shell title={`今日 · ${profile.name}`}>
      <section className="today-coach" aria-label="今日鼓励">
        <div className="today-coach-top">
          <div className="today-coach-face" aria-hidden>
            {coach.face}
          </div>
          <div className="today-coach-meta">
            <span className="today-pill">今日 {coach.doneToday}/{coach.goalToday}</span>
            <span className="today-pill soft">会认 {coach.knownCount} 字</span>
            <span className="today-pill soft">已上 {coach.lessonCount} 课</span>
          </div>
        </div>

        <div className="today-coach-lines">
          {coach.lines.map((line, i) => (
            <TapRead
              key={`${i}-${line.slice(0, 8)}`}
              text={line}
              size="sm"
              showHint={i === 0}
              wholeSpeak
            />
          ))}
        </div>

        <div className="today-coach-actions">
          <button
            type="button"
            className="btn btn-sun"
            onClick={() => {
              speak(whole, {
                rate: 0.95,
                onend: () => {
                  void ensureBgmPlaying()
                },
              })
            }}
          >
            听整段鼓励
          </button>
          <Link to="/pet" className="btn btn-mint" style={{ textDecoration: 'none' }}>
            去看星宝
          </Link>
        </div>
      </section>

      {list.map((l) => {
        const done = isLessonDoneToday(profile.lessonLog || [], l.id)
        const ever = profile.completedLessons.includes(l.id)
        return (
          <Link
            key={l.id}
            to={`/lesson/${l.id}`}
            className="card kid-card today-lesson"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '1.15rem' }}>{l.title}</strong>
                <div className="muted">{l.summary}</div>
              </div>
              <span className="chip">
                {done ? '今天会了 ✓' : ever ? `再练` : `+${l.reward.earnestStars}⭐`}
              </span>
            </div>
          </Link>
        )
      })}
      <p className="muted today-footer">差不多了就可以休息，你真棒。</p>
    </Shell>
  )
}
