# Retest — BGM / 回退 / 说一说录音 (2026-09-11)

## 根因说明（BGM）
**不是没下载。** 背景音乐是 Web Audio **本机合成**，不需下载。  
此前问题：TTS 用系统朗读能响，但 AudioContext 未用静音缓冲真正解锁；切歌后立刻播报 duck，且结束后未强制续播。

## 本轮修复
1. `unlockAudio`：用户手势内 resume + 静音 buffer kick（Safari/Chrome）  
2. 切 BGM 后 `wantedStyle` 记忆；TTS `onend` / 回前台 / 首次点击 → `ensureBgmPlaying`  
3. 音量提高；duck 不完全静音  
4. 课内 **← 上一拍 / 回今日**  
5. **说一说**：开始说 → 录音+音量检测 → 停 → 可听回放 → 才允许下一拍  
6. 家长角可 **添加小朋友**

## 自动验证
| Check | Result |
|-------|--------|
| `npm run build` | PASS |
| `npm test`（store + lesson-flow） | PASS |

## 人工必测（Owner 本机）
1. 家长角点「童趣」→ **应立刻听到循环旋律**（可先不听旁白）  
2. 切另一小朋友 → BGM 应继续或可再点一次恢复  
3. 课内第 2 拍点「上一拍」能回去  
4. 第 3 拍：无录音时「进入下一拍」禁用；开始说→大声说→停→检测到声音后才能下一步  

## 结论
工程侧按上述缺陷关闭；听感以本机第 1 条为准。
