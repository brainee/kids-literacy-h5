import type { LessonContent } from '../domain/types'

/** 2.0-A 示例课：复用「星」 */
export const LESSONS: LessonContent[] = [
  {
    id: 'cn-star-01',
    subject: 'chinese',
    courseId: 'cn-basics-a',
    title: '认一认：星',
    ageBands: ['L0', 'L1', 'L2'],
    capabilityTags: ['symbol.chinese.char', 'observe.diff', 'express.speak'],
    summary: '听读「星」，选一选，说一句',
    beats: {
      listen: {
        speak: '天上有什么会眨眼睛？对啦，是星星。这个字，读。星。',
        show: '⭐ 星',
      },
      play: {
        kind: 'choose',
        prompt: '哪个是「星」？',
        options: ['星', '日', '月', '水'],
        answer: 0,
      },
      speak: {
        prompt: '看着图，大声说：我看见一颗星。',
        sample: '我看见一颗星。',
      },
      review: {
        speak: '真棒。你今天会认星，还练习了观察和表达。',
        capabilityLine: '今天练了：识字 · 观察 · 表达',
      },
    },
    reward: { earnestStars: 2 },
  },
  {
    id: 'th-diff-01',
    subject: 'thinking',
    courseId: 'th-observe-a',
    title: '找不同',
    ageBands: ['L0', 'L1', 'L2'],
    capabilityTags: ['observe.diff', 'sense.attention'],
    summary: '找出不一样的那个',
    beats: {
      listen: {
        speak: '仔细看，找出不一样的那个。',
        show: '👀 找不同',
      },
      play: {
        kind: 'choose',
        prompt: '哪一个和其他不同？',
        options: ['🍎', '🍎', '🍐', '🍎'],
        answer: 2,
      },
      speak: {
        prompt: '告诉我：不一样的是什么？',
        sample: '不一样的是梨。',
      },
      review: {
        speak: '眼睛真亮。你练习了观察。',
        capabilityLine: '今天练了：观察 · 注意',
      },
    },
    reward: { earnestStars: 2 },
  },
]

export function lessonsForAge(band: string | null) {
  if (!band) return LESSONS
  return LESSONS.filter((l) => l.ageBands.includes(band as 'L0' | 'L1' | 'L2'))
}

export function getLesson(id: string) {
  return LESSONS.find((l) => l.id === id)
}
