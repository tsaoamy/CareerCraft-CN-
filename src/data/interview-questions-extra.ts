/**
 * 面试题库扩展 — 行为 / 情景 / 技术 · 中英文
 */

import type { InterviewQuestion, JobCategory, InterviewCategory } from '@/types/interview';

let _eid = 1000;

function eq(
  question: string,
  category: InterviewCategory,
  jobs: JobCategory[],
  difficulty: number,
  focusPoints: string[],
  referencePoints: string[],
  suggestedDuration: number,
  language: 'zh' | 'en' = 'zh'
): InterviewQuestion {
  return {
    id: `q${++_eid}`,
    question,
    category,
    jobs,
    difficulty,
    focusPoints,
    referencePoints,
    suggestedDuration,
    language,
  };
}

export const extraQuestionBank: InterviewQuestion[] = [
  // ── 中文 · 行为面试 ──
  eq(
    '描述一次你在没有正式授权的情况下，仍成功推动跨部门协作的经历。',
    '行为面试',
    [],
    4,
    ['影响力', '跨部门协作', '自驱力'],
    ['背景：为何需要跨部门、阻力在哪', '策略：对齐目标、找共同利益、小步验证', '关键沟通节点与人物', '量化结果与复盘'],
    150
  ),
  eq(
    '当你与上级意见相左时，你通常如何处理？请举一个具体例子。',
    '行为面试',
    [],
    3,
    ['向上管理', '沟通技巧', '职业成熟度'],
    ['先理解上级视角与约束', '用数据和方案而非情绪沟通', '提出备选方案或分阶段验证', '最终决策与事后复盘'],
    120
  ),
  eq(
    '说一次你主动发现问题并推动流程改进的经历，带来了什么可量化收益？',
    '行为面试',
    [],
    3,
    ['主动意识', '流程优化', '结果导向'],
    ['如何发现问题（数据/反馈/观察）', '改进方案与试点', '推动落地的步骤', '前后对比数据'],
    150
  ),
  eq(
    '描述你如何在资源严重不足的情况下仍按时交付项目。',
    '行为面试',
    ['项目管理', '产品经理', '后端开发', '前端开发'],
    4,
    ['资源管理', '优先级', '抗压能力'],
    ['资源缺口具体是什么', '如何重新排优先级与砍 scope', '争取资源的尝试', '交付结果与 trade-off'],
    150
  ),
  eq(
    '分享一次你收到严厉批评后的反应，以及你后续如何改进。',
    '行为面试',
    [],
    3,
    ['成长心态', '自我反思', '改进执行'],
    ['批评的具体内容与第一反应', '如何冷静分析与验证', '改进行动与跟踪', '长期变化'],
    120
  ),
  eq(
    '举例说明你如何培养或帮助一位 junior 同事成长。',
    '行为面试',
    ['项目管理', '后端开发', '前端开发'],
    3,
    [' mentoring', '团队贡献', '领导力'],
    ['识别对方短板的方式', '辅导计划与频率', '具体工具（代码 review/结对）', '对方成长的可视化结果'],
    120
  ),
  eq(
    '描述一次你在多任务并行、deadline 密集时的优先级管理方法。',
    '行为面试',
    [],
    3,
    ['时间管理', '优先级', '抗压'],
    ['任务清单与评估维度（影响/紧急/依赖）', '与 stakeholder 对齐预期', '具体工具或方法', '是否按时交付'],
    120
  ),
  eq(
    '说一个你提出新想法 initially 被拒绝，但最终被采纳或部分采纳的案例。',
    '行为面试',
    ['产品经理', '运营'],
    4,
    ['说服力', '韧性', '迭代思维'],
    ['想法内容与最初阻力', '如何调整方案或补充证据', '二次推进策略', '最终影响'],
    150
  ),

  // ── 中文 · 情景问答 ──
  eq(
    '上线前 48 小时测试发现 P0 级 bug，修复需 3 天，但业务方坚持按时发布，你怎么处理？',
    '情景问答',
    ['前端开发', '后端开发', '项目管理'],
    4,
    ['风险管理', '沟通', '质量意识'],
    ['评估 bug 影响面与用户风险', '提出分阶段发布或 feature flag 方案', '书面同步风险与决策人签字', '底线：核心安全/数据问题不能妥协'],
    150
  ),
  eq(
    '你负责的功能上线后核心指标下跌 15%，老板要求今天给出原因和方案，你会怎么做？',
    '情景问答',
    ['产品经理', '数据分析', '运营'],
    4,
    ['数据分析', '危机响应', '结构化思维'],
    ['先确认数据口径与归因窗口', '快速排查：技术/产品/运营/外部因素', '提出短期止血与长期修复', '同步进展节奏'],
    150
  ),
  eq(
    '客户投诉产品体验差并威胁解约，作为对接人你第一步做什么？',
    '情景问答',
    ['产品经理', '运营', 'UI/UX 设计师'],
    3,
    ['客户意识', '情绪管理', '问题解决'],
    ['倾听并复述客户核心诉求', '内部快速拉通相关同学', '给出时间表与 interim 方案', '事后复盘防止复发'],
    120
  ),
  eq(
    '团队两位 senior 在技术方案上僵持不下，项目被卡住，你会如何破局？',
    '情景问答',
    ['后端开发', '前端开发', '项目管理'],
    4,
    [' facilitation', '技术判断', '决策推动'],
    ['分别了解双方核心关切', '引入客观标准（性能/成本/工期）', '组织评审或 POC 对比', '明确决策人与 deadline'],
    150
  ),
  eq(
    '你刚接手一个历史遗留、文档缺失的系统，两周后要 demo，你怎么安排？',
    '情景问答',
    ['后端开发', '前端开发'],
    3,
    ['学习能力', '风险规划', '务实'],
    ['快速摸清核心链路与 demo 范围', '识别最高风险点并设 fallback', '每日同步进度', 'demo 范围管理（砍非核心）'],
    120
  ),
  eq(
    '业务方提出一个「技术上可行但维护成本极高」的需求，你会如何回应？',
    '情景问答',
    ['后端开发', '前端开发', '产品经理'],
    4,
    ['技术判断', '商业理解', '方案设计'],
    ['理解业务目标而非字面需求', '提供 2-3 档方案及成本对比', '推荐 MVP 与迭代路径', '记录决策与 trade-off'],
    150
  ),
  eq(
    '你发现同事提交的代码存在安全漏洞，但 TA 即将休假，你会怎么处理？',
    '情景问答',
    ['后端开发', '前端开发'],
    3,
    ['工程伦理', '沟通', '责任心'],
    ['评估漏洞严重程度', '及时同步本人与 TL', '协助修复或临时 mitigation', '事后补充规范或 checklist'],
    120
  ),
  eq(
    '公司突然要求全员降本增效，你的团队预算被砍 30%，你如何调整 OKR？',
    '情景问答',
    ['产品经理', '项目管理', '运营'],
    4,
    ['战略思维', '优先级', '资源规划'],
    ['重新对齐业务北极星指标', '砍掉低 ROI 事项', '争取替代资源（自动化/复用）', '与上级对齐新 OKR'],
    150
  ),

  // ── 中文 · 技术面试（通用+多岗） ──
  eq(
    '解释 CAP 定理，并结合你参与过的系统说明如何在 CP 和 AP 之间取舍。',
    '技术面试',
    ['后端开发'],
    4,
    ['分布式基础', '架构权衡', '实践经验'],
    ['准确定义 C/A/P', '典型场景（支付 vs 社交 feed）', '结合项目说明选择与后果', '故障时的表现'],
    150
  ),
  eq(
    '如何设计一个支持千万级 DAU 的短链服务？关键组件有哪些？',
    '技术面试',
    ['后端开发'],
    5,
    ['系统设计', '高并发', '存储选型'],
    ['生成与冲突策略', '读写分离与缓存', '过期与统计', '监控与限流'],
    180
  ),
  eq(
    '说说 React 18 并发特性对你项目的影响，你用过哪些相关 API？',
    '技术面试',
    ['前端开发'],
    4,
    ['React 深度', '性能', '实践经验'],
    ['Suspense / startTransition / useDeferredValue', '适用场景', '实测效果', '迁移注意点'],
    150
  ),
  eq(
    '前端如何做大型表格（1 万行）的性能优化？从渲染、数据、交互三方面说。',
    '技术面试',
    ['前端开发'],
    4,
    ['性能优化', '虚拟化', '工程实践'],
    ['虚拟滚动 / 分页', 'memo 与稳定引用', 'Web Worker 或分片加载', '度量方式'],
    150
  ),
  eq(
    '解释 Transformer 中 self-attention 的计算过程，以及为什么适合 NLP/多模态任务。',
    '技术面试',
    ['算法工程师'],
    5,
    ['深度学习', '注意力机制', '表达清晰'],
    ['Q/K/V 与 scaled dot-product', '复杂度与并行优势', '与 RNN 对比', '结合应用举例'],
    180
  ),
  eq(
    '训练大模型时遇到 loss 不收敛，你的排查 checklist 是什么？',
    '技术面试',
    ['算法工程师'],
    5,
    ['ML 工程', '调试', '经验'],
    ['数据与 label 检查', '学习率与 batch size', '梯度爆炸/消失', '过拟合与正则'],
    150
  ),
  eq(
    '如何评估一个推荐系统的效果？线上与离线指标分别看什么？',
    '技术面试',
    ['算法工程师', '数据分析'],
    4,
    ['推荐系统', '指标设计', 'AB 测试'],
    ['离线：AUC/NDCG/Recall', '线上：CTR/时长/留存', 'position bias 处理', '长期 vs 短期目标'],
    150
  ),
  eq(
    '设计一个 AB 实验平台，需要支持哪些核心能力？如何避免常见统计陷阱？',
    '技术面试',
    ['数据分析', '产品经理'],
    4,
    ['实验设计', '统计', '产品思维'],
    ['分流、曝光、指标采集', '样本量与功效', '多重比较、 novelty effect', '护栏指标'],
    150
  ),
  eq(
    'SQL：如何找出连续 3 天活跃的用户？写出思路或伪 SQL。',
    '技术面试',
    ['数据分析', '后端开发'],
    3,
    ['SQL 能力', '窗口函数', '逻辑思维'],
    ['日期去重与排序', 'row_number 或 lag 差值', '分组连续段', '边界情况'],
    120
  ),
  eq(
    '作为 PM，如何定义并拆解一个「提升用户留存」的目标？关键指标和实验是什么？',
    '技术面试',
    ['产品经理'],
    3,
    ['产品方法论', '指标', '实验'],
    ['留存定义（D1/D7）与 cohort', '漏斗与归因', '假设与 MVP 实验', '迭代节奏'],
    150
  ),

  // ── English · Behavioral ──
  eq(
    'Tell me about a time you influenced a decision without formal authority.',
    '行为面试',
    [],
    4,
    ['influence', 'leadership', 'collaboration'],
    ['Set context and stakeholders', 'How you built alignment', 'Actions taken', 'Measurable outcome'],
    150,
    'en'
  ),
  eq(
    'Describe a situation where you received harsh feedback. How did you respond and what changed afterward?',
    '行为面试',
    [],
    3,
    ['growth mindset', 'self-awareness', 'adaptability'],
    ['Specific feedback', 'Initial reaction vs thoughtful response', 'Concrete improvements', 'Long-term impact'],
    120,
    'en'
  ),
  eq(
    'Give an example of when you had to prioritize multiple urgent tasks. Walk me through your framework.',
    '行为面试',
    [],
    3,
    ['prioritization', 'time management', 'communication'],
    ['Criteria used (impact, urgency, dependencies)', 'Stakeholder alignment', 'Trade-offs made', 'Result'],
    120,
    'en'
  ),
  eq(
    'Tell me about a failure you owned. What did you learn and how did you apply it later?',
    '行为面试',
    [],
    4,
    ['accountability', 'learning', 'resilience'],
    ['Honest description without blame', 'Root cause analysis', 'Corrective actions', 'Subsequent success'],
    150,
    'en'
  ),
  eq(
    'Describe a time you mentored or helped a junior teammate improve significantly.',
    '行为面试',
    ['后端开发', '前端开发', '产品经理'],
    3,
    ['mentorship', 'teamwork', 'leadership'],
    ['Gap identified', 'Coaching approach', 'Checkpoints', 'Visible improvement'],
    120,
    'en'
  ),
  eq(
    'Share an example where you proactively identified a problem and drove a process improvement.',
    '行为面试',
    [],
    3,
    ['initiative', 'problem solving', 'impact'],
    ['How you spotted the issue', 'Proposal and pilot', 'Implementation steps', 'Quantified benefit'],
    150,
    'en'
  ),
  eq(
    'Tell me about a conflict with a coworker. How did you resolve it while preserving the relationship?',
    '行为面试',
    [],
    3,
    ['conflict resolution', 'EQ', 'professionalism'],
    ['Both perspectives', 'De-escalation', 'Agreed solution', 'Relationship outcome'],
    120,
    'en'
  ),
  eq(
    'Describe the most challenging project you led. What made it hard and how did you deliver?',
    '行为面试',
    ['项目管理', '产品经理'],
    4,
    ['leadership', 'execution', 'stakeholder management'],
    ['Scope and constraints', 'Team/risk management', 'Key decisions', 'Results and retrospective'],
    150,
    'en'
  ),

  // ── English · Situational ──
  eq(
    'A critical bug is found 48 hours before launch. Fixing it takes 3 days, but sales insists on the date. What do you do?',
    '情景问答',
    ['前端开发', '后端开发', '项目管理'],
    4,
    ['risk management', 'communication', 'quality'],
    ['Assess user/business impact', 'Propose phased launch or feature flag', 'Escalate with written risk', 'Non-negotiables on safety/data'],
    150,
    'en'
  ),
  eq(
    'Core metrics drop 15% after your release. Your manager wants root cause and a plan by end of day. Your approach?',
    '情景问答',
    ['产品经理', '数据分析'],
    4,
    ['analytics', 'crisis response', 'structured thinking'],
    ['Validate metric definition', 'Hypothesis tree (tech/product/ops/external)', 'Short-term mitigation', 'Communication cadence'],
    150,
    'en'
  ),
  eq(
    'Two senior engineers disagree on architecture and block progress. How do you unblock the team?',
    '情景问答',
    ['后端开发', '前端开发'],
    4,
    ['facilitation', 'technical judgment', 'decision making'],
    ['Understand each side\'s constraints', 'Objective criteria / POC', 'Time-boxed decision forum', 'Document decision'],
    150,
    'en'
  ),
  eq(
    'You inherit a legacy system with no docs and must demo in two weeks. How do you plan?',
    '情景问答',
    ['后端开发', '前端开发'],
    3,
    ['learning agility', 'planning', 'pragmatism'],
    ['Map critical path for demo', 'Identify top risks + fallback', 'Daily progress sync', 'Scope control'],
    120,
    'en'
  ),
  eq(
    'A stakeholder requests a feature that is feasible but extremely costly to maintain. How do you respond?',
    '情景问答',
    ['产品经理', '后端开发'],
    4,
    ['trade-offs', 'business acumen', 'solution design'],
    ['Clarify underlying goal', 'Offer tiered options with cost', 'Recommend MVP path', 'Document trade-offs'],
    150,
    'en'
  ),
  eq(
    'Your team budget is cut 30% mid-quarter. How do you revise goals and communicate to the team?',
    '情景问答',
    ['产品经理', '项目管理'],
    4,
    ['strategy', 'prioritization', 'leadership'],
    ['Re-align to north-star metrics', 'Cut low-ROI work', 'Seek efficiency gains', 'Transparent team communication'],
    150,
    'en'
  ),

  // ── English · Technical ──
  eq(
    'Explain the CAP theorem and describe a system where you chose availability over consistency (or vice versa).',
    '技术面试',
    ['后端开发'],
    4,
    ['distributed systems', 'trade-offs', 'real experience'],
    ['Correct definitions', 'Example scenario', 'Consequences under failure', 'Monitoring/fallback'],
    150,
    'en'
  ),
  eq(
    'Design a URL shortener that supports 10M DAU. What are the key components and bottlenecks?',
    '技术面试',
    ['后端开发'],
    5,
    ['system design', 'scalability', 'storage'],
    ['ID generation', 'Read/write path', 'Cache layer', 'Analytics and rate limiting'],
    180,
    'en'
  ),
  eq(
    'How would you optimize a React app with a 5-second first contentful paint? Walk through your diagnosis.',
    '技术面试',
    ['前端开发'],
    4,
    ['performance', 'React', 'measurement'],
    ['Profiling tools', 'Bundle/code splitting', 'Critical rendering path', 'Before/after metrics'],
    150,
    'en'
  ),
  eq(
    'What is virtual DOM diffing, and when can it hurt performance? How do you mitigate that?',
    '技术面试',
    ['前端开发'],
    3,
    ['React fundamentals', 'performance awareness'],
    ['Reconciliation basics', 'Large list re-render issue', 'memo, keys, virtualization', 'Practical example'],
    120,
    'en'
  ),
  eq(
    'Explain how self-attention works in Transformers. Why is it effective for sequence modeling?',
    '技术面试',
    ['算法工程师'],
    5,
    ['deep learning', 'attention', 'communication'],
    ['Q/K/V computation', 'Complexity vs RNN', 'Parallelization benefit', 'Application example'],
    180,
    'en'
  ),
  eq(
    'How do you evaluate a recommendation system offline vs online? What pitfalls should you avoid?',
    '技术面试',
    ['算法工程师', '数据分析'],
    4,
    ['ML metrics', 'experimentation', 'product impact'],
    ['Offline: AUC, NDCG, recall@k', 'Online: CTR, retention, guardrails', 'Position bias', 'Long-term effects'],
    150,
    'en'
  ),
  eq(
    'Write the approach (or pseudo-SQL) to find users active three consecutive days.',
    '技术面试',
    ['数据分析', '后端开发'],
    3,
    ['SQL', 'window functions', 'logic'],
    ['Dedupe by user-day', 'Gap/island technique', 'Edge cases', 'Explain complexity'],
    120,
    'en'
  ),
  eq(
    'Walk me through designing an A/B testing platform. What statistical mistakes do teams often make?',
    '技术面试',
    ['数据分析', '产品经理'],
    4,
    ['experimentation', 'statistics', 'platform design'],
    ['Randomization & exposure', 'Power and sample size', 'Peeking, multiple testing', 'Guardrail metrics'],
    150,
    'en'
  ),
  eq(
    'How do you debug a production incident where API latency spiked 10x? Outline your steps.',
    '技术面试',
    ['后端开发'],
    4,
    ['incident response', 'observability', 'debugging'],
    ['Dashboards and alerts', 'Recent deploys/config changes', 'Isolate dependency', 'Mitigation then RCA'],
    150,
    'en'
  ),
  eq(
    'As a PM, how would you define success metrics for improving user retention? What experiments would you run?',
    '技术面试',
    ['产品经理'],
    3,
    ['product sense', 'metrics', 'experimentation'],
    ['Define retention cohorts', 'Funnel diagnosis', 'Hypothesis-driven tests', 'Iteration plan'],
    150,
    'en'
  ),
];
