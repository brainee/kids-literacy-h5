# 任务看板（TASKS）

> 规则见根目录 [`AGENTS.md`](../../../AGENTS.md)。  
> 文档分层：[`docs/README.md`](../../README.md)  
> 证据目录：[`docs/dev/evidence/`](../evidence/)

## 进行中 / 待办

| ID | 标题 | 状态 | 规格 | 计划 | 证据 / 备注 |
|----|------|------|------|------|-------------|
| T-049 | 今日情绪导读：进度/预期/星宝 + 点读 | done | [规格](../../product/specs/2026-09-11-today-coach-design.md) | — | [`../evidence/smoke-2026-09-11-today-coach.md`](../evidence/smoke-2026-09-11-today-coach.md) |
| T-051 | Review 跟进：点读整句恢复 + 短提示 | done | [review](../evidence/review-2026-09-14.md) | — | 听整句打开；文案缩短 |
| T-050 | 上课日历 + 家长阶段统计 | todo | （待规格） | — | Owner 已提需求；含真·今日进度 |
| T-048 | 多宠自选：每人多只、递增费用、儿童化视听 | done | [规格](../../product/specs/2026-09-11-multi-pet-design.md) | — | PetPage 认养/切换 |
| T-047 | 恢复星宝商店/背包/喂养交互（认真星经济） | done | 2.0 规格星宝 | — | PetPage 商店+背包 |
| T-046 | 修 BGM 必播 + 上一拍 + 说一说录音检测 | done | Owner 复测 | — | [`../evidence/smoke-2026-09-11-bgm-speak-retest.md`](../evidence/smoke-2026-09-11-bgm-speak-retest.md) |
| T-045 | 2.0-B 声音（BGM/重播/Piper）+ 儿童化 UI | done | [规格](../../product/specs/2026-09-11-audio-piper-kids-ui-design.md) | [计划](./2026-09-11-audio-piper-kids-ui-plan.md) | [`../evidence/smoke-2026-09-11-audio-piper-ui.md`](../evidence/smoke-2026-09-11-audio-piper-ui.md) |
| T-044 | 课内提示句点读（点一个读一个） | done | Owner 口述 | — | `packages/web/src/ui/TapRead.tsx` |
| T-043 | review 修复（刷星/不可变 store）；**撤顶层 package.json** | done | Owner 问询 | — | [`../evidence/smoke-2026-09-09-root-review.md`](../evidence/smoke-2026-09-09-root-review.md) |
| T-042 | 收拢为 packages/web 单项目 + evidence 入 docs | done | Owner 口述 | — | [`../evidence/smoke-2026-09-09-monopackage.md`](../evidence/smoke-2026-09-09-monopackage.md) |
| T-040 | 2.0 能力乐园规格 | approved | [2.0 设计](../../product/specs/2026-09-09-capability-lab-2.0-design.md) | — | Owner OK 已锁 4 项 |
| T-041 | 2.0-A 骨架（Vite+React+课程引擎） | done | 同上 | [2.0-A 计划](./2026-09-09-capability-lab-2.0a-plan.md) | [`../evidence/smoke-2.0a-2026-09-09.md`](../evidence/smoke-2.0a-2026-09-09.md) |
| T-030 | 1.2 多包代码 + 文档分层 | done | [1.2 设计](../../product/specs/2026-09-09-multipackage-docs-design.md) | [1.2 计划](./2026-09-09-multipackage-docs-plan.md) | [`../evidence/smoke-2026-09-09-mp.md`](../evidence/smoke-2026-09-09-mp.md)；多包已收拢见 T-042 |
| T-020 | 本机人工确认 BGM 听感 | todo | [1.1](../../product/specs/2026-09-09-reward-pet-tts-design.md) | [1.1 计划](./2026-09-09-reward-pet-tts-plan.md) | |
| T-021 | 扩充字库与思维关卡 | todo | （未开规格） | — | 改 `packages/web`（2.0 content 或 legacy） |
| T-022 | 数学模块一期 | todo | （未开规格） | — | 在 `packages/web` 内扩展，勿新建 npm 包 |
| T-023 | 英语模块一期 | todo | （未开规格） | — | 同上 |
| T-024 | 录音 IndexedDB | todo | （未开规格） | — | |

## 已完成（近期）

| ID | 标题 | 状态 | 规格 | 计划 | 证据 |
|----|------|------|------|------|------|
| T-010 | 一期交付 | done | [一期](../../product/specs/2026-09-07-kids-thinking-literacy-design.md) | [一期计划](./2026-09-07-implementation-plan.md) | [`../evidence/smoke-2026-09-07.md`](../evidence/smoke-2026-09-07.md) |
| T-011 | GitHub Pages | done | README | — | pages URL |
| T-012 | 开源调研归档 | done | — | — | `docs/research/…` |
| T-013–T-015 | 1.1 TTS/录音/奖励/BGM | done | [1.1](../../product/specs/2026-09-09-reward-pet-tts-design.md) | [1.1 计划](./2026-09-09-reward-pet-tts-plan.md) | [`../evidence/smoke-2026-09-09.md`](../evidence/smoke-2026-09-09.md) |
| T-016 | docs 索引 | done | — | — | `docs/README.md` |
| T-017 | MOSS bootstrap | done | `.moss-twin/ssot.md` | — | owner 侧 projects |

## 如何新增

1. 下一 `T-0xx`  
2. 产品 → `docs/product/specs`；工程 → `docs/dev/`  
3. 改 `packages/web`  
4. done 时填 `docs/dev/evidence/`
