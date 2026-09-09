# 1.2 多包代码布局 + 文档分层

**日期：** 2026-09-09  
**状态：** partially superseded（2026-09-09 晚）  
**约束延续（文档分层仍有效）：** 静态托管、LocalStorage、无后端。

> **修订（Owner）：** 多包 `@kids/*` 仅为未来 server 等预留思路；**当前代码收拢为单一项目 `packages/web`**（含 `legacy/`）。证据迁至 `docs/dev/evidence/`。见 `docs/dev/architecture.md` 与 T-042。

## 目标

1. ~~代码按领域拆成 `packages/*`~~ → **现行：`packages/web` 单项目**；`packages/` 目录留给未来第二运行时。  
2. 文档区分 **dev（工程/流程）** 与 **主题（产品/调研）**（仍有效）。  
3. GitHub Pages 可部署（现行：Actions 构建 `packages/web`）。

## 非目标

- 不上 Vite/Webpack/React（除非另开规格）。  
- 不引入 monorepo 工具链（pnpm workspace 可选身份文件，不作为运行依赖）。  
- 不改变玩法与存档键 `kidsThinkLit.v1`。

## 代码包设计

```text
packages/
  core/       # storage / profile / uid / normalize
  audio/      # unlockAudio / BGM / sfx / duck
  speech/     # pickVoice / speak / phrases
  literacy/   # CHAR_BANK + 识字流程
  think/      # 思维关卡数据与渲染辅助
  quiz/       # 测验流程
  pet/        # coins / 星宝 / celebrate
  app/        # 路由绑屏、组装各包（main）
apps/web/     # （可选）静态资源与样式；根 index.html 仍为 Pages 入口
```

每个包：

- `package.json`：`"name": "@kids/<pkg>"`, `"type": "module"`（身份，不要求 install）  
- `src/*.js`：纯 ESM export  
- `README.md`：包职责 + 对外 API 三五行  

根 `index.html`：结构 + Tailwind + `type="module"` 引入 `packages/app/src/main.js`。

## 文档分层

```text
docs/
  README.md                 # 总索引（dev vs 主题 vs 包文档）
  dev/                      # 工程 / Agent / SDLC
    architecture.md         # 多包架构说明
    sdlc/                   # 原 docs/sdlc/*
    checklist-notes.md      # 可选：指向根 CHECKLIST
  product/                  # 产品主题
    specs/                  # 原 docs/specs/*
  research/                 # 调研主题
    *.md                    # 原 docs/references/*
packages/*/README.md        # 包级文档（跟代码走）
```

| 类型 | 放哪 | 例子 |
|------|------|------|
| 怎么开发 / Agent / 任务 / 架构 | `docs/dev/` | TASKS、implementation plan、architecture |
| 产品做什么 / 验收口径 | `docs/product/` | 一期/1.1/1.2 specs |
| 外部调研 / 对标 | `docs/research/` | 开源儿童应用 |
| 某个包怎么用 | `packages/<name>/README.md` | `@kids/pet` API |

根目录保留：`AGENTS.md`、`README.md`、`CHECKLIST.md`；证据 → `docs/dev/evidence/`。

## 迁移原则

- 旧路径用短 redirect 说明文件或在 `docs/README.md` 给出对照表，避免断链。  
- 先搬文档再拆代码；拆代码时行为不变，冒烟对齐 1.1。

## 验收

- 本地 `python3 -m http.server` 打开根路径，主流程可用。  
- `packages/*` 均可独立打开 README 理解职责。  
- `docs/dev` 与 `docs/product` / `docs/research` 目录清晰；`AGENTS.md` 路径已更新。  
- Pages：根 `index.html` 仍为入口。
