import { getActivePet } from '../domain/store'
import type { ProfileV2 } from '../domain/types'
import { petFace, petMood } from './petFoods'

export type TodayCoach = {
  lines: string[]
  face: string
  petHref: boolean
  doneToday: number
  goalToday: number
  knownCount: number
  lessonCount: number
}

/** 今日情绪导读文案（本地进度 + 星宝心情） */
export function buildTodayCoach(
  profile: ProfileV2,
  todayLessonIds: string[],
): TodayCoach {
  const goalToday = Math.max(1, todayLessonIds.length)
  const doneToday = todayLessonIds.filter((id) => profile.completedLessons.includes(id)).length
  const knownCount = profile.knownChars.length
  const lessonCount = profile.completedLessons.length
  const pet = getActivePet(profile)
  const remain = Math.max(0, goalToday - doneToday)

  const lines: string[] = []
  lines.push(`${profile.name}，今天也来啦。你真棒。`)

  if (knownCount > 0 || lessonCount > 0) {
    const bits: string[] = []
    if (knownCount > 0) bits.push(`会认 ${knownCount} 个字`)
    if (lessonCount > 0) bits.push(`上完 ${lessonCount} 节课`)
    lines.push(`你已经${bits.join('，')}，一点一点在变厉害。`)
  } else {
    lines.push('第一次来也很棒。我们慢慢听、慢慢玩。')
  }

  if (doneToday >= goalToday) {
    lines.push(`今天的 ${goalToday} 节都完成啦。可以休息，也可以去看看星宝。`)
  } else if (doneToday > 0) {
    lines.push(`今天想一起上 ${goalToday} 节，你已经完成 ${doneToday} 节，还差 ${remain} 节。`)
  } else {
    lines.push(`今天咱们一起上 ${goalToday} 节小课，认真听就会有认真星。`)
  }

  let face = '⭐'
  if (pet) {
    face = petFace(pet.kind, pet.hunger)
    lines.push(`${pet.name}，${petMood(pet.hunger)}。学完可以去喂它哦。`)
  } else {
    face = '🥚'
    lines.push('星宝还在等你认养。攒认真星，去迎一只小伙伴吧。')
  }

  return {
    lines,
    face,
    petHref: true,
    doneToday,
    goalToday,
    knownCount,
    lessonCount,
  }
}
