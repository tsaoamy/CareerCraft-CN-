/**
 * 面试备考素材库 — 按维度、岗位、语言组织
 */

import type { InterviewCategory, JobCategory } from '@/types/interview';
import { extraPrepTopics } from './interview-prep-extra';

export type InterviewDimension = 'behavioral' | 'situational' | 'technical';
export type InterviewLanguage = 'zh' | 'en';

export interface PrepTopic {
  id: string;
  title: string;
  dimension: InterviewDimension;
  language: InterviewLanguage;
  jobs: JobCategory[];
  description: string;
  likelyQuestions: string[];
  answerFramework: string[];
  tips: string[];
  commonMistakes: string[];
}

export const DIMENSION_LABELS: Record<InterviewDimension, string> = {
  behavioral: '行为面试',
  situational: '情景面试',
  technical: '技术面试',
};

export const prepTopics: PrepTopic[] = [
  {
    id: 'prep-behavior-star',
    title: 'STAR 行为面试应答框架',
    dimension: 'behavioral',
    language: 'zh',
    jobs: [],
    description: '行为面试考察你在真实场景中的行动与结果。大厂（腾讯、字节、网易）普遍采用 STAR 法则评估候选人的软实力与价值观匹配度。',
    likelyQuestions: [
      '描述一次你主导跨部门协作的经历',
      '你如何处理与上级意见不一致的情况？',
      '说一个你失败的经历，以及你从中学到了什么',
      '举例说明你如何在资源有限的情况下完成任务',
      '描述一次你主动承担额外工作的经历',
    ],
    answerFramework: [
      'S（情境）：1-2 句话交代背景、团队规模、业务场景',
      'T（任务）：明确你的职责与目标，避免「我们」模糊主语',
      'A（行动）：重点描述「你做了什么」，用动词开头（主导/设计/推动/协调）',
      'R（结果）：量化成果（提升 X%、节省 Y 小时、服务 Z 万用户）',
    ],
    tips: [
      '提前准备 5-8 个可复用的 STAR 故事，覆盖协作、冲突、创新、抗压等场景',
      '每个故事准备 60 秒和 3 分钟两个版本',
      '用「我负责/我主导」而非「我们团队」突出个人贡献',
    ],
    commonMistakes: ['只描述团队成果，说不清个人贡献', '缺少量化数据', '回避失败类问题', '故事与岗位无关'],
  },
  {
    id: 'prep-situational-product',
    title: '产品经理情景面试',
    dimension: 'situational',
    language: 'zh',
    jobs: ['产品经理'],
    description: '情景面试模拟真实业务决策场景，考察产品思维、用户洞察与结构化分析能力。常见于腾讯、字节、美团等产品岗终面。',
    likelyQuestions: [
      '如果 DAU 连续两周下降 10%，你会如何排查？',
      '如何在「用户体验」和「商业变现」之间做权衡？',
      '老板要求 2 周内上线一个功能，但研发评估需要 4 周，你怎么处理？',
      '设计一个功能提升新用户 7 日留存率',
      '竞品推出了类似功能，你会如何应对？',
    ],
    answerFramework: [
      '澄清问题：确认目标用户、核心指标、约束条件',
      '拆解框架：用户旅程 / 漏斗分析 / 优先级矩阵',
      '提出假设：列出 2-3 个可能原因或方案',
      '验证路径：数据验证、用户调研、A/B 测试',
      '给出结论：推荐方案 + 预期效果 + 风险与备选',
    ],
    tips: [
      '先说框架再展开，体现结构化思维',
      '引用真实产品案例（微信、抖音、淘宝）增加说服力',
      '主动询问边界条件，展示严谨性',
    ],
    commonMistakes: ['直接给答案不分析过程', '忽略商业与技术的可行性', '没有数据支撑'],
  },
  {
    id: 'prep-situational-conflict',
    title: '团队协作与冲突处理',
    dimension: 'situational',
    language: 'zh',
    jobs: [],
    description: '考察候选人在团队分歧、跨部门协作、高压 deadline 下的沟通与推动力。互联网大厂各岗位通用高频考点。',
    likelyQuestions: [
      '研发认为你的需求不合理，拒绝排期，你怎么沟通？',
      '两个部门对同一项目优先级有分歧，你作为 PM 如何协调？',
      '团队成员消极怠工影响进度，你会怎么处理？',
      '上线前发现严重 Bug，但业务方坚持按时发布，你怎么办？',
    ],
    answerFramework: [
      '理解各方诉求：先倾听，不急于站队',
      '找共同目标：对齐业务目标与用户价值',
      '数据/事实论证：用客观依据减少主观争论',
      '提出折中方案：分阶段交付、MVP 优先、资源置换',
      '复盘机制：建立预防类似问题的流程',
    ],
    tips: ['展现 empathy 而非对抗', '强调结果导向', '提及具体的沟通工具或会议机制'],
    commonMistakes: ['推卸责任', '只说「说服了对方」不说具体方法', '回避冲突'],
  },
  {
    id: 'prep-tech-frontend',
    title: '前端技术深度面试',
    dimension: 'technical',
    language: 'zh',
    jobs: ['前端开发'],
    description: '覆盖 JavaScript 基础、React 生态、性能优化、工程化与浏览器原理。腾讯、字节、阿里前端岗技术面核心考点。',
    likelyQuestions: [
      'React 虚拟 DOM 的 Diff 算法原理是什么？',
      '如何优化首屏加载时间？请结合你的项目说明',
      '解释 Event Loop，宏任务与微任务执行顺序',
      'Webpack 与 Vite 的构建差异，如何选择？',
      '设计一个高性能的长列表渲染方案',
      'TypeScript 中泛型与类型推断的实际应用场景',
    ],
    answerFramework: [
      '概念定义：简洁准确的核心解释',
      '原理深入：底层机制或设计动机',
      '项目关联：「我在 XX 项目中用这个方法解决了 YY 问题」',
      '权衡分析：不同方案的优缺点对比',
      '扩展思考：相关的前沿技术或最佳实践',
    ],
    tips: [
      '每题尽量关联 1 个真实项目',
      '手写代码题先讲思路再写',
      '了解目标公司技术栈（如腾讯自研框架、字节跨端方案）',
    ],
    commonMistakes: ['只会背八股不会结合项目', '代码不写边界 case', '忽略性能与可维护性权衡'],
  },
  {
    id: 'prep-tech-backend',
    title: '后端系统设计与架构',
    dimension: 'technical',
    language: 'zh',
    jobs: ['后端开发'],
    description: '考察分布式系统、数据库、缓存、消息队列与 API 设计。适用于阿里、字节、美团等后端/服务端岗位。',
    likelyQuestions: [
      '设计一个短链接服务，估算 QPS 与存储',
      'MySQL 索引原理，什么情况下索引失效？',
      'Redis 缓存穿透、击穿、雪崩的区别与解决方案',
      '如何保证分布式事务的一致性？',
      '微服务拆分的原则，你参与过的架构演进',
    ],
    answerFramework: [
      '需求澄清：功能、规模、SLA',
      '高层设计：组件划分、数据流',
      '详细设计：数据库 schema、缓存策略、API',
      '瓶颈分析：单点、扩展性、容灾',
      '优化迭代：监控、限流、降级',
    ],
    tips: ['从简单方案开始逐步扩展', '量化估算（用户数、存储、带宽）', '提及实际用过的中间件'],
    commonMistakes: ['过度设计', '忽略运维与监控', '无法估算规模'],
  },
  {
    id: 'prep-tech-algo',
    title: '算法工程师面试',
    dimension: 'technical',
    language: 'zh',
    jobs: ['算法工程师'],
    description: '涵盖机器学习基础、模型训练部署、论文阅读与业务落地。字节、商汤、腾讯 AI Lab 等算法岗必备。',
    likelyQuestions: [
      '解释 Transformer 的 Self-Attention 机制',
      '如何处理类别不平衡问题？',
      '推荐系统中冷启动如何解决？',
      '介绍一个你复现或改进的论文工作',
      '模型上线后效果下降，如何排查？',
    ],
    answerFramework: [
      '问题定义：业务目标与评估指标',
      '方法选择：为什么选这个模型/算法',
      '实验设计：数据、特征、训练、验证',
      '结果分析：离线指标 + 在线 A/B',
      '迭代优化：bad case 分析与下一步计划',
    ],
    tips: ['准备 1-2 个完整项目从数据到部署', '了解目标公司业务（推荐/搜索/NLP/CV）', '关注最新论文但要能讲清楚'],
    commonMistakes: ['只堆模型名词', '说不清业务价值', '实验设计不严谨'],
  },
  {
    id: 'prep-en-intro',
    title: 'English Self-Introduction',
    dimension: 'behavioral',
    language: 'en',
    jobs: [],
    description: 'Essential for Apple, Tesla, Google, and multinational tech companies. A strong intro sets the tone for the entire interview.',
    likelyQuestions: [
      'Walk me through your resume / Tell me about yourself',
      'Why are you interested in this role and our company?',
      'What are your greatest strengths and weaknesses?',
      'Where do you see yourself in 5 years?',
      'Why are you leaving your current position?',
    ],
    answerFramework: [
      'Present: Current role, key responsibility (15 sec)',
      'Past: 1-2 relevant achievements with metrics (45 sec)',
      'Future: Why this role aligns with your goals (30 sec)',
      'Close: Express enthusiasm for the opportunity',
    ],
    tips: [
      'Keep it under 2 minutes',
      'Use the PAR method (Problem-Action-Result)',
      'Practice pronunciation of technical terms',
      'Research company values (Apple: innovation, Tesla: mission)',
    ],
    commonMistakes: ['Reciting entire resume chronologically', 'No connection to target role', 'Memorized robotic delivery'],
  },
  {
    id: 'prep-en-technical',
    title: 'English Technical Interview',
    dimension: 'technical',
    language: 'en',
    jobs: ['前端开发', '后端开发', '算法工程师'],
    description: 'Technical interviews at global tech firms often require explaining complex concepts clearly in English.',
    likelyQuestions: [
      'Explain how you would design a scalable notification system',
      'Describe a challenging bug you debugged and how you found the root cause',
      'How do you ensure code quality in your team?',
      'Tell me about a trade-off you made between performance and maintainability',
      'How would you approach learning a new technology stack?',
    ],
    answerFramework: [
      'Clarify requirements and constraints',
      'Outline high-level approach',
      'Dive into technical details with examples',
      'Discuss trade-offs and alternatives',
      'Summarize with measurable outcomes',
    ],
    tips: [
      'Think aloud — interviewers want to see your reasoning process',
      'Use simple English; clarity beats vocabulary',
      'Prepare 3-4 project stories in English',
    ],
    commonMistakes: ['Silent coding without explanation', 'Over-complicated vocabulary', 'Cannot explain projects simply'],
  },
  {
    id: 'prep-en-behavioral',
    title: 'English Behavioral (Amazon/Google Style)',
    dimension: 'behavioral',
    language: 'en',
    jobs: [],
    description: 'Leadership Principles and behavioral questions are core at Amazon, Google, Meta. Use STAR format consistently.',
    likelyQuestions: [
      'Tell me about a time you disagreed with a teammate. How did you resolve it?',
      'Describe a situation where you had to meet a tight deadline',
      'Give an example of when you took initiative beyond your job description',
      'Tell me about a time you failed and what you learned',
      'Describe your most significant accomplishment',
    ],
    answerFramework: [
      'Situation: Set the context (team, project, timeline)',
      'Task: Your specific responsibility',
      'Action: Steps YOU took (use "I" not "we")',
      'Result: Quantified outcome + lesson learned',
    ],
    tips: [
      'Prepare stories mapped to common principles: Ownership, Bias for Action, Customer Obsession',
      'Each story should be reusable across multiple questions',
      'End with what you would do differently',
    ],
    commonMistakes: ['Team credit without personal role', 'No metrics', 'Hypothetical answers instead of real examples'],
  },
  {
    id: 'prep-data-analyst',
    title: '数据分析师综合面试',
    dimension: 'situational',
    language: 'zh',
    jobs: ['数据分析'],
    description: '结合 SQL 实操、业务分析框架与数据 storytelling。美团、滴滴、京东数据岗常见考察方式。',
    likelyQuestions: [
      '如何定义和拆解一个业务核心指标？',
      '发现某渠道转化率突然下降，分析思路是什么？',
      'SQL：计算连续登录用户的留存率',
      '如何用数据支撑一个产品决策？举例说明',
      'A/B 测试样本量如何确定？',
    ],
    answerFramework: [
      '业务理解：指标定义、业务背景',
      '分析框架：漏斗/ cohort / 归因',
      '数据获取：数据源、SQL 逻辑',
      '洞察输出：可视化 + 结论 + 建议',
      '落地跟踪：方案效果验证',
    ],
    tips: ['准备 1 个完整分析报告案例', '熟悉目标公司核心业务指标', '练习白板 SQL'],
    commonMistakes: ['只会工具不会业务', '分析没有 actionable 建议', '忽略数据质量'],
  },
];

/** 完整备考专题列表 */
export const allPrepTopics: PrepTopic[] = [...prepTopics, ...extraPrepTopics];

export function getPrepByDimension(dimension: InterviewDimension): PrepTopic[] {
  return allPrepTopics.filter((p) => p.dimension === dimension);
}

export function getPrepByJob(job: JobCategory): PrepTopic[] {
  return allPrepTopics.filter((p) => p.jobs.length === 0 || p.jobs.includes(job));
}

export function getPrepByLanguage(lang: InterviewLanguage): PrepTopic[] {
  return allPrepTopics.filter((p) => p.language === lang);
}

export function filterPrepTopics(
  dimension: InterviewDimension,
  language: InterviewLanguage,
  job: JobCategory = '通用'
): PrepTopic[] {
  return allPrepTopics.filter(
    (p) =>
      p.dimension === dimension &&
      p.language === language &&
      (p.jobs.length === 0 || p.jobs.includes(job))
  );
}

export function getPrepStats(
  dimension: InterviewDimension,
  language: InterviewLanguage,
  job: JobCategory = '通用'
): { topicCount: number; questionCount: number } {
  const topics = filterPrepTopics(dimension, language, job);
  const questionCount = topics.reduce((sum, t) => sum + t.likelyQuestions.length, 0);
  return { topicCount: topics.length, questionCount };
}

export function getLikelyQuestionsForJob(
  jobTitle: string,
  dimension?: InterviewDimension,
  language: InterviewLanguage = 'zh'
): string[] {
  const jobLower = jobTitle.toLowerCase();
  let job: JobCategory = '通用';
  if (/前端|frontend|react|ios/i.test(jobLower)) job = '前端开发';
  else if (/后端|backend|java|go|server/i.test(jobLower)) job = '后端开发';
  else if (/算法|ml|ai|machine learning/i.test(jobLower)) job = '算法工程师';
  else if (/产品|pm|product/i.test(jobLower)) job = '产品经理';
  else if (/数据|analyst|analytics/i.test(jobLower)) job = '数据分析';
  else if (/设计|ui|ux|design/i.test(jobLower)) job = 'UI/UX 设计师';
  else if (/运营|operation/i.test(jobLower)) job = '运营';

  let topics = allPrepTopics.filter(
    (p) => p.language === language && (p.jobs.length === 0 || p.jobs.includes(job))
  );
  if (dimension) topics = topics.filter((p) => p.dimension === dimension);

  const questions = topics.flatMap((t) => t.likelyQuestions);
  return [...new Set(questions)].slice(0, 12);
}

/** 维度 → 面试题型映射 */
export const dimensionToCategories: Record<InterviewDimension, InterviewCategory[]> = {
  behavioral: ['行为面试', '团队协作', '压力面试', '自我介绍', '职业规划'],
  situational: ['情景问答', '案例分析', '通用问答', '项目追问'],
  technical: ['技术面试', 'AI 应用', '项目追问', '自我介绍'],
};
