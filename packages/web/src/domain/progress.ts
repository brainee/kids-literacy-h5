import type { CapabilityTag, LessonLogEntry, ProfileV2, SubjectId } from './types'

/** 设备本地日键 YYYY-MM-DD */
export function dayKey(ts: number = Date.now()): string {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(key: string, delta: number): string {
  const d = parseDayKey(key)
  d.setDate(d.getDate() + delta)
  return dayKey(d.getTime())
}

export function logsOnDay(log: LessonLogEntry[], key: string): LessonLogEntry[] {
  return log.filter((e) => dayKey(e.at) === key)
}

/** 某日完成的去重课 id */
export function uniqueLessonIdsOnDay(log: LessonLogEntry[], key: string): string[] {
  const ids: string[] = []
  for (const e of logsOnDay(log, key)) {
    if (!ids.includes(e.lessonId)) ids.push(e.lessonId)
  }
  return ids
}

/** 今日推荐课里，今天已完成几节（去重） */
export function countTodayProgress(
  log: LessonLogEntry[],
  todayLessonIds: string[],
  today: string = dayKey(),
): number {
  const done = new Set(uniqueLessonIdsOnDay(log, today))
  return todayLessonIds.filter((id) => done.has(id)).length
}

export function isLessonDoneToday(
  log: LessonLogEntry[],
  lessonId: string,
  today: string = dayKey(),
): boolean {
  return uniqueLessonIdsOnDay(log, today).includes(lessonId)
}

/** 连续打卡：从今天往前，有上课记录的天数 */
export function streakDays(log: LessonLogEntry[], today: string = dayKey()): number {
  if (!log.length) return 0
  let n = 0
  let cur = today
  // 若今天还没上，从昨天开始算「已有连续」
  if (logsOnDay(log, cur).length === 0) {
    cur = addDays(cur, -1)
  }
  for (let i = 0; i < 366; i++) {
    if (logsOnDay(log, cur).length === 0) break
    n += 1
    cur = addDays(cur, -1)
  }
  return n
}

export function countLogsInLastDays(log: LessonLogEntry[], days: number, today: string = dayKey()): number {
  const start = addDays(today, -(days - 1))
  return log.filter((e) => {
    const k = dayKey(e.at)
    return k >= start && k <= today
  }).length
}

export const SUBJECT_LABEL: Record<SubjectId, string> = {
  chinese: '语文',
  math: '数学',
  english: '英语',
  thinking: '思维',
}

export function countBySubject(log: LessonLogEntry[]): Record<SubjectId, number> {
  const out: Record<SubjectId, number> = {
    chinese: 0,
    math: 0,
    english: 0,
    thinking: 0,
  }
  for (const e of log) {
    if (e.subject in out) out[e.subject] += 1
  }
  return out
}

export const CAPABILITY_LABEL: Partial<Record<CapabilityTag, string>> = {
  'sense.attention': '注意',
  'observe.diff': '观察',
  classify: '分类',
  sequence: '排序',
  quantity: '数感',
  'symbol.chinese.char': '识字',
  'symbol.english.letter': '字母',
  'express.speak': '表达',
  'emotion.retry': '再试',
  'meta.choice': '选择',
}

export type MonthCell = {
  dayKey: string
  day: number
  inMonth: boolean
  count: number
  isToday: boolean
}

export function buildMonthGrid(year: number, month0: number, log: LessonLogEntry[]): MonthCell[] {
  const today = dayKey()
  const first = new Date(year, month0, 1)
  const startPad = first.getDay() // 0 Sun
  const daysInMonth = new Date(year, month0 + 1, 0).getDate()
  const cells: MonthCell[] = []

  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month0, 1 - (startPad - i))
    const key = dayKey(d.getTime())
    cells.push({
      dayKey: key,
      day: d.getDate(),
      inMonth: false,
      count: logsOnDay(log, key).length,
      isToday: key === today,
    })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month0, day)
    const key = dayKey(d.getTime())
    cells.push({
      dayKey: key,
      day,
      inMonth: true,
      count: logsOnDay(log, key).length,
      isToday: key === today,
    })
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]
    const d = parseDayKey(last.dayKey)
    d.setDate(d.getDate() + 1)
    const key = dayKey(d.getTime())
    cells.push({
      dayKey: key,
      day: d.getDate(),
      inMonth: false,
      count: logsOnDay(log, key).length,
      isToday: key === today,
    })
  }
  return cells
}

export function summarizeProfile(profile: ProfileV2) {
  const log = profile.lessonLog || []
  return {
    streak: streakDays(log),
    last7: countLogsInLastDays(log, 7),
    bySubject: countBySubject(log),
    totalSessions: log.length,
    knownCount: profile.knownChars.length,
    lessonsCleared: profile.completedLessons.length,
  }
}
