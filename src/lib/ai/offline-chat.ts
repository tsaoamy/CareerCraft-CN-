/**
 * AI 导师离线对话 — 无 API Key 时的智能基础回复
 * 基于关键词意图识别，提供有内容的辅导式回答
 */

export type ChatIntent =
  | 'star'
  | 'self_intro'
  | 'interview'
  | 'job_match'
  | 'resume_tips'
  | 'career'
  | 'salary'
  | 'intern'
  | 'jd_help'
  | 'general';

export function detectChatIntent(message: string): ChatIntent {
  const m = message.toLowerCase();
  if (/star|情境|任务|行动|结果|项目.*怎么写|经历.*描述/.test(m)) return 'star';
  if (/自我介绍|introduce|介绍自己|2分钟/.test(m)) return 'self_intro';
  if (/面试|interview|hr.*问|面试官|压力面|行为面/.test(m)) return 'interview';
  if (/匹配|match|jd|岗位描述|fit|适合.*岗位/.test(m)) return 'job_match';
  if (/简历|resume|优化|改写|量化|关键词|ats/.test(m)) return 'resume_tips';
  if (/职业规划|转行|转岗|3年|5年|发展路径/.test(m)) return 'career';
  if (/薪资|工资|谈薪|offer|期望薪酬/.test(m)) return 'salary';
  if (/实习|应届|校招|没有经验|零经验/.test(m)) return 'intern';
  if (/jd.*分析|解析.*岗位|职位描述/.test(m)) return 'jd_help';
  return 'general';
}

const OFFLINE_RESPONSES: Record<ChatIntent, string> = {
  star: `**STAR 法则**是写项目经历最被 HR 认可的结构：

- **S（情境）**：1-2 句话交代背景——什么业务、什么团队、什么规模
- **T（任务）**：你的具体目标或挑战是什么
- **A（行动）**：你做了什么（用「我负责/我主导」，避免只说「我们」）
- **R（结果）**：可量化的成果（提升 X%、服务 Y 万用户、节省 Z 小时）

**示例对比：**
- 弱：「参与了用户增长项目，效果良好」
- 强：「负责 DAU 增长实验，通过 A/B 测试优化 onboarding 流程，7 日留存提升 12%」

你可以把一段项目经历发给我，我帮你按 STAR 结构拆解优化。`,

  self_intro: `**2 分钟自我介绍**建议三段式（约 250 字）：

1. **现在**（15 秒）：姓名 + 当前身份/最近一份工作
2. **过去**（60 秒）：1-2 段与目标岗位最相关的经历 + 核心成果
3. **未来**（30 秒）：为什么对这个岗位/公司感兴趣

**技巧：**
- 开头不要从「我出生于…」流水账开始
- 每段经历带 1 个数字
- 结尾表达对该岗位的真实兴趣

告诉我你的目标岗位，我可以帮你定制一版自我介绍框架。`,

  interview: `**面试准备**可以分三步：

1. **预测问题**：根据 JD 提炼 5-8 个高频考点（技术/项目/行为）
2. **准备 STAR 故事**：每类问题准备 2 个可复用的真实案例
3. **模拟练习**：用职航的 [AI 面试官](/interview) 做行为/情景/技术面练习

**HR 常问：**
- 为什么离开上一家公司？
- 你的优势和短板？
- 说一个你解决冲突的例子

你可以告诉我具体岗位，我帮你预测 3 个最可能被问的问题。`,

  job_match: `**岗位匹配**分析建议这样做：

1. 在 [JD 分析](/jd-analyzer) 粘贴完整岗位描述
2. 系统会提取技能要求，对比你的素材库/简历
3. 查看技能缺口，针对性补充经历或学习

**提升匹配度的 3 个动作：**
- 简历关键词对齐 JD 前 5 条要求
- 把最相关的项目经历置顶
- 用 JD 中的业务词汇改写项目描述

如果你把 JD 核心要求发给我，我可以帮你判断应该突出哪些经历。`,

  resume_tips: `**简历优化**核心 checklist：

1. **量化**：每个项目至少 1 个数字（%、用户数、时长、金额）
2. **关键词**：对照目标 JD，确保核心技能词出现 2-3 次
3. **结构**：经历按与岗位的关联度排序，最强的放最前
4. **动词**：用「主导/设计/推动/优化」，避免「参与/了解」
5. **一页原则**：校招/3 年以内尽量 1 页

你可以：
- 上传 PDF / Word / 文本简历让我评测
- 去 [智能匹配](/talent/matching) 选择目标岗位生成定制版

有具体段落不确定怎么写？直接贴给我。`,

  career: `**职业规划**回答框架（面试也适用）：

- **短期（1 年）**：在目标岗位上深耕核心技能，成为独立贡献者
- **中期（3 年）**：承担更复杂项目，带小团队或成为某领域 go-to person
- **长期（5 年+）**：根据行业选择专家路线或管理路线

**关键：** 规划要与目标岗位同方向，让面试官感到「稳定且契合」。

你目前处于什么阶段？目标行业是什么？我可以给更具体的建议。`,

  salary: `**谈薪建议**（仅供参考）：

1. **调研**：看准了、脉脉、OfferShow 了解该岗位市场区间
2. **锚定**：给一个基于调研的范围，而非单一数字
3. **时机**：等对方明确表达意向后再深入谈薪
4. **结构**：了解 base、绩效、股票/期权、福利的完整 package

**话术示例：**
「基于我的经验和该岗位的市场水平，我的期望在 XX-XX 范围，具体可以根据整体 package 灵活讨论。」

不建议在简历上写死期望薪资，除非 JD 明确要求。`,

  intern: `**零经验/实习**简历可以这样写：

1. **课程项目** → 按正式项目写，强调技术栈和成果
2. **竞赛/开源** → 体现主动性和技术深度
3. **校园经历** → 只写有领导力和量化结果的（如「组织 XX 活动，覆盖 500 人」）
4. **技能区** → 诚实列出掌握程度，面试会被深挖

**心态：** 实习看潜力和学习能力，项目不必是大厂级别，但要讲清楚「你做了什么」。

去 [素材库](/materials) 把每段经历录进去，JD 分析时会自动匹配。`,

  jd_help: `**JD 解读**时重点看 5 个部分：

1. **岗位职责** → 判断日常做什么
2. **硬性要求** → 学历、年限、必须技能（不过线可能被 ATS 筛掉）
3. **加分项** → 差异化竞争点
4. **业务关键词** → 写简历时要呼应的词汇
5. **团队/产品信息** → 面试时展示业务理解

把 JD 粘贴到 [JD 智能分析](/jd-analyzer)，可一次性完成：匹配度评估 + 定制简历 + 面试准备 + 投递追踪。`,

  general: `感谢你的提问！作为 **AI 简历导师**，我的方式是引导你自己思考，而不是直接代写。

**我可以帮你：**
- 简历优化与 STAR 表达
- 岗位 JD 匹配分析
- 面试问题预测与回答框架
- 职业规划思路梳理

**你可以试试：**
- 「STAR 法则怎么用？」
- 「前端岗简历怎么突出项目？」
- 「面试自我介绍怎么组织？」
- 上传简历文件，说「帮我评测简历」

告诉我你的目标岗位或具体困惑，我们深入聊。`,
};

export function getOfflineChatResponse(message: string): string {
  const intent = detectChatIntent(message);
  const base = OFFLINE_RESPONSES[intent];

  if (intent !== 'general' && message.length > 20) {
    return `${base}\n\n---\n💡 你问的是关于「${getIntentLabel(intent)}」的问题。如需更精准分析，可补充目标岗位或粘贴相关经历。`;
  }
  return base;
}

function getIntentLabel(intent: ChatIntent): string {
  const labels: Record<ChatIntent, string> = {
    star: 'STAR 法则',
    self_intro: '自我介绍',
    interview: '面试准备',
    job_match: '岗位匹配',
    resume_tips: '简历优化',
    career: '职业规划',
    salary: '谈薪策略',
    intern: '实习/应届',
    jd_help: 'JD 解读',
    general: '通用咨询',
  };
  return labels[intent];
}

/** 从用户消息推断 API 模式 */
export function detectCopilotMode(
  content: string,
  resumeContent: string,
  targetJD: string
): 'chat' | 'review' | 'enhance' | 'match' {
  const lower = content.toLowerCase();
  const hasLongContent = content.length > 300 || resumeContent.length > 100;

  if (
    (/评测|分析.*简历|review|帮我看.*简历|简历.*怎么样/.test(lower) || hasLongContent) &&
    (resumeContent || content.length > 200)
  ) {
    return 'review';
  }
  if (/匹配|match|fit|对比.*jd|jd.*匹配/.test(lower) && (targetJD || resumeContent)) {
    return 'match';
  }
  if (/项目.*挖掘|star.*分析|增强.*经历|优化.*项目描述/.test(lower)) {
    return 'enhance';
  }
  return 'chat';
}
