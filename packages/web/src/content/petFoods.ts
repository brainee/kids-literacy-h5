export const PET_FOODS = [
  { id: 'carrot' as const, name: '胡萝卜', emoji: '🥕', price: 2, hunger: 18 },
  { id: 'apple' as const, name: '苹果', emoji: '🍎', price: 3, hunger: 28 },
  { id: 'fish' as const, name: '小鱼干', emoji: '🐟', price: 4, hunger: 40 },
]

export type FoodId = (typeof PET_FOODS)[number]['id']

export const PET_KINDS = [
  {
    id: 'chick' as const,
    name: '小鸡',
    emoji: '🐥',
    sad: '🐤',
    mid: '🐣',
    happy: '🐥',
    color: '#ffd166',
    blurb: '软软的，爱吃小米和胡萝卜',
  },
  {
    id: 'bunny' as const,
    name: '小兔',
    emoji: '🐰',
    sad: '🐇',
    mid: '🐰',
    happy: '🐰',
    color: '#fbcfe8',
    blurb: '蹦蹦跳跳，最爱胡萝卜',
  },
  {
    id: 'kitty' as const,
    name: '小猫',
    emoji: '🐱',
    sad: '😺',
    mid: '😸',
    happy: '😻',
    color: '#fdba74',
    blurb: '喵喵叫，喜欢小鱼干',
  },
  {
    id: 'puppy' as const,
    name: '小狗',
    emoji: '🐶',
    sad: '🐕',
    mid: '🐶',
    happy: '🐶',
    color: '#bfdbfe',
    blurb: '摇尾巴，陪你上课最开心',
  },
  {
    id: 'panda' as const,
    name: '熊猫',
    emoji: '🐼',
    sad: '🐻‍❄️',
    mid: '🐼',
    happy: '🐼',
    color: '#d1fae5',
    blurb: '圆滚滚，慢慢吃也很可爱',
  },
]

export type PetKindId = (typeof PET_KINDS)[number]['id']

/** 第 n 只（0-based）认养费用：第 1 只免费，越多越贵 */
export function adoptCost(ownedCount: number) {
  if (ownedCount <= 0) return 0
  if (ownedCount === 1) return 5
  if (ownedCount === 2) return 10
  return 999
}

export const MAX_PETS = 3

export function kindMeta(kind: PetKindId) {
  return PET_KINDS.find((k) => k.id === kind) || PET_KINDS[0]
}

export function petFace(kind: PetKindId, hunger: number) {
  const k = kindMeta(kind)
  if (hunger >= 80) return k.happy
  if (hunger >= 45) return k.mid
  return k.sad
}

export function petMood(hunger: number) {
  if (hunger >= 80) return '吃得好饱，好开心！'
  if (hunger >= 45) return '还不错，再喂一点更好'
  return '有点饿啦，想吃东西'
}
