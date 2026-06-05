/**
 * 从素材库生成个人资料参考提示 — 仅供展示，不自动写入用户设置
 */

import type { Material } from '@/types/material';
import type { ProfileHints } from '@/types/user-profile';
import { CATEGORY_LABELS } from '@/types/material';

const ROLE_PATTERNS: { pattern: RegExp; role: string }[] = [
  { pattern: /前端|frontend|react|vue/i, role: '前端开发工程师' },
  { pattern: /后端|backend|java|go|server/i, role: '后端开发工程师' },
  { pattern: /算法|ml|ai|machine learning/i, role: '算法工程师' },
  { pattern: /产品|pm|product manager/i, role: '产品经理' },
  { pattern: /数据|analyst|analytics/i, role: '数据分析师' },
  { pattern: /设计|ui|ux|designer/i, role: 'UI/UX 设计师' },
  { pattern: /运营|operation/i, role: '运营专员' },
];

const CITY_PATTERN = /(北京|上海|深圳|杭州|广州|成都|南京|武汉|西安|苏州)/;

export function buildProfileHints(materials: Material[]): ProfileHints {
  if (materials.length === 0) {
    return {
      hasData: false,
      experienceCount: 0,
      skillCount: 0,
      topSkills: [],
      experienceTitles: [],
      bioSuggestion: null,
      targetRoleSuggestion: null,
      locationSuggestion: null,
    };
  }

  const allSkills = [...new Set(materials.flatMap((m) => m.skills))];
  const topSkills = allSkills.slice(0, 6);
  const experienceTitles = materials.slice(0, 4).map((m) => m.title);

  const categoryCounts = new Map<string, number>();
  for (const m of materials) {
    categoryCounts.set(m.category, (categoryCounts.get(m.category) || 0) + 1);
  }
  const dominantCategory = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  const allText = materials
    .map((m) => [m.title, m.rawContent, m.star.result, ...m.highlights].join(' '))
    .join('\n');

  let targetRoleSuggestion: string | null = null;
  for (const { pattern, role } of ROLE_PATTERNS) {
    if (pattern.test(allText)) {
      targetRoleSuggestion = role;
      break;
    }
  }
  if (!targetRoleSuggestion && dominantCategory) {
    const map: Partial<Record<Material['category'], string>> = {
      internship: '相关方向实习生',
      project: '软件工程师',
      research: '研究员 / 算法方向',
      competition: '技术竞赛方向',
      campus: '综合管理培训生',
    };
    targetRoleSuggestion = map[dominantCategory as Material['category']] ?? null;
  }

  const locationMatch = allText.match(CITY_PATTERN);
  const locationSuggestion = locationMatch?.[1] ?? null;

  const skillPart = topSkills.length > 0 ? `熟悉 ${topSkills.slice(0, 4).join('、')}` : '';
  const expPart =
    experienceTitles.length > 0
      ? `拥有 ${materials.length} 段${dominantCategory ? CATEGORY_LABELS[dominantCategory as Material['category']] : '相关'}经历`
      : '';
  const resultSnippet = materials
    .map((m) => m.star.result || m.highlights[0])
    .filter(Boolean)
    .slice(0, 1)[0];

  let bioSuggestion: string | null = null;
  if (skillPart || expPart) {
    bioSuggestion = [expPart, skillPart, resultSnippet ? `代表性成果：${resultSnippet.slice(0, 60)}` : '']
      .filter(Boolean)
      .join('，')
      .slice(0, 120);
    if (bioSuggestion.length < 10) bioSuggestion = null;
  }

  return {
    hasData: true,
    experienceCount: materials.length,
    skillCount: allSkills.length,
    topSkills,
    experienceTitles,
    bioSuggestion,
    targetRoleSuggestion,
    locationSuggestion,
  };
}
