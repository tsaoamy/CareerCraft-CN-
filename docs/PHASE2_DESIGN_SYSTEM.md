# Phase 2 — 功能页设计系统统一

## 已完成

### 系统基础设施
| 路径 | 职责 |
|------|------|
| `src/components/system/campaign-hero.tsx` | 90vh Campaign Hero（noise + radial + scroll hint） |
| `src/components/system/feature-page-layout.tsx` | FeaturePageRoot / FeaturePageShell / SystemSection / PageCTA |
| `src/components/system/system-card.tsx` | SystemCard / FilterChip / MetricCard |
| `src/components/system/skeleton.tsx` | Skeleton / SkeletonCard / SkeletonHero / SkeletonGrid |
| `src/components/system/smooth-scroll.tsx` | Lenis 平滑滚动 Provider |
| `src/lib/theme/tokens.ts` | 深色 token + motion preset |

### 7 个功能页
- `/dashboard` — Campaign Hero + FeaturePageRoot
- `/materials` — Campaign Hero + Volt CTA
- `/talent/matching` — Campaign Hero + FilterChip
- `/jd-analyzer` — Campaign Hero + 深色内容区
- `/resume-builder` — Campaign Hero
- `/interview` — 全 phase 包裹 FeaturePageRoot
- `/applications` — Campaign Hero + 统一 shell

### 全局
- `GlassPageHero` → 重导出 `CampaignHero`（向后兼容）
- 默认主题 `dark`
- Lenis 已安装并接入 `AppProviders`
- `globals.css` — `.system-page` / `.system-card` / `.campaign-hero` / legacy card 别名
- `Card` 组件 → system-card 风格

## 页面统一结构模板

```tsx
<FeaturePageRoot>
  <CampaignHero badge title subtitle icon footer|action />
  <FeaturePageShell tight>
    <SystemSection label title>...</SystemSection>
    {/* 功能内容 — system-card / FilterChip */}
    <PageCTA title action={BrandButton} />
  </FeaturePageShell>
</FeaturePageRoot>
```

## 后续可选
- 各页内 `StatCard` / 表单控件批量换 `system-input`
- 登录/注册/设置页接入同一系统
- loading.tsx 使用 SkeletonHero
