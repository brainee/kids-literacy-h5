# 接入 Cloudflare Pages（`*.pages.dev`）

本仓库已可双轨部署：

| 平台 | URL 形态 | `VITE_BASE` |
|------|----------|-------------|
| GitHub Pages | `https://brainee.github.io/kids-literacy-h5/` | `/kids-literacy-h5/`（现有 Actions） |
| Cloudflare Pages | `https://<项目名>.pages.dev/` | `/`（站点根路径） |

> 静态站 + `localStorage`，无后端。CF 与 GH Pages 可同时开，互不影响。

## 方式 A · Dashboard 接 GitHub（推荐）

1. 打开 [Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages)  
2. **Create** → **Pages** → **Connect to Git** → 选仓库 `brainee/kids-literacy-h5`（授权 Cloudflare GitHub App）  
3. Build 配置：

| 字段 | 值 |
|------|-----|
| Production branch | `main` |
| Root directory | `packages/web` |
| Build command | `npm run build:cf` |
| Build output directory | `dist` |
| Environment variable | `VITE_BASE` = `/`（`build:cf` 已内置；也可在 UI 再设一遍） |
| Environment variable | `NODE_VERSION` = `22` |

4. **Save and Deploy** → 等待构建 → 得到 `https://<项目名>.pages.dev`  
5. （可选）Custom domains 绑自己的域名；HTTPS 自动签。

每次推 `main` 自动生产部署；PR 会出 Preview URL。

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
