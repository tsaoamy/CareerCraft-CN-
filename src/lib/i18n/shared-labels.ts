import type { Locale } from './translations';
import type { MaterialCategory } from '@/types/material';
import type { ApplicationPlatform, ApplicationStatus } from '@/types/application';

const CATEGORY_LABELS: Record<Locale, Record<MaterialCategory, string>> = {
  en: {
    internship: 'Internship',
    project: 'Project',
    competition: 'Competition',
    research: 'Research',
    campus: 'Campus',
  },
  zh: {
    internship: '实习经历',
    project: '项目经历',
    competition: '竞赛经历',
    research: '科研经历',
    campus: '校园经历',
  },
};

const PLATFORM_LABELS: Record<Locale, Record<ApplicationPlatform, string>> = {
  en: {
    boss: 'Boss Zhipin',
    liepin: 'Liepin',
    lagou: 'Lagou',
    linkedin: 'LinkedIn',
    official: 'Company Site',
    referral: 'Referral',
    campus: 'Campus Recruiting',
    other: 'Other',
  },
  zh: {
    boss: 'Boss 直聘',
    liepin: '猎聘',
    lagou: '拉勾',
    linkedin: 'LinkedIn',
    official: '官网投递',
    referral: '内推',
    campus: '校招',
    other: '其他',
  },
};

const STATUS_LABELS: Record<Locale, Record<ApplicationStatus, string>> = {
  en: {
    wishlist: 'Wishlist',
    applied: 'Applied',
    screening: 'Screening',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
  },
  zh: {
    wishlist: '待投递',
    applied: '已投递',
    screening: '简历筛选',
    interview: '面试中',
    offer: '已获 Offer',
    rejected: '已拒绝',
    withdrawn: '已撤回',
  },
};

const JOB_INDUSTRIES: Record<Locale, readonly string[]> = {
  en: [
    'All',
    'Internet',
    'Gaming',
    'Cloud',
    'AI',
    'Consumer Electronics',
    'Smart Vehicles',
    'Smart Manufacturing',
    'Retail',
    'OS',
    'Local Services',
    'E-commerce & Logistics',
    'Content & Community',
    'Smart Hardware',
  ],
  zh: [
    '全部',
    '互联网',
    '游戏',
    '云计算',
    '人工智能',
    '消费电子',
    '智能汽车',
    '智能制造',
    '零售消费',
    '操作系统',
    '本地生活',
    '电商物流',
    '内容社区',
    '智能硬件',
  ],
};

export function getCategoryLabels(locale: Locale): Record<MaterialCategory, string> {
  return CATEGORY_LABELS[locale];
}

export function getCategoryLabel(locale: Locale, category: MaterialCategory): string {
  return CATEGORY_LABELS[locale][category];
}

export function getPlatformLabels(locale: Locale): Record<ApplicationPlatform, string> {
  return PLATFORM_LABELS[locale];
}

export function getStatusLabels(locale: Locale): Record<ApplicationStatus, string> {
  return STATUS_LABELS[locale];
}

export function getJobIndustries(locale: Locale): readonly string[] {
  return JOB_INDUSTRIES[locale];
}

export function getAllCategoryLabel(locale: Locale): string {
  return locale === 'en' ? 'All' : '全部';
}

/** Map Chinese industry values in seed data to English display labels */
const INDUSTRY_ZH_TO_EN: Record<string, string> = {
  互联网: 'Internet',
  游戏: 'Gaming',
  云计算: 'Cloud',
  人工智能: 'AI',
  消费电子: 'Consumer Electronics',
  智能汽车: 'Smart Vehicles',
  智能制造: 'Smart Manufacturing',
  零售消费: 'Retail',
  操作系统: 'OS',
  本地生活: 'Local Services',
  电商物流: 'E-commerce & Logistics',
  内容社区: 'Content & Community',
  智能硬件: 'Smart Hardware',
};

const INDUSTRY_EN_TO_ZH: Record<string, string> = Object.fromEntries(
  Object.entries(INDUSTRY_ZH_TO_EN).map(([zh, en]) => [en, zh])
);

export function getIndustryLabel(locale: Locale, industry: string): string {
  if (locale === 'zh') return industry;
  return INDUSTRY_ZH_TO_EN[industry] ?? industry;
}

/** Convert UI filter label to stored industry value for matching */
export function resolveIndustryFilter(locale: Locale, filterLabel: string): string {
  if (locale === 'en' && filterLabel !== 'All') {
    return INDUSTRY_EN_TO_ZH[filterLabel] ?? filterLabel;
  }
  if (locale === 'zh' && filterLabel === '全部') return '全部';
  return filterLabel;
}

export function getDefaultIndustryFilter(locale: Locale): string {
  return locale === 'en' ? 'All' : '全部';
}
