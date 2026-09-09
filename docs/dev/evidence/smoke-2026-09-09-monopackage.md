# Smoke — packages/web 单项目收拢 (2026-09-09)

## Scope
T-042：多包收拢 + evidence 迁入 docs

## Layout
```text
packages/web/           # 唯一当前项目（原 apps/web）
  src/                  # 2.0 React
  legacy/src/           # 原 packages/{core,audio,…,app} 单树
docs/dev/evidence/      # 原根目录 evidence/
```

## Checks
| Check | Result |
|-------|--------|
| `cd packages/web && npm run build` | PASS |
| `node --check` legacy main/store/pet | PASS |
| 旧 `packages/{core,app,…}` 已删除 | PASS |
| `apps/`、根 `evidence/` 已移除 | PASS |
| `legacy.html` → `./packages/web/legacy/src/main.js` | PASS |
| Pages workflow → `packages/web` | PASS |

## Notes
- `packages/` 预留未来 server 等；当前勿再拆 npm 多包
- 历史规格 1.2 / 2.0 目录示意已标注 superseded / 现行落地
