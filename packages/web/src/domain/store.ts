import type {
  AgeBand,
  CapabilityTag,
  LessonLogEntry,
  PetKindId,
  PetState,
  ProfileV2,
  StoreV2,
  SubjectId,
} from './types'
import { adoptCost, HUNGER_AFTER_LEVEL, MAX_PETS, PET_FOODS, type FoodId } from '../content/petFoods'

const KEY = 'kidsThinkLit.v2'
const LEGACY_KEY = 'kidsThinkLit.v1'

function uid() {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function makePet(kind: PetKindId, name: string): PetState {
  return {
    id: 'p_' + uid().slice(2),
    kind,
    name: name.trim().slice(0, 6) || '小伙伴',
    level: 1,
    hunger: 35,
    foods: { carrot: 1, apple: 0, fish: 0 },
    lastFedAt: Date.now(),
  }
}

/** 空栏：还没认养，等小孩自己选 */
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
    lessonLog: [],
    pets: [],
    activePetId: null,
  }
}

function normalizeProfile(raw: ProfileV2): ProfileV2 {
  let pets = Array.isArray(raw.pets) ? raw.pets.map((p) => ({ ...p, foods: { ...p.foods } })) : []
  if ((!pets.length || !raw.pets) && raw.pet) {
    const legacy = raw.pet as PetState & { kind?: PetKindId }
    pets = [
      {
        id: legacy.id || 'p_legacy',
        kind: legacy.kind || 'chick',
        name: legacy.name || '星宝',
        level: legacy.level || 1,
        hunger: legacy.hunger ?? 20,
        foods: { ...{ carrot: 1, apple: 0, fish: 0 }, ...legacy.foods },
        lastFedAt: legacy.lastFedAt,
      },
    ]
  }
  const activePetId =
    (raw.activePetId && pets.some((p) => p.id === raw.activePetId) && raw.activePetId) ||
    pets[0]?.id ||
    null
  return {
    ...raw,
    pets,
    activePetId,
    capabilityXp: { ...raw.capabilityXp },
    completedLessons: [...(raw.completedLessons || [])],
    knownChars: [...(raw.knownChars || [])],
    lessonLog: Array.isArray(raw.lessonLog)
      ? raw.lessonLog.map((e) => ({ ...e }))
      : [],
  }
}

function cloneProfile(p: ProfileV2): ProfileV2 {
  const n = normalizeProfile(p)
  return {
    ...n,
    pets: n.pets.map((pet) => ({ ...pet, foods: { ...pet.foods } })),
    lessonLog: n.lessonLog.map((e) => ({ ...e })),
  }
}

export function getActivePet(profile: ProfileV2): PetState | null {
  const n = normalizeProfile(profile)
  if (!n.activePetId) return null
  return n.pets.find((p) => p.id === n.activePetId) || n.pets[0] || null
}

function withProfile(store: StoreV2, nextProfile: ProfileV2): StoreV2 {
  const id = store.currentUserId
  if (!id) return store
  const next: StoreV2 = {
    ...store,
    profiles: {
      ...store.profiles,
      [id]: normalizeProfile(nextProfile),
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
          pet?: Partial<PetState>
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
      const base = defaultProfile(u.name)
      if (p?.pet) {
        const pet = makePet('chick', p.pet.name || '星宝')
        pet.level = p.pet.level || 1
        pet.hunger = p.pet.hunger ?? 20
        pet.foods = {
          carrot: p.pet.foods?.carrot ?? 1,
          apple: p.pet.foods?.apple ?? 0,
          fish: p.pet.foods?.fish ?? 0,
        }
        base.pets = [pet]
        base.activePetId = pet.id
      }
      profiles[u.id] = {
        ...base,
        earnestStars: Math.max(0, Math.floor((p?.coins || 0) / 2) + (p?.thinkStars || 0)),
        coinsLegacy: p?.coins || 0,
        knownChars,
      }
    }
    return {
      version: 2,
      users: old.users,
      currentUserId: old.currentUserId ?? null,
      profiles,
      bgm: old.bgm || 'none',
      ttsEngine: 'webspeech',
      piperAutoPrefetch: true,
    }
  } catch {
    return null
  }
}

function normalizeStore(parsed: StoreV2): StoreV2 {
  const profiles: StoreV2['profiles'] = {}
  for (const [id, p] of Object.entries(parsed.profiles || {})) {
    profiles[id] = normalizeProfile(p)
  }
  return {
    ...parsed,
    profiles,
    bgm: parsed.bgm || 'none',
    ttsEngine: parsed.ttsEngine === 'piper' ? 'piper' : 'webspeech',
    piperAutoPrefetch: parsed.piperAutoPrefetch !== false,
  }
}

export function loadStore(): StoreV2 {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as StoreV2
      if (parsed?.version === 2 && parsed.users) {
        const next = normalizeStore(parsed)
        saveStore(next)
        return next
      }
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
    ttsEngine: 'webspeech',
    piperAutoPrefetch: true,
  }
  saveStore(store)
  return store
}

export function saveStore(store: StoreV2) {
  localStorage.setItem(KEY, JSON.stringify(store))
}

export function getProfile(store: StoreV2): ProfileV2 | null {
  const id = store.currentUserId
  if (!id) return null
  const p = store.profiles[id]
  return p ? normalizeProfile(p) : null
}

export function completeLesson(
  store: StoreV2,
  lessonId: string,
  tags: CapabilityTag[],
  earnestStars: number,
  knownChar?: string,
  subject: SubjectId = 'chinese',
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
  const entry: LessonLogEntry = {
    at: Date.now(),
    lessonId,
    subject,
    firstClear: !already,
  }
  p.lessonLog.push(entry)
  // 防止无限膨胀：保留最近 400 条
  if (p.lessonLog.length > 400) p.lessonLog = p.lessonLog.slice(-400)
  return withProfile(store, p)
}

export function setAgeBand(store: StoreV2, band: AgeBand): StoreV2 {
  const prev = getProfile(store)
  if (!prev) return store
  const p = cloneProfile(prev)
  p.ageBand = band
  return withProfile(store, p)
}

export function adoptPet(
  store: StoreV2,
  kind: PetKindId,
  name: string,
): { store: StoreV2; ok: boolean; message: string } {
  const prev = getProfile(store)
  if (!prev) return { store, ok: false, message: '请先选择小朋友' }
  if (prev.pets.length >= MAX_PETS) {
    return { store, ok: false, message: `最多养 ${MAX_PETS} 只哦。先把它们喂得胖胖的吧。` }
  }
  const cost = adoptCost(prev.pets.length)
  if (prev.earnestStars < cost) {
    return {
      store,
      ok: false,
      message: `认养要 ${cost} 颗认真星。再上几课，更努力一点就能迎新伙伴啦。`,
    }
  }
  const pet = makePet(kind, name)
  const p = cloneProfile(prev)
  p.earnestStars -= cost
  p.pets.push(pet)
  p.activePetId = pet.id
  return {
    store: withProfile(store, p),
    ok: true,
    message: cost === 0 ? `${pet.name}来家里啦！` : `花了 ${cost}⭐，迎来${pet.name}！要更努力上课哦。`,
  }
}

export function selectPet(
  store: StoreV2,
  petId: string,
): { store: StoreV2; ok: boolean; message: string } {
  const prev = getProfile(store)
  if (!prev) return { store, ok: false, message: '请先选择小朋友' }
  const pet = prev.pets.find((x) => x.id === petId)
  if (!pet) return { store, ok: false, message: '找不到这只小伙伴。' }
  const p = cloneProfile(prev)
  p.activePetId = petId
  return { store: withProfile(store, p), ok: true, message: `来照顾${pet.name}啦。` }
}

export function buyPetFood(
  store: StoreV2,
  foodId: FoodId,
): { store: StoreV2; ok: boolean; message: string } {
  const prev = getProfile(store)
  const food = PET_FOODS.find((f) => f.id === foodId)
  const active = prev ? getActivePet(prev) : null
  if (!prev || !food) return { store, ok: false, message: '找不到这种食物。' }
  if (!active) return { store, ok: false, message: '先认养一只小动物吧。' }
  if (prev.earnestStars < food.price) {
    return { store, ok: false, message: '认真星不够哦。先去上课赚认真星，再来买。' }
  }
  const p = cloneProfile(prev)
  const pet = p.pets.find((x) => x.id === p.activePetId)
  if (!pet) return { store, ok: false, message: '先认养一只小动物吧。' }
  p.earnestStars -= food.price
  pet.foods[foodId] = (pet.foods[foodId] || 0) + 1
  return { store: withProfile(store, p), ok: true, message: `买到${food.name}啦。可以喂给${pet.name}。` }
}

export function feedPet(
  store: StoreV2,
  foodId: FoodId = 'carrot',
): { store: StoreV2; ok: boolean; message: string; leveled: boolean } {
  const prev = getProfile(store)
  const food = PET_FOODS.find((f) => f.id === foodId)
  if (!prev || !food) return { store, ok: false, message: '请先选择小朋友', leveled: false }
  const p = cloneProfile(prev)
  const pet = p.pets.find((x) => x.id === p.activePetId)
  if (!pet) return { store, ok: false, message: '先认养一只小动物吧。', leveled: false }
  if ((pet.foods[foodId] || 0) <= 0) {
    return { store, ok: false, message: '还没有这个食物。先去买一份吧。', leveled: false }
  }
  pet.foods[foodId] -= 1
  pet.hunger = Math.min(100, pet.hunger + food.hunger)
  pet.lastFedAt = Date.now()
  let leveled = false
  if (pet.hunger >= 100) {
    pet.level += 1
    // 形态由 level 决定；饱食回到「还行」，勿打回显饿
    pet.hunger = HUNGER_AFTER_LEVEL
    leveled = true
  }
  return {
    store: withProfile(store, p),
    ok: true,
    leveled,
    message: leveled
      ? `${pet.name}升级啦！现在是${pet.level}级，形态更棒了！`
      : `真香！${pet.name}吃得好开心。`,
  }
}

export function convertLegacyCoins(
  store: StoreV2,
): { store: StoreV2; ok: boolean; message: string } {
  const prev = getProfile(store)
  if (!prev) return { store, ok: false, message: '请先选择小朋友' }
  if (prev.coinsLegacy <= 0) return { store, ok: false, message: '没有可兑换的旧金币啦。' }
  const gain = Math.floor(prev.coinsLegacy / 2)
  if (gain <= 0) {
    return { store, ok: false, message: '金币还不够兑 1 颗认真星（2 币兑 1 星）。' }
  }
  const p = cloneProfile(prev)
  p.coinsLegacy -= gain * 2
  p.earnestStars += gain
  return { store: withProfile(store, p), ok: true, message: `兑好啦！得到 ${gain} 颗认真星。` }
}

export function addChild(
  store: StoreV2,
  name: string,
): { store: StoreV2; ok: boolean; message: string } {
  const n = name.trim().slice(0, 8)
  if (!n) return { store, ok: false, message: '先写上名字，好不好。' }
  if (store.users.some((u) => u.name === n)) {
    return { store, ok: false, message: '已经有这个名字啦。' }
  }
  const id = uid()
  const next: StoreV2 = {
    ...store,
    users: [...store.users, { id, name: n, createdAt: Date.now() }],
    profiles: { ...store.profiles, [id]: defaultProfile(n) },
    currentUserId: id,
  }
  saveStore(next)
  return { store: next, ok: true, message: `好呀，已添加${n}。快去选一只小动物吧。` }
}
