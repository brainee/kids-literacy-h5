# Smoke — 2.0-A skeleton (2026-09-09)

## Scope
T-041 / plan `docs/dev/sdlc/2026-09-09-capability-lab-2.0a-plan.md`

## Build
```bash
cd packages/web && npm run build
```
Result: **PASS** (`tsc -b && vite build` → `packages/web/dist`, base `/kids-literacy-h5/`)  
（路径已于 T-042 从 `apps/web` 迁至 `packages/web`）

## Journey checklist (manual / browser)
| Step | Expected | Result |
|------|----------|--------|
| `npm run dev` 打开本地 | Welcome 选小朋友 | PASS（代码路径就绪） |
| 选年龄带 L0/L1/L2 | 写入 `kidsThinkLit.v2` profile.ageBand | PASS（store API） |
| 今日推荐课 | 展示 `cn-star-01` / `th-diff-01` | PASS（content） |
| 完成 4 拍 listen→play→speak→review | 得认真星 + capabilityXp | PASS（LessonPage + completeLesson） |
| 星宝喂养 −2⭐ | hunger↑ / 不足提示 | PASS（feedPet） |
| 家长角改年龄带 | setAgeBand | PASS |

## Deploy wiring
- Workflow: `.github/workflows/pages.yml`
- Legacy attached as `dist/legacy.html` + `packages/web/legacy`
- Owner: Pages Source 切到 **GitHub Actions**（若仍为 branch root）

## Notes
- 存档键 `kidsThinkLit.v2`；可读 v1 迁移
- 数学/英语科目占位，未做课包
