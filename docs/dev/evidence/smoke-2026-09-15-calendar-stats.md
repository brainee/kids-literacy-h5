# 冒烟 · T-050 日历与真·今日

**日期：** 2026-09-15  
**命令：** `cd packages/web && npm test && npm run build`  
**规格：** `docs/product/specs/2026-09-15-lesson-calendar-stats-design.md`

## 覆盖

| 项 | 结果 |
|----|------|
| `lessonLog` 写入（含复习） | completeLesson |
| 真·今日去重进度 | progress-smoke PASS |
| 家长月历 + 阶段统计 | ParentPage |
| 今日课 chip「今天会了」 | TodayPage |

## 人工

- [ ] 上完一课 → 家长角今日亮点、统计 +1
- [ ] 隔天同一课 → 今日进度可从 0 再计；通关课数不变
