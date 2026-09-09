# AGENTS.md — 如何驱动 AI 开发本仓库

面向 Cursor / 其他 Agent。**读完再动手。**  
人类 Owner 用自然语言下任务；Agent 必须按本文流程：规格 → 计划 → 实现 → 证据。

## 0. 项目是什么

- **产品**：3–7 岁儿童「识字 + 思维」纯前端 H5（星星思维识字乐园）
- **形态**：**多包 + 原生 ESM**，零 npm 构建；入口 `index.html` → `packages/app/src/main.js`
- **数据**：仅 `localStorage`（`kidsThinkLit.v1`），不上传
- **音频**：Web Speech（TTS）+ Web Audio（BGM/音效）；麦克风本地录音不上传
- **部署**：GitHub Pages（根 `index.html`）；本地须用 HTTP 静态服务（ESM）
- **仓库路径**：`/Users/zolad/work/app/yirenge/kids-literacy-h5`
- **MOSS 项目层**：`.moss-twin/` → `~/.agents/projects/kids-literacy-h5/`

文档总索引：`docs/README.md`（**dev / product / research** 三分）。  
架构：`docs/dev/architecture.md`。任务看板：`docs/dev/sdlc/TASKS.md`。

## 1. 强制工作流（不可跳）

```text
Owner 意图
  → 产品行为：docs/product/specs/
  → 工程/拆包/Agent：docs/dev/
  → 调研：docs/research/
  → 包 API 说明：packages/<name>/README.md
  → 登记 docs/dev/sdlc/TASKS.md
  → 改对应 package（勿把一切塞回单文件）
  → 自测 + evidence/
  → （Owner 要求时）commit / push
```

| 禁止 | 说明 |
|------|------|
| 只改代码不写 docs | 不算落地 |
| 以 `.cursor/plans` 为唯一存档 | 必须进 `docs/` |
| 无 evidence 宣称完成 | 视为未完成 |
| 擅自引入 Vite/后端/云 TTS | 除非新规格批准 |
| 跨包循环依赖 / 无视 `docs/dev/architecture.md` 边界 | 禁止 |

## 2. 任务如何记录

看板：[`docs/dev/sdlc/TASKS.md`](docs/dev/sdlc/TASKS.md)

## 3. 怎么对 Agent 下指令

有效：「按 TASKS 做 T-0xx」「先写 product spec 再拆 `@kids/literacy`」。  
低效：「优化一下」「顺便上 React」。

## 4. Agent 行为清单

1. 读 `AGENTS.md` → `TASKS.md` → 相关 spec → 对应 `packages/*`  
2. 本地预览：`python3 -m http.server`（不要依赖 `file://` 跑 module）  
3. 完成前：语法检查 + 冒烟写入 `evidence/`  
4. 更新包 README（若 API 变了）与 TASKS 状态  

## 5. 包地图（速查）

| 包 | 职责 |
|----|------|
| `@kids/core` | state / store / dom |
| `@kids/audio` | BGM / sfx / unlock |
| `@kids/speech` | TTS |
| `@kids/literacy` | CHAR_BANK |
| `@kids/think` | THINK_LEVELS |
| `@kids/quiz` | 预留 |
| `@kids/pet` | 金币 / 星宝 / 庆祝 |
| `@kids/app` | 组装与 UI 流程 |

## 6. 当前基线

- 一期 + 1.1 功能 done  
- 1.2 多包 + 文档分层：见 `docs/product/specs/2026-09-09-multipackage-docs-design.md`
