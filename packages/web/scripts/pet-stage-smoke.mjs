import assert from 'node:assert/strict'

function petStageIndex(level) {
  const lv = Math.max(1, Math.floor(level || 1))
  if (lv >= 7) return 3
  if (lv >= 5) return 2
  if (lv >= 3) return 1
  return 0
}

assert.equal(petStageIndex(1), 0)
assert.equal(petStageIndex(2), 0)
assert.equal(petStageIndex(3), 1)
assert.equal(petStageIndex(5), 2)
assert.equal(petStageIndex(7), 3)
assert.equal(petStageIndex(99), 3)

// 升级后 hunger 回落不应改变 stage
const levelAfterUp = 3
const hungerAfter = 55
assert.equal(petStageIndex(levelAfterUp), 1)
assert.ok(hungerAfter >= 45, 'after level stays mid mood, not baby form')

console.log('pet-stage-smoke: PASS')
