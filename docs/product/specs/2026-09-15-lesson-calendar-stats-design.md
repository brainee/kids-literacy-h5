# 上课日历 + 家长阶段统计（T-050）

**日期：** 2026-09-15  
**状态：** approved（Owner「继续」接 review 建议）  
**受众：** 家长角完整版；今日页用同一数据做「真·今日」进度（孩子侧轻量）

## 问题

- `completedLessons` 只记「曾经上过」，不记日期 → 「今日 2/3」是终身假进度  
- 家长角只有扁平能力标签，无日历、无周/科目汇总

## 方案

### 数据

`ProfileV2.lessonLog: LessonLogEntry[]`

```ts
{ at: number; lessonId: string; subject: SubjectId; firstClear: boolean }
```

- 每次点「收下认真星 / 练完啦」追加一条（含复习）  
- 认真星 / knownChars / capabilityXp 仍仅首次 clear 增加  
- 本地日键 `YYYY-MM-DD`（设备时区）

### 今日页

- `doneToday` = 今日 log 中、且属于今日推荐课列表的 **去重 lessonId** 数  
- 导读/pill 用真今日

### 家长角

1. **本月打卡月历**：有课的日子亮点；点某日看当天课目列表  
2. **阶段统计**：  
   - 连续打卡天数（截止今天）  
   - 近 7 天上课次数  
   - 按科目：语文 / 思维 / 数学 / 英语 次数  
   - 能力小账本保留，中文标签

### 非目标

- 云同步、导出 PDF、孩子侧完整月历页（可后加贴纸周条）

## 验收

- [ ] 同一课隔天再上：今日进度可重新从 0 计  
- [ ] 家长角月历有点；点日可见课  
- [ ] 科目统计随 log 增加  
- [ ] `npm test` + `npm run build`
