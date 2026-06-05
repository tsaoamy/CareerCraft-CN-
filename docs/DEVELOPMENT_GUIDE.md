# 职航 CareerCraft CN — 完整开发目录与设计方案

> **文档版本**：v1.0  
> **更新日期**：2026-05-29  
> **适用仓库**：`careercraft-cn/`  
> **文档性质**：项目总纲 — 含需求定义、架构设计、目录说明、模块方案、迭代计划与验收标准

---

## 目录

1. [项目概述](#1-项目概述)
2. [需求定义（精确描述）](#2-需求定义精确描述)
3. [用户与业务场景](#3-用户与业务场景)
4. [产品架构与主流程](#4-产品架构与主流程)
5. [技术架构](#5-技术架构)
6. [完整开发目录（文件树）](#6-完整开发目录文件树)
7. [模块详细设计](#7-模块详细设计)
8. [数据模型与持久化方案](#8-数据模型与持久化方案)
9. [核心算法设计](#9-核心算法设计)
10. [API 接口规范](#10-api-接口规范)
11. [国际化（i18n）方案](#11-国际化i18n方案)
12. [UI/UX 设计规范](#12-uiux-设计规范)
13. [安全与权限](#13-安全与权限)
14. [测试与质量保障](#14-测试与质量保障)
15. [已知问题与差距分析](#15-已知问题与差距分析)
16. [分阶段开发计划](#16-分阶段开发计划)
17. [验收标准](#17-验收标准)
18. [环境配置与运行](#18-环境配置与运行)
19. [附录](#19-附录)

---

## 1. 项目概述

### 1.1 产品定位

**职航（CareerCraft CN）** 是一款面向中国求职场景（尤其校招/实习）的 **AI 求职智能体平台**。

核心理念：

> **一个职业档案，多岗位智能适配** — 用户只需录入一次经历素材，系统可针对不同目标岗位自动完成 JD 分析、简历定制、面试准备与投递追踪。

### 1.2 目标用户

| 用户群 | 典型场景 |
|--------|----------|
| 校招/实习求职者 | 上传简历 → 拆解经历 → 针对 JD 定制简历 → 模拟面试 → 记录投递 |
| 社招转岗者 | 维护素材库 → 多岗位匹配分析 → 一键生成定向简历 |
| 企业 HR（企业版） | 批量简历解析、筛选、排名（Phase 7） |
| 平台管理员 | 用户管理、Prompt 管理、AI 监控、数据分析 |

### 1.3 产品边界

**包含**：
- 职业素材库（STAR 结构化经历管理）
- 简历上传与本地/服务端解析
- JD 分析与岗位匹配
- AI 简历定制（本地引擎 + LLM 双路径）
- AI 模拟面试（行为/情景/技术维度）
- 投递进度追踪
- 人才画像与智能匹配
- 管理后台
- 中英文双语界面

**不包含（当前版本）**：
- 真实招聘平台 API 对接（Boss/猎聘等仅作渠道标签）
- 自动代投递
- 付费订阅完整闭环（Schema 预留）

### 1.4 当前实现状态（2026-05）

| 模块 | 完成度 | 说明 |
|------|--------|------|
| 用户认证 | ✅ 可用 | 邮箱/手机注册登录，JWT |
| 职业素材库 | ✅ 可用 | 上传解析、CRUD、筛选 |
| 简历识别 | ✅ 已优化 | 中文校招格式；奖项/校园任职可识别 |
| JD 分析枢纽 | ✅ 可用 | 四 Tab 串联分析/简历/面试/投递 |
| AI 简历定制 | ✅ 可用 | 简化流程；本地+API 双路径 |
| 智能匹配 | ⚠️ 演示级 | 关键词启发式+随机扰动，需升级 |
| 投递追踪 | ⚠️ 基础 | 功能齐全但仅 localStorage |
| 全站 i18n | ⚠️ 部分 | 主页面已接入，表单/面试等待收尾 |
| 管理后台 | ⚠️ 开发态 | 存在 mock 免登录，生产需加固 |
| 单元测试 | ❌ 缺失 | 仅简历解析 sample 脚本 |

---

## 2. 需求定义（精确描述）

本节汇总产品方/用户在本项目中提出的全部核心需求，作为开发与验收的**唯一需求基线**。

### 2.1 全站国际化（i18n）

**需求描述**：
- 用户切换语言为 English (EN) 后，**全站所有可见文案**须为英文，不得残留中文。
- 至少覆盖：导航、页脚、工作台、素材库、JD 分析、简历定制、智能匹配、投递追踪、面试模块、错误提示、空状态、表单标签。

**验收标准**：
- 在 EN locale 下逐页人工走查，无硬编码中文（除用户自身输入内容）。
- 分类标签、渠道标签、状态标签统一走 `shared-labels.ts` 或 `page-translations.ts`。

**当前差距**：
- `material-form.tsx` 完全未接入 i18n
- 面试子组件 `prep-library`、`result-report` 部分中文
- API/alert 错误信息多为中文
- 离线匹配建议 `generateLocalResult` 硬编码中文

---

### 2.2 AI 简历定制（简化 + 真 AI 适配）

**需求描述**：
- 页面流程须**简化**：目标岗位 → 一键 AI 适配 → 查看/微调，去除假版本历史、静态 ATS 分数、复杂侧栏等干扰元素。
- **真 AI 适配**：根据目标岗位 JD，对用户素材库内容进行：
  - 针对性改写（岗位关键词嵌入）
  - 经历排序（与岗位相关度优先）
  - STAR 格式 bullet 增强
  - 给出补充建议与可新增经历模板
- 无 AI Key 时须有无缝本地回退，但须向用户标明来源（local / ai）。

**验收标准**：
- 输入 JD 后 10 秒内（本地）或 30 秒内（API）产出可编辑简历段落。
- 生成内容与 JD 关键词有可验证关联（非纯模板拼接）。
- AI 路径不得丢失本地 bullet 增强；评分与展示内容一致。

**当前差距**：
- AI 成功时 `sections` 被 AI 结果直接覆盖，丢失本地 `materialToExperienceBlock` 增强
- `matchScore` 与可见 sections 来源不一致
- 生成失败无用户提示

---

### 2.3 简历识别优化

**需求描述**：
- 上传 PDF/Word/TXT 简历时，须准确识别并结构化提取：
  - 教育背景
  - 实习/工作经历
  - 项目经历
  - **荣获奖项 / 荣誉奖项**
  - **校园经历 / 学生工作 / 学校任职**
  - 竞赛、科研
  - 技能特长
  - 联系方式（姓名、手机、邮箱）
- 识别结果可一键批量导入素材库，分类正确、标题清晰、无重复、无技能段污染。

**支持的简历格式特征**：
- 中文章节标题（教育背景、实习经历、荣获奖项、校园经历等）
- 日期格式：`2024.06`、`2024年6月`、`2020.09 - 2024.06`
- Markdown `#` 标题、中文序号（一、二、）、方括号标题【】
- PDF/Word 提取后的换行合并

**验收标准**（标准样例简历）：
- 识别 ≥7 段经历，含教育 1、实习 ≥1、项目 ≥1、校园任职 ≥1、奖项 ≥1
- 标题无 `10 国家励志奖学金` 类碎数字前缀
- 无「实习经历」串入教育标题
- 无重复条目

**当前差距**：
- 教育经历归类为 `campus` 而非独立 `education` 类型
- 非标准日期格式教育段可能被过滤
- 英文简历关键词提取弱
- UI 文案写「AI 提取」实为本地启发式

---

### 2.4 智能匹配算法准确性

**需求描述**：
- 智能匹配页（`/talent/matching`）须给出**稳定、可解释、与简历/JD 真实相关**的匹配结果。
- 不得使用随机数扰动分数。
- 匹配维度至少包含：关键词覆盖率、技能缺口、竞争力、优化建议、相关岗位推荐、成长路径。
- 与 JD 分析页、投递追踪中保存的 `matchScore` **口径一致**。

**验收标准**：
- 同一简历 + 同一岗位，连续 3 次分析分数差异 ≤ 2 分。
- 推荐岗位与目标岗位行业/技能有实际关联，非虚高 overlap。
- UI 若未调用 LLM，不得标注「AI 分析」（或明确标注「规则估算」）。

**当前差距**：
- `simulateMatching()` 含 `Math.random()` 扰动
- 三套评分：`/talent/matching`、`jd-analyzer`、`/api/ai/match` 互不打通
- `buildRelatedPositions` 计分逻辑有误
- 行业筛选项与种子数据不一致（缺「智能制造」）

---

### 2.5 投递追踪功能完善

**需求描述**：
- 用户可手动新增投递记录，也可从 JD 分析枢纽一键保存。
- 支持：公司、岗位、渠道、状态、JD 原文、匹配分、薪资、地点、进展记事、时间线事件。
- 统计数据：总数、各状态分布、各渠道分布、面试率、Offer 率。
- 数据须**登录后持久化、跨设备同步**，游客数据登录后可合并。

**验收标准**：
- 登录用户投递记录写入服务端，刷新/换浏览器不丢失。
- 状态变更可选自动写入时间线事件。
- 英文界面下时间线事件文案为英文。

**当前差距**：
- 仅存 `localStorage`，无 REST API
- `guest` 与 `userId` 隔离，登录后看不到游客期数据
- 状态变更不写进展事件
- 部分文案硬编码中文

---

### 2.6 整体质量与流畅度

**需求描述**：
- 主链路（素材库 → JD 分析 → 简历定制 → 面试 → 投递）无断点、无静默失败。
- 未登录用户操作须有明确提示（素材/投递不可持久化）。
- 管理后台生产环境须真实鉴权。
- 构建无 TypeScript 错误；关键路径有自动化测试。

**验收标准**：
- `npm run build` 通过
- 表单校验失败有用户可见反馈
- 文件上传失败有明确错误（含大小、格式）
- 管理后台 mock 免登录仅在 `NODE_ENV=development` 启用

---

## 3. 用户与业务场景

### 3.1 核心用户故事

```
作为 校招求职者，
我希望 上传一份 PDF 简历后自动拆成多段经历，
以便 在素材库中编辑 STAR 并复用到不同岗位。
```

```
作为 求职者，
我希望 粘贴目标 JD 后一键生成定向简历，
以便 快速投递而不从零写简历。
```

```
作为 求职者，
我希望 在 JD 分析页完成分析后保存到投递追踪，
以便 统一管理所有申请进度。
```

```
作为 求职者，
我希望 切换英文界面后所有菜单和表单都是英文，
以便 在外企场景下使用。
```

### 3.2 主链路时序

```
注册/登录
    ↓
上传简历 → 解析 → 导入素材库（STAR 编辑）
    ↓
选择/粘贴 JD → JD 分析（技能匹配、缺口、建议）
    ↓
    ├→ AI 简历定制（按 JD 改写素材）
    ├→ AI 面试准备（维度选题）
    └→ 保存投递追踪
    ↓
智能匹配（选岗 → 分析 → 推荐岗位 → 定制简历）
    ↓
投递管理（状态更新、进展记事、统计）
```

---

## 4. 产品架构与主流程

### 4.1 信息架构（站点地图）

```
/                     落地页
/login, /register     认证
/dashboard            工作台（入口聚合）
/materials            职业素材库
/talent               人才画像
/talent/matching      智能岗位匹配
/jd-analyzer          JD 分析（Job Analysis Hub）
/resume-builder       AI 简历定制
/interview            AI 模拟面试
/applications         投递追踪
/settings             个人中心
/enterprise           企业版
/admin/*              管理后台
/about, /help, ...    静态页
```

### 4.2 Job Analysis Hub（产品枢纽）

组件：`src/components/talent/job-analysis-hub.tsx`  
页面：`src/app/jd-analyzer/page.tsx`

| Tab | 功能 | 依赖 |
|-----|------|------|
| 分析 | JD 解析、技能匹配、缺口、建议 | `jd-analyzer.ts` + 素材库 skills |
| 定制简历 | 跳转/内嵌简历生成 | `resume-ai-engine.ts` |
| 面试准备 | 维度与题目推荐 | `interview-prep.ts` |
| 投递追踪 | 保存到 applications | `application-context.tsx` |

### 4.3 导航配置

**Header 主链**（`src/components/layout/header.tsx`）：
`工作台 → 素材库 → 智能匹配 → JD 分析 → 简历定制 → AI 面试 → 投递管理`

**Footer**：产品链 + 帮助/隐私/条款/关于/博客/更新日志/招聘/联系

---

## 5. 技术架构

### 5.1 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 App Router |
| 语言 | TypeScript 5 |
| UI | React 18 + Tailwind CSS 3 + 自建 shadcn 风格组件 |
| 动画/主题 | framer-motion + next-themes |
| 图表 | echarts / recharts |
| 认证 | jose (JWT) + bcryptjs |
| 数据库 | sql.js → `.careercraft.db.sqlite` |
| 文档解析 | pdf-parse + mammoth + word-extractor |
| AI | OpenAI 兼容 API（`src/lib/ai/engine.ts`），含离线回退 |
| 客户端状态 | React Context + localStorage |

### 5.2 分层架构

```
┌─────────────────────────────────────────────────┐
│  Presentation Layer (pages + components)        │
├─────────────────────────────────────────────────┤
│  State Layer (Context: auth, material, app...)  │
├─────────────────────────────────────────────────┤
│  Domain Layer (lib: resume-extract, jd-analyzer)│
├─────────────────────────────────────────────────┤
│  API Layer (app/api/* route handlers)           │
├─────────────────────────────────────────────────┤
│  Data Layer (sql.js repositories + localStorage)│
└─────────────────────────────────────────────────┘
```

### 5.3 部署架构（当前）

```
Next.js standalone (output: 'standalone')
    ├── 服务端：API Routes + sql.js 文件 DB
    └── 客户端：React SPA + localStorage 缓存
```

**规划演进**：素材库、投递、用户资料迁移至 SQLite/API；可选 CloudBase/PostgreSQL。

### 5.4 AI 双路径策略

```
用户请求
    ↓
检测 OPENAI_API_KEY / 兼容 Key
    ↓
有 Key → 调用 LLM（engine.ts）
    ↓ 失败
无 Key / 失败 → 本地规则引擎回退
    ↓
返回结果 + source: 'ai' | 'local'
```

适用模块：简历生成、匹配、面试评分、Copilot 对话。

---

## 6. 完整开发目录（文件树）

```
careercraft-cn/
├── docs/
│   └── DEVELOPMENT_GUIDE.md          ← 本文档
├── public/
│   └── images/                       静态资源
├── src/
│   ├── app/                          Next.js App Router
│   │   ├── layout.tsx                根布局（AppProviders）
│   │   ├── page.tsx                  落地页
│   │   ├── globals.css
│   │   ├── error.tsx / not-found.tsx / global-error.tsx
│   │   │
│   │   ├── login/page.tsx            登录
│   │   ├── register/page.tsx         注册
│   │   ├── dashboard/page.tsx        工作台
│   │   ├── materials/page.tsx        职业素材库
│   │   ├── jd-analyzer/page.tsx      JD 分析（Hub 容器）
│   │   ├── resume-builder/page.tsx   AI 简历定制
│   │   ├── interview/page.tsx        AI 模拟面试
│   │   ├── applications/page.tsx     投递追踪
│   │   ├── talent/
│   │   │   ├── page.tsx              人才画像
│   │   │   └── matching/page.tsx     智能岗位匹配
│   │   ├── settings/page.tsx         个人中心
│   │   ├── enterprise/page.tsx       企业版
│   │   ├── about|blog|help|...       静态内容页
│   │   │
│   │   ├── admin/                    管理后台
│   │   │   ├── layout.tsx            侧栏布局（⚠️ 含 mock 鉴权）
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── users|resumes|prompts|ai-monitor|analytics|...
│   │   │   └── ...
│   │   │
│   │   └── api/                      Route Handlers
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   ├── register/route.ts
│   │       ├── send-code/route.ts
│   │       │   ├── me/route.ts
│   │       │   ├── bind-email/route.ts
│   │       │   └── bind-phone/route.ts
│   │       ├── ai/
│   │       │   ├── chat/route.ts
│   │       │   ├── match/route.ts
│   │       │   ├── enhance/route.ts
│   │       │   ├── review/route.ts
│   │       │   ├── generate-resume/route.ts
│   │       │   ├── extract-resume/route.ts
│   │       │   ├── parse-resume-file/route.ts   PDF/Word 解析
│   │       │   └── analytics/route.ts
│   │       ├── talent/
│   │       │   ├── route.ts
│   │       │   └── matching/route.ts            智能匹配 API
│   │       ├── dashboard/route.ts
│   │       ├── enterprise/route.ts
│   │       ├── events/route.ts
│   │       └── admin/
│   │           ├── users/route.ts
│   │           ├── stats/route.ts
│   │           └── prompts/[id]/route.ts
│   │
│   ├── components/
│   │   ├── ui/                       Button, Card, Input, Badge...
│   │   ├── layout/                   Header, Footer
│   │   ├── landing/                  Hero, CareerVault
│   │   ├── materials/
│   │   │   ├── material-form.tsx     ⚠️ 待 i18n
│   │   │   └── material-card.tsx
│   │   ├── talent/
│   │   │   ├── job-analysis-hub.tsx  JD 枢纽四 Tab
│   │   │   └── tailored-resume-panel.tsx
│   │   ├── interview/                面试 UI 子组件
│   │   ├── ai-copilot/               全局 AI 浮窗
│   │   ├── admin/                    管理端组件
│   │   └── app-providers.tsx         全局 Provider 挂载
│   │
│   ├── lib/
│   │   ├── resume-extract.ts         ★ 简历文本解析（本地启发式）
│   │   ├── resume-extract.test-sample.ts  手动测试脚本
│   │   ├── resume-file-parser.ts     PDF/Word 二进制解析
│   │   ├── resume-ai-engine.ts       ★ AI 简历生成引擎
│   │   ├── tailored-resume.ts        岗位定制简历
│   │   ├── jd-analyzer.ts            ★ JD 分析 + calculateMatch
│   │   ├── resume-progress.ts        简历完成度
│   │   ├── profile-hints.ts          资料完善提示
│   │   │
│   │   ├── interview-engine.ts       面试评分引擎
│   │   ├── interview-job-audit.ts    岗位审核
│   │   ├── interview-code-runner.ts  代码题执行
│   │   │
│   │   ├── ai/
│   │   │   ├── engine.ts             ★ LLM 统一调用
│   │   │   ├── prompts.ts
│   │   │   ├── types.ts
│   │   │   └── offline-chat.ts
│   │   │
│   │   ├── db/
│   │   │   ├── index.ts              sql.js 初始化
│   │   │   ├── schema.ts             ★ 完整 Schema（7 Phase）
│   │   │   └── repositories/
│   │   │       ├── user.ts
│   │   │       ├── matching.ts
│   │   │       ├── talent.ts
│   │   │       ├── enterprise.ts
│   │   │       ├── event.ts
│   │   │       └── prompt.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── jwt.ts
│   │   │   ├── rbac.ts
│   │   │   └── verification.ts
│   │   ├── api/middleware.ts         requireAuth / requireAdmin
│   │   ├── api-client.ts
│   │   │
│   │   ├── auth-context.tsx
│   │   ├── material-context.tsx      素材库（localStorage）
│   │   ├── application-context.tsx   投递（localStorage）⚠️
│   │   ├── user-profile-context.tsx
│   │   ├── notification-context.tsx
│   │   │
│   │   ├── i18n/
│   │   │   ├── translations.ts       导航/通用
│   │   │   ├── page-translations.ts  各页面文案
│   │   │   ├── shared-labels.ts      分类/渠道/状态
│   │   │   ├── interview-labels.ts
│   │   │   └── locale-context.tsx
│   │   │
│   │   ├── admin/                    管理端服务
│   │   ├── utils.ts
│   │   ├── avatar-utils.ts
│   │   └── site-config.ts
│   │
│   ├── data/
│   │   ├── job-positions.ts          岗位种子数据
│   │   └── interview-prep.ts         面试维度/题目
│   │
│   ├── types/
│   │   ├── material.ts               MaterialCategory, STAR
│   │   ├── application.ts            投递类型
│   │   ├── interview.ts
│   │   ├── user-profile.ts
│   │   ├── notification.ts
│   │   ├── admin.ts
│   │   └── api.ts
│   │
│   └── hooks/
│       ├── use-admin.ts
│       └── use-draggable-float.ts
│
├── .careercraft.db.sqlite            运行时 SQLite（gitignore）
├── next.config.js                    standalone + 外部包
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── setup.bat                         Windows 一键启动
└── README.md                         快速入门（部分过时，以本文档为准）
```

### 6.1 关键文件职责速查

| 文件 | 职责 | 修改频率 |
|------|------|----------|
| `resume-extract.ts` | 简历结构化解析 | 高 |
| `resume-ai-engine.ts` | 简历生成核心 | 高 |
| `jd-analyzer.ts` | JD 分析 + 匹配分 | 高 |
| `api/talent/matching/route.ts` | 智能匹配 API | 高 |
| `job-analysis-hub.tsx` | 产品枢纽 UI | 中 |
| `material-form.tsx` | 上传/编辑表单 | 中 |
| `application-context.tsx` | 投递状态 | 高（待迁移 API） |
| `page-translations.ts` | 页面 i18n | 中 |
| `db/schema.ts` | 数据模型真理来源 | 低 |

---

## 7. 模块详细设计

### 7.1 职业素材库（Material Library）

**路由**：`/materials`  
**Context**：`material-context.tsx`  
**类型**：`types/material.ts`

#### 7.1.1 数据模型

```typescript
type MaterialCategory = 'internship' | 'project' | 'competition' | 'research' | 'campus';
// 规划新增：'education' | 'award'（或 award 归 competition/campus）

interface Material {
  id: string;
  title: string;
  category: MaterialCategory;
  dateRange?: string;
  rawContent: string;
  star: { situation, task, action, result };
  tags: string[];
  skills: string[];
  highlights: string[];
  createdAt: string;
  updatedAt: string;
}
```

#### 7.1.2 上传解析流程

```
用户选择 PDF/Word/TXT
    ↓
parseResumeFile(file)
    ├─ txt/md/csv → 客户端 parseResumeContent()
    └─ pdf/doc/docx → POST /api/ai/parse-resume-file
                          → parseResumeBuffer()
                          → parseResumeContent()
    ↓
返回 { text, experiences[], skills[], keywords[], contact }
    ↓
MaterialForm 填充 + 批量导入 pendingImports
    ↓
用户确认 → addMaterial / addMaterials
    ↓
localStorage: careercraft-materials-{userId}
```

#### 7.1.3 待实现改进

- [ ] `material-form.tsx` 全面 i18n
- [ ] 未登录禁止保存 + 登录引导
- [ ] 快速模板传递正确 category
- [ ] 表单校验错误提示
- [ ] 客户端 10MB 预检
- [ ] STAR 自动拆解（调用 `/api/ai/enhance` 或本地规则）
- [ ] 素材库迁移至 SQLite `materials` 表（新建）

---

### 7.2 简历识别引擎

**核心**：`src/lib/resume-extract.ts`（~870 行）

#### 7.2.1 解析流水线

```
normalizeResumeText()        规范化 PDF 换行、合并日期行
    ↓
splitSections()              按 SECTION_DEFS 切分章节
    ↓
parseStructuredResume()      分章节解析
    ├─ parseEducationSection()
    ├─ parseSectionEntries()  实习/项目/科研
    ├─ parseCampusSection()   校园/任职
    └─ parseAwardsSection()   荣获奖项
    ↓
scanOrphanSections()         补救未分段落
    ↓
去重 + 过滤 + slice(0, 20)
```

#### 7.2.2 章节定义（SECTION_DEFS）

| key | 中文标签示例 | 默认 category |
|-----|-------------|---------------|
| education | 教育背景、Education | —（单独处理） |
| internship | 实习经历 | internship |
| work | 工作经历 | internship |
| project | 项目经历 | project |
| campus | 校园经历、学生工作、学校任职 | campus |
| awards | 荣获奖项、荣誉奖项 | competition |
| competition | 竞赛经历 | competition |
| research | 科研经历 | research |
| skills | 技能特长 | skipExperience |

#### 7.2.3 设计改进方案

**新增 MaterialCategory**：

```typescript
type MaterialCategory =
  | 'education'    // 新增：教育背景
  | 'internship'
  | 'project'
  | 'competition'
  | 'research'
  | 'campus';
```

**教育过滤修复**：去重时检查 `title + description` 是否含学历关键词。

**测试**：建立 Vitest 套件，覆盖样例 + 边界 case（无日期、英文简历、PDF 拆行）。

---

### 7.3 JD 分析

**核心**：`src/lib/jd-analyzer.ts`  
**页面**：`src/app/jd-analyzer/page.tsx`

#### 7.3.1 输出结构

```typescript
interface JDAnalysisResult {
  title: string;
  company: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  requirements: string[];
  keywords: string[];
  matchScore: number;          // 素材 skills 覆盖率
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}
```

#### 7.3.2 匹配分计算（目标统一方案）

```typescript
function calculateUnifiedMatch(
  jdKeywords: string[],
  materialSkills: string[],
  resumeText: string
): {
  matchScore: number;          // 0-100，确定性
  keywordCoverage: number;
  matched: string[];
  missing: string[];
}
```

**规则**：
1. 关键词归一化（小写、同义词表）
2. 命中 = 在 skills 或 resumeText 中出现
3. `matchScore = matched.length / required.length * 100`
4. **禁止 Math.random()**

此函数将被 `jd-analyzer.ts`、`matching/route.ts`、投递保存 **共同引用**。

---

### 7.4 AI 简历定制

**页面**：`src/app/resume-builder/page.tsx`  
**引擎**：`src/lib/resume-ai-engine.ts`  
**API**：`POST /api/ai/generate-resume`

#### 7.4.1 简化 UI 结构

```
┌─────────────────────────────────────────────┐
│ 目标岗位 JD 输入区                            │
│ [粘贴 JD] [从素材库选岗]                       │
├─────────────────────────────────────────────┤
│ [一键 AI 适配]  source: ai | local           │
├─────────────────────────────────────────────┤
│ 生成结果（可编辑段落）                          │
│ · 个人摘要                                   │
│ · 经历列表（排序后 STAR bullets）              │
├─────────────────────────────────────────────┤
│ 补充建议 + 可新增经历模板                       │
├─────────────────────────────────────────────┤
│ [复制全文] [导出] [重新生成]                    │
└─────────────────────────────────────────────┘
```

#### 7.4.2 生成流水线

```
generateResumeAI(jd, materials, locale)
    ↓
inferRoleProfile(jd)           岗位画像（关键词、优先级）
    ↓
rankMaterials(materials, profile)  经历排序
    ↓
materialToExperienceBlock()    本地 bullet 增强
    ↓
尝试 API generate-resume
    ↓ 成功
mergeAISections(localEnriched, aiSections)  ← 待实现
    ↓ 失败
返回本地完整结果 + source: 'local'
```

---

### 7.5 智能岗位匹配

**页面**：`src/app/talent/matching/page.tsx`  
**API**：`src/app/api/talent/matching/route.ts`  
**种子**：`src/data/job-positions.ts`

#### 7.5.1 目标架构

```
GET  /api/talent/matching?type=positions   岗位列表
POST /api/talent/matching                  分析匹配
GET  /api/talent/matching                    历史记录（登录用户）
```

#### 7.5.2 匹配结果结构

```typescript
interface MatchResult {
  match_score: number;
  keyword_coverage: number;
  competitiveness_score: number;
  skill_gaps: Array<{ skill: string; required_level: number; current_level: number }>;
  optimization_tips: string[];
  top5_positions: Array<{ id; title; company; score }>;
  top5_industries: string[];
  growth_path: string[];
}
```

#### 7.5.3 改造要点

1. 删除所有 `Math.random()` 分数扰动
2. 使用 `calculateUnifiedMatch()` 作为核心
3. 修复 `buildRelatedPositions`：overlap 只计关键词命中，行业/公司单独加分
4. 补全 `JOB_INDUSTRIES`（含「智能制造」）
5. 页面展示匹配历史（读 `job_matches` 表）
6. 可选：有 AI Key 时调用 `engine.matchPosition()` 增强 tips

---

### 7.6 投递追踪

**页面**：`src/app/applications/page.tsx`  
**Context**：`application-context.tsx`

#### 7.6.1 目标数据流（规划）

```
ApplicationProvider
    ↓
登录 → GET /api/applications
    ↓
CRUD → POST/PATCH/DELETE /api/applications
    ↓
SQLite 表 job_applications（新建）
    ↓
登录合并：POST /api/applications/merge-guest
```

#### 7.6.2 建议 Schema

```sql
CREATE TABLE IF NOT EXISTS job_applications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  company TEXT DEFAULT '',
  title TEXT NOT NULL,
  platform TEXT DEFAULT 'other',
  status TEXT DEFAULT 'wishlist',
  jd_text TEXT DEFAULT '',
  match_score REAL DEFAULT 0,
  salary TEXT DEFAULT '',
  location TEXT DEFAULT '',
  applied_at TEXT,
  notes TEXT DEFAULT '',
  events TEXT DEFAULT '[]',    -- JSON
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 7.6.3 功能清单

| 功能 | 现状 | 目标 |
|------|------|------|
| 手动新增 | ✅ | ✅ |
| JD 枢纽保存 | ✅ | ✅ |
| 状态筛选 | ✅ | ✅ |
| 渠道/状态统计 | ✅ | ✅ |
| 进展记事 | ✅ | ✅ |
| 状态变更留痕 | ❌ | ✅ 自动 addEvent |
| 服务端持久化 | ❌ | ✅ |
| 游客数据合并 | ❌ | ✅ |
| 去重 | ❌ | ✅ 同公司+岗位提示 |

---

### 7.7 AI 模拟面试

**页面**：`src/app/interview/page.tsx`（~49.5kB）  
**引擎**：`interview-engine.ts`

**模块组成**：
- 岗位/JD 输入 → 面试方案生成
- 维度选题（行为/情景/技术）
- 中英语言切换
- 代码题在线运行（`interview-code-runner.ts`）
- 结果报告与维度雷达

**待完善**：英文题库扩充、子组件 i18n、`prep-library` / `result-report`。

---

### 7.8 管理后台

**路由**：`/admin/*`  
**现状**：`admin/layout.tsx` 自动写入 mock token（**生产必须移除**）

**功能模块**：
- 用户管理、简历管理
- Prompt 模板 CRUD + 版本
- AI 调用监控、热力图
- 数据分析、用户增长

---

## 8. 数据模型与持久化方案

### 8.1 存储现状 vs 目标

| 数据 | 现状 | 目标 |
|------|------|------|
| 用户账号 | SQLite `users` | 保持 |
| 匹配历史 | SQLite `job_matches` | 保持 + UI 展示 |
| 素材库 | localStorage | SQLite 新表 `materials` |
| 投递记录 | localStorage | SQLite 新表 `job_applications` |
| 用户资料 | localStorage | SQLite 或 `users` 扩展字段 |
| JD 分析历史 | 内存 state | SQLite 新表 `jd_analyses`（可选） |

### 8.2 Context 与 API 映射（目标）

```
MaterialProvider     → /api/materials
ApplicationProvider  → /api/applications
UserProfileProvider  → /api/profile
AuthProvider         → /api/auth/*（已有）
```

### 8.3 本地存储 Key 规范

```
careercraft-materials-{userId}
careercraft-applications-{userId}
careercraft-profile-{userId}
careercraft-locale
careercraft-guest-applications   ← 合并后删除
```

---

## 9. 核心算法设计

### 9.1 统一匹配算法（`lib/match-engine.ts` — 待新建）

```typescript
/**
 * 确定性岗位匹配 — 全站唯一入口
 */
export function computeMatchScore(input: {
  jdText: string;
  jdKeywords: string[];
  materialSkills: string[];
  resumeText: string;
}): MatchBreakdown;

interface MatchBreakdown {
  matchScore: number;           // 0-100
  keywordCoverage: number;      // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
  competitiveness: number;      // 基于命中密度，无随机
}
```

**步骤**：
1. 从 JD 提取 requiredKeywords（规则 + 可选 LLM）
2. 构建 searchableCorpus = skills ∪ resumeText（小写）
3. 逐词命中（支持同义词：JS ↔ JavaScript）
4. 计分：`coverage = hit / total * 100`
5. `competitiveness = min(100, coverage * 1.1 + bonus)`，bonus 来自实习/项目数

### 9.2 简历解析算法要点

- 章节切分：正则 + SECTION_DEFS 多标签
- 日期：`DATE_PART` 优先匹配 `.10` 双位月份
- 奖项：`AWARD_DATE_PREFIX_RE` 负向排除日期范围行
- 校园：`splitOrgRole()` 识别「组织 · 职务」
- 去重：`title|dateRange|category` 三元组

### 9.3 简历生成算法要点

- `inferRoleProfile(jd)`：中文+英文 ROLE_PATTERNS
- `rankMaterials()`：关键词命中数 × 类别权重
- `rewriteBullet()`：STAR 模板 + 岗位动词库
- AI 路径：Prompt 含 JD + 排序后素材 JSON

---

## 10. API 接口规范

### 10.1 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/send-code` | 验证码 |
| GET | `/api/auth/me` | 当前用户 |
| POST | `/api/auth/bind-email` | 绑定邮箱 |
| POST | `/api/auth/bind-phone` | 绑定手机 |

### 10.2 AI

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/ai/parse-resume-file` | PDF/Word → 结构化 |
| POST | `/api/ai/generate-resume` | AI 简历生成 |
| POST | `/api/ai/match` | Copilot 匹配 |
| POST | `/api/ai/chat` | 对话 |
| POST | `/api/ai/enhance` | 内容增强 |
| POST | `/api/ai/review` | 简历评审 |

### 10.3 业务

| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST | `/api/talent/matching` | 匹配分析/历史 |
| GET | `/api/talent` | 人才画像 |
| GET | `/api/dashboard` | 工作台数据 |
| POST | `/api/events` | 行为埋点 |

### 10.4 规划新增

| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST | `/api/materials` | 素材 CRUD |
| GET/PATCH/DELETE | `/api/materials/[id]` | 单条素材 |
| GET/POST | `/api/applications` | 投递 CRUD |
| POST | `/api/applications/merge-guest` | 游客数据合并 |

### 10.5 响应格式

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

错误时：`success: false`, `error: "message_key_or_text"`

---

## 11. 国际化（i18n）方案

### 11.1 架构

```
LocaleProvider (locale-context.tsx)
    ↓
useLocale() → { locale, setLocale, t }
    ↓
translations.ts
  ├── nav, footer, common...
  ├── ...pageTranslations (spread)
  └── sharedLabels
```

### 11.2 文案组织

| 文件 | 内容 |
|------|------|
| `translations.ts` | 导航、通用、认证 |
| `page-translations.ts` | 各页面 `dashboard`, `materials`, `applications`, `resumeBuilder`, `matching`... |
| `shared-labels.ts` | `getCategoryLabels()`, `getPlatformLabels()`, `getStatusLabels()` |
| `interview-labels.ts` | 面试专用 |

### 11.3 接入规范

```tsx
// ✅ 正确
const { t, locale } = useLocale();
<p>{t.materialForm.titleLabel}</p>

// ❌ 禁止
<p>{locale === 'en' ? 'Title' : '标题'}</p>
alert('上传失败');
```

### 11.4 待接入清单

- [ ] `components/materials/material-form.tsx`
- [ ] `components/interview/prep-library.tsx`
- [ ] `components/interview/result-report.tsx`
- [ ] `data/interview-prep.ts` → `DIMENSION_LABELS` 迁到 i18n
- [ ] API 错误码 + 客户端按 locale 映射
- [ ] `application-context.tsx` 事件文案

---

## 12. UI/UX 设计规范

### 12.1 设计语言

- **风格**：Apple-inspired，毛玻璃导航、圆角卡片、浅色/深色双主题
- **主色**：blue / purple 渐变
- **字体**：系统字体栈，中文优先 PingFang/微软雅黑
- **间距**：Tailwind 标准，卡片 `p-6`，section `gap-6`

### 12.2 交互原则

1. **无静默失败**：任何 API/解析/保存失败须 Toast 或 inline 错误
2. **加载态**：按钮 disabled + spinner；大区块 skeleton
3. **空状态**：图标 + 标题 + 引导链接（走 i18n）
4. **登录边界**：未登录可浏览，保存/持久化操作须引导登录
5. **来源标注**：AI / 本地 / 规则估算 须对用户可见

### 12.3 响应式

- 移动端：Header 折叠菜单、卡片单列
- 匹配页/面试页：ECharts 自适应宽度
- 表单：小屏 stack，大屏双列

---

## 13. 安全与权限

### 13.1 用户认证

- JWT（jose）存 httpOnly cookie 或 Authorization header
- 密码 bcrypt 哈希
- API 通过 `requireAuth()` 中间件保护

### 13.2 须修复的安全项

| 项 | 风险 | 方案 |
|----|------|------|
| Admin mock 免登录 | 高 | 仅 development；生产 requireAdmin |
| parse-resume-file 无鉴权 | 中 | requireAuth + 速率限制 |
| 文件上传 10MB | 中 | 客户端预检 + 服务端校验 |
| AI Key 暴露 | 低 | 仅服务端环境变量 |

### 13.3 RBAC

```
user → 普通功能
admin → 管理后台只读/部分写
super_admin → 全权限
```

---

## 14. 测试与质量保障

### 14.1 测试策略

| 层级 | 工具 | 覆盖目标 |
|------|------|----------|
| 单元测试 | Vitest | resume-extract, jd-analyzer, match-engine |
| 组件测试 | Testing Library | MaterialForm, JobAnalysisHub |
| E2E | Playwright（规划） | 上传→导入→生成→保存投递 |
| 手动 | test-sample.ts | 简历解析回归 |

### 14.2 建议测试用例（简历解析）

```
✓ 标准中文校招简历（7 段）
✓ 仅日期奖项行（2022.10 奖学金）
✓ 校园任职双条目
✓ 章节标题被 PDF 拆行
✓ 英文简历基础识别
✓ 空文件 / 过短文本报错
✓ 扫描版 PDF 友好错误
```

### 14.3 CI 检查（规划）

```yaml
- npm run lint
- npx tsc --noEmit
- npm run test
- npm run build
```

---

## 15. 已知问题与差距分析

### 15.1 Critical

| # | 问题 | 影响 |
|---|------|------|
| C1 | 匹配分含 Math.random() | 用户信任、分数不可复现 |
| C2 | 投递仅 localStorage | 数据丢失、无法跨设备 |
| C3 | 三套匹配分不统一 | 不同页面分数矛盾 |
| C4 | Admin mock 免登录 | 生产安全风险 |

### 15.2 Medium

| # | 问题 |
|---|------|
| M1 | material-form 无 i18n |
| M2 | 教育经历归类/过滤问题 |
| M3 | AI 简历路径覆盖本地增强 |
| M4 | 未登录素材/投递无明确引导 |
| M5 | 推荐岗位计分 bug |
| M6 | 行业筛选项缺失 |

### 15.3 Low

| # | 问题 |
|---|------|
| L1 | 无自动化测试 |
| L2 | README 与代码不同步 |
| L3 | ESLint hooks 警告 |
| L4 | JD 分析历史不持久 |

---

## 16. 分阶段开发计划

### Phase A — 信任与数据（P0，1-2 周）

| 任务 | 文件 | 产出 |
|------|------|------|
| A1 统一匹配引擎 | 新建 `lib/match-engine.ts`，改 `matching/route.ts`, `jd-analyzer.ts` | 确定性分数 |
| A2 去除随机扰动 | `matching/route.ts` | 稳定可复现 |
| A3 投递 API | 新建 `api/applications/*`, schema 迁移 | 服务端持久化 |
| A4 游客数据合并 | 登录 flow + merge API | 登录无断档 |
| A5 Admin 鉴权加固 | `admin/layout.tsx` | 生产安全 |

### Phase B — 体验与 i18n（P1，1-2 周）

| 任务 | 文件 |
|------|------|
| B1 material-form i18n | `material-form.tsx` |
| B2 面试模块 i18n | interview 组件 + labels |
| B3 错误信息 i18n | API + alert 统一 |
| B4 表单校验反馈 | material-form, applications |
| B5 未登录引导 | material/applications context |

### Phase C — 简历与 AI（P1，1 周）

| 任务 | 文件 |
|------|------|
| C1 教育分类修复 | `material.ts`, `resume-extract.ts` |
| C2 AI+本地 merge | `resume-ai-engine.ts` |
| C3 生成失败提示 | `resume-builder/page.tsx` |
| C4 英文 ROLE_PATTERNS | `resume-ai-engine.ts` |
| C5 解析单元测试 | Vitest + fixtures |

### Phase D — 完善与扩展（P2，2 周）

| 任务 | 说明 |
|------|------|
| D1 素材库 SQLite 迁移 | 替代 localStorage |
| D2 匹配历史 UI | matching page |
| D3 STAR 自动拆解 | enhance API 接入 |
| D4 JD 分析历史持久化 | 可选 |
| D5 E2E 测试 | Playwright |
| D6 英文题库扩充 | interview data |

### Phase E — 企业版与商业化（P3，规划）

- 批量简历解析（已有 schema 基础）
- 订阅 tier 与用量限制
- 埋点 → `daily_stats` 仪表盘

---

## 17. 验收标准

### 17.1 功能验收

| 模块 | 验收项 |
|------|--------|
| 简历识别 | 标准样例 7 段正确；奖项/校园任职标题正确 |
| 素材库 | 上传→导入→编辑→保存；登录后持久化 |
| JD 分析 | 粘贴 JD → 技能匹配 → 建议列表 |
| 简历定制 | 输入 JD → 生成 → 内容与 JD 相关；标注 source |
| 智能匹配 | 同输入 3 次分数差 ≤ 2；无随机 |
| 投递 | 新增/编辑/筛选/统计；登录后换浏览器仍在 |
| i18n | EN 模式全页无中文硬编码 |
| 面试 | 完整流程可跑通；中英文切换 |

### 17.2 工程验收

```
npx tsc --noEmit     → 0 errors
npm run lint         → 0 errors（warnings 可接受）
npm run build        → success
npm run test         → 全部通过（Phase C 后）
```

### 17.3 性能基准

| 操作 | 目标 |
|------|------|
| 首页 LCP | < 2.5s |
| 本地简历解析 | < 500ms（TXT） |
| PDF 解析 | < 3s（5MB 内） |
| 本地简历生成 | < 1s |
| AI 简历生成 | < 30s（含超时回退） |

---

## 18. 环境配置与运行

### 18.1 环境变量

```env
# .env.local
OPENAI_API_KEY=sk-...              # 可选，AI 功能
OPENAI_BASE_URL=https://api.openai.com/v1   # 可选，兼容端点
JWT_SECRET=your-secret-key           # 必须（生产）
NODE_ENV=development|production
```

### 18.2 本地启动

```bash
cd careercraft-cn
npm install --legacy-peer-deps
npm run dev
# → http://localhost:3000
```

Windows：双击 `setup.bat`

### 18.3 生产构建

```bash
npm run build
npm run start
```

输出：`standalone` 模式，含 sql.js 与 bcryptjs 外部包配置。

### 18.4 手动测试简历解析

```bash
npx tsx src/lib/resume-extract.test-sample.ts
```

---

## 19. 附录

### 19.1 名词表

| 术语 | 含义 |
|------|------|
| 素材库 | Material Library，STAR 结构化经历仓库 |
| JD | Job Description，岗位描述 |
| STAR | Situation-Task-Action-Result 经历描述法 |
| Hub | Job Analysis Hub，JD 分析四 Tab 枢纽 |
| 本地引擎 | 无 LLM 的规则/启发式回退逻辑 |
| 种子岗位 | `job-positions.ts` 内置示例岗位 |

### 19.2 相关文档

| 文档 | 说明 |
|------|------|
| `README.md` | 快速入门（需同步更新） |
| `docs/DEVELOPMENT_GUIDE.md` | 本文档 |
| `src/lib/db/schema.ts` | 数据库 Schema 真理来源 |

### 19.3 默认管理员（开发）

Schema 内置：`123456@qq.com` / 密码 `123456`（bcrypt 哈希）  
**生产环境必须修改或禁用。**

### 19.4 需求追溯矩阵

| 需求 ID | 描述 | 主要模块 | Phase |
|---------|------|----------|-------|
| REQ-01 | 全站 i18n | i18n/*, 各 page | B |
| REQ-02 | AI 简历简化+真适配 | resume-builder, resume-ai-engine | C |
| REQ-03 | 简历识别（奖项/校园） | resume-extract | C（已部分完成） |
| REQ-04 | 智能匹配准确 | match-engine, matching API | A |
| REQ-05 | 投递追踪完善 | applications API | A |
| REQ-06 | 整体流畅无静默失败 | 全站 | A+B |
| REQ-07 | 管理后台安全 | admin | A |

---

> **维护说明**：本文档随代码演进更新。重大架构变更须同步修订第 5、8、9、16 节。  
> **文档所有者**：CareerCraft CN 开发团队  
> **下次评审建议**：Phase A 完成后更新「当前实现状态」与「已知问题」章节。
