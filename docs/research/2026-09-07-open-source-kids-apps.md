# 开源儿童学习应用调研（对本仓库的可用性）

**日期：** 2026-09-07  
**筛选原则：** 免费 / 开源 / 小孩能自己点 / 家长少折腾  
**用途：** 二期功能灵感、对标清单、外部推荐链接；**不**表示要 fork 或嵌入这些项目。

本仓库定位：纯前端 H5、本地存储、无账号、识字 + 思维启蒙。下列条目按「对本项目有没有用」分级。

---

## 结论（先看这个）

| 对本仓库 | 建议动作 |
|---|---|
| **直接对标** | `hanzi-study`：浏览器闯关识字，最接近一期形态；做竞品体验与关卡节奏参考 |
| **二期可借鉴玩法** | ScratchJr / Code Quest Kids / GCompris：积木与活动型思维，不必接入代码 |
| **英语二期候选体验** | qlobe-kids、VaibhavCodeClub/learn（打开即玩）；HiKid / FeltWords 需家长配模型，不符合「少折腾」 |
| **暂不纳入产品内** | 字音岛、书空、Martı、AI4Kids：原生 App / Electron / 高年级数据素养，与当前静态 H5 栈不合 |

家庭侧「只装 2–3 个」可写进家长说明（可选）：本 H5 + ScratchJr +（有 Android 再加字音岛）。

---

## 一、中文识字 / 拼音

| 项目 | 适龄 | 对本仓库 | 链接 |
|---|---|---|---|
| **hanzi-study** | 3–6 | **高**：Web 闯关、听音、笔顺、加减、古诗；平板手机均可。一期对标首选。 | [dhjz/hanzi-study](https://github.com/dhjz/hanzi-study) |
| 字音岛 | 5–6 | **低（产品内）/ 中（家庭推荐）**：语音优先自学好，但是 Android App + 本地进度，非本仓库栈。 | [700elgoog/ziyin-island-app](https://github.com/700elgoog/ziyin-island-app) |
| 书空 | 写字阶段 | **中（远期）**：笔顺动画 + 跟写纠错；Electron/Web。若二期做「写字」可参考交互，一期不做笔迹。 | [vipzhicheng/shukong-app](https://github.com/vipzhicheng/shukong-app) |

**试用建议：** 无 Android → 先开 hanzi-study；有平板且要语音引导自学 → 再装字音岛。

**可吸收进本 H5 的点（不抄代码，抄体验）：**

- 闯关节奏与「听音选字」权重（我们已有四选一 / 跟读）
- 笔顺展示可作为远期增强（SVG 动画，仍保持零构建）
- 古诗 / 加减法可作为「识字旁路」小模块，勿挤占思维乐园主路径

---

## 二、数据思维 / 计算思维启蒙

「数据思维」对 3–7 岁更接近：分类、排序、模式、简单可视化、积木编程——本仓库「思维乐园」已覆盖分类/排序/规律，无需引入 Excel 式工具。

| 项目 | 适龄 | 对本仓库 | 链接 |
|---|---|---|---|
| **ScratchJr** | 5–7 | **高（互补）**：业界标准积木故事；官方开源。建议**外链推荐**，不嵌入。 | [scratchfoundation/scratchjr](https://github.com/scratchfoundation/scratchjr) · [官网](https://www.scratchjr.org/) |
| ScratchJr Desktop | 同上 | 仅电脑教室场景；与本 H5 无关。 | [jfo8000/ScratchJr-Desktop](https://github.com/jfo8000/ScratchJr-Desktop) |
| **Code Quest Kids** | 6–10 | **中高**：网页积木闯关、中英+注音、无账号——与「打开就玩」一致，可学关卡文案与按钮尺度。 | [hsinhoyeh/code-quest-kids](https://github.com/hsinhoyeh/code-quest-kids) |
| Martı | 小学偏大 | **低**：真·数据素养（图表/地图），超龄。 | [karton-project/marti](https://github.com/karton-project/marti) |
| **GCompris** | 2–10 | **中**：成熟活动库；可借鉴「活动类型清单」，不迁移 KDE 栈。 | [KDE/gcompris](https://invent.kde.org/education/gcompris) · [官网](https://gcompris.net/) |

**低龄路径：** ScratchJr → Code Quest / GCompris；要「看数据做图」再碰 Martı。

---

## 三、英语启蒙（二期占位参考）

| 项目 | 适龄 | 对本仓库 | 链接 |
|---|---|---|---|
| qlobe-kids | 5–6 | **高（二期体验参考）**：平板小游戏、自然拼读、无广告无账号。 | [kaigani/qlobe-kids](https://github.com/kaigani/qlobe-kids) |
| VaibhavCodeClub/learn | 字母入门 | **中**：Flutter 极简字母/发音；玩法可迁到 Web。 | [VaibhavCodeClub/learn](https://github.com/VaibhavCodeClub/learn) |
| HiKid | 口语 | **低（一期原则）**：本机 AI，主要 macOS，需家长配置。 | [xiaochong/hi-kid](https://github.com/xiaochong/hi-kid) |
| FeltWords | 3–8 | **低**：交互有趣，但拍照/模型链路偏折腾。 | [SkyNotSilent/FeltWords](https://github.com/SkyNotSilent/FeltWords) |
| AI4Kids | 4–16 | **低**：Android 分模块，非静态 H5。 | [junngithub/ai4kids_android](https://github.com/junngithub/ai4kids_android) |

**二期英语原则延续一期：** 打开即玩 > AI 陪练；优先字母/拼读小游戏，口语评分不做。

---

## 快速选型（家庭场景，非本仓库开发）

| 场景 | 选 |
|---|---|
| 中文识字，打开网页 | hanzi-study **或本仓库** |
| 思维启蒙（积木） | ScratchJr |
| 英语字母/拼读 | qlobe-kids 或 GCompris 字母活动 |
| 英语口语（有 Mac） | HiKid（接受配置成本时） |
| 全家桶少装软件 | GCompris |

---

## 使用提醒（写进家长说明时可用）

1. GitHub 星多 ≠ 幼教质量；ScratchJr / GCompris 是少数长期验证过的。
2. 很多 AI 项目要 API Key 或本机模型，不等于「装完即用」。
3. 低龄：短时 10–15 分钟、家长陪同、关广告/账号类功能。

---

## 与本仓库路线图的映射

| 本仓库方向 | 调研中可借鉴对象 | 建议 |
|---|---|---|
| 扩充字库 / 关卡节奏 | hanzi-study | 对照关卡密度与听音题占比 |
| 思维乐园加深 | Code Quest、GCompris 活动类型 | 加关卡 JSON，不引积木引擎 |
| 数学二期 | hanzi-study 加减、GCompris 数数 | 数感/10 以内加减，保持零构建 |
| 英语二期 | qlobe-kids、learn | 字母 + 发音 TTS，避免 API Key |
| 写字 / 笔顺（远期） | 书空 | 仅当明确要「写」再开 |
| 产品内嵌 Scratch | — | **不做**；设置页可外链 ScratchJr 官网 |
