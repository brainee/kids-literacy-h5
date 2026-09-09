# 任务看板（TASKS）

> 规则见根目录 [`AGENTS.md`](../../../AGENTS.md)。  
> 文档分层：[`docs/README.md`](../../README.md)

## 进行中 / 待办

| ID | 标题 | 状态 | 规格 | 计划 | 证据 / 备注 |
|----|------|------|------|------|-------------|
| T-030 | 1.2 多包代码 + 文档分层 | done | [1.2 设计](../../product/specs/2026-09-09-multipackage-docs-design.md) | [1.2 计划](./2026-09-09-multipackage-docs-plan.md) | `evidence/smoke-2026-09-09-mp.md` |
| T-020 | 本机人工确认 BGM 听感 | todo | [1.1](../../product/specs/2026-09-09-reward-pet-tts-design.md) | [1.1 计划](./2026-09-09-reward-pet-tts-plan.md) | |
| T-021 | 扩充字库与思维关卡 | todo | （未开规格） | — | 优先改 `@kids/literacy` / `@kids/think` |
| T-022 | 数学模块一期 | todo | （未开规格） | — | 宜新包 `@kids/math` |
| T-023 | 英语模块一期 | todo | （未开规格） | — | 宜新包 `@kids/english` |
| T-024 | 录音 IndexedDB | todo | （未开规格） | — | |

## 已完成（近期）

| ID | 标题 | 状态 | 规格 | 计划 | 证据 |
|----|------|------|------|------|------|
| T-010 | 一期交付 | done | [一期](../../product/specs/2026-09-07-kids-thinking-literacy-design.md) | [一期计划](./2026-09-07-implementation-plan.md) | `evidence/smoke-2026-09-07.md` |
| T-011 | GitHub Pages | done | README | — | pages URL |
| T-012 | 开源调研归档 | done | — | — | `docs/research/…` |
| T-013–T-015 | 1.1 TTS/录音/奖励/BGM | done | [1.1](../../product/specs/2026-09-09-reward-pet-tts-design.md) | [1.1 计划](./2026-09-09-reward-pet-tts-plan.md) | `evidence/smoke-2026-09-09.md` |
| T-016 | docs 索引 | done | — | — | `docs/README.md` |
| T-017 | MOSS bootstrap | done | `.moss-twin/ssot.md` | — | owner 侧 projects |

## 如何新增

1. 下一 `T-0xx`  
2. 产品 → `docs/product/specs`；工程 → `docs/dev/`  
3. 改对应 `packages/<name>`，更新包 README  
4. done 时填 evidence
