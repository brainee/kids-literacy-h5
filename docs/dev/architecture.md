# 架构

`packages/` **预留多项目**（未来可加 `server` 等）；**当前只有一个项目：`packages/web`**。

## 2.0 运行时（主）

```text
Browser
  └─ packages/web/dist/index.html     # GitHub Actions / Vite build
       └─ React Router
            ├─ domain/  (StoreV2 · AgeBand · capability)
            ├─ content/ (LessonContent 示例课)
            ├─ pages/   (今日 / 课 4 拍 / 星宝 / 家长)
            └─ lib/speak (Web Speech 基础)
```

本地：`cd packages/web && npm run dev`  
构建：`cd packages/web && npm run build` → base `/kids-literacy-h5/`（Pages）

> 根目录无 `package.json`：单包阶段避免 workspace 空壳；第二项目出现后再加。

## 1.x 遗留（同项目内单树）

```text
Browser
  └─ legacy.html
       └─ packages/web/legacy/src/main.js
            └─ core | audio | speech | literacy | think | quiz | pet
```

相对路径 ESM；需 HTTP 静态服务。CI 把 `legacy.html` + `packages/web/legacy` 拷进 dist。

## 文档 / 证据

- 规格与计划 → `docs/product` / `docs/dev`
- 冒烟证据 → `docs/dev/evidence/`
- 改行为 → `packages/web` + 必要时规格
