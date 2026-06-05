# Phase 3.5 — 体验颗粒度统一

> 目标：让整个产品像「未来 AI 人才操作系统」，而非若干功能页面的拼接。

## 核心交付

### 1. EmptyState System

- **组件**：`FeatureEmpty`（`src/components/system/feature-empty.tsx`）
- **增强**：`EmptyState` 支持 `onClick` CTA + 微动效光晕
- **已接入 7 功能页**：
  | 页面 | preset key |
  |------|------------|
  | `/dashboard` | `dashboard` |
  | `/materials` | `materials` / `materials-search` |
  | `/talent/matching` | `matching-positions` / `matching` |
  | `/jd-analyzer` | `jd-analyzer` |
  | `/resume-builder` | `resume-builder` |
  | `/applications` | `applications` |

### 2. Verify Page

- **路径**：`/verify`
- **文件**：`src/app/verify/page.tsx` + `verify-content.tsx`
- **四态**：loading → success / expired / error
- **调试**：`?state=success|expired|error` 或 `?token=expired|error`

### 3. Onboarding

- **路径**：`/onboarding`
- **四步**：Identity → Goal → AI Preference → System Ready
- **组件**：`SystemInput` / `SystemSelect` + progress bar + cinematic motion

### 4. Form System

- **SystemInput** / **SystemTextarea** / **SystemSelect**（`system-input.tsx`）
- **已迁移**：materials 搜索、matching 搜索、onboarding 表单
- **待续**：applications 筛选、jd-analyzer 文本域、settings 细项

### 5. Async Action + Toast

- **文案库**：`src/lib/feedback/messages.ts`（FB / FB_ZH）
- **Hook**：`useSystemFeedback()` — `success('analysisComplete')` 等
- **Toast 增强**：processing / warning + blur enter + icon spring
- **已替换 alert**：matching、interview、tailored-resume-panel、chat-panel

### 6. Status System

- **组件**：`StatusPanel` / `StatusBadge` / `ProcessingOverlay`（`status.tsx`）
- **展示页**：`/system/status`（设计系统参考，非 API）

### 7. 反馈语言规范

| 避免 | 使用 |
|------|------|
| 操作成功 | System Updated |
| 加载失败 | Connection Lost — Retry When Ready |
| 分析完成 | Analysis Complete |
| 提交完成 | Data Synced |

## 文件索引

```
src/components/system/
├── empty-state.tsx      # 基础 Empty + motion
├── feature-empty.tsx    # 7 页 preset
├── status.tsx           # 统一状态面板
├── toast.tsx            # 系统反馈 toast
└── system-input.tsx     # Input / Textarea / Select

src/lib/feedback/
├── messages.ts
└── use-system-feedback.ts

src/app/
├── verify/
├── onboarding/
└── system/status/
```

## 验证

```bash
npm run dev
# /verify / /onboarding / /system/status
# 各功能页空状态 + matching 上传/分析 toast
npx tsc --noEmit
```

## 关键词

System · Motion · Precision · Future · Human · Intelligence · Energy
