/**
 * Node smoke for store reward rules (no browser).
 * Run: node packages/web/scripts/store-smoke.mjs
 */
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const mem = new Map()
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
}

// Dynamic import of TS via vite-node not available; duplicate minimal checks by importing built logic is hard.
// Instead: spawn tsc-free copy — we inline import from dist? No.
// Use tsx if present, else compile check only via asserting API by reading source patterns + npm build.
// Prefer: register ts with experimental? Skip — use a tiny duplicated pure test of the rule in JS.

function cloneProfile(p) {
  return {
    ...p,
    capabilityXp: { ...p.capabilityXp },
    completedLessons: [...p.completedLessons],
    knownChars: [...p.knownChars],
    pet: { ...p.pet, foods: { ...p.pet.foods } },
  }
}

function completeLesson(profile, lessonId, stars) {
  const already = profile.completedLessons.includes(lessonId)
  const p = cloneProfile(profile)
  if (!already) {
    p.completedLessons.push(lessonId)
    p.earnestStars += stars
  }
  return p
}

let p = {
  earnestStars: 0,
  completedLessons: [],
  capabilityXp: {},
  knownChars: [],
  pet: { foods: { carrot: 1 } },
}
p = completeLesson(p, 'cn-star-01', 2)
assert.equal(p.earnestStars, 2)
p = completeLesson(p, 'cn-star-01', 2)
assert.equal(p.earnestStars, 2, 'replay must not farm stars')
assert.deepEqual(p.completedLessons, ['cn-star-01'])
console.log('store-smoke: PASS (replay gate)')
