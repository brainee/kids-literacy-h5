import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AgeBand, CapabilityTag, StoreV2 } from '../domain/types'
import {
  completeLesson,
  feedPet,
  getProfile,
  loadStore,
  saveStore,
  setAgeBand,
} from '../domain/store'

type AppCtx = {
  store: StoreV2
  refresh: () => void
  selectUser: (id: string) => void
  setBand: (band: AgeBand) => void
  finishLesson: (id: string, tags: CapabilityTag[], stars: number, char?: string) => void
  feed: () => { ok: boolean; message: string }
  profile: ReturnType<typeof getProfile>
}

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreV2>(() => loadStore())

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

  const feed = useCallback(() => {
    const current = loadStore()
    // 以最新持久化为准，避免 StrictMode 双调用基于脏闭包
    const r = feedPet(current)
    setStore(r.store)
    return { ok: r.ok, message: r.message }
  }, [])

  const profile = getProfile(store)

  const value = useMemo(
    () => ({ store, refresh, selectUser, setBand, finishLesson, feed, profile }),
    [store, refresh, selectUser, setBand, finishLesson, feed, profile],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp outside provider')
  return v
}
