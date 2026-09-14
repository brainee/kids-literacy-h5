# 冒烟 · BGM 关闭与切曲可辨

**日期：** 2026-09-11  
**命令：** `cd packages/web && npm test && npm run build`

## 根因

1. 关闭后 TTS `duckBgm(false)` 仍把 `bgmGain` 拉回 0.28；若节点未净停会像「关不掉」。
2. 四种曲风几乎都是相近正弦音阶，听感像「就一种」。

## 修复

- `silenceBgm()`：停节点 + gen 作废旧 tick + gain=0
- `liveBgmLevel()`：wantedStyle=none 时恒为 0
- 曲风引擎：box 慢高音 / kids 跳音+五度 / game 方波 / pop 锯齿切分
- 家长角：关音乐单独文案；切曲先听 0.9s 再旁白

## 人工验收（Owner）

- [ ] 开八音盒 → 关：旋律停（可听一句旁白「关掉啦」）
- [ ] 依次切童趣 / 小游戏 / 轻快：听感明显不同
- [ ] 旁白结束后，已关闭的不会又响起来
