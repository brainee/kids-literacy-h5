import { getActivePet } from '../domain/store'
import { countTodayProgress } from '../domain/progress'
import type { ProfileV2 } from '../domain/types'
import { petMood, petStageFace } from './petFoods'

export type TodayCoach = {
  lines: string[]
  face: string
  petHref: boolean
  doneToday: number
  goalToday: number
  knownCount: number
  lessonCount: number
}

/** 今日情绪导读（短句；进度按日历日） */
export function buildTodayCoach(
  profile: ProfileV2,
  todayLessonIds: string[],
): TodayCoach {
  const goalToday = Math.max(1, todayLessonIds.length)
  const doneToday = countTodayProgress(profile.lessonLog || [], todayLessonIds)
  const knownCount = profile.knownChars.length
  const lessonCount = profile.completedLessons.length
  const pet = getActivePet(profile)
  const remain = Math.max(0, goalToday - doneToday)

  const lines: string[] = []
  lines.push(`${profile.name}，今天也来啦！`)

  if (knownCount > 0 || lessonCount > 0) {
    const bits: string[] = []
    if (knownCount > 0) bits.push(`会认${knownCount}字`)
    if (lessonCount > 0) bits.push(`上过${lessonCount}课`)
    lines.push(`你已经${bits.join('，')}，真棒！`)
  } else {
    lines.push('第一次来也很棒。')
  }

  if (doneToday >= goalToday) {
    lines.push(`今天${goalToday}节都完成啦！可以休息。`)
  } else if (doneToday > 0) {
    lines.push(`今天${goalToday}节，还差${remain}节。`)
  } else {
    lines.push(`今天一起上${goalToday}节小课。`)
  }

  let face = '⭐'
  if (pet) {
    face = petStageFace(pet.kind, pet.level)
    lines.push(`${pet.name}，${petMood(pet.hunger)}`)
  } else {
    face = '🥚'
    lines.push('去迎一只星宝吧！')
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
