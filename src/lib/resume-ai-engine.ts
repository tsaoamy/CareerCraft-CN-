/**
 * 简历 AI 引擎 — 基于素材库 + 目标岗位，本地智能重组、丰富表述、生成建议
 */

import type { Material, MaterialCategory } from '@/types/material';
import type { TailoredResumeResult } from '@/lib/tailored-resume';
import { materialsToResumeText, generateTailoredResumeLocal } from '@/lib/tailored-resume';
import { analyzeJD } from '@/lib/jd-analyzer';
import type { Locale } from '@/lib/i18n/translations';

export interface RoleProfile {
  title: string;
  level: string;
  industry: string;
  keywords: string[];
  softSkills: string[];
}

export interface ResumeSuggestion {
  id: string;
  type: 'enhance' | 'add' | 'keyword' | 'quantify' | 'structure';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
}

export interface SuggestedExperience {
  id: string;
  category: MaterialCategory;
  title: string;
  reason: string;
  template: string;
}

export interface ResumeAIResult {
  sections: { id: string; label: string; content: string }[];
  matchScore: number;
  keywordCoverage: number;
  suggestions: ResumeSuggestion[];
  suggestedExperiences: SuggestedExperience[];
  tailoringNotes: string[];
  usedMaterialIds: string[];
}

export interface ResumeAIInput {
  jobTitle: string;
  jdExtra?: string;
  materials: Material[];
  locale: Locale;
}

const ROLE_PATTERNS: { pattern: RegExp; title: string; keywords: string[] }[] = [
  { pattern: /产品|product\s*manager|pm/i, title: '产品经理', keywords: ['产品设计', '用户研究', '数据分析', 'PRD', 'A/B测试', '竞品分析', '项目管理'] },
  { pattern: /前端|frontend|web/i, title: '前端工程师', keywords: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', '性能优化', '组件化'] },
  { pattern: /后端|backend|java|go\s*开发/i, title: '后端工程师', keywords: ['Java', 'Go', 'MySQL', 'Redis', '微服务', 'API', 'Docker'] },
  { pattern: /算法|ai|机器学习|ml|deep\s*learning/i, title: '算法工程师', keywords: ['Python', '机器学习', '深度学习', 'PyTorch', 'TensorFlow', 'NLP'] },
  { pattern: /数据|analyst|analytics|bi/i, title: '数据分析师', keywords: ['SQL', 'Python', '数据分析', 'Tableau', 'A/B测试', '数据可视化'] },
  { pattern: /运营|operation|growth/i, title: '运营', keywords: ['用户增长', '数据分析', '内容运营', '活动策划', 'A/B测试'] },
  { pattern: /设计|ui|ux|designer/i, title: '设计师', keywords: ['Figma', '用户体验', '交互设计', '视觉设计', '用户研究'] },
];

const SOFT_SKILLS = ['沟通能力', '团队协作', '问题解决', '领导力', '项目管理'];

const ACTION_VERBS_ZH = ['主导', '负责', '推动', '设计', '优化', '搭建', '实现', '分析', '落地', '协调'];
const ACTION_VERBS_EN = ['Led', 'Owned', 'Drove', 'Designed', 'Optimized', 'Built', 'Implemented', 'Analyzed', 'Delivered', 'Coordinated'];

function inferRoleProfile(jobTitle: string, jdExtra?: string, locale: Locale = 'zh'): RoleProfile {
  const combined = `${jobTitle}\n${jdExtra ?? ''}`;
  const jdAnalysis = analyzeJD(combined, []);
  let keywords = [...new Set([...jdAnalysis.skills, ...jdAnalysis.keywords])];

  for (const role of ROLE_PATTERNS) {
    if (role.pattern.test(jobTitle) || role.pattern.test(jdExtra ?? '')) {
      keywords = [...new Set([...keywords, ...role.keywords])];
      return {
        title: locale === 'en' ? jobTitle : role.title,
        level: jdAnalysis.portrait.level,
        industry: jdAnalysis.portrait.industry,
        keywords: keywords.slice(0, 12),
        softSkills: SOFT_SKILLS.slice(0, 3),
      };
    }
  }

  if (keywords.length === 0) {
    keywords = locale === 'en'
      ? ['Problem Solving', 'Communication', 'Project Management', 'Data Analysis']
      : ['数据分析', '项目管理', '沟通协作', '问题解决'];
  }

  return {
    title: jobTitle,
    level: jdAnalysis.portrait.level,
    industry: jdAnalysis.portrait.industry,
    keywords,
    softSkills: SOFT_SKILLS.slice(0, 3),
  };
}

function scoreMaterial(m: Material, profile: RoleProfile): number {
  let score = 0;
  const text = `${m.title} ${m.rawContent} ${m.star.action} ${m.star.result} ${m.skills.join(' ')}`.toLowerCase();
  for (const kw of profile.keywords) {
    if (text.includes(kw.toLowerCase())) score += 3;
    if (m.skills.some((s) => s.toLowerCase() === kw.toLowerCase())) score += 2;
  }
  if (m.star.result && /\d|%|万|k|倍|提升|增长/.test(m.star.result)) score += 2;
  if (m.highlights.length >= 2) score += 1;
  return score;
}

function hasQuantified(text: string): boolean {
  return /\d+%|\d+万|\d+\+|提升\s*\d|增长\s*\d|服务\s*\d|DAU|MAU|GMV/i.test(text);
}

function enrichBullet(text: string, profile: RoleProfile, locale: Locale): string {
  let bullet = text.replace(/^[-*•]\s*/, '').trim();
  if (!bullet) return bullet;

  const verbs = locale === 'en' ? ACTION_VERBS_EN : ACTION_VERBS_ZH;
  const startsWithVerb = verbs.some((v) => bullet.startsWith(v) || bullet.toLowerCase().startsWith(v.toLowerCase()));
  if (!startsWithVerb && bullet.length > 10) {
    bullet = locale === 'en' ? `Delivered ${bullet.charAt(0).toLowerCase()}${bullet.slice(1)}` : `主导${bullet.replace(/^[，,。.]/, '')}`;
  }

  const missingKw = profile.keywords.find(
    (kw) => !bullet.toLowerCase().includes(kw.toLowerCase()) && bullet.length < 100
  );
  if (missingKw && profile.keywords.indexOf(missingKw) < 3) {
    bullet = locale === 'en'
      ? `${bullet}, applying ${missingKw} to improve outcomes`
      : `${bullet}，运用${missingKw}提升业务效果`;
  }

  return bullet;
}

function materialToExperienceBlock(m: Material, profile: RoleProfile, locale: Locale): string {
  const header = m.dateRange ? `${m.title} · ${m.dateRange}` : m.title;
  const bullets: string[] = [];

  if (m.star.action) bullets.push(enrichBullet(m.star.action, profile, locale));
  if (m.star.result) bullets.push(enrichBullet(m.star.result, profile, locale));
  for (const h of m.highlights.slice(0, 2)) {
    if (h.trim()) bullets.push(enrichBullet(h, profile, locale));
  }
  if (bullets.length === 0 && m.rawContent) {
    const lines = m.rawContent.split('\n').filter((l) => l.trim().length > 8).slice(0, 3);
    bullets.push(...lines.map((l) => enrichBullet(l, profile, locale)));
  }

  const uniqueBullets = [...new Set(bullets)].slice(0, 4);
  return `${header}\n${uniqueBullets.map((b) => `• ${b}`).join('\n')}`;
}

function buildSummary(profile: RoleProfile, materials: Material[], locale: Locale): string {
  const allSkills = [...new Set(materials.flatMap((m) => m.skills))];
  const matched = profile.keywords.filter((k) =>
    allSkills.some((s) => s.toLowerCase().includes(k.toLowerCase())) ||
    materials.some((m) => m.rawContent.toLowerCase().includes(k.toLowerCase()))
  );
  const core = (matched.length > 0 ? matched : profile.keywords).slice(0, 5).join(locale === 'en' ? ', ' : '、');
  const years = materials.length >= 4 ? (locale === 'en' ? '3+' : '3+') : (locale === 'en' ? '1+' : '1+');

  if (locale === 'en') {
    return `${years} years of relevant experience targeting ${profile.title}. Core strengths: ${core}. Proven track record delivering measurable outcomes across ${materials.length} documented experiences, with strong alignment to ${profile.industry} role requirements.`;
  }
  return `求职意向：${profile.title}（${profile.level}）。具备 ${core} 等核心能力，拥有 ${materials.length} 段可验证的项目/实习经历，熟悉${profile.industry}业务场景，注重用数据驱动结果与端到端交付。`;
}

function buildSkillsContent(materials: Material[], profile: RoleProfile, locale: Locale): string {
  const userSkills = [...new Set(materials.flatMap((m) => m.skills))];
  const core = profile.keywords.filter((k) =>
    userSkills.some((s) => s.toLowerCase().includes(k.toLowerCase())) ||
    userSkills.some((s) => k.toLowerCase().includes(s.toLowerCase()))
  );
  const coreList = (core.length > 0 ? core : profile.keywords.slice(0, 6));
  const other = userSkills.filter((s) => !coreList.some((c) => c.toLowerCase() === s.toLowerCase())).slice(0, 8);

  if (locale === 'en') {
    return `Core (role-aligned): ${coreList.join(' · ')}\nOther: ${other.length > 0 ? other.join(' · ') : 'See experiences below'}`;
  }
  return `核心技能（岗位匹配）：${coreList.join(' · ')}\n其他技能：${other.length > 0 ? other.join(' · ') : '见下方经历'}`;
}

function buildSuggestions(
  materials: Material[],
  profile: RoleProfile,
  matchScore: number,
  keywordCoverage: number,
  locale: Locale
): ResumeSuggestion[] {
  const suggestions: ResumeSuggestion[] = [];
  const allText = materials.map((m) => m.rawContent + m.star.result).join(' ');
  const missingKw = profile.keywords.filter((k) => !allText.toLowerCase().includes(k.toLowerCase()));

  if (materials.length === 0) {
    suggestions.push({
      id: 'add-first',
      type: 'add',
      title: locale === 'en' ? 'Add your first experience' : '先录入至少 1 段经历',
      description: locale === 'en'
        ? 'Go to Material Library and add internship/project experiences — AI will structure them in STAR format.'
        : '前往素材库录入实习/项目经历，AI 会自动拆解为 STAR 格式后再生成简历。',
      priority: 'high',
      actionLabel: locale === 'en' ? 'Go to Library' : '去素材库',
    });
    return suggestions;
  }

  if (missingKw.length > 0) {
    suggestions.push({
      id: 'keywords',
      type: 'keyword',
      title: locale === 'en' ? `Add JD keywords: ${missingKw.slice(0, 4).join(', ')}` : `补充岗位关键词：${missingKw.slice(0, 4).join('、')}`,
      description: locale === 'en'
        ? 'Weave these into project bullets naturally — ATS and recruiters scan for them.'
        : '在项目描述中自然融入这些词，提升 ATS 通过率与面试官匹配感知。',
      priority: 'high',
    });
  }

  const noQuant = materials.filter((m) => !hasQuantified(m.star.result + m.rawContent));
  if (noQuant.length > 0) {
    suggestions.push({
      id: 'quantify',
      type: 'quantify',
      title: locale === 'en' ? `${noQuant.length} experiences need metrics` : `${noQuant.length} 段经历缺少量化成果`,
      description: locale === 'en'
        ? 'Add numbers: user scale, growth %, revenue impact, efficiency gains.'
        : '补充用户数、增长率、营收/效率提升等可验证数据，每条经历至少 1 个数字。',
      priority: 'high',
    });
  }

  if (matchScore < 70) {
    suggestions.push({
      id: 'match',
      type: 'enhance',
      title: locale === 'en' ? 'Strengthen role alignment' : '提升岗位匹配度',
      description: locale === 'en'
        ? `Highlight experiences closest to "${profile.title}" and reorder bullets by relevance.`
        : `优先展示与「${profile.title}」最相关的经历，并将最匹配的 bullet 置顶。`,
      priority: 'medium',
    });
  }

  if (keywordCoverage < 75) {
    suggestions.push({
      id: 'coverage',
      type: 'structure',
      title: locale === 'en' ? 'Expand skill coverage' : '扩展技能覆盖',
      description: locale === 'en'
        ? 'Add a dedicated skills section and mirror JD terminology in experience titles.'
        : '在技能栏突出 JD 术语，并在经历标题中体现岗位相关能力。',
      priority: 'medium',
    });
  }

  if (materials.length < 3) {
    suggestions.push({
      id: 'more-exp',
      type: 'add',
      title: locale === 'en' ? 'Add 1-2 more experiences' : '建议再补充 1-2 段经历',
      description: locale === 'en'
        ? '3+ experiences give recruiters enough depth — see suggested templates below.'
        : '3 段以上经历更有说服力，可参考下方「建议补充的经历」模板。',
      priority: 'medium',
    });
  }

  return suggestions.slice(0, 5);
}

function buildSuggestedExperiences(
  materials: Material[],
  profile: RoleProfile,
  locale: Locale
): SuggestedExperience[] {
  const existing = new Set(materials.map((m) => m.category));
  const suggestions: SuggestedExperience[] = [];

  const templates: { cat: MaterialCategory; title: string; reason: string; tpl: string; tplEn: string }[] = [
    {
      cat: 'project',
      title: locale === 'en' ? 'Role-aligned side project' : '岗位相关实战项目',
      reason: locale === 'en' ? `Demonstrate ${profile.keywords[0] ?? 'core skills'} in a real scenario` : `用真实场景体现${profile.keywords[0] ?? '核心技能'}`,
      tpl: `【项目名称】· 个人/负责人 · 【时间】\n\n针对${profile.title}场景，基于${profile.keywords.slice(0, 2).join('+')}完成【具体功能】。\n- 从0到1完成方案设计与落地\n- 关键指标提升 XX%（请替换真实数据）\n- 技术/方法：${profile.keywords.slice(0, 3).join('、')}`,
      tplEn: `[Project] · Lead · [Date]\n\nBuilt a feature for ${profile.title} using ${profile.keywords.slice(0, 2).join(' + ')}.\n- Designed and shipped end-to-end\n- Improved key metric by XX% (use real data)\n- Stack: ${profile.keywords.slice(0, 3).join(', ')}`,
    },
    {
      cat: 'internship',
      title: locale === 'en' ? 'Internship (if applicable)' : '相关实习经历',
      reason: locale === 'en' ? 'Industry exposure strengthens credibility' : '行业实践增强可信度',
      tpl: `【公司】· ${profile.title}实习 · 【时间】\n\n- 参与【产品/项目】需求分析与迭代\n- 运用${profile.keywords[0] ?? '数据分析'}输出报告，支撑决策\n- 协作跨团队推进上线，用户指标提升 XX%`,
      tplEn: `[Company] · ${profile.title} Intern · [Date]\n\n- Contributed to product iterations and analysis\n- Used ${profile.keywords[0] ?? 'data analysis'} for decision support\n- Cross-team delivery with measurable user impact`,
    },
    {
      cat: 'competition',
      title: locale === 'en' ? 'Competition / hackathon' : '竞赛 / 黑客松',
      reason: locale === 'en' ? 'Shows problem-solving under pressure' : '体现抗压与快速交付能力',
      tpl: `【竞赛名称】· 【奖项】\n\n- 角色：队长/核心开发\n- 解决${profile.industry}领域【具体问题】\n- 方案准确率达 XX%，获【奖项等级】`,
      tplEn: `[Competition] · [Award]\n\n- Role: team lead\n- Solved a ${profile.industry} problem\n- Achieved XX% accuracy, won [award level]`,
    },
  ];

  for (const t of templates) {
    if (!existing.has(t.cat) || materials.filter((m) => m.category === t.cat).length < 2) {
      suggestions.push({
        id: `suggest-${t.cat}`,
        category: t.cat,
        title: t.title,
        reason: t.reason,
        template: locale === 'en' ? t.tplEn : t.tpl,
      });
    }
  }

  return suggestions.slice(0, 3);
}

function tailoredResultToSections(result: TailoredResumeResult, locale: Locale): { id: string; label: string; content: string }[] {
  const labels = locale === 'en'
    ? { summary: 'Summary', skills: 'Skills', experience: 'Experience', education: 'Education' }
    : { summary: '个人简介', skills: '专业技能', experience: '工作/项目经历', education: '教育背景' };

  const expContent = result.experiences
    .map((e) => {
      let block = e.title;
      if (e.organization) block += ` · ${e.organization}`;
      if (e.period) block += `\n${e.period}`;
      block += '\n' + e.highlights.map((h) => `• ${h}`).join('\n');
      return block;
    })
    .join('\n\n');

  const skillsContent = locale === 'en'
    ? `Core: ${result.skills.core.join(' · ')}\nOther: ${result.skills.other.join(' · ') || '—'}`
    : `核心：${result.skills.core.join(' · ')}\n其他：${result.skills.other.join(' · ') || '—'}`;

  return [
    { id: 'summary', label: labels.summary, content: result.summary },
    { id: 'skills', label: labels.skills, content: skillsContent },
    { id: 'experience', label: labels.experience, content: expContent },
    ...(result.education ? [{ id: 'education', label: labels.education, content: result.education }] : []),
  ];
}

/** 本地智能生成（主路径，无需 API） */
export function generateResumeAI(input: ResumeAIInput): ResumeAIResult {
  const { jobTitle, jdExtra, materials, locale } = input;
  const profile = inferRoleProfile(jobTitle, jdExtra, locale);

  if (materials.length === 0) {
    return {
      sections: [],
      matchScore: 0,
      keywordCoverage: 0,
      suggestions: buildSuggestions([], profile, 0, 0, locale),
      suggestedExperiences: buildSuggestedExperiences([], profile, locale),
      tailoringNotes: locale === 'en'
        ? ['Add experiences in Material Library first']
        : ['请先在素材库录入经历'],
      usedMaterialIds: [],
    };
  }

  const ranked = [...materials]
    .map((m) => ({ m, score: scoreMaterial(m, profile) }))
    .sort((a, b) => b.score - a.score);

  const topMaterials = ranked.slice(0, 6).map((r) => r.m);
  const resumeText = materialsToResumeText(topMaterials);
  const syntheticJd = jdExtra?.trim() || `${jobTitle}\n${profile.keywords.join(' ')} ${profile.softSkills.join(' ')}`;

  const localResult = generateTailoredResumeLocal({
    resumeContent: resumeText,
    jobTitle,
    jdText: syntheticJd,
    jdKeywords: profile.keywords,
  });

  // 用更丰富的 bullet 重写经历板块
  const enrichedExp = topMaterials
    .map((m) => materialToExperienceBlock(m, profile, locale))
    .join('\n\n');

  const sections = tailoredResultToSections(localResult, locale).map((s) =>
    s.id === 'experience' && enrichedExp ? { ...s, content: enrichedExp } : s
  );

  if (!sections.find((s) => s.id === 'summary')) {
    sections.unshift({
      id: 'summary',
      label: locale === 'en' ? 'Summary' : '个人简介',
      content: buildSummary(profile, topMaterials, locale),
    });
  } else {
    const idx = sections.findIndex((s) => s.id === 'summary');
    if (idx >= 0) sections[idx] = { ...sections[idx], content: buildSummary(profile, topMaterials, locale) };
  }

  const skillsIdx = sections.findIndex((s) => s.id === 'skills');
  if (skillsIdx >= 0) {
    sections[skillsIdx] = { ...sections[skillsIdx], content: buildSkillsContent(topMaterials, profile, locale) };
  }

  const jdMatch = analyzeJD(syntheticJd, materials);
  const matchScore = jdMatch.matchScore;
  const keywordCoverage = localResult.keywordCoverage;

  const tailoringNotes = locale === 'en'
    ? [
        `Prioritized ${topMaterials.length} most relevant experiences for "${jobTitle}"`,
        `Keyword coverage ~${keywordCoverage}% — ${profile.keywords.slice(0, 5).join(', ')}`,
        'Bullets rewritten with action verbs and role-aligned phrasing',
        missingNotes(materials, profile, locale),
      ]
    : [
        `已按「${jobTitle}」筛选并置顶 ${topMaterials.length} 段最相关经历`,
        `关键词覆盖率约 ${keywordCoverage}%，对齐：${profile.keywords.slice(0, 5).join('、')}`,
        '经历描述已用 STAR 逻辑改写，突出行动与成果',
        missingNotes(materials, profile, locale),
      ];

  return {
    sections,
    matchScore,
    keywordCoverage,
    suggestions: buildSuggestions(materials, profile, matchScore, keywordCoverage, locale),
    suggestedExperiences: buildSuggestedExperiences(materials, profile, locale),
    tailoringNotes,
    usedMaterialIds: topMaterials.map((m) => m.id),
  };
}

function missingNotes(materials: Material[], profile: RoleProfile, locale: Locale): string {
  const gaps = profile.keywords.filter(
    (k) => !materials.some((m) => (m.rawContent + m.skills.join(' ')).toLowerCase().includes(k.toLowerCase()))
  );
  if (gaps.length === 0) {
    return locale === 'en' ? 'Core keywords covered — ready to refine details' : '核心关键词已覆盖，可微调表述';
  }
  return locale === 'en'
    ? `Consider adding: ${gaps.slice(0, 3).join(', ')}`
    : `建议补充经历体现：${gaps.slice(0, 3).join('、')}`;
}

/** 尝试调用 AI API，失败则回退本地 */
export async function generateResumeAIWithApi(input: ResumeAIInput): Promise<ResumeAIResult & { source: 'ai' | 'local' }> {
  const local = generateResumeAI(input);
  const resumeContent = materialsToResumeText(input.materials);
  if (resumeContent.length < 20 || !input.jobTitle.trim()) {
    return { ...local, source: 'local' };
  }

  const jdText = input.jdExtra?.trim() || `${input.jobTitle}\n${local.tailoringNotes.join('\n')}`;
  const keywords = inferRoleProfile(input.jobTitle, input.jdExtra, input.locale).keywords;

  try {
    const res = await fetch('/api/ai/generate-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeContent,
        jobTitle: input.jobTitle,
        jdText,
        jdKeywords: keywords,
      }),
    });
    const data = await res.json();
    if (data.success && data.data) {
      const result = data.data as TailoredResumeResult;
      const sections = tailoredResultToSections(result, input.locale);
      return {
        sections,
        matchScore: local.matchScore,
        keywordCoverage: result.keywordCoverage ?? local.keywordCoverage,
        suggestions: local.suggestions,
        suggestedExperiences: local.suggestedExperiences,
        tailoringNotes: result.tailoringNotes ?? local.tailoringNotes,
        usedMaterialIds: local.usedMaterialIds,
        source: data.meta?.source === 'offline' ? 'local' : 'ai',
      };
    }
  } catch {
    // fallback
  }

  return { ...local, source: 'local' };
}
