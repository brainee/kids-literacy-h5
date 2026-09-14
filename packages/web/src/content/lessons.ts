import type { LessonContent } from '../domain/types'

/** 2.0-A 示例课：复用「星」——提示句保持短，方便点读/整句听 */
export const LESSONS: LessonContent[] = [
  {
    id: 'cn-star-01',
    subject: 'chinese',
    courseId: 'cn-basics-a',
    title: '认一认：星',
    ageBands: ['L0', 'L1', 'L2'],
    capabilityTags: ['symbol.chinese.char', 'observe.diff', 'express.speak'],
    summary: '听读「星」，选一选，说一句',
    knownChar: '星',
    beats: {
      listen: {
        speak: '这个字，读：星。',
        show: '⭐ 星',
      },
      play: {
        kind: 'choose',
        prompt: '哪个是「星」？',
        options: ['星', '日', '月', '水'],
        answer: 0,
      },
      speak: {
        prompt: '请说：我看见一颗星。',
        sample: '我看见一颗星。',
      },
      review: {
        speak: '这个字，读什么？',
        capabilityLine: '今天练了：识字 · 观察 · 表达',
        recall: {
          show: '⭐',
          prompt: '读什么？',
          options: ['月', '星', '日', '水'],
          answer: 1,
        },
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
        speak: '找出不一样的。',
        show: '👀 找不同',
      },
      play: {
        kind: 'choose',
        prompt: '哪一个不同？',
        options: ['🍎', '🍎', '🍐', '🍎'],
        answer: 2,
      },
      speak: {
        prompt: '请说：不一样的是梨。',
        sample: '不一样的是梨。',
      },
      review: {
        speak: '不一样的是哪一个？',
        capabilityLine: '今天练了：观察 · 注意',
        recall: {
          show: '👀',
          prompt: '哪一个？',
          options: ['🍎', '🍐', '🍎', '🍎'],
          answer: 1,
        },
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
