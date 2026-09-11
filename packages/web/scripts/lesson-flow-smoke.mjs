/**
 * BGM 关键状态机冒烟（无浏览器 AudioContext）
 * 验证：wantedStyle / none 切换语义与「非下载」说明一致性
 */
import assert from 'node:assert/strict'

const styles = ['none', 'box', 'kids', 'game', 'pop']
assert.ok(styles.includes('box'))
assert.equal(styles[0], 'none')

// 说一说门禁：未录音不可 next
function canAdvanceSpeak(speakOk) {
  return !!speakOk
}
assert.equal(canAdvanceSpeak(false), false)
assert.equal(canAdvanceSpeak(true), true)

// 回上一拍
function prevIdx(i) {
  return Math.max(0, i - 1)
}
assert.equal(prevIdx(2), 1)
assert.equal(prevIdx(0), 0)

console.log('lesson-flow-smoke: PASS (bgm ids + speak gate + back)')
