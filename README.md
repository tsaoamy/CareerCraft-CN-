# 🚀 CareerCraft CN

> **一个职业档案，多岗位智能适配**
> 
> 只需录入一次经历，AI 自动为每个岗位生成专属简历。

---

## 📁 项目结构

```
careercraft-cn/
├── src/
│   ├── app/                      # Next.js 15 App Router
│   │   ├── page.tsx              # Landing Page（首页）
│   │   ├── layout.tsx            # 根布局（Header + Footer）
│   │   ├── login/page.tsx        # 登录页
│   │   ├── register/page.tsx     # 注册页
│   │   ├── dashboard/page.tsx    # 工作台
│   │   ├── materials/page.tsx    # 职业素材库
│   │   ├── jd-analyzer/page.tsx  # JD 解析器
│   │   ├── resume-builder/       # AI 简历定制
│   │   ├── interview/page.tsx    # AI 面试官
│   │   └── settings/page.tsx     # 个人中心
│   ├── components/
│   │   ├── ui/                   # Button, Card, Input, Badge
│   │   ├── layout/               # Header, Footer
│   │   ├── landing/              # Hero, CareerVault
│   │   └── theme-provider.tsx    # 深色模式
│   └── lib/utils.ts
├── package.json
├── tailwind.config.ts
├── next.config.js
└── setup.bat                     # 一键安装启动脚本
```

## 🎯 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 15 App Router |
| 语言 | TypeScript |
| 样式 | TailwindCSS |
| UI 组件 | 自建 shadcn 风格 (Button, Card, Input, Badge) |
| 图标 | Lucide React |
| 动画 | Framer Motion |
| 深色模式 | next-themes |
| 后端 (Phase 2+) | CloudBase (PostgreSQL, Auth, AI) |

## 🏃 快速开始

### Windows（双击运行）
```
双击 setup.bat → 自动安装依赖 → 启动开发服务器
```

### 手动启动
```bash
npm install --legacy-peer-deps
npm run dev
```

访问 **http://localhost:3000**

## 🎨 设计特色

- **深色/浅色模式**：右上角一键切换
- **移动端适配**：完全响应式设计
- **毛玻璃效果**：导航栏使用 backdrop-blur
- **渐变动画**：品牌色渐变文字动画
- **统一设计语言**：基于 blue/purple 主色调

## 📋 Phase 1 完成清单

- [x] Next.js 15 + TypeScript 框架
- [x] Landing Page（Hero + CareerVault）
- [x] 登录 / 注册页面
- [x] 工作台 Dashboard（统计 + 动态 + 快捷操作）
- [x] 职业素材库（Material Library 占位）
- [x] JD 解析器（JD Analyzer 占位）
- [x] 简历定制器（Resume Builder 占位）
- [x] AI 面试官（Interview 占位）
- [x] 个人中心（Settings 占位）
- [x] 深色模式支持
- [x] 响应式设计
- [x] 中文界面

## 🔮 下一步（Phase 2-6）

| Phase | 内容 |
|-------|------|
| 2 | 职业素材库 CRUD + STAR 拆解 + CloudBase 存储 |
| 3 | JD 解析器 AI 集成（DeepSeek API） |
| 4 | AI 简历定制 + PDF/DOCX 导出 |
| 5 | AI 面试官聊天模式 |
| 6 | 订阅系统 + 支付集成 |
