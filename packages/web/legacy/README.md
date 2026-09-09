# legacy（1.x ESM）

迁移期保留的原生 ESM 玩法，收在 **`packages/web` 单项目** 内，不再拆 `@kids/*` 多包。

- 入口壳：仓库根 `legacy.html`（或 Pages 产物里的同名文件）
- 模块：`src/{core,audio,speech,literacy,think,quiz,pet,main.js}`
- 预览：仓库根 `python3 -m http.server` → `/legacy.html`

主产品请用同目录上级的 Vite 应用（`packages/web` 根：`npm run dev`）。
