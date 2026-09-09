# 1.2 Implementation Plan — 多包 + 文档分层

**规格：** [`../../product/specs/2026-09-09-multipackage-docs-design.md`](../../product/specs/2026-09-09-multipackage-docs-design.md)

### Task 1: 文档分层

- [x] `docs/dev` / `docs/product` / `docs/research`
- [x] 旧路径迁移说明
- [x] 新 `docs/README.md` + `architecture.md`

### Task 2: 建立 packages 骨架与 README

- [x] `packages/{core,audio,speech,literacy,think,quiz,pet,app}`
- [x] 各包 `package.json` + `README.md`

### Task 3: 从 `index.html` 抽出 ESM 模块

- [x] core / audio / speech / data 层先抽
- [x] literacy / think / quiz / pet / app 组装
- [x] `index.html` 仅保留 DOM + `import main.js`

### Task 4: 更新 AGENTS / 根 README / TASKS / 链接

- [x] 路径全部指向新 docs 树
- [x] 明确「多包仍零构建」

### Task 5: 门禁

- [x] 语法检查 + 本地 HTTP 冒烟写 `evidence/smoke-2026-09-09-mp.md`
