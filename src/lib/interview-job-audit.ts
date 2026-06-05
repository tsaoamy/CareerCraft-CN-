/**
 * 面试岗位审核 — 校验目标岗位输入并生成选题方案
 */

import { questionBank, filterQuestionsByLanguage } from '@/data/interview-questions';
import {
  dimensionToCategories,
  DIMENSION_LABELS,
  type InterviewDimension,
  type InterviewLanguage,
} from '@/data/interview-prep';
import type { InterviewCategory, JobCategory } from '@/types/interview';

export type JobAuditStatus = 'empty' | 'invalid' | 'too_short' | 'weak' | 'valid';

export interface JobTitleAudit {
  status: JobAuditStatus;
  message: string;
  hint: string;
  normalizedTitle: string;
}

export interface InterviewPlanAudit {
  jobAudit: JobTitleAudit;
  jobCategory: JobCategory;
  categoryConfidence: 'high' | 'medium' | 'low';
  dimension: InterviewDimension;
  dimensionLabel: string;
  /** 历史/快捷入口的会话类型标签，如「完整模拟」 */
  sessionLabel?: string;
  language: InterviewLanguage;
  languageLabel: string;
  plannedCount: number;
  availableCount: number;
  categories: InterviewCategory[];
  categoryBreakdown: { category: InterviewCategory; count: number }[];
  canStart: boolean;
  warnings: string[];
  evalReminders: string[];
}

const JOB_PATTERNS: { pattern: RegExp; category: JobCategory }[] = [
  { pattern: /ai产品|ai\s*pm|ai产品经理|aigc产品|大模型产品|llm产品/i, category: '产品经理' },
  { pattern: /前端|frontend|react|vue|ios|android|mobile|h5/i, category: '前端开发' },
  { pattern: /后端|backend|java|go|golang|python|server|微服务/i, category: '后端开发' },
  { pattern: /产品|pm|product manager|产品经理/i, category: '产品经理' },
  { pattern: /算法|machine learning|深度学习|nlp|cv|大模型工程师|llm工程师/i, category: '算法工程师' },
  { pattern: /运营|operation|growth|用户增长/i, category: '运营' },
  { pattern: /数据|analyst|analytics|bi|分析师/i, category: '数据分析' },
  { pattern: /设计|ui|ux|designer|视觉|交互/i, category: 'UI/UX 设计师' },
  { pattern: /项目|pmo|scrum|项目经理/i, category: '项目管理' },
];

const COMPANY_PATTERN =
  /腾讯|字节|阿里|百度|华为|美团|京东|网易|小米|apple|google|meta|amazon|microsoft|bytedance|tencent|alibaba/i;

const ROLE_PATTERN =
  /工程|开发|经理|总监|主管|专员|实习|intern|engineer|developer|manager|lead|architect|designer|analyst/i;

const GIBBERISH_PATTERN =
  /^(asdf|qwer|test|abc|xxx|111|222|aaa|bbb|zzz|hello|hi|ok|no|yes|嗯|啊|哦|呃|测|试)$/i;

/** 检测岗位类别 */
export function detectJobCategory(title: string): JobCategory {
  const t = title.toLowerCase();
  for (const { pattern, category } of JOB_PATTERNS) {
    if (pattern.test(t)) return category;
  }
  return '通用';
}

function categoryConfidence(title: string, category: JobCategory): 'high' | 'medium' | 'low' {
  if (category === '通用') return 'low';
  const t = title.toLowerCase();
  const match = JOB_PATTERNS.find((p) => p.category === category);
  if (match && match.pattern.test(t) && COMPANY_PATTERN.test(t)) return 'high';
  if (match && match.pattern.test(t)) return 'medium';
  return 'low';
}

/** 审核目标岗位输入 */
export function auditJobTitle(title: string): JobTitleAudit {
  const normalizedTitle = title.trim().replace(/\s+/g, ' ');

  if (!normalizedTitle) {
    return {
      status: 'empty',
      message: '请先输入目标岗位',
      hint: '示例：腾讯 AI 产品经理、字节跳动后端开发、Apple iOS Engineer',
      normalizedTitle: '',
    };
  }

  if (normalizedTitle.length <= 2 || /^[a-zA-Z]$/.test(normalizedTitle)) {
    return {
      status: 'invalid',
      message: '岗位描述无效',
      hint: '单字符或无意义输入无法匹配面试题库，请填写完整岗位名称',
      normalizedTitle,
    };
  }

  if (
    /^(.)\1+$/.test(normalizedTitle) ||
    /^[\d\s\-_.，,。!！?？]+$/.test(normalizedTitle) ||
    GIBBERISH_PATTERN.test(normalizedTitle)
  ) {
    return {
      status: 'invalid',
      message: '无法识别为有效岗位',
      hint: '请避免乱码、重复字符或测试性输入，填写真实的公司与岗位',
      normalizedTitle,
    };
  }

  const hasJobKeyword = JOB_PATTERNS.some((p) => p.pattern.test(normalizedTitle));
  const hasCompany = COMPANY_PATTERN.test(normalizedTitle);
  const hasRole = ROLE_PATTERN.test(normalizedTitle);
  const hasChinese = /[\u4e00-\u9fff]{2,}/.test(normalizedTitle);
  const englishWords = (normalizedTitle.match(/[a-zA-Z]{2,}/g) || []).length;

  if (normalizedTitle.length < 4 && !hasJobKeyword) {
    return {
      status: 'too_short',
      message: '岗位描述过短',
      hint: '至少需包含岗位方向，如「产品经理」「Frontend Engineer」',
      normalizedTitle,
    };
  }

  if (!hasJobKeyword && !hasCompany && !hasRole && normalizedTitle.length < 8 && englishWords < 2 && !hasChinese) {
    return {
      status: 'too_short',
      message: '岗位信息不足以定向选题',
      hint: '请补充公司名 + 岗位方向，例如「美团 数据分析师」',
      normalizedTitle,
    };
  }

  if (!hasJobKeyword && !hasCompany && normalizedTitle.length < 12) {
    return {
      status: 'weak',
      message: '岗位信息较简略，将按通用方向选题',
      hint: '建议补充公司名或具体技术/业务方向，以获得更精准的题目',
      normalizedTitle,
    };
  }

  return {
    status: 'valid',
    message: '岗位审核通过',
    hint: '',
    normalizedTitle,
  };
}

function countQuestionPoolWithCategories(
  jobCategory: JobCategory,
  language: InterviewLanguage,
  categories: InterviewCategory[]
) {
  let pool =
    jobCategory === '通用'
      ? [...questionBank]
      : questionBank.filter((q) => q.jobs.length === 0 || q.jobs.includes(jobCategory));

  pool = filterQuestionsByLanguage(pool, language);
  pool = pool.filter((q) => categories.includes(q.category));
  return pool;
}

function countQuestionPool(
  jobCategory: JobCategory,
  dimension: InterviewDimension,
  language: InterviewLanguage
): { pool: typeof questionBank; categories: InterviewCategory[] } {
  const categories = dimensionToCategories[dimension] as InterviewCategory[];
  const pool = countQuestionPoolWithCategories(jobCategory, language, categories);
  return { pool, categories };
}

function buildCategoryBreakdown(pool: typeof questionBank, categories: InterviewCategory[]) {
  const categoryMap = new Map<InterviewCategory, number>();
  for (const q of pool) {
    categoryMap.set(q.category, (categoryMap.get(q.category) ?? 0) + 1);
  }
  return categories
    .map((c) => ({ category: c, count: categoryMap.get(c) ?? 0 }))
    .filter((x) => x.count > 0);
}

/** 生成完整面试方案（审核 + 选题预览） */
export function buildInterviewPlan(
  title: string,
  dimension: InterviewDimension,
  language: InterviewLanguage
): InterviewPlanAudit {
  const jobAudit = auditJobTitle(title);
  const normalized = jobAudit.normalizedTitle || title.trim();
  const jobCategory = detectJobCategory(normalized);
  const conf = categoryConfidence(normalized, jobCategory);
  const { pool, categories } = countQuestionPool(jobCategory, dimension, language);
  const plannedCount = language === 'en' ? 6 : 8;

  const categoryBreakdown = buildCategoryBreakdown(pool, categories);

  const warnings: string[] = [];
  if (jobAudit.status === 'weak') warnings.push(jobAudit.hint);
  if (conf === 'low') warnings.push('未能精确识别岗位方向，本次将从通用 + 岗位相关题中抽取。');
  if (pool.length < plannedCount) {
    warnings.push(`当前条件下仅有 ${pool.length} 道题可用，将少于计划的 ${plannedCount} 题。`);
  }
  if (pool.length === 0) {
    warnings.push('当前维度与语言组合下无可用题目，请切换维度或语言。');
  }

  const evalReminders = [
    `每题将根据题型自动评估：简答题由 AI 按考察要点评分，选择/代码题自动判分。`,
    `本次将从 ${plannedCount} 道题中混合抽取简答、单选、多选、代码等题型。`,
    '敷衍或过短（如单字符）的回答将被判定为无效，得分极低。',
    language === 'en'
      ? '英文题请用完整英文句子作答，建议每题 80 字以上。'
      : '建议简答题 60 字以上，行为/情景题请使用 STAR 结构并补充量化数据。',
    '提交后可查看正确答案、详细讲解与改进建议。',
  ];

  const canStart =
    jobAudit.status !== 'empty' &&
    jobAudit.status !== 'invalid' &&
    jobAudit.status !== 'too_short' &&
    pool.length > 0;

  return {
    jobAudit,
    jobCategory,
    categoryConfidence: conf,
    dimension,
    dimensionLabel: DIMENSION_LABELS[dimension],
    language,
    languageLabel: language === 'zh' ? '中文题库' : 'English Bank',
    plannedCount: Math.min(plannedCount, pool.length),
    availableCount: pool.length,
    categories,
    categoryBreakdown,
    canStart,
    warnings,
    evalReminders,
  };
}

/** 历史记录 / 快捷入口 — 按岗位 + 会话类型生成方案 */
export function buildHistoryInterviewPlan(
  role: string,
  language: InterviewLanguage,
  options: {
    dimension: InterviewDimension;
    questionCount: number;
    sessionLabel: string;
    categories?: InterviewCategory[];
  }
): InterviewPlanAudit {
  const { dimension, questionCount, sessionLabel, categories: categoriesOverride } = options;
  const base = buildInterviewPlan(role, dimension, language);
  const categories =
    categoriesOverride ?? (dimensionToCategories[dimension] as InterviewCategory[]);
  const pool = countQuestionPoolWithCategories(base.jobCategory, language, categories);
  const plannedCount = Math.min(questionCount, pool.length);

  const warnings = [...base.warnings];
  if (pool.length < questionCount) {
    warnings.push(`「${sessionLabel}」计划 ${questionCount} 题，当前条件下可用 ${pool.length} 题。`);
  }

  return {
    ...base,
    dimension,
    dimensionLabel: DIMENSION_LABELS[dimension],
    sessionLabel,
    categories,
    plannedCount,
    availableCount: pool.length,
    categoryBreakdown: buildCategoryBreakdown(pool, categories),
    canStart: base.canStart && pool.length > 0,
    warnings,
    evalReminders: [
      `本次为「${sessionLabel}」，目标岗位「${base.jobAudit.normalizedTitle}」。`,
      ...base.evalReminders,
    ],
  };
}

/** AI 自由对话欢迎语 */
export function buildAiChatWelcome(
  title: string,
  dimension: InterviewDimension,
  language: InterviewLanguage
): string {
  const plan = buildInterviewPlan(title, dimension, language);
  const job = plan.jobAudit.normalizedTitle;

  if (language === 'en') {
    return (
      `Hello, I'm your AI Interviewer.\n\n` +
      `Target role identified: "${job}"\n` +
      `Focus: ${plan.jobCategory} · ${plan.dimensionLabel} · ${plan.languageLabel}\n\n` +
      `Guidelines:\n` +
      `· I'll conduct a mock interview based on the role and focus area above\n` +
      `· Please answer in complete sentences; avoid one-word or perfunctory replies\n` +
      `· For behavioral/situational questions, use the STAR method (Situation-Task-Action-Result)\n` +
      `· Feel free to ask me to "change topic", "dig deeper", or "give feedback"\n\n` +
      `Ready? Start with a brief self-introduction, or tell me which area you'd like to practice most.`
    );
  }

  return (
    `你好，我是 AI 面试官。\n\n` +
    `已识别你的目标岗位：「${job}」\n` +
    `岗位方向：${plan.jobCategory} · ${plan.dimensionLabel} · ${plan.languageLabel}\n\n` +
    `对话说明：\n` +
    `· 我会围绕上述岗位和维度进行模拟面试与追问\n` +
    `· 请用完整句子回答，避免单字或敷衍回复\n` +
    `· 行为/情景类问题建议使用 STAR 法则（情境-任务-行动-结果）\n` +
    `· 可随时让我「换一题」「深入追问」或「给改进建议」\n\n` +
    `准备好了请先做一个简短的自我介绍，或告诉我你最想练习的方向。`
  );
}
