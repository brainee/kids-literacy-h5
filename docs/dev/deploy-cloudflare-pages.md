# 接入 Cloudflare Pages（`*.pages.dev`）

本仓库已可双轨部署：

| 平台 | URL 形态 | `VITE_BASE` |
|------|----------|-------------|
| GitHub Pages | `https://brainee.github.io/kids-literacy-h5/` | `/kids-literacy-h5/`（现有 Actions） |
| Cloudflare Pages | `https://<项目名>.pages.dev/` | `/`（站点根路径） |

> 静态站 + `localStorage`，无后端。CF 与 GH Pages 可同时开，互不影响。

## Cloudflare Dashboard 必对配置（`starlit`）

| 字段 | 正确值 | 错误示例 |
|------|--------|----------|
| Root directory | `packages/web` | 仓库根 |
| Build command | `npm run build:cf` | `npm run build`（会用 GH 子路径） |
| Build output directory | `dist` | |
| **Deploy command** | **留空** | `npx wrangler deploy` ← 你日志里的失败原因 |
| `NODE_VERSION` | `22` 或 `24` | |

> 经典 **Pages** 只上传 `dist`，不要填 Deploy command。  
> 填了 `wrangler deploy` 会走 **Workers Assets**（单文件 ≤25MiB），且会二次交互式 setup。

上线地址（项目名 `starlit`）：**https://starlit.pages.dev/**

### 大文件说明

`onnxruntime` wasm ≈ 27MB，已从构建产物剔除；Piper 运行时从 jsDelivr CDN 拉 wasm。默认 Web Speech 不受影响。

### SPA 深链

`packages/web/public/_redirects` 已含：

```text
/*    /index.html   200
```

构建时会拷进 `dist/`，刷新 `/today`、`/pet` 等不会 404。

### Legacy 1.x

CF 默认只发 2.0（`dist`）。若要在 CF 也挂 `legacy.html`，在 Build command 后加拷贝（可选）：

```bash
npm run build:cf && cp ../../legacy.html dist/legacy.html && mkdir -p dist/packages/web && cp -R legacy dist/packages/web/legacy
```

路径以 Root=`packages/web` 为准。

## 方式 B · Wrangler 直接上传（本机 / CI）

需已登录：`npx wrangler login`

```bash
cd packages/web
npm ci
npm run build:cf
npx wrangler pages deploy dist --project-name=kids-literacy-h5
```

首次会提示创建 Pages 项目；之后同名覆盖。

GitHub Actions 示例（可选，与现有 GH Pages 并存）：

```yaml
# .github/workflows/cloudflare-pages.yml（需要时再建）
# secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
```

## 本地验 CF 产物

```bash
cd packages/web
npm run build:cf
npx vite preview --base /
# 或: npx wrangler pages dev dist
```

确认 Network 里 JS/CSS 路径是 `/assets/...` 而不是 `/kids-literacy-h5/assets/...`。

## 常见坑

1. **忘了 `VITE_BASE=/`**：仍按 GH 子路径打包 → `*.pages.dev` 白屏 / 资源 404。  
2. **Root directory 填错成仓库根**：找不到 `package.json`。必须是 `packages/web`。  
3. **公司 npm 镜像**：本仓库 `packages/web/.npmrc` 已钉 **公网** `registry.npmjs.org`；CF / GitHub Actions 均可 `npm ci`。勿再把 lock 指回内网 artifactory。  
4. **Piper / onnx wasm**：体积大，首次加载慢属正常；与托管平台无关。  
5. **`public/404.html`**：已按 hostname 区分 GH 子路径 / CF 根路径；CF 还依赖 `_redirects` 深链回落。

## 验收清单

- [ ] `*.pages.dev` 打开欢迎页  
- [ ] 直达 `/today` 刷新不 404  
- [ ] 进一课、喂星宝、家长角正常（localStorage）  
- [ ] GH Pages 旧链接仍可用（若未关 Actions）
