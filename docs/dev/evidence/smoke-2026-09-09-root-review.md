# Smoke — root scripts + independent review fixes (2026-09-09)

## Answers logged
| Question | Answer |
|----------|--------|
| 顶层 package.json | **已撤回**（单包阶段不需要；理由见下） |
| legacy 必要吗 | **产品双轨不必要**；仅当还要 1.x 全量字库/思维/BGM/录音且尚未迁入 2.0 时暂留。等 Owner 确认后删除 |
| 此前是否独立 review/测试 | **否**（仅有 build）。本轮已补 |

## Independent review
Subagent verdict was **fix-first**. Fixed:
- 重玩刷认真星（`completeLesson` 已完成则不再发奖）
- store 不可变克隆 + `getProfile` 只读
- `feedPet` 不再白送胡萝卜
- CI 改为根目录 `npm ci`（单一 lockfile）

## Verification (this run)
| Check | Result |
|-------|--------|
| `cd packages/web && npm run build` | PASS（撤顶层后复测） |
| `npm test`（replay gate） | PASS |
| `vite preview` + `GET /kids-literacy-h5/` | PASS 200 + title（撤顶层前） |
| JS asset under base | PASS 200 |

## Why no root package.json (decision)
当前只有 `packages/web` 一个可运行包。根 workspace 会：多一份 lockfile、CI 与本地入口分叉、脚本只是转发。等出现真正第二运行时（如 server）再加 monorepo 顶层。

## Still not done
- 真浏览器点完 welcome→课→星宝（需 Owner 或本机 Chrome）
- v1→v2 migrate fixture
- 线上 Pages deep-link

## Legacy recommendation
确认后删除：`legacy.html`、`index.html`（1.x 壳）、`packages/web/legacy/`、CI Attach legacy 步骤。
