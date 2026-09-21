# 接入 Cloudflare（`starlit` · Workers + Assets）

| 平台 | URL | `VITE_BASE` |
|------|-----|-------------|
| GitHub Pages | https://brainee.github.io/kids-literacy-h5/ | `/kids-literacy-h5/` |
| Cloudflare `starlit` | **https://starlit.pages.dev/**（以 Domains 为准） | `/` |

## Dashboard 配置（不要清空 Deploy）

| 字段 | 值 |
|------|-----|
| Root directory | `packages/web` |
| Build command | `npm run build:cf` |
| Deploy command | `npx wrangler deploy --config wrangler.jsonc --assets=./dist` |
| Version command | **留空** |

- **没有**「Build output directory」栏是正常的；输出在 `wrangler.jsonc` → `./dist`。
- **不要**把 Deploy 留空：Workers 项目会 `Invalid request body`。
- SPA 深链：用 `wrangler.jsonc` 的 `not_found_handling: single-page-application`。  
  **不要**再放 `public/_redirects` 的 `/* /index.html 200`（会 Infinite loop，code 100324）。

## 构建说明

- `npm run build:cf`：`VITE_BASE=/` + 剔除 >25MiB 的 onnx wasm（Piper 运行时走 CDN）。
- 部署前请 **commit + push**：`wrangler.jsonc`、无 `_redirects`、strip-wasm 脚本。

## 本机直传（可选）

```bash
cd packages/web
npm ci
npm run build:cf
npx wrangler login   # 首次
npm run cf:deploy
```

## 常见坑

1. Deploy 里写裸 `npx wrangler deploy` → 可能触发 Vite 交互 setup，再跑一遍 `npm run build`（GH 子路径），易乱。用上面带 `--config` / `--assets` 的命令。  
2. `_redirects` + Workers SPA = Infinite loop。  
3. ort wasm 打进 dist = Asset too large（25MiB）。  
4. GitHub 红条 Error fetching…：到 https://github.com/settings/installations 重授 Cloudflare。
