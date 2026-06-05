# 职航 — 统一品牌双主题系统

> Calm · Future · Precision · Air · Human · System

Dark 与 Light 不是两套 UI，而是同一 AI 品牌的两种状态。

---

## 架构

```
src/styles/theme-tokens.css     ← CSS 变量源（Light :root / Dark .dark）
src/lib/theme/tokens.ts         ← TS 侧 design tokens（组件/动画引用）
src/lib/theme/use-theme-transition.ts  ← 平滑切换 hook
tailwind.config.ts              ← ink / volt / stone 等映射到 var(--*)
src/app/globals.css               ← 页面级语义 class（system-page / hero / dashboard…）
```

### 主题切换流程

1. `next-themes` 在 `<html>` 上切换 `class="dark"`
2. `useThemeTransition().toggleTheme()` 切换前添加 `html.theme-transitioning`
3. CSS 变量在 `:root` / `.dark` 间插值（480ms，ease brand）
4. `ThemeTransitionInit` 同步 `color-scheme`，减少滚动条/表单 flash

---

## 色板

### Dark — 柔和深色工作空间

| Token | 值 | 用途 |
|-------|-----|------|
| `--surface-1` | `#0F1115` | 页面底色 |
| `--surface-2` | `#151821` | 次级背景 / gradient 中段 |
| `--surface-3` | `#1B1F2A` | 卡片 / 弹层 |
| `--text-primary` | `#E8EAED` | 主文字 |
| `--text-muted` | `#8B919E` | 次要文字 |
| `--accent` | `#9BB832` | 品牌 Lime（柔和荧光） |
| `--accent-glow` | `rgba(155,184,50,0.22)` | 边框 / glow |

**禁止**：纯黑 `#000`、高饱和 neon、赛博朋克渐变。

### Light — 高级中性浅主题

| Token | 值 | 用途 |
|-------|-----|------|
| `--surface-1` | `#F5F5F2` | 页面底色（warm off-white） |
| `--surface-2` | `#ECECE8` | 分区 / Landing 浅段 |
| `--surface-3` | `#FFFFFF` | 卡片 surface |
| `--text-primary` | `#1A1A1A` | 主文字（非纯黑） |
| `--text-secondary` | `#2A2A2A` | 强调段落 |
| `--accent` | `#7A9E12` | 品牌 Lime Accent |

**禁止**：纯白 `#FFF` 整页、蓝色 SaaS 风、普通后台灰。

---

## 语义组件 Class

| Class | 说明 |
|-------|------|
| `.system-page` | 功能页容器（surface-1 + text-primary） |
| `.system-card` / `.dashboard-*` | 半透明卡片 + subtle border + ambient shadow |
| `.workspace-toolbar-shell-active` | 顶栏滚动后浮动工具栏 |
| `.brand-hero` / `.campaign-hero` | Landing / 功能页 Hero（ambient glow + grain） |
| `.landing-light-section` | Landing 浅段（surface-2，双主题自适应） |
| `.auth-campaign` | 认证页（跟随 surface 层级） |

---

## Tailwind 用法

```tsx
// ✅ 语义色 — 随主题自动切换
className="bg-cloud text-ink border-hairline"
className="text-volt bg-volt/10"

// ❌ 避免硬编码
className="bg-[#050505] text-white"
className="border-white/10"
```

| Tailwind | CSS Variable |
|----------|--------------|
| `ink` | `--text-primary` |
| `stone` / `mute` | `--text-muted` / `--text-subtle` |
| `volt` | `--accent` |
| `cloud` | `--surface-1` |
| `canvas` | `--surface-3` |
| `hairline` | `--border-default` |

---

## 品牌 Accent 指南

- **Dark**：柔和荧光感，`--accent-soft` 做 hover / 选中底
- **Light**：高级 Lime，`--accent-glow` 做边框高光
- Glow 强度克制：`workspace-nav-glow`、Hero 粒子均使用 `--accent-glow`
- 旧 Volt `#b8e600` / `#ccff00` 已废弃

---

## 纹理与深度

- **Grain**：`body::after` 全屏 overlay，`--grain-opacity` 随主题微调
- **Shadow**：`--shadow-card` / `--shadow-float` 统一卡片深度
- **Gradient**：Hero / Auth 使用 `--ambient-glow`，非高对比电影感

---

## 开发 Checklist

- [ ] 新组件只用 `var(--*)` 或 Tailwind 语义色
- [ ] 不用 `text-white` 做正文（用 `text-ink`）
- [ ] 卡片用 `--card-bg` + `--card-border` + `--shadow-card`
- [ ] 主题切换走 `useThemeTransition().toggleTheme`
- [ ] 手动验证 Light / Dark 切换无 flash、对比度可读

---

## 参考气质

Dark: Linear · Arc · Vercel · OpenAI · Raycast  
Light: Apple · Linear Light · Arc · Notion
