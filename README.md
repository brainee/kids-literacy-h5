# 星星思维识字乐园

面向 3–7 岁的**纯前端**儿童 H5：以识字为载体，训练观察、分类、排序、逻辑与表达。  
数据仅存浏览器 `localStorage`，无后端、无账号云同步。

## 快速开始

```bash
cd /Users/zolad/work/app/yirenge/kids-literacy-h5
# 方式 1：直接双击打开 index.html
open index.html

# 方式 2：本地静态服务（推荐，麦克风权限更稳）
npx --yes serve -p 5173
# 浏览器打开 http://localhost:5173
```

## 功能一览

- 用户：预置「星星」「月月」，可新增；数据隔离；欢迎语音
- 识字：50 字起步（郑星辰礼乐优先）；读字 / 跟读录音 / 四选一 / 认识·不认识
- 记忆：level + 错题加权；复习测验 5/10/15 + 报告
- 思维乐园：观察、分类、排序、找规律、看图表达
- 背景音乐：程序化 Web Audio（离线可用）；播报时自动降音量
- 扩展占位：数学 / 英语「即将开放」

## 免费部署（一期目标）

### Cloudflare Pages（推荐）

1. 将本目录推到 GitHub/GitLab，或直接拖拽上传  
2. Build command 留空；Output directory 填 `/` 或项目根  
3. 获得免费域名：`https://<项目名>.pages.dev`

### GitHub Pages

1. 新建公开仓库，推送本目录  
2. Settings → Pages → Deploy from branch → `/ (root)`  
3. 访问：`https://<user>.github.io/<repo>/`

### 免费自定义域名注意

- Cloudflare / GitHub 自带二级域名即可用，稳定优先  
- Freenom 等「免费顶级域」稳定性差，不建议作为主入口  
- 自定义域可后续在 Cloudflare 绑定（通常需自有域名年费）

## 安全说明

- 不上传用户数据、录音、进度  
- 麦克风仅本地 MediaRecorder，关闭即释放  
- 无第三方追踪脚本（仅 Tailwind CDN）

## SDLC 文档

- 设计：`docs/specs/2026-09-07-kids-thinking-literacy-design.md`
- 计划：`docs/sdlc/2026-09-07-implementation-plan.md`
- 自测：`CHECKLIST.md`

## 后续迭代建议

1. 扩充字库与思维关卡 JSON（可拆 `data/` 仍保持零构建）  
2. 数学（数感/加减）与英语（字母/单词）正式模块  
3. 可选 PWA 离线缓存；可选家长导出进度（本地文件）

开源对标与二期灵感（已按「免费/开源/少折腾」筛过）：见  
`docs/references/2026-09-07-open-source-kids-apps.md`
