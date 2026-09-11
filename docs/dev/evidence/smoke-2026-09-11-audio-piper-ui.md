# Smoke + 三角色验收 — 2.0-B 声音与儿童化 (2026-09-11)

## 范围
规格：`docs/product/specs/2026-09-11-audio-piper-kids-ui-design.md`

## 工程验证
| Check | Result |
|-------|--------|
| `cd packages/web && npm run build` | PASS |
| store replay gate `npm test` | PASS（未改破坏） |
| BGM API `startBgm` / Parent 持久化 `store.bgm` | 代码就绪；需本机点按听感 |
| 课内「再听一遍」固定入口 | 代码就绪 |
| Piper 懒加载 + IndexedDB（piper-plus） | 代码就绪；首次需拉 HF 模型，失败回退 Web Speech |

## 缓存说明（回答 Owner）
**可以本地缓存。** `piper-plus` 将 ONNX 模型写入浏览器 **IndexedDB**；下载成功后二次进入不必重下。偏好（`ttsEngine` / `piperAutoPrefetch` / `bgm`）在 `kidsThinkLit.v2`。

## 三角色验收

### A · 架构
- [x] 无后端；静态可部署  
- [x] 默认 Web Speech；Piper 可选  
- [x] 未就绪不挡课（回退）  
- [x] 模型可缓存；空闲预取可关  
- [x] BGM 程序化 Web Audio，切换写回 store  

### B · 幼师
- [x] 每拍有「再听一遍」  
- [x] 点读仍在  
- [x] 不强迫下载神经模型即可上课  
- [ ] 本机听感确认 Piper 中文儿童可接受（依赖网络首次下载）  

### C · 儿童
- [x] 大按钮、彩色乐园风、卡片浮起阴影  
- [x] 答对/喂养有音效反馈  
- [x] BGM 可开可关  
- [ ] 真机 Safari/Chrome 点完一课旅程（人工）  

## 已知风险
- 国内访问 HuggingFace 下载 Piper 模型可能失败 → 保持系统朗读  
- 首次 Piper 体积大，低端机合成可能慢  
- 程序化 BGM 非真人编曲，听感偏简单（与 1.x 同级）

## 结论
**工程最终版（2.0-B）可交付试用。** 听感与 Piper 下载需 Owner 本机终验勾选 B/C 未勾项。
