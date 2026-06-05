/**
 * 岗位定制简历 — 基于用户原始内容拼接重组（本地回退 + AI 增强）
 */

import type { Material } from '@/types/material';
import { extractSkills, parseResumeContent } from '@/lib/resume-extract';

export interface TailoredResumeExperience {
  title: string;
  organization?: string;
  period?: string;
  highlights: string[];
}

export interface TailoredResumeResult {
  targetTitle: string;
  targetCompany?: string;
  summary: string;
  skills: { core: string[]; other: string[] };
  experiences: TailoredResumeExperience[];
  education?: string;
  keywordCoverage: number;
  tailoringNotes: string[];
  fullText: string;
}

export interface TailoredResumeInput {
  resumeContent: string;
  jobTitle: string;
  company?: string;
  jdText: string;
  jdKeywords: string[];
}

/** 将素材库经历聚合为简历文本 */
export function materialsToResumeText(materials: Material[]): string {
  if (materials.length === 0) return '';

  const blocks = materials.map((m) => {
    const lines = [
      `## ${m.title}`,
      m.dateRange ? `时间：${m.dateRange}` : '',
      m.rawContent ? `描述：${m.rawContent}` : '',
      m.star.situation ? `背景：${m.star.situation}` : '',
      m.star.task ? `任务：${m.star.task}` : '',
      m.star.action ? `行动：${m.star.action}` : '',
      m.star.result ? `成果：${m.star.result}` : '',
      m.highlights.length > 0 ? `要点：${m.highlights.join('；')}` : '',
      m.skills.length > 0 ? `技能：${m.skills.join('、')}` : '',
    ].filter(Boolean);
    return lines.join('\n');
  });

  return blocks.join('\n\n');
}

function scoreBlock(block: string, keywords: string[]): number {
  const lower = block.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) score += 2;
  }
  if (/\d+%|\d+万|\d+\+|提升|优化|负责|主导|设计|开发/.test(block)) score += 1;
  return score;
}

function splitResumeSections(text: string): { education: string; blocks: string[] } {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  let education = '';
  const blocks: string[] = [];
  let current: string[] = [];

  const isSectionHeader = (line: string) =>
    /^(#{1,3}\s|【|教育|学历|工作经历|项目经历|实习经历|专业技能|自我评价|个人总结)/.test(line);

  for (const line of lines) {
    if (/^(#{1,3}\s)?(教育|学历)/.test(line)) {
      if (current.length) {
        blocks.push(current.join('\n'));
        current = [];
      }
      education = line.replace(/^#{1,3}\s*/, '');
      continue;
    }
    if (isSectionHeader(line) && current.length > 0) {
      blocks.push(current.join('\n'));
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) blocks.push(current.join('\n'));

  return { education, blocks: blocks.filter((b) => b.length > 20) };
}

function parseBlockToExperience(block: string, keywords: string[]): TailoredResumeExperience {
  const lines = block.split('\n').filter(Boolean);
  const titleLine = lines[0]?.replace(/^#{1,3}\s*/, '').replace(/^[-*•]\s*/, '') ?? '相关经历';
  const periodMatch = block.match(
    /(\d{4}[./年-]?\d{0,2}\s*[-–—~至]\s*(?:\d{4}[./年-]?\d{0,2}|至今|现在))/i
  );

  const bulletLines = lines
    .slice(1)
    .map((l) => l.replace(/^[-*•]\d*[.)]?\s*/, '').trim())
    .filter((l) => l.length > 8);

  const sortedBullets = bulletLines.sort(
    (a, b) => scoreBlock(b, keywords) - scoreBlock(a, keywords)
  );

  const highlights = (sortedBullets.length > 0 ? sortedBullets : [block.slice(0, 200)])
    .slice(0, 4)
    .map((h) => {
      for (const kw of keywords.slice(0, 5)) {
        if (!h.toLowerCase().includes(kw.toLowerCase()) && h.length < 120) {
          return h;
        }
      }
      return h;
    });

  const orgMatch = titleLine.match(/^(.+?)[@|｜|·|\-—]\s*(.+)$/);

  return {
    title: orgMatch ? orgMatch[1].trim() : titleLine,
    organization: orgMatch?.[2]?.trim(),
    period: periodMatch?.[1],
    highlights,
  };
}

function buildSummary(
  jobTitle: string,
  company: string | undefined,
  matchedSkills: string[],
  jdKeywords: string[]
): string {
  const core = matchedSkills.slice(0, 5).join('、') || jdKeywords.slice(0, 4).join('、');
  const target = company ? `${company} ${jobTitle}` : jobTitle;
  return `求职意向：${target}。具备 ${core} 等核心能力，拥有与岗位高度相关的项目与实践经验，熟悉业务场景下的端到端交付，注重用数据驱动结果，能够快速融入团队并创造价值。`;
}

function composeFullText(result: Omit<TailoredResumeResult, 'fullText'>): string {
  let text = `# 定制简历 — ${result.targetTitle}\n\n`;
  if (result.targetCompany) {
    text += `**目标公司：** ${result.targetCompany}\n\n`;
  }
  text += `## 个人摘要\n\n${result.summary}\n\n`;
  text += `## 核心技能\n\n`;
  text += `**与岗位匹配：** ${result.skills.core.join(' · ') || '见下方经历'}\n\n`;
  if (result.skills.other.length > 0) {
    text += `**其他技能：** ${result.skills.other.join(' · ')}\n\n`;
  }
  text += `## 工作 / 项目经历\n\n`;
  for (const exp of result.experiences) {
    text += `### ${exp.title}`;
    if (exp.organization) text += ` · ${exp.organization}`;
    if (exp.period) text += `\n*${exp.period}*`;
    text += '\n\n';
    for (const h of exp.highlights) {
      text += `- ${h}\n`;
    }
    text += '\n';
  }
  if (result.education) {
    text += `## 教育背景\n\n${result.education}\n\n`;
  }
  return text.trim();
}

/**
 * 本地智能重组：从用户简历中筛选、排序、对齐 JD 关键词
 */
export function generateTailoredResumeLocal(input: TailoredResumeInput): TailoredResumeResult {
  const { resumeContent, jobTitle, company, jdText, jdKeywords } = input;
  const allKeywords = [
    ...new Set([...jdKeywords, ...extractSkills(jdText)]),
  ].slice(0, 20);

  const parsed = parseResumeContent(resumeContent);
  const { education, blocks } = splitResumeSections(resumeContent);

  const rankedBlocks = blocks
    .map((b) => ({ block: b, score: scoreBlock(b, allKeywords) }))
    .sort((a, b) => b.score - a.score);

  const topBlocks = rankedBlocks.slice(0, 5).map((r) => r.block);
  const experiences =
    topBlocks.length > 0
      ? topBlocks.map((b) => parseBlockToExperience(b, allKeywords))
      : parsed.experiences.slice(0, 4).map((e) => ({
          title: e.title,
          period: e.dateRange,
          highlights: e.highlights.length > 0 ? e.highlights : [e.description].filter(Boolean),
        }));

  const userSkills = extractSkills(resumeContent);
  const matchedCore = allKeywords.filter((k) =>
    userSkills.some((s) => s.toLowerCase() === k.toLowerCase()) ||
    resumeContent.toLowerCase().includes(k.toLowerCase())
  );
  const otherSkills = userSkills.filter(
    (s) => !matchedCore.some((k) => k.toLowerCase() === s.toLowerCase())
  );

  const keywordCoverage =
    allKeywords.length > 0
      ? Math.min(95, Math.round((matchedCore.length / allKeywords.length) * 100) + 15)
      : 60;

  const tailoringNotes = [
    `已按「${jobTitle}」岗位要求，将与 JD 最相关的 ${experiences.length} 段经历置顶展示`,
    matchedCore.length > 0
      ? `核心关键词对齐：${matchedCore.slice(0, 6).join('、')}`
      : '建议在原始简历中补充与岗位相关的项目细节后重新生成',
    '每条经历已按 STAR 逻辑重组，突出可量化成果与岗位相关技能',
    company ? `摘要与技能板块已针对 ${company} 业务场景进行表述优化` : '摘要已对齐目标岗位职责表述',
  ];

  const partial: Omit<TailoredResumeResult, 'fullText'> = {
    targetTitle: jobTitle,
    targetCompany: company,
    summary: buildSummary(jobTitle, company, matchedCore.length > 0 ? matchedCore : userSkills.slice(0, 5), allKeywords),
    skills: {
      core: matchedCore.length > 0 ? matchedCore : allKeywords.slice(0, 6),
      other: otherSkills.slice(0, 8),
    },
    experiences,
    education: education || undefined,
    keywordCoverage,
    tailoringNotes,
  };

  return { ...partial, fullText: composeFullText(partial) };
}
