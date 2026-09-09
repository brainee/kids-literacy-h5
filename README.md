# 星星思维识字乐园

面向 3–7 岁的**纯前端**儿童 H5：以识字为载体，训练观察、分类、排序、逻辑与表达。  
数据仅存浏览器 `localStorage`，无后端、无账号云同步。

**形态：** 多包原生 ESM（`packages/*`），零 npm 构建。详见 [`docs/dev/architecture.md`](docs/dev/architecture.md)。

## 快速开始

```bash
cd /Users/zolad/work/app/yirenge/kids-literacy-h5
# 必须用静态服务（ES Module 不支持随意 file://）
python3 -m http.server 5173
# 或：npx --yes serve -p 5173
# 打开 http://localhost:5173
```

## 功能一览

- 用户：预置「星星」「月月」，可新增；数据隔离；欢迎语音
- 识字：字库 + 读字 / 跟读录音回放 / 四选一 / 认识·不认识
- 记忆：level + 错题加权；复习测验 + 报告
- 思维乐园：观察、分类、排序、找规律、看图表达
- 奖励：答对音效/庆祝/金币；「我的星宝」喂养
- 背景音乐：程序化 Web Audio；播报时自动降音量
- 扩展占位：数学 / 英语「即将开放」

## 包结构（摘要）

| 包 | 职责 |
|----|------|
| `packages/app` | 入口组装 |
| `packages/core` | 存档 / state / DOM |
| `packages/audio` / `speech` | BGM·音效 / TTS |
| `packages/literacy` / `think` / `pet` | 字库 / 关卡 / 星宝 |
| `packages/quiz` | 测验扩展点 |

## 免费部署

### GitHub Pages（已开通）

- **线上：** https://brainee.github.io/kids-literacy-h5/
- Source：`main` / `/ (root)`（根 `index.html`）
- 推送后约 1 分钟更新

### Cloudflare Pages

Build 留空；Output 为仓库根。

## 安全说明

- 不上传用户数据、录音、进度  
- 麦克风仅本地 MediaRecorder  
- 无第三方追踪（仅 Tailwind CDN）

## 文档

- **Agent：** [`AGENTS.md`](AGENTS.md)
- **索引：** [`docs/README.md`](docs/README.md)（dev / product / research）
- **任务：** [`docs/dev/sdlc/TASKS.md`](docs/dev/sdlc/TASKS.md)
- **自测：** [`CHECKLIST.md`](CHECKLIST.md) · [`evidence/`](evidence/)

## 后续迭代建议

1. 扩充 `@kids/literacy` / `@kids/think` 数据  
2. 新包 `@kids/math` / `@kids/english`  
3. 可选 PWA；录音 IndexedDB
