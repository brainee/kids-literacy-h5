# 1.1 迭代 Implementation Plan — 拟人语音 / 录音闭环 / 答对奖励与星宝 / BGM

> **For agentic workers:** 按任务勾选；完成前必须跑测试门禁并写 `evidence/`。

**Goal:** 落地 [`../specs/2026-09-09-reward-pet-tts-design.md`](../specs/2026-09-09-reward-pet-tts-design.md)。  
**范围文件：** 主要 `index.html`；同步 `README.md` / `CHECKLIST.md` / `evidence/`。  
**约束：** 单文件、LocalStorage、Web Speech + Web Audio、无云 TTS。

---

### Task 0: BGM 无声修复（前置）

- [x] `unlockAudio()` await `AudioContext.resume`
- [x] `startBgm` 解锁后立即第一拍 + interval
- [x] 选曲先开 BGM 再短提示；`visibilitychange` 再 resume

### Task 1: 拟人 TTS

- [x] `pickVoice` 打分优选自然中文女声
- [x] `splitSpeakPhrases` + 句间停顿；默认 rate/pitch 幼教向
- [x] 口语文案替换（欢迎、答对、BGM、录音提示等）

### Task 2: 录音保存与回放

- [x] 引导语结束后再 `MediaRecorder.start`
- [x] `state.recordings[key]` 存 Blob URL；识字 / 表达可「听我的录音」
- [x] 去掉抢戏的「开始录音 / 录音结束」硬播报

### Task 3: 数据 — 金币与星宝

- [x] `defaultProfile` / `normalizeProfile`：`coins` + `pet`
- [x] 旧存档缺字段补齐，不丢 `charLevels` / `thinkStars`

### Task 4: 音效与庆祝

- [x] `sfx(correct|coin|feed|wrong|levelup)`（Web Audio）
- [x] `#celebrateLayer` + `celebrateCorrect({ coins, speakLine, el })`
- [x] 识字 / 思维 / 测验 / 「我认识」挂接发奖

### Task 5: 星宝屏

- [x] `screen-pet`：表情 / 等级 / 饱食度 / 商店 / 背包喂养
- [x] 主页入口「我的星宝」+ 金币展示

### Task 6: 测试门禁（必做）

- [x] Chrome CDP 冒烟：BGM store、答对金币+庆祝、星宝买喂持久化  
      → `evidence/smoke-2026-09-09.md`
- [x] 更新 `CHECKLIST.md` 系统项与自测记录
- [ ] 本机人工听感：八音盒点击后立即有旋律（环境相关，需有声设备）

---

## 来源

本计划由 Cursor Plan「答对奖励与宠物」落地进仓库，避免设计只留在 IDE 本地 plan 文件。
