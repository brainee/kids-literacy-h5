# 儿童思维识字 H5 Implementation Plan

> **For agentic workers:** Implement task-by-task; checkboxes track progress.

**Goal:** 交付可本地打开、可静态托管的一期儿童思维+识字 H5。

**Architecture:** 单文件 `index.html`；LocalStorage；Web Speech + Web Audio。

**Tech Stack:** HTML5, Tailwind CDN, vanilla JS

---

### Task 1: 壳与路由

- [x] Create `index.html` 多屏切换（用户/主页/识字/思维/测验/结果）
- [x] 移动端适配、禁长按选中、按钮 active 反馈

### Task 2: 存储与用户

- [x] LocalStorage schema + 预置星星/月月
- [x] 新增用户、切换、数据隔离、欢迎语

### Task 3: 识字与记忆

- [x] 字库 + level/错题加权
- [x] 读字、录音、选择题、认识/不认识、测验报告

### Task 4: 思维乐园

- [x] 观察 / 分类 / 排序 / 规律 / 表达 多关卡

### Task 5: BGM / TTS / 部署文档

- [x] 语音 ducking + 程序化 BGM
- [x] README + CHECKLIST + 自测证据
