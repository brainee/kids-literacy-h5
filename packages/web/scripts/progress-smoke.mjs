/**
 * 真·今日 / 连续打卡纯逻辑冒烟（无浏览器）
 */
import assert from 'node:assert/strict'

function dayKey(ts) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(key, delta) {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + delta)
  return dayKey(dt.getTime())
}

function uniqueOnDay(log, key) {
  const ids = []
  for (const e of log) {
    if (dayKey(e.at) !== key) continue
    if (!ids.includes(e.lessonId)) ids.push(e.lessonId)
  }
  return ids
}

function countTodayProgress(log, todayIds, today) {
  const done = new Set(uniqueOnDay(log, today))
  return todayIds.filter((id) => done.has(id)).length
}

const today = dayKey(Date.now())
const yesterday = addDays(today, -1)
const log = [
  { at: Date.parse(yesterday + 'T12:00:00'), lessonId: 'a', subject: 'chinese' },
  { at: Date.parse(yesterday + 'T13:00:00'), lessonId: 'b', subject: 'thinking' },
]

assert.equal(countTodayProgress(log, ['a', 'b'], today), 0, 'yesterday does not count as today')
log.push({ at: Date.now(), lessonId: 'a', subject: 'chinese' })
assert.equal(countTodayProgress(log, ['a', 'b'], today), 1)
log.push({ at: Date.now(), lessonId: 'a', subject: 'chinese' })
assert.equal(countTodayProgress(log, ['a', 'b'], today), 1, 'dedupe same lesson same day')
log.push({ at: Date.now(), lessonId: 'b', subject: 'thinking' })
assert.equal(countTodayProgress(log, ['a', 'b'], today), 2)

console.log('progress-smoke: PASS (true today + dedupe)')
