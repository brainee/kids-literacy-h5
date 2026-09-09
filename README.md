# 星星思维识字乐园

面向 3–8 岁的**纯前端**儿童 H5：以识字/思维为载体练观察、分类、表达；2.0 起为「能力乐园」壳（数学/英语占位）。  
数据仅存浏览器 `localStorage`，无后端、无账号云同步。

**代码：** 当前全部在 **`packages/web`**（`packages/` 留给未来其它项目，如 server）。

## 快速开始（2.0 · 推荐）

```bash
cd packages/web
npm install
npm run dev
# 打开终端提示的本地地址（默认 http://localhost:5173）
```

生产构建：

```bash
cd packages/web
npm run build
# 产物：packages/web/dist（默认 base=/kids-literacy-h5/）
```

> 仓库根**故意没有** `package.json`：当前只有一个前端包，顶层 workspace 徒增 lockfile/CI 分叉；等真正出现第二项目（如 `packages/server`）再加。

## 1.x 遗留（ESM，无构建）

```bash
# 仓库根目录
python3 -m http.server 5173
# 打开 http://localhost:5173/legacy.html
```

## 功能一览

- **2.0：** 选小朋友 → 自报年龄带 → 今日短课 → 听/玩/说/想 四拍 → 认真星 → 喂星宝；家长角可改年龄带
- **1.x：** 识字字库、思维乐园、跟读录音、BGM、金币版星宝（`legacy.html`）
- 科目壳：语文 / 思维可用；数学 · 英语「即将开放」

## 免费部署

### GitHub Pages

- **线上：** https://brainee.github.io/kids-literacy-h5/
- **构建：** `.github/workflows/pages.yml`（`packages/web` + 附带 legacy）
- 首次切到 Actions 部署：仓库 Settings → Pages → Source = **GitHub Actions**
- 推送 `main` 后约 1–2 分钟更新

### Cloudflare Pages

- Root：`packages/web`
- Build：`npm run build`（自定义域根路径可设 `VITE_BASE=/`）
- Output：`dist`

## 安全说明

- 不上传用户数据、录音、进度  
- 麦克风仅本地 MediaRecorder（1.x）  
- 无账号云同步

## 文档

- **Agent：** [`AGENTS.md`](AGENTS.md)
- **索引：** [`docs/README.md`](docs/README.md)
- **证据：** [`docs/dev/evidence/`](docs/dev/evidence/)
- **2.0 规格：** [`docs/product/specs/2026-09-09-capability-lab-2.0-design.md`](docs/product/specs/2026-09-09-capability-lab-2.0-design.md)
- **任务：** [`docs/dev/sdlc/TASKS.md`](docs/dev/sdlc/TASKS.md)
