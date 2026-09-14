# AGENTS.md — 如何驱动 AI 开发本仓库

面向 Cursor / 其他 Agent。**读完再动手。**  
人类 Owner 用自然语言下任务；Agent 必须按本文流程：规格 → 计划 → 实现 → 证据。

## 0. 项目是什么

- **产品**：3–8 岁儿童「识字 + 思维（→数学/英语）」能力乐园 H5
- **形态（2.0）：** `packages/web` = **Vite + React + TypeScript**；`npm run build` 出静态站
- **形态（1.x 遗留）：** 根目录 `legacy.html` + `packages/web/legacy`（单树 ESM，迁移期）
- **packages/ 约定：** 预留给未来多项目（如 server）；**当前仅 `packages/web` 一个项目**，勿再拆 `@kids/*` 多包
- **数据**：`localStorage`（`kidsThinkLit.v2`，可读 v1 迁移），不上传
- **音频**：Web Speech（TTS）+ Web Audio（BGM/音效）；麦克风本地录音不上传
- **部署**：GitHub Pages（Actions 构建 `packages/web/dist`，base `/kids-literacy-h5/`）
- **仓库路径**：`/Users/zolad/work/app/yirenge/kids-literacy-h5`
- **MOSS 项目层**：`.moss-twin/` → `~/.agents/projects/kids-literacy-h5/`

文档总索引：`docs/README.md`（**dev / product / research** 三分）。  
架构：`docs/dev/architecture.md`。任务看板：`docs/dev/sdlc/TASKS.md`。  
冒烟证据：`docs/dev/evidence/`。

## 1. 强制工作流（不可跳）

```text
Owner 意图
  → 产品行为：docs/product/specs/
  → 工程/Agent：docs/dev/
  → 调研：docs/research/
  → 登记 docs/dev/sdlc/TASKS.md
  → 改 packages/web（主代码）
  → 自测 + docs/dev/evidence/
  → （Owner 要求时）commit / push
```

| 禁止 | 说明 |
|------|------|
| 只改代码不写 docs | 不算落地 |
| 以 `.cursor/plans` 为唯一存档 | 必须进 `docs/` |
| 无 evidence 宣称完成 | 视为未完成 |
| 擅自引入后端 / 云 TTS / 账号体系 | 除非新规格批准 |
| 无视 `docs/dev/architecture.md` 边界 | 禁止 |
| 为「看起来模块化」再拆 packages 多包 | 仅当未来真正有第二运行时（如 server）再新增项目 |

> **已批准：** 2.0 使用 Vite 构建 + 静态托管（见 `docs/product/specs/2026-09-09-capability-lab-2.0-design.md`）。

## 2. 任务如何记录

看板：[`docs/dev/sdlc/TASKS.md`](docs/dev/sdlc/TASKS.md)

## 3. 怎么对 Agent 下指令

有效：「按 TASKS 做 T-0xx」「先写 product spec 再实现 packages/web」。  
低效：「优化一下」「顺便上云」。

## 4. Agent 行为清单

1. 读 `AGENTS.md` → **§7 血泪清单** → `docs/dev/playbooks/kids-h5-pitfalls.md` → `TASKS.md` → 相关 spec → `packages/web`  
2. 本地预览 2.0：`cd packages/web && npm install && npm run dev`  
3. 本地预览 1.x：`python3 -m http.server` 打开 `/legacy.html`（建议迁完内容后删除双轨）  
4. 完成前：`cd packages/web && npm run build`（+ `npm test`）+ 冒烟写入 `docs/dev/evidence/`  
5. 更新 TASKS 状态  
6. 被 Owner 同一问题追问第二次 → **立刻**把教训写进 §7 / playbook，再修产品  

## 5. 代码地图（速查）

| 路径 | 职责 |
|------|------|
| `packages/web` | 2.0 主应用（路由 / 今日 / 4 拍课 / 认真星 / 星宝） |
| `packages/web/legacy` | 1.x ESM 遗留单树 |
| `legacy.html` | 1.x 入口壳 |

## 6. 当前基线

- 一期 + 1.1 + 1.2 done；多包已收拢为 `packages/web`  
- **2.0-A**：Vite 骨架 + 年龄带 + 认真星 + 示例课（见 T-041）  
- **2.0-B+**：BGM/重播/Piper 可选、说一说真录音、星宝商店+多宠（见 T-045～T-048）

## 7. 血泪清单（Owner 纠偏 · 不要再提醒）

详细版：[`docs/dev/playbooks/kids-h5-pitfalls.md`](docs/dev/playbooks/kids-h5-pitfalls.md)

1. **迁功能 = 迁完整玩法**，禁止收成空壳按钮（星宝必须有商店/背包/喂养/庆祝，可用认真星替代金币）。  
2. **儿童视听是交付标准**：大图案、音效、动效、可回退；不是「以后 polish」。  
3. **BGM ≠ 下载资源**：Web Audio 本机合成；手势内 unlock + silent kick；TTS/回前台后 `ensureBgmPlaying()`；验收以「切曲后真能听到旋律」为准。  
   - **关闭**必须硬停节点 + `bgmGain=0`；TTS 结束不得把已关闭的 BGM 拉回音量。  
   - **切曲**必须听得出差别（音色/节奏/音高都不同）；不要四种都用差不多的正弦琶音。  
4. **说一说**：开始说 → 录音+音量检测 → 回放 → 再下一步；禁止「我说完了」空点。  
5. **课程可回上一拍**；每拍可「再听一遍」。收尾「想一想」用**疑问语气 + 再选一次**（主动回忆），不要直接宣告「你会了」。  
6. **多宠 / 每孩独立**：最多 3 只、认养递增价、切换与喂养有反馈。  
7. 修过的 bug **本机复测**再写 evidence；勿无 build 代替玩法验收。
