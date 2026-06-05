/**
 * 统一岗位匹配引擎 — 全站确定性评分（无随机扰动）
 */

import type { Material } from '@/types/material';
import type { JobPositionSeed } from '@/data/job-positions';

export const MATCH_VOCABULARY = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'SQL', 'React', 'Vue', 'Angular',
  'Node.js', 'Django', 'Spring', 'Docker', 'Kubernetes', 'AWS', 'Linux', 'Git', 'Redis', 'MongoDB',
  'MySQL', 'PostgreSQL', 'GraphQL', 'REST API', '微服务', 'CI/CD', 'DevOps', '敏捷开发', 'Scrum',
  '产品设计', '用户研究', '用户体验', '数据分析', '数据挖掘', '机器学习', '深度学习', 'NLP',
  '计算机视觉', 'PyTorch', 'TensorFlow', 'A/B测试', 'PRD', '竞品分析', '需求管理', '项目管理',
  '用户增长', '增长黑客', 'SEO', 'SEM', '内容运营', '社群运营', '新媒体运营', '品牌营销',
  '财务分析', '风险控制', '合规', 'Tableau', 'Power BI', 'Excel', 'SPSS',
  '沟通能力', '团队协作', '领导力', '问题解决', '批判性思维', '时间管理', '演讲能力',
  '性能优化', '工程化', '前端架构', '跨端', '微信生态', 'Unity', 'Unreal', '游戏策划',
  'Prompt', 'LLM', '大模型', 'Agent', 'Figma', 'Axure', 'Next.js', 'Webpack', 'Vite',
];

const SYNONYMS: Record<string, string[]> = {
  javascript: ['javascript', 'js', 'ecmascript'],
  typescript: ['typescript', 'ts'],
  react: ['react', 'react.js', 'reactjs'],
  vue: ['vue', 'vue.js', 'vuejs'],
  nodejs: ['node.js', 'nodejs', 'node'],
  python: ['python', 'py'],
  kubernetes: ['kubernetes', 'k8s'],
  llm: ['llm', '大模型'],
  cicd: ['ci/cd', 'cicd'],
};

export interface MatchBreakdown {
  matchScore: number;
  keywordCoverage: number;
  competitivenessScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  skillGaps: Array<{ skill: string; required_level: number; current_level: number }>;
}

export interface PositionMatchResult {
  match_score: number;
  keyword_coverage: number;
  competitiveness_score: number;
  skill_gaps: MatchBreakdown['skillGaps'];
  optimization_tips: string[];
  top5_positions: Array<{ title: string; company: string; match_score: number }>;
  top5_industries: string[];
  growth_path: Array<{ step: number; description: string; timeframe: string }>;
}

function normalizeCompact(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '').replace(/[./\-_]/g, '');
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extractKeywordsFromText(text: string): string[] {
  const found: string[] = [];
  const lower = text.toLowerCase();
  for (const skill of MATCH_VOCABULARY) {
    if (lower.includes(skill.toLowerCase())) found.push(skill);
  }
  return [...new Set(found)];
}

export function buildCorpusText(parts: {
  resumeText?: string;
  jdText?: string;
  materialSkills?: string[];
  materials?: Material[];
}): string {
  const chunks: string[] = [];
  if (parts.resumeText) chunks.push(parts.resumeText);
  if (parts.jdText) chunks.push(parts.jdText);
  if (parts.materialSkills?.length) chunks.push(parts.materialSkills.join(' '));
  if (parts.materials) {
    for (const m of parts.materials) {
      chunks.push(
        m.title, m.rawContent, m.dateRange ?? '',
        ...m.skills, ...m.highlights, ...m.tags,
        m.star.situation, m.star.task, m.star.action, m.star.result
      );
    }
  }
  return chunks.filter(Boolean).join('\n');
}

export function isKeywordInCorpus(keyword: string, corpusLower: string, corpusCompact: string): boolean {
  const kw = keyword.trim();
  if (!kw) return false;
  const kwLower = kw.toLowerCase();
  if (corpusLower.includes(kwLower)) return true;
  const kwCompact = normalizeCompact(kw);
  if (kwCompact.length >= 2 && corpusCompact.includes(kwCompact)) return true;

  for (const variants of Object.values(SYNONYMS)) {
    const hit = variants.some((v) => kwLower.includes(v.toLowerCase()) || kwCompact.includes(normalizeCompact(v)));
    if (hit) {
      return variants.some(
        (v) => corpusLower.includes(v.toLowerCase()) || corpusCompact.includes(normalizeCompact(v))
      );
    }
  }
  if (kw.length <= 5 && /^[a-z0-9+/]+$/i.test(kw)) {
    if (new RegExp(`\\b${escapeRegex(kwLower)}\\b`, 'i').test(corpusLower)) return true;
  }
  return false;
}

function mergeKeywords(primary: string[], extra: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of [...primary, ...extra]) {
    const t = k.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

function countOccurrences(keyword: string, corpusLower: string): number {
  return (corpusLower.match(new RegExp(escapeRegex(keyword.toLowerCase().trim()), 'gi')) || []).length;
}

function estimateCurrentLevel(keyword: string, corpusLower: string, corpusCompact: string): number {
  if (!isKeywordInCorpus(keyword, corpusLower, corpusCompact)) return 0;
  const n = countOccurrences(keyword, corpusLower);
  if (n >= 3) return 7;
  if (n >= 2) return 6;
  return 4;
}

function buildSkillGaps(
  allKeywords: string[],
  matchedKeywords: string[],
  corpusLower: string,
  corpusCompact: string
): MatchBreakdown['skillGaps'] {
  const unmatched = allKeywords.filter((k) => !matchedKeywords.includes(k));
  const gapSource = unmatched.length > 0 ? unmatched : allKeywords.slice(0, 4);
  return gapSource.slice(0, 5).map((skill, index) => ({
    skill,
    required_level: Math.min(9, 7 + Math.floor(index / 2)),
    current_level: estimateCurrentLevel(skill, corpusLower, corpusCompact),
  }));
}

export function computeMatchBreakdown(input: {
  requiredKeywords: string[];
  corpusText: string;
}): MatchBreakdown {
  const keywords = mergeKeywords(input.requiredKeywords, []);
  const corpusText = input.corpusText.trim();
  const corpusLower = corpusText.toLowerCase();
  const corpusCompact = normalizeCompact(corpusText);
  const hasContent = corpusText.length > 20;

  if (keywords.length === 0) {
    return {
      matchScore: 0, keywordCoverage: 0, competitivenessScore: 0,
      matchedKeywords: [], missingKeywords: [], skillGaps: [],
    };
  }

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  for (const kw of keywords) {
    if (isKeywordInCorpus(kw, corpusLower, corpusCompact)) matchedKeywords.push(kw);
    else missingKeywords.push(kw);
  }

  if (!hasContent) {
    return {
      matchScore: 0, keywordCoverage: 0, competitivenessScore: 0,
      matchedKeywords: [], missingKeywords: keywords,
      skillGaps: buildSkillGaps(keywords, [], corpusLower, corpusCompact),
    };
  }

  const keywordCoverage = Math.round((matchedKeywords.length / keywords.length) * 100);
  let depthBonus = 0;
  for (const kw of matchedKeywords) {
    if (countOccurrences(kw, corpusLower) >= 2) depthBonus += 1;
  }
  depthBonus = Math.min(8, depthBonus);
  const matchScore = Math.min(100, Math.round(keywordCoverage * 0.9 + depthBonus + 2));
  const competitivenessScore = Math.min(
    100,
    Math.max(0, Math.round(matchScore * 0.85 + Math.min(12, matchedKeywords.length * 2)))
  );

  return {
    matchScore, keywordCoverage, competitivenessScore,
    matchedKeywords, missingKeywords,
    skillGaps: buildSkillGaps(keywords, matchedKeywords, corpusLower, corpusCompact),
  };
}

export function computePositionMatch(input: {
  positionKeywords: string[];
  positionJdText?: string;
  resumeContent: string;
}): MatchBreakdown {
  const fromJd = input.positionJdText ? extractKeywordsFromText(input.positionJdText) : [];
  return computeMatchBreakdown({
    requiredKeywords: mergeKeywords(input.positionKeywords, fromJd),
    corpusText: input.resumeContent,
  });
}

export function computeMaterialMatch(
  materials: Material[],
  requiredSkills: string[]
): MatchBreakdown & { matchedMaterials: Material[] } {
  const breakdown = computeMatchBreakdown({
    requiredKeywords: requiredSkills,
    corpusText: buildCorpusText({ materials }),
  });
  const matchedMaterials = materials.filter((mat) => {
    const c = buildCorpusText({ materials: [mat] });
    const lower = c.toLowerCase();
    const compact = normalizeCompact(c);
    return requiredSkills.some((s) => isKeywordInCorpus(s, lower, compact));
  });
  return { ...breakdown, matchedMaterials };
}

const GROWTH_PATHS: Record<string, PositionMatchResult['growth_path']> = {
  互联网: [
    { step: 1, description: '补齐岗位核心技能栈与项目量化表达', timeframe: '1-2个月' },
    { step: 2, description: '积累与目标公司业务场景相关的实战项目', timeframe: '2-4个月' },
    { step: 3, description: '参与开源/技术分享，建立行业影响力', timeframe: '4-8个月' },
    { step: 4, description: '向 Senior / Tech Lead 或产品专家方向进阶', timeframe: '1-2年' },
  ],
  游戏: [
    { step: 1, description: '深入理解目标游戏品类与核心玩法循环', timeframe: '1-2个月' },
    { step: 2, description: '补充引擎/策划/数值相关作品集', timeframe: '2-4个月' },
    { step: 3, description: '参与 Game Jam 或独立项目积累完整上线经验', timeframe: '4-6个月' },
    { step: 4, description: '向主策/主程或制作人方向发展', timeframe: '2-3年' },
  ],
  人工智能: [
    { step: 1, description: '强化论文阅读与 SOTA 模型复现能力', timeframe: '1-3个月' },
    { step: 2, description: '完成 1-2 个端到端 ML 项目（数据→训练→部署）', timeframe: '3-6个月' },
    { step: 3, description: '关注顶会动态，尝试投稿或高质量开源', timeframe: '6-12个月' },
    { step: 4, description: '向 Research Scientist / ML Engineer 进阶', timeframe: '1-2年' },
  ],
  智能制造: [
    { step: 1, description: '补齐工业软件/嵌入式/自动化相关技能', timeframe: '1-3个月' },
    { step: 2, description: '参与产线数字化或 IoT 相关项目', timeframe: '3-6个月' },
    { step: 3, description: '积累跨部门（工艺+软件）协作案例', timeframe: '6-12个月' },
    { step: 4, description: '向智能制造架构师或产品专家进阶', timeframe: '1-2年' },
  ],
};

function rankRelatedPositions(
  positionId: string,
  position: JobPositionSeed | undefined,
  resumeContent: string,
  positions: JobPositionSeed[],
  currentMatchScore: number
): PositionMatchResult['top5_positions'] {
  const current = { title: position?.title ?? '目标岗位', company: position?.company ?? '', match_score: currentMatchScore };
  const scored = positions
    .filter((p) => p.id !== positionId)
    .map((p) => {
      const b = computePositionMatch({ positionKeywords: p.keywords, positionJdText: p.jd_text, resumeContent });
      let score = b.matchScore;
      if (p.industry === position?.industry) score = Math.min(100, score + 5);
      if (p.company === position?.company) score = Math.min(100, score + 3);
      return { title: p.title, company: p.company, match_score: score, hits: b.matchedKeywords.length };
    });
  scored.sort((a, b) => b.match_score - a.match_score || b.hits - a.hits);
  return [current, ...scored.slice(0, 4).map(({ title, company, match_score }) => ({ title, company, match_score }))].slice(0, 5);
}

export function buildPositionMatchResult(
  positionId: string,
  resumeContent: string,
  position: JobPositionSeed | undefined,
  allPositions: JobPositionSeed[]
): PositionMatchResult {
  const breakdown = computePositionMatch({
    positionKeywords: position?.keywords ?? ['React', 'TypeScript', 'Python', 'SQL', '产品设计', '数据分析'],
    positionJdText: position?.jd_text,
    resumeContent,
  });
  const industry = position?.industry ?? '互联网';
  const { matchedKeywords, missingKeywords } = breakdown;
  const total = matchedKeywords.length + missingKeywords.length;

  return {
    match_score: breakdown.matchScore,
    keyword_coverage: breakdown.keywordCoverage,
    competitiveness_score: breakdown.competitivenessScore,
    skill_gaps: breakdown.skillGaps,
    optimization_tips: [
      matchedKeywords.length > 0
        ? `简历已覆盖 ${matchedKeywords.length}/${total} 个核心关键词（${matchedKeywords.slice(0, 4).join('、')}），建议在项目描述中进一步量化成果`
        : '建议在简历中补充与目标岗位 JD 对齐的关键词与项目经历',
      missingKeywords.length > 0
        ? `重点补齐：${missingKeywords.slice(0, 3).join('、')}，可通过相关课程、项目或开源实践快速补强`
        : '核心技能覆盖较好，建议突出领导力、跨团队协作等软实力',
      `针对 ${position?.company ?? '目标公司'} ${position?.title ?? '该岗位'}，建议在简历顶部增加与「${position?.department ?? '业务部门'}」相关的业务理解`,
      '使用 STAR 法则描述项目，每条成就尽量包含数据指标（提升 X%、服务 Y 万用户等）',
    ],
    top5_positions: rankRelatedPositions(positionId, position, resumeContent, allPositions, breakdown.matchScore),
    top5_industries: [industry, '互联网', '人工智能', '云计算', '智能制造'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 5),
    growth_path: GROWTH_PATHS[industry] ?? GROWTH_PATHS['互联网'],
  };
}

export function computeJdResumeMatch(resumeContent: string, jdContent: string): MatchBreakdown {
  const jdKeywords = extractKeywordsFromText(jdContent);
  return computeMatchBreakdown({
    requiredKeywords: jdKeywords.length > 0 ? jdKeywords : ['团队协作', '沟通能力', '问题解决', '项目管理'],
    corpusText: buildCorpusText({ resumeText: resumeContent }),
  });
}
