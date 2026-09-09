# packages/web — 星星思维乐园（2.0）

仓库内**唯一当前可运行项目**。`packages/` 仅预留未来其它运行时（如 server）。

## 命令

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 生产默认 base=/kids-literacy-h5/
npm run preview
```

## 目录

| 路径 | 说明 |
|------|------|
| `src/` | React 2.0 主应用 |
| `legacy/` | 1.x 原生 ESM 单树（根 `legacy.html` 引用） |
| `dist/` | 构建产物（gitignore） |

## 遗留入口

仓库根：`python3 -m http.server` → `/legacy.html`
