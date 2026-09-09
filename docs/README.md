# 文档索引

按主题分开；**开发/Agent 文档** 与 **产品/调研主题文档** 不混放。  
代码包文档跟包走：`packages/*/README.md`。

**驱动 AI：** 根目录 [`AGENTS.md`](../AGENTS.md) · [`dev/sdlc/TASKS.md`](./dev/sdlc/TASKS.md)

## Dev（工程 · 流程 · 架构）

| 文档 | 说明 |
|------|------|
| [architecture.md](./dev/architecture.md) | 多包 + 原生 ESM 架构 |
| [sdlc/](./dev/sdlc/) | 阶段总览、实现计划、TASKS 看板 |
| 根 [`CHECKLIST.md`](../CHECKLIST.md) / [`evidence/`](../evidence/) | 自测与证据 |

## Product（产品主题）

| 文档 | 说明 | 状态 |
|------|------|------|
| [一期设计](./product/specs/2026-09-07-kids-thinking-literacy-design.md) | 识字+思维 | done |
| [1.1 设计](./product/specs/2026-09-09-reward-pet-tts-design.md) | TTS/录音/金币星宝/BGM | done |
| [1.2 设计](./product/specs/2026-09-09-multipackage-docs-design.md) | 多包代码 + 文档分层 | implemented |

## Research（调研主题）

| 文档 | 说明 |
|------|------|
| [开源儿童应用调研](./research/2026-09-07-open-source-kids-apps.md) | 免费/开源/少折腾对标 |

## Packages（跟代码）

| 包 | 职责 |
|----|------|
| `@kids/core` | 存档 / profile |
| `@kids/audio` | BGM / sfx / unlock |
| `@kids/speech` | TTS |
| `@kids/literacy` | 字库与识字 |
| `@kids/think` | 思维关卡 |
| `@kids/quiz` | 测验 |
| `@kids/pet` | 金币 / 星宝 / 庆祝 |
| `@kids/app` | 组装与路由 |

## 旧路径

`docs/specs` · `docs/sdlc` · `docs/references` 仅保留迁移说明，指向新目录。

## 约定

1. 产品行为变更 → `docs/product/specs/`  
2. 工程流程/拆包/Agent → `docs/dev/`  
3. 外部调研 → `docs/research/`  
4. 包 API → `packages/<name>/README.md`  
5. 完成前：TASKS + evidence
