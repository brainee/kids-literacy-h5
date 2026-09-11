# 冒烟 · 今日情绪导读（T-049）

**日期：** 2026-09-11  
**命令：** `cd packages/web && npm test && npm run build` → PASS  
**规格：** `docs/product/specs/2026-09-11-today-coach-design.md`

## 覆盖点

| 项 | 结果 |
|----|------|
| 顶部非课同级空说明 | 改为 `today-coach` 渐变导读条 |
| 进度 pill | 今日 done/goal、会认字、已上课 |
| 星宝脸 + 心情句 / 无宠邀请 | `buildTodayCoach` |
| 点字读音 | 各行 `TapRead` size=sm |
| 听整段鼓励 | TTS 整段 + onend 恢复 BGM |
| 去看星宝 | Link `/pet` |

## 人工听感（Owner）

- [ ] 打开今日：导读语气是否温柔、数字是否对
- [ ] 点字 / 听整段是否可读
- [ ] 完成今日课后文案是否变为「可以休息」
