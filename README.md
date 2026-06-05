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
| 部署 | CloudBase CloudRun (Container) |

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

## 🌐 线上部署

| 项目 | 详情 |
|------|------|
| **平台** | 腾讯云 CloudBase |
| **环境 ID** | `careercraft-d4gfk3hi163786996` |
| **区域** | 上海 (`ap-shanghai`) |
| **访问地址** | [https://careercraft-cn-264754-8-1435862329.sh.run.tcloudbase.com/](https://careercraft-cn-264754-8-1435862329.sh.run.tcloudbase.com/) |
| **服务类型** | CloudRun 容器 (Next.js 15 standalone) |
| **规格** | 1 CPU / 2 GB 内存 / 1-3 实例 |
| **构建方式** | Dockerfile 多阶段构建（云端自动 npm ci + next build） |
| **数据库** | CloudBase NoSQL 文档数据库 (18个集合) |
| **认证方式** | CloudBase Auth v3 (用户名密码 / 手机号) + JWT |
| **最近部署** | 2026-06-03 (v017) |

### 🔧 环境变量

| 变量 | 说明 |
|------|------|
| `CLOUDBASE_ENV_ID` | CloudBase 环境 ID (`careercraft-d4gfk3hi163786996`) |
| `USE_CLOUDBASE` | 启用 CloudBase NoSQL (`true`) |
| `NODE_ENV` | 运行模式 (`production`) |
| `NEXT_PUBLIC_CLOUDBASE_ENV_ID` | 前端 CloudBase 环境 ID |
| `NEXT_PUBLIC_CLOUDBASE_REGION` | 前端区域 (`ap-shanghai`) |
| `NEXT_PUBLIC_CLOUDBASE_PUBLISHABLE_KEY` | CloudBase Auth 公钥（构建时注入） |

### ☁️ 多端实时同步

所有用户数据存储在 CloudBase NoSQL 云端数据库，支持**多设备、多用户实时同步**：

- 🔐 **用户系统**：`cv_users` — 用户账号、登录态（登录即同步）
- 📦 **素材库**：`cv_user_materials` — 简历素材、面试笔记、项目经验（写入即同步）
- 📋 **投递记录**：`cv_user_applications` — 求职投递状态跟踪（实时更新）
- 👤 **个人资料**：`cv_user_profiles` — 用户偏好设置
- 🤝 **团队共享**：`cv_workspace_snapshot` — 跨用户可见的内容快照
- 🎯 **人才画像**：`cv_talent_profiles` — AI 分析结果云端存储
- 💼 **岗位匹配**：`cv_job_positions` / `cv_job_matches` — 岗位库和匹配记录
- 📊 **行为分析**：`cv_user_events` / `cv_daily_stats` — 埋点事件和 DAU/MAU 统计
- 🤖 **Prompt 管理**：`cv_prompt_templates` 等 — AI Prompt 版本管理和调用日志
- 🏢 **企业版**：`cv_enterprise_users` 等 — 企业用户和简历批量分析

> **验证方式**：用户A在电脑端添加素材/投递 → 用户B在手机端登录同一账号 → 数据实时同步显示

### 🔧 重新部署

```bash
# 本地构建
npm run build

# 通过 CloudBase CLI 部署
tcb cloudrun deploy careercraft-cn --source .
```

或者通过控制台：[CloudRun 管理](https://tcb.cloud.tencent.com/dev?envId=careercraft-d4gfk3hi163786996#/platform-run) → 点击「新建版本」→ 选择代码包部署

### 🖥️ 控制台入口

| 功能 | 链接 |
|------|------|
| **环境概览** | [查看](https://tcb.cloud.tencent.com/dev?envId=careercraft-d4gfk3hi163786996#/overview) |
| **CloudRun 服务** | [管理](https://tcb.cloud.tencent.com/dev?envId=careercraft-d4gfk3hi163786996#/platform-run) |
| **NoSQL 数据库** | [管理](https://tcb.cloud.tencent.com/dev?envId=careercraft-d4gfk3hi163786996#/db/doc) |
| **身份认证** | [配置](https://tcb.cloud.tencent.com/dev?envId=careercraft-d4gfk3hi163786996#/identity) |
| **静态托管** | [管理](https://tcb.cloud.tencent.com/dev?envId=careercraft-d4gfk3hi163786996#/static-hosting) |

> ⚠️ 测试域名有访问限制，生产环境请绑定自定义域名。数据库控制台：[NoSQL 数据库](https://tcb.cloud.tencent.com/dev?envId=careercraft-d4gfk3hi163786996#/db/doc)

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
