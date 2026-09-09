# 2.0-A Implementation Plan — 能力乐园骨架

**规格：** [`../../product/specs/2026-09-09-capability-lab-2.0-design.md`](../../product/specs/2026-09-09-capability-lab-2.0-design.md)  
**目标：** 引入 Vite+React+TS；落地「今日 + 科目壳 + 课程 4 拍引擎 + 能力标签 + 年龄带 + 认真星」骨架；保留现有识字/思维/星宝可玩路径（迁移或桥接）。  
**部署：** `npm run build` → `dist/` → GitHub Pages / Cloudflare Pages。

---

### Task 1: 工程脚手架

- [x] Vite + React + TS（`packages/web`；曾用 `apps/web`）
- [x] `npm run build` / `dev`；Pages workflow + README
- [x] 旧 ESM：`legacy.html` + `packages/web/legacy`；CI 附带进 dist

### Task 2: 核心领域模型

- [x] `AgeBand` L0/L1/L2；首次自报 + 家长可改
- [x] Content schema + 示例课（语文「星」+ 思维找不同）
- [x] `capabilityTags` 结算写入 profile
- [x] 存档 `kidsThinkLit.v2`（读 v1 迁移）

### Task 3: Shell 信息架构

- [x] 路由：`/` `/age` `/today` `/subjects` `/lesson/:id` `/pet` `/parent`
- [x] 今日推荐 2–3 课（按年龄带）
- [x] 科目入口：语文 / 数学(占位) / 英语(占位) / 思维

### Task 4: 课程 4 拍引擎

- [x] 拍：listen → play → speak → review
- [x] Feature：`choose` 接通
- [x] 完成课 → 认真星 + 能力反馈一句话

### Task 5: 星宝与认真星

- [x] 经济：认真星 ← 完成课；喂养扣认真星
- [x] 迁移旧 `coins` → `coinsLegacy` + 换算认真星

### Task 6: 迁移现网玩法

- [x] 示例识字/思维进 4 拍（完整 1.x 字库迁移留给后续）
- [x] 思维挂 `thinking` 科目
- [ ] 拟人 TTS / BGM 全量迁入（本阶段仅基础 `speak`）— 记入后续

### Task 7: 门禁

- [x] `npm run build` 通过
- [x] 旅程冒烟清单：`docs/dev/evidence/smoke-2.0a-2026-09-09.md`
- [x] 更新 AGENTS.md（允许 Vite）+ TASKS

---

**非目标（本阶段不做）：** 数学/英语完整课包、云同步、云 TTS。
