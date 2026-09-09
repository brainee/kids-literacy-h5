export type AgeBand = 'L0' | 'L1' | 'L2'
export type SubjectId = 'chinese' | 'math' | 'english' | 'thinking'

export type CapabilityTag =
  | 'sense.attention'
  | 'observe.diff'
  | 'classify'
  | 'sequence'
  | 'quantity'
  | 'symbol.chinese.char'
  | 'symbol.english.letter'
  | 'express.speak'
  | 'emotion.retry'
  | 'meta.choice'

export type LessonBeat = 'listen' | 'play' | 'speak' | 'review'

export type FeatureKind = 'choose' | 'listen' | 'speak' | 'sort' | 'classify'

export interface LessonContent {
  id: string
  subject: SubjectId
  courseId: string
  title: string
  ageBands: AgeBand[]
  capabilityTags: CapabilityTag[]
  summary: string
  beats: {
    listen: { speak: string; show: string }
    play: {
      kind: 'choose'
      prompt: string
      options: string[]
      answer: number
    }
    speak: { prompt: string; sample: string }
    review: { speak: string; capabilityLine: string }
  }
  reward: { earnestStars: number }
}

export interface PetState {
  name: string
  level: number
  hunger: number
  foods: { carrot: number; apple: number; fish: number }
}

export interface ProfileV2 {
  version: 2
  name: string
  ageBand: AgeBand | null
  earnestStars: number
  coinsLegacy: number
  capabilityXp: Partial<Record<CapabilityTag, number>>
  completedLessons: string[]
  knownChars: string[]
  pet: PetState
}

export interface StoreV2 {
  version: 2
  users: { id: string; name: string; createdAt: number }[]
  currentUserId: string | null
  profiles: Record<string, ProfileV2>
  bgm: string
}
