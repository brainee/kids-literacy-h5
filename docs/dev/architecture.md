# 架构：多包 + 原生 ESM（零构建）

**规格：** [`../product/specs/2026-09-09-multipackage-docs-design.md`](../product/specs/2026-09-09-multipackage-docs-design.md)

## 运行时

```text
Browser
  └─ index.html          # Pages 入口：DOM 壳 + Tailwind
       └─ packages/app/src/main.js   # type=module
            ├─ @kids/core
            ├─ @kids/audio
            ├─ @kids/speech
            ├─ @kids/literacy
            ├─ @kids/think
            ├─ @kids/quiz
            └─ @kids/pet
```

导入使用**相对路径**（浏览器原生 ESM），例如：

```js
import { loadStore, saveStore } from "../../core/src/store.js";
```

不依赖 npm install / bundler。本地请用静态服务器（`python3 -m http.server` 或 `npx serve`），避免 `file://` 下 module CORS 问题。

## 包边界

| 包 | 可依赖 | 不可依赖 |
|----|--------|----------|
| core | — | 其它业务包 |
| audio / speech | core（可选） | literacy/think/pet |
| literacy / think / quiz / pet | core, audio, speech | 彼此循环依赖 |
| app | 全部 | —（唯一组装点） |

## 文档对应

- 改包行为 → 更新该包 `README.md` + 必要时 `docs/product/specs`
- 改拆包方式 → 更新本文件 + 1.2 规格
