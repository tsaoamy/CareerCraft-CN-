# Phase 3 — 产品体验层统一

## 已完成

### Auth（Campaign Auth Experience）
- `/login` — 左右分屏 · 品牌叙事 + 极简表单
- `/register` — 同上 · 分步注册
- `/forgot-password` — 重置密码入口

组件：`src/components/system/auth-layout.tsx`

### System Input
- `SystemInput` / `SystemTextarea` — Volt focus glow · error/success 动效
- `ui/input.tsx` 统一 re-export

### Settings
- `FeaturePageRoot` + 紧凑 Hero
- 左侧导航（Linear 风格）+ MetricCard 概览
- Toast 保存反馈 · SystemDialog 删除确认

### Loading
- `src/app/loading.tsx` — 全局 Skeleton
- `src/app/dashboard/loading.tsx`
- `SkeletonMetric` / `SkeletonFeed`

### 反馈系统
- `ToastProvider` + `useToast()`
- `SystemDialog` — cinematic overlay

### 页面切换
- `PageTransition` — AnimatePresence + pathname key

### Empty State
- `EmptyState` / `EmptyStateInline`
- Dashboard 已接入

### Landing 过渡
- `landing-bridge-top` / `landing-bridge-bottom` gradient bridge

## 使用示例

```tsx
import { useToast } from '@/components/system/toast';
import { EmptyState } from '@/components/system/empty-state';
import { SystemInput } from '@/components/system/system-input';

const { success, error } = useToast();
success('保存成功');
```

## 待扩展（可选）
- `/verify` · `/onboarding` 独立页
- 各功能页 EmptyState 批量替换
- 表单页 system-input 全量迁移
