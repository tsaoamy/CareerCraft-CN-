/**
 * 面试模块 — 题型 / 维度 / 模式 多语言标签
 */

import type { InterviewCategory, JobCategory } from '@/types/interview';
import type { InterviewDimension } from '@/data/interview-prep';
import type { Locale } from '@/lib/i18n/translations';
import type { QuestionFormat } from '@/types/interview';

export const CATEGORY_LABELS: Record<InterviewCategory, Record<Locale, string>> = {
  自我介绍: { zh: '自我介绍', en: 'Self-intro' },
  项目追问: { zh: '项目追问', en: 'Project deep-dive' },
  行为面试: { zh: '行为面试', en: 'Behavioral' },
  技术面试: { zh: '技术面试', en: 'Technical' },
  情景问答: { zh: '情景问答', en: 'Situational' },
  案例分析: { zh: '案例分析', en: 'Case study' },
  职业规划: { zh: '职业规划', en: 'Career goals' },
  压力面试: { zh: '压力面试', en: 'Stress interview' },
  团队协作: { zh: '团队协作', en: 'Teamwork' },
  通用问答: { zh: '通用问答', en: 'General Q&A' },
  'AI 应用': { zh: 'AI 应用', en: 'AI applications' },
};

export const JOB_LABELS: Record<JobCategory, Record<Locale, string>> = {
  前端开发: { zh: '前端开发', en: 'Frontend' },
  后端开发: { zh: '后端开发', en: 'Backend' },
  算法工程师: { zh: '算法工程师', en: 'ML / Algorithm' },
  产品经理: { zh: '产品经理', en: 'Product Manager' },
  运营: { zh: '运营', en: 'Operations' },
  数据分析: { zh: '数据分析', en: 'Data Analytics' },
  'UI/UX 设计师': { zh: 'UI/UX 设计师', en: 'UI/UX Design' },
  项目管理: { zh: '项目管理', en: 'Project Management' },
  通用: { zh: '通用', en: 'General' },
};

export const DIMENSION_LABELS_I18N: Record<InterviewDimension, Record<Locale, string>> = {
  behavioral: { zh: '行为面试', en: 'Behavioral' },
  situational: { zh: '情景面试', en: 'Situational' },
  technical: { zh: '技术面试', en: 'Technical' },
};

export const FORMAT_LABELS_I18N: Record<QuestionFormat, Record<Locale, string>> = {
  essay: { zh: '简答题', en: 'Essay' },
  single_choice: { zh: '单选题', en: 'Single choice' },
  multi_choice: { zh: '多选题', en: 'Multi choice' },
  code: { zh: '代码题', en: 'Coding' },
};

export const QUICK_MODE_LABELS: Record<string, Record<Locale, string>> = {
  full: { zh: '完整模拟', en: 'Full simulation' },
  situational: { zh: '情景面试', en: 'Situational' },
  behavior: { zh: '行为面试', en: 'Behavioral' },
  'technical-frontend': { zh: '前端技术面', en: 'Frontend technical' },
  'technical-backend': { zh: '后端技术面', en: 'Backend technical' },
  product: { zh: '产品经理面', en: 'Product manager' },
  'data-analyst': { zh: '数据分析面', en: 'Data analyst' },
  english: { zh: '英语面试', en: 'English interview' },
  pressure: { zh: '压力面试', en: 'Stress interview' },
  design: { zh: '设计师面试', en: 'Designer interview' },
};

export function tCategory(cat: InterviewCategory, locale: Locale): string {
  return CATEGORY_LABELS[cat]?.[locale] ?? cat;
}

export function tJob(job: JobCategory, locale: Locale): string {
  return JOB_LABELS[job]?.[locale] ?? job;
}

export function tDimension(dim: InterviewDimension, locale: Locale): string {
  return DIMENSION_LABELS_I18N[dim][locale];
}

export function tFormat(format: QuestionFormat, locale: Locale): string {
  return FORMAT_LABELS_I18N[format][locale];
}

export function tQuickMode(id: string, fallback: string, locale: Locale): string {
  return QUICK_MODE_LABELS[id]?.[locale] ?? fallback;
}

/** 全局 locale → 面试题库语言 */
export function localeToInterviewLanguage(locale: Locale): 'zh' | 'en' {
  return locale;
}
