# 冒烟 · 星宝等级形态

**日期：** 2026-09-16  
**规格：** `docs/product/specs/2026-09-16-pet-stage-growth-design.md`

## 设计对照（游戏惯例）

- 形态/进化 ← 等级  
- 表情/心情 ← 饱食  
- 升级重置饱食到「还行」，不重置形态

## 覆盖

| 项 | 结果 |
|----|------|
| stage 阈值 1/3/5/7 | pet-stage-smoke |
| 升级 hunger=55 | store feedPet |
| UI 主脸用 level | PetPage / Today coach |

## 人工

- [ ] 喂到升级：主 emoji 应变大/变种，并有装饰  
- [ ] 饿了只有角标变哭脸，主形态仍是高等级
