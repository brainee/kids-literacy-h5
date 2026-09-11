# 文档索引

按主题分开；**开发/Agent 文档** 与 **产品/调研主题文档** 不混放。

**驱动 AI：** 根目录 [`AGENTS.md`](../AGENTS.md) · [`dev/sdlc/TASKS.md`](./dev/sdlc/TASKS.md)

## Dev（工程 · 流程 · 架构）

| 文档 | 说明 |
|------|------|
| [architecture.md](./dev/architecture.md) | `packages/web` 单项目 + legacy |
| [playbooks/kids-h5-pitfalls.md](./dev/playbooks/kids-h5-pitfalls.md) | **血泪清单**（迁移/BGM/儿童化/课程/星宝） |
| [sdlc/](./dev/sdlc/) | 阶段总览、实现计划、TASKS 看板 |
| [evidence/](./dev/evidence/) | 冒烟与验收证据 |
| 根 [`CHECKLIST.md`](../CHECKLIST.md) | 人工自测清单 |

## Product（产品主题）

| 文档 | 说明 | 状态 |
|------|------|------|
| [一期设计](./product/specs/2026-09-07-kids-thinking-literacy-design.md) | 识字+思维 | done |
| [1.1 设计](./product/specs/2026-09-09-reward-pet-tts-design.md) | TTS/录音/金币星宝/BGM | done |
| [1.2 设计](./product/specs/2026-09-09-multipackage-docs-design.md) | 文档分层；多包已收拢（见架构） | superseded-in-part |
| [2.0 能力乐园](./product/specs/2026-09-09-capability-lab-2.0-design.md) | 能力体系×三视角×模块化×技术演进 | approved |
| [2.0-B 声音与儿童化](./product/specs/2026-09-11-audio-piper-kids-ui-design.md) | BGM/重播/Piper 可选/UI | done |
| [多宠物](./product/specs/2026-09-11-multi-pet-design.md) | 自选种类/多只/递增认养费 | done |
| [今日情绪导读](./product/specs/2026-09-11-today-coach-design.md) | 进度/今日预期/星宝 + 点读 | done |

## Research（调研主题）

| 文档 | 说明 |
|------|------|
| [开源儿童应用调研](./research/2026-09-07-open-source-kids-apps.md) | 免费/开源/少折腾对标 |

## 代码

| 路径 | 职责 |
|------|------|
| [`packages/web`](../packages/web/) | 2.0 主应用（唯一当前项目） |
| [`packages/web/legacy`](../packages/web/legacy/) | 1.x ESM 遗留 |

`packages/` 目录预留未来第二项目（如 server）；当前不要再拆多包。

## 约定

1. 产品行为变更 → `docs/product/specs/`  
2. 工程流程 / Agent → `docs/dev/`  
3. 外部调研 → `docs/research/`  
4. 完成前：TASKS + `docs/dev/evidence/`
