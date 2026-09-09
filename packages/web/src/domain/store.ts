import type { AgeBand, CapabilityTag, ProfileV2, StoreV2 } from './types'

const KEY = 'kidsThinkLit.v2'
const LEGACY_KEY = 'kidsThinkLit.v1'

function uid() {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function defaultPet() {
  return {
    name: '星宝',
    level: 1,
    hunger: 20,
    foods: { carrot: 1, apple: 0, fish: 0 },
  }
}

export function defaultProfile(name = '小朋友'): ProfileV2 {
  return {
    version: 2,
    name,
    ageBand: null,
    earnestStars: 0,
    coinsLegacy: 0,
    capabilityXp: {},
    completedLessons: [],
    knownChars: [],
    pet: defaultPet(),
  }
}

function cloneProfile(p: ProfileV2): ProfileV2 {
  return {
    ...p,
    capabilityXp: { ...p.capabilityXp },
    completedLessons: [...p.completedLessons],
    knownChars: [...p.knownChars],
    pet: {
      ...p.pet,
      foods: { ...p.pet.foods },
    },
  }
}

function withProfile(store: StoreV2, nextProfile: ProfileV2): StoreV2 {
  const id = store.currentUserId
  if (!id) return store
  const next: StoreV2 = {
    ...store,
    profiles: {
      ...store.profiles,
      [id]: nextProfile,
    },
  }
  saveStore(next)
  return next
}

function migrateFromV1(): StoreV2 | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return null
    const old = JSON.parse(raw) as {
      users?: { id: string; name: string; createdAt: number }[]
      currentUserId?: string | null
      profiles?: Record<
        string,
        {
          thinkStars?: number
          coins?: number
          pet?: ProfileV2['pet']
          charLevels?: Record<string, number>
        }
      >
      bgm?: string
    }
    if (!old.users?.length) return null
    const profiles: StoreV2['profiles'] = {}
    for (const u of old.users) {
      const p = old.profiles?.[u.id]
      const knownChars = p?.charLevels
        ? Object.keys(p.charLevels).filter((k) => (p.charLevels?.[k] || 0) >= 1)
        : []
      profiles[u.id] = {
        ...defaultProfile(u.name),
        earnestStars: Math.max(0, Math.floor((p?.coins || 0) / 2) + (p?.thinkStars || 0)),
        coinsLegacy: p?.coins || 0,
        knownChars,
        pet: p?.pet
          ? { ...defaultPet(), ...p.pet, foods: { ...defaultPet().foods, ...p.pet.foods } }
          : defaultPet(),
      }
    }
    return {
      version: 2,
      users: old.users,
      currentUserId: old.currentUserId ?? null,
      profiles,
      bgm: old.bgm || 'none',
    }
  } catch {
    return null
  }
}

export function loadStore(): StoreV2 {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as StoreV2
      if (parsed?.version === 2 && parsed.users) return parsed
    }
  } catch {
    /* fallthrough */
  }
  const migrated = migrateFromV1()
  if (migrated) {
    saveStore(migrated)
    return migrated
  }
  const a = uid()
  const b = uid()
  const store: StoreV2 = {
    version: 2,
    users: [
      { id: a, name: '星星', createdAt: Date.now() },
      { id: b, name: '月月', createdAt: Date.now() + 1 },
    ],
    currentUserId: null,
    profiles: {
      [a]: defaultProfile('星星'),
      [b]: defaultProfile('月月'),
    },
    bgm: 'none',
  }
  saveStore(store)
  return store
}

export function saveStore(store: StoreV2) {
  localStorage.setItem(KEY, JSON.stringify(store))
}

/** 只读；不存在则返回 null（不在 render 路径上写 store） */
export function getProfile(store: StoreV2): ProfileV2 | null {
  const id = store.currentUserId
  if (!id) return null
  return store.profiles[id] ?? null
}

export function completeLesson(
  store: StoreV2,
  lessonId: string,
  tags: CapabilityTag[],
  earnestStars: number,
  knownChar?: string,
): StoreV2 {
  const prev = getProfile(store)
  if (!prev) return store

  const already = prev.completedLessons.includes(lessonId)
  const p = cloneProfile(prev)

  if (!already) {
    p.completedLessons.push(lessonId)
    p.earnestStars += earnestStars
    for (const t of tags) {
      p.capabilityXp[t] = (p.capabilityXp[t] || 0) + 1
    }
    if (knownChar && !p.knownChars.includes(knownChar)) p.knownChars.push(knownChar)
  }

  return withProfile(store, p)
}

export function setAgeBand(store: StoreV2, band: AgeBand): StoreV2 {
  const prev = getProfile(store)
  if (!prev) return store
  const p = cloneProfile(prev)
  p.ageBand = band
  return withProfile(store, p)
}

export function feedPet(
  store: StoreV2,
  cost = 2,
): { store: StoreV2; ok: boolean; message: string } {
  const prev = getProfile(store)
  if (!prev) return { store, ok: false, message: '请先选择小朋友' }
  if (prev.earnestStars < cost) {
    return { store, ok: false, message: '认真星不够啦。先完成一课再来喂。' }
  }
  const carrot = prev.pet.foods.carrot || 0
  if (carrot <= 0) {
    return { store, ok: false, message: '没有胡萝卜啦。完成课程后再来看看。' }
  }

  const p = cloneProfile(prev)
  p.earnestStars -= cost
  p.pet.foods.carrot -= 1
  p.pet.hunger = Math.min(100, p.pet.hunger + 18)
  if (p.pet.hunger >= 100) {
    p.pet.level += 1
    p.pet.hunger = 35
    p.pet.foods.carrot += 1
  }
  const next = withProfile(store, p)
  return { store: next, ok: true, message: '星宝吃得好开心！' }
}
