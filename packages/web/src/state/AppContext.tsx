import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AgeBand, CapabilityTag, PetKindId, StoreV2, TtsEnginePref } from '../domain/types'
import type { FoodId } from '../content/petFoods'
import {
  addChild,
  adoptPet,
  buyPetFood,
  completeLesson,
  convertLegacyCoins,
  feedPet,
  getProfile,
  loadStore,
  saveStore,
  selectPet,
  setAgeBand,
} from '../domain/store'
import { ensureBgmPlaying, installBgmLifecycle, startBgm, unlockAudio } from '../lib/bgm'
import { scheduleIdlePiperPrefetch } from '../lib/piper'
import { setPreferredTtsEngine } from '../lib/speak'

type AppCtx = {
  store: StoreV2
  refresh: () => void
  selectUser: (id: string) => void
  setBand: (band: AgeBand) => void
  finishLesson: (id: string, tags: CapabilityTag[], stars: number, char?: string) => void
  buyFood: (foodId: FoodId) => { ok: boolean; message: string }
  feedFood: (foodId: FoodId) => { ok: boolean; message: string; leveled: boolean }
  adopt: (kind: PetKindId, name: string) => { ok: boolean; message: string }
  switchPet: (petId: string) => { ok: boolean; message: string }
  convertCoins: () => { ok: boolean; message: string }
  setBgm: (id: string) => Promise<boolean>
  setTtsEngine: (engine: TtsEnginePref) => void
  setPiperAutoPrefetch: (on: boolean) => void
  addUser: (name: string) => { ok: boolean; message: string }
  profile: ReturnType<typeof getProfile>
}

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreV2>(() => loadStore())

  useEffect(() => {
    setPreferredTtsEngine(store.ttsEngine)
  }, [store.ttsEngine])

  useEffect(() => {
    if (store.piperAutoPrefetch) scheduleIdlePiperPrefetch()
  }, [store.piperAutoPrefetch])

  useEffect(() => installBgmLifecycle(), [])

  useEffect(() => {
    const kick = () => {
      if (store.bgm && store.bgm !== 'none') void ensureBgmPlaying()
    }
    window.addEventListener('pointerdown', kick, { once: true })
    return () => window.removeEventListener('pointerdown', kick)
  }, [store.bgm])

  const refresh = useCallback(() => setStore(loadStore()), [])

  const selectUser = useCallback((id: string) => {
    setStore((s) => {
      const next = { ...s, currentUserId: id }
      saveStore(next)
      return next
    })
  }, [])

  const setBand = useCallback((band: AgeBand) => {
    setStore((s) => setAgeBand(s, band))
  }, [])

  const finishLesson = useCallback(
    (id: string, tags: CapabilityTag[], stars: number, char?: string) => {
      setStore((s) => completeLesson(s, id, tags, stars, char))
    },
    [],
  )

  const buyFood = useCallback((foodId: FoodId) => {
    const r = buyPetFood(loadStore(), foodId)
    setStore(r.store)
    return { ok: r.ok, message: r.message }
  }, [])

  const feedFood = useCallback((foodId: FoodId) => {
    const r = feedPet(loadStore(), foodId)
    setStore(r.store)
    return { ok: r.ok, message: r.message, leveled: r.leveled }
  }, [])

  const adopt = useCallback((kind: PetKindId, name: string) => {
    const r = adoptPet(loadStore(), kind, name)
    setStore(r.store)
    return { ok: r.ok, message: r.message }
  }, [])

  const switchPet = useCallback((petId: string) => {
    const r = selectPet(loadStore(), petId)
    setStore(r.store)
    return { ok: r.ok, message: r.message }
  }, [])

  const convertCoins = useCallback(() => {
    const r = convertLegacyCoins(loadStore())
    setStore(r.store)
    return { ok: r.ok, message: r.message }
  }, [])

  const setBgm = useCallback(async (id: string) => {
    const unlocked = await unlockAudio()
    if (!unlocked && id !== 'none') return false
    const ok = await startBgm(id)
    setStore((s) => {
      const next = { ...s, bgm: id }
      saveStore(next)
      return next
    })
    return ok
  }, [])

  const setTtsEngine = useCallback((engine: TtsEnginePref) => {
    setPreferredTtsEngine(engine)
    setStore((s) => {
      const next = { ...s, ttsEngine: engine }
      saveStore(next)
      return next
    })
  }, [])

  const setPiperAutoPrefetch = useCallback((on: boolean) => {
    setStore((s) => {
      const next = { ...s, piperAutoPrefetch: on }
      saveStore(next)
      return next
    })
    if (on) scheduleIdlePiperPrefetch()
  }, [])

  const addUser = useCallback((name: string) => {
    const r = addChild(loadStore(), name)
    setStore(r.store)
    return { ok: r.ok, message: r.message }
  }, [])

  const profile = getProfile(store)

  const value = useMemo(
    () => ({
      store,
      refresh,
      selectUser,
      setBand,
      finishLesson,
      buyFood,
      feedFood,
      adopt,
      switchPet,
      convertCoins,
      setBgm,
      setTtsEngine,
      setPiperAutoPrefetch,
      addUser,
      profile,
    }),
    [
      store,
      refresh,
      selectUser,
      setBand,
      finishLesson,
      buyFood,
      feedFood,
      adopt,
      switchPet,
      convertCoins,
      setBgm,
      setTtsEngine,
      setPiperAutoPrefetch,
      addUser,
      profile,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp outside provider')
  return v
}
