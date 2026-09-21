export const PET_FOODS = [
  { id: 'carrot' as const, name: '胡萝卜', emoji: '🥕', price: 2, hunger: 18 },
  { id: 'apple' as const, name: '苹果', emoji: '🍎', price: 3, hunger: 28 },
  { id: 'fish' as const, name: '小鱼干', emoji: '🐟', price: 4, hunger: 40 },
]

export type FoodId = (typeof PET_FOODS)[number]['id']

/**
 * stages：随等级变丰富（养成惯例：形态看等级，心情看饱食）。
 * sad/mid/happy：心情角标，不覆盖主形态。
 */
export const PET_KINDS = [
  {
    id: 'chick' as const,
    name: '小鸡',
    emoji: '🐥',
    stages: ['🐤', '🐣', '🐥', '🐔'],
    sad: '😢',
    mid: '😊',
    happy: '🤩',
    color: '#ffd166',
    blurb: '软软的，爱吃小米和胡萝卜',
  },
  {
    id: 'bunny' as const,
    name: '小兔',
    emoji: '🐰',
    stages: ['🐰', '🐇', '🐰', '🐰'],
    sad: '😢',
    mid: '😊',
    happy: '🤩',
    color: '#fbcfe8',
    blurb: '蹦蹦跳跳，最爱胡萝卜',
  },
  {
    id: 'kitty' as const,
    name: '小猫',
    emoji: '🐱',
    stages: ['🐱', '😺', '😸', '😻'],
    sad: '😢',
    mid: '😊',
    happy: '🤩',
    color: '#fdba74',
    blurb: '喵喵叫，喜欢小鱼干',
  },
  {
    id: 'puppy' as const,
    name: '小狗',
    emoji: '🐶',
    stages: ['🐶', '🐕', '🐕', '🦮'],
    sad: '😢',
    mid: '😊',
    happy: '🤩',
    color: '#bfdbfe',
    blurb: '摇尾巴，陪你上课最开心',
  },
  {
    id: 'panda' as const,
    name: '熊猫',
    emoji: '🐼',
    stages: ['🐼', '🐼', '🐻‍❄️', '🐼'],
    sad: '😢',
    mid: '😊',
    happy: '🤩',
    color: '#d1fae5',
    blurb: '圆滚滚，慢慢吃也很可爱',
  },
] as const

export type PetKindId = (typeof PET_KINDS)[number]['id']

/** 第 n 只（0-based）认养费用：第 1 只免费，越多越贵 */
export function adoptCost(ownedCount: number) {
  if (ownedCount <= 0) return 0
  if (ownedCount === 1) return 5
  if (ownedCount === 2) return 10
  return 999
}

export const MAX_PETS = 3

/** 升级后回落到「还行」档，避免刚进化却显饿 */
export const HUNGER_AFTER_LEVEL = 55

export function kindMeta(kind: PetKindId) {
  return PET_KINDS.find((k) => k.id === kind) || PET_KINDS[0]
}

/** 0 宝宝 · 1 少年 · 2 成长 · 3 闪亮 */
export function petStageIndex(level: number) {
  const lv = Math.max(1, Math.floor(level || 1))
  if (lv >= 7) return 3
  if (lv >= 5) return 2
  if (lv >= 3) return 1
  return 0
}

export function petStageLabel(level: number) {
  return ['宝宝', '少年', '成长', '闪亮'][petStageIndex(level)]
}

/** 升到下一形态还差几级；已是闪亮则 0 */
export function levelsToNextStage(level: number) {
  const lv = Math.max(1, Math.floor(level || 1))
  if (lv >= 7) return 0
  if (lv >= 5) return 7 - lv
  if (lv >= 3) return 5 - lv
  return 3 - lv
}

export type MoodId = 'sad' | 'mid' | 'happy'

export function petMoodId(hunger: number): MoodId {
  if (hunger >= 80) return 'happy'
  if (hunger >= 45) return 'mid'
  return 'sad'
}

/** 主形态：只看等级 */
export function petStageFace(kind: PetKindId, level: number) {
  const k = kindMeta(kind)
  const i = petStageIndex(level)
  return k.stages[i] || k.emoji
}

/** 心情角标：只看饱食 */
export function petMoodBadge(hunger: number) {
  const id = petMoodId(hunger)
  if (id === 'happy') return '🤩'
  if (id === 'mid') return '😊'
  return '😢'
}

/**
 * 展示主脸：优先等级形态。
 * 新用法 `petFace(kind, level, hunger)`；旧用法 `petFace(kind, hunger)` 仍可读。
 */
export function petFace(kind: PetKindId, levelOrHunger: number, hunger?: number) {
  if (typeof hunger === 'number') {
    return petStageFace(kind, levelOrHunger)
  }
  // 旧调用无 level：用饱食粗映射到阶段，避免崩
  const h = levelOrHunger
  const k = kindMeta(kind)
  if (h >= 80) return k.stages[2] || k.emoji
  if (h >= 45) return k.stages[1] || k.emoji
  return k.stages[0] || k.emoji
}

export function petMood(hunger: number) {
  if (hunger >= 80) return '吃得好饱，好开心！'
  if (hunger >= 45) return '还不错，再喂一点更好'
  return '有点饿啦，想吃东西'
}

export function petDecor(level: number): string[] {
  const s = petStageIndex(level)
  if (s >= 3) return ['⭐', '✨', '👑']
  if (s >= 2) return ['✨', '⭐']
  if (s >= 1) return ['✨']
  return []
}
