# 接入 Cloudflare（`kidslit` · Workers + Assets）

| 平台 | URL | `VITE_BASE` |
|------|-----|-------------|
| GitHub Pages | https://brainee.github.io/kids-literacy-h5/ | `/kids-literacy-h5/` |
| Cloudflare `kidslit` | Dashboard → Domains（常见 `kidslit.<账号>.workers.dev`；若有 Pages 则为 `kidslit.pages.dev`） | `/` |

> 国内访问 `*.workers.dev` 常超时；能绑自定义域最好。勿把别人的 `starlit.pages.dev` 当成本站。

## Dashboard 配置（不要清空 Deploy）

| 字段 | 值 |
|------|-----|
| Root directory | `packages/web` |
| Build command | `npm run build:cf` |
| Deploy command | `npm run cf:deploy` |
| Version command | **留空** |

### 从 `starlit` 改名为 `kidslit`

1. 仓库已改 `wrangler.jsonc` → `"name": "kidslit"`，**push** 后触发构建。  
2. 下次 `wrangler deploy` 会**新建** Worker `kidslit`（旧 `starlit` 仍在，可在 Dashboard 删除）。  
3. 打开新项目 **Domains / Visit** 拿真实 URL，不要猜 `pages.dev`。

- **没有**「Build output directory」栏是正常的；输出在 `wrangler.jsonc` → `./dist`。
- **不要**把 Deploy 留空：Workers 项目会 `Invalid request body`。
- SPA 深链：用 `not_found_handling: single-page-application`。  
  **不要**再放 `public/_redirects` 的 `/* /index.html 200`（Infinite loop 100324）。

## 构建说明

- `npm run build:cf`：`VITE_BASE=/` + 剔除 >25MiB 的 onnx wasm（Piper 走 CDN）。
- 部署前请 **commit + push**：含改名后的 `wrangler.jsonc`。

## 本机直传（可选）

```bash
cd packages/web
npm ci
npm run build:cf
npx wrangler login   # 首次
npm run cf:deploy
```

## 常见坑

1. Deploy 用裸 `npx wrangler deploy` → 可能触发 Vite setup；优先 `npm run cf:deploy`。  
2. `_redirects` + Workers SPA = Infinite loop。  
3. ort wasm 打进 dist = Asset too large（25MiB）。  
4. GitHub 红条：https://github.com/settings/installations 重授 Cloudflare。  
5. `*.pages.dev` 全局唯一；名字被占就只能用 `workers.dev` / 自定义域。
