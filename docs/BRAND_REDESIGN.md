# 职航 CareerCraft — Nike 级品牌视觉重构方案

> 基于 `DESIGN-nike.md` 分析 + Apple/Nike/Linear 运动科技美学融合  
> 技术栈：Next.js 15 · TailwindCSS · Framer Motion · 8pt Grid

---

## 1. 设计哲学

**摄影说话，Chrome 克制。** 80% 中性色（`#111` / `#fff` / `#f5f5f5`），15% 荧光 Volt（`#CCFF00`），5% 语义色（Sale/Success）。

| 层级 | Token | 用途 |
|------|-------|------|
| Display | `font-display` + `text-display-campaign` | 仅 Hero / Campaign 大标题 |
| Heading | `text-heading-xl/lg/md` | 区块标题、卡片名 |
| Body | `text-body-md` / `text-caption-*` | 正文、元数据 |
| Surface | `ink` / `canvas` / `cloud` | 背景与卡片 |
| Accent | `volt` | CTA、进度、数据高亮 |

---

## 2. 页面五屏叙事结构

```
┌─────────────────────────────────────────┐
│ ① Hero — 品牌冲击 (brand-hero, 100svh) │
├─────────────────────────────────────────┤
│ ② ValueProposition — 核心价值 (不对称)  │
├─────────────────────────────────────────┤
│ ③ FeatureShowcase + DashboardPreview     │
│    产品能力 (Nike product-card 网格)    │
├─────────────────────────────────────────┤
│ ④ CareerVault — 信任背书 + 对比表        │
├─────────────────────────────────────────┤
│ ⑤ Final CTA — 深色 Campaign 转化屏       │
└─────────────────────────────────────────┘
```

文件映射：

| 屏 | 组件 | 路径 |
|----|------|------|
| 1 | `Hero` | `src/components/landing/hero.tsx` |
| 2 | `ValueProposition` | `src/components/landing/value-proposition.tsx` |
| 3 | `FeatureShowcase` + `DashboardPreview` | `src/components/landing/` |
| 4–5 | `CareerVault` | `src/components/landing/career-vault.tsx` |

---

## 3. 设计系统组件层级

```
src/components/design-system/
├── brand-button.tsx    # Primary / Secondary / Outline / Volt
├── brand-card.tsx      # ProductCard / CampaignTile / BrandCard
├── motion.tsx          # Reveal / Stagger / Parallax / spring tokens
└── section-header.tsx  # BrandSectionHeader
```

### Button 规范

| Variant | 场景 |
|---------|------|
| `primary` | 浅色区主 CTA — 黑底白字 pill |
| `secondary` | 次要 — cloud 灰底 |
| `outline-dark` | 深色 Hero 描边按钮 |
| `volt` | 深色 Hero 主 CTA — 荧光品牌色 |

### Card 规范

- **零圆角** product-card（Nike 标准）
- **1px hairline** 边框，无 drop-shadow
- **hover**: `translateY(-3px)` + 边框加深（spring 0.45s）

---

## 4. 动效实现方案

使用 **Framer Motion**（已安装 `framer-motion@11`）：

| 动效 | 实现 | 时长 |
|------|------|------|
| 文本 Stagger | `Stagger` + `StaggerItem` + `fadeUp` | 0.65s ease-brand |
| 滚动 Reveal | `Reveal` + `whileInView` | 0.65s |
| Hero 视差 | `useScroll` + `useTransform` | 随滚动 |
| 按钮反馈 | `whileHover/Tap` spring | stiffness 260 |
| 进度条 | Header `scrollProgress` | 150ms |
| 滚动引导 | `animate-scroll-hint` CSS | 2s loop |

**ease 曲线**: `cubic-bezier(0.16, 1, 0.3, 1)` — Apple/Nike 官网同款缓出。

可选后续：接入 `@studio-freight/lenis` 平滑滚动（当前 `scroll-behavior: smooth` 已启用）。

---

## 5. Tailwind 结构

`tailwind.config.ts` 扩展：

- **colors**: `ink`, `canvas`, `cloud`, `volt`, `mute`, `hairline`…
- **fontFamily**: `sans` (Inter), `display` (Bebas Neue)
- **borderRadius**: `pill`, `pill-lg`, `none`
- **spacing**: `section`, `section-lg` (8pt 倍数)

CSS 工具类（`globals.css`）：

- `.brand-hero` / `.brand-hero-noise` — 深色沉浸式 Hero
- `.brand-nav` — 毛玻璃导航
- `.brand-card-flat` / `.brand-card-dark` — 卡片系统
- `.brand-editorial-width` — max 90rem + 响应式 gutter
- `.brand-display` — Display 字体 uppercase

---

## 6. 字体方案

| Nike 原版 | 开源替代 | 加载 |
|-----------|----------|------|
| Nike Futura ND | Bebas Neue | `next/font/google` |
| Helvetica Now | Inter | `next/font/google` |
| 中文 | PingFang SC / 微软雅黑 | system fallback |

配置：`src/lib/fonts.ts` → `layout.tsx` CSS variables。

---

## 7. 响应式策略

| 断点 | 调整 |
|------|------|
| `<640px` | Hero 单列、Display 缩至 48px、CTA 全宽 |
| `640–1024px` | 2-up 产品网格 |
| `≥1024px` | 不对称 7/5 价值区、4-up 产品网格 |
| `≥1440px` | editorial-width 80px gutter |

---

## 8. 后续迭代路线

1. **Phase 2**：7 个功能页 `GlassPageHero` → `CampaignTile` 统一
2. **Phase 3**：Cursor glow + page load skeleton
3. **Phase 4**：Lenis smooth scroll + GSAP section pin（可选）
4. **Phase 5**：Dark/Light 主题 token 完全分离

---

## 9. 开发验证

```bash
npm run dev          # localhost:3000
npx tsc --noEmit     # 类型检查
npm run build        # 生产构建
```

参考设计源文件：`docs/DESIGN-nike.md`
