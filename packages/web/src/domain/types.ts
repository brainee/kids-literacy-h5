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
  /** 学会的字（语文课）；完成后写入 knownChars */
  knownChar?: string
  beats: {
    listen: { speak: string; show: string }
    play: {
      kind: 'choose'
      prompt: string
      options: string[]
      answer: number
    }
    speak: { prompt: string; sample: string }
    /** 收尾提醒：疑问语气 + 再判断一次（主动回忆） */
    review: {
      speak: string
      capabilityLine: string
      /** 再认/再选；有则须答对才能收认真星 */
      recall?: {
        show?: string
        prompt: string
        options: string[]
        answer: number
      }
    }
  }
  reward: { earnestStars: number }
}

export type PetKindId = 'chick' | 'bunny' | 'kitty' | 'puppy' | 'panda'

export interface PetState {
  id: string
  kind: PetKindId
  name: string
  level: number
  hunger: number
  foods: { carrot: number; apple: number; fish: number }
  lastFedAt?: number
}

export interface LessonLogEntry {
  at: number
  lessonId: string
  subject: SubjectId
  /** 是否本课首次通关（认真星只在首次发） */
  firstClear: boolean
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
  /** 上课时间线（含复习），用于日历与真·今日 */
  lessonLog: LessonLogEntry[]
  /** @deprecated 读时迁移到 pets */
  pet?: PetState
  pets: PetState[]
  activePetId: string | null
}

export type TtsEnginePref = 'webspeech' | 'piper'

export interface StoreV2 {
  version: 2
  users: { id: string; name: string; createdAt: number }[]
  currentUserId: string | null
  profiles: Record<string, ProfileV2>
  bgm: string
  ttsEngine: TtsEnginePref
  piperAutoPrefetch: boolean
}
