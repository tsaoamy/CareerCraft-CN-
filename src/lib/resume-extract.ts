/**
 * 简历文本解析与关键词提取（本地启发式，无需 AI Key）
 * 针对中文校招/实习简历（教育背景、实习经历、项目经历、技能特长）优化
 */

import type { MaterialCategory } from '@/types/material';
import { apiFetchFormData } from '@/lib/api-client';

export const RESUME_FILE_ACCEPT =
  '.txt,.md,.csv,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const RESUME_FILE_LABEL = 'PDF / Word / TXT';

const SKILL_PATTERNS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'Go', 'Rust', 'SQL',
  'React', 'Vue\\.?js', 'Vue', 'Angular', 'Next\\.js', 'Node\\.js', 'Uniapp', 'Uni-app',
  'SpringBoot', 'Spring', 'MyBatis', 'Django', 'Flask', 'Element-UI',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLServer', 'Docker', 'Kubernetes',
  'AWS', 'Git', 'Nginx', 'Postman', 'Linux', 'HTML', 'CSS',
  'Figma', 'Axure', 'TensorFlow', 'PyTorch', 'OpenCV', 'CLIP', 'GPT-4o', 'Cursor',
  '产品设计', '用户研究', '数据分析', '项目管理', '敏捷开发', 'A/B测试',
  '机器学习', '深度学习', '计算机视觉', '自然语言处理', 'Prompt', 'LLM',
  'RESTful', 'ORM', 'Agent',
];

const SECTION_DEFS: {
  key: string;
  labels: string[];
  category?: MaterialCategory;
  skipExperience?: boolean;
}[] = [
  { key: 'education', labels: ['教育背景', '教育经历', 'Education', 'Educational Background'] },
  { key: 'internship', labels: ['实习经历', '实习经验', 'Internship', 'Internships'], category: 'internship' },
  { key: 'work', labels: ['工作经历', '工作经验', 'Work Experience', 'Employment'], category: 'internship' },
  { key: 'project', labels: ['项目经历', '项目经验', '项目描述', 'Projects', 'Project Experience'], category: 'project' },
  { key: 'campus', labels: [
    '校园经历', '在校经历', '学生工作', '学校任职', '学生干部', '社团活动', '社团经历',
    '社会实践', '志愿活动', '志愿服务', '组织经历', 'Leadership', 'Campus Activities',
  ], category: 'campus' },
  { key: 'awards', labels: [
    '荣获奖项', '荣誉奖项', '获奖情况', '所获荣誉', '奖项荣誉', '荣誉奖励', '个人荣誉',
    'Awards', 'Honors', 'Honours', 'Achievements',
  ], category: 'competition' },
  { key: 'competition', labels: ['竞赛经历', '比赛经历', 'Competitions'], category: 'competition' },
  { key: 'research', labels: ['科研经历', '科研经验', 'Research', 'Research Experience'], category: 'research' },
  { key: 'skills', labels: ['技能特长', '专业技能', '核心技能', 'Skills', 'Technical Skills'], skipExperience: true },
  { key: 'skillsAlt', labels: ['掌握技能', '技术栈', 'Skill Set'], skipExperience: true },
  { key: 'summary', labels: ['个人简介', '自我评价', '个人总结', 'Summary', 'Profile'], skipExperience: true },
];

const SECTION_HEADER_NAMES = [
  '教育背景', '教育经历', '实习经历', '实习经验', '工作经历', '工作经验',
  '项目经历', '项目经验', '校园经历', '在校经历', '学生工作', '学校任职',
  '荣获奖项', '荣誉奖项', '获奖情况', '竞赛经历', '科研经历',
  '技能特长', '专业技能', '个人简介', '自我评价',
  'Education', 'Internship', 'Work Experience', 'Projects', 'Awards', 'Honors', 'Skills',
].join('|');

const SECTION_HEADER_LINE_RE = new RegExp(`^(?:${SECTION_HEADER_NAMES})\\s*$`, 'i');

/** 日期片段：2024.06 / 2024.6 / 2024年6月 / 2024/06/01 */
const DATE_PART =
  '\\d{4}(?:[./]\\d{2}(?:[./]\\d{2})?|[./]\\d{1,2}(?![0-9])|年\\d{1,2}(?:月\\d{1,2}日?)?)';
const DATE_END = `(?:${DATE_PART}|至今|现在|present|Present|今)`;

/** 经历条目行：2025.06 - 2025.09  公司  岗位 */
const ENTRY_HEADER_RE = new RegExp(
  `^(${DATE_PART})\\s*[-–—~至到]+\\s*(${DATE_END})\\s*(.*)$`,
  'i'
);

/** 标题在前、日期在后：腾讯 · 产品实习  2023.06-2023.09 */
const ENTRY_DATE_SUFFIX_RE = new RegExp(
  `^(.+?)\\s+(${DATE_PART})\\s*[-–—~至到]+\\s*(${DATE_END})\\s*$`,
  'i'
);

/** 仅日期行（下一行是标题） */
const DATE_ONLY_LINE_RE = new RegExp(
  `^(${DATE_PART})\\s*[-–—~至到]+\\s*(${DATE_END})\\s*$`,
  'i'
);

/** 行首日期 + 奖项/荣誉内容（单行日期，非起止范围） */
const AWARD_DATE_PREFIX_RE = new RegExp(
  `^(${DATE_PART}|\\d{4}年)(?!\\s*[-–—~至到]+\\s*\\d{4})\\s+(.+)$`,
  'i'
);

const AWARD_KEYWORDS = /奖|学金|荣誉|优秀|标兵|干部|称号|证书|Certificate|Scholarship|Award|Honor|First Prize|一等奖|二等奖|三等奖|金奖|银奖|铜奖/i;
const CAMPUS_ORG_KEYWORDS = /学生会|社团|协会|俱乐部|班级|团支部|党支|科协|广播|志愿者|媒体中心|就协|青协|导生|班委|任职|部长|主席|干事|社长|队长|书记|委员|团支书|班长|学委|Campus|Student Union|Club/i;

const CATEGORY_HINTS: Record<MaterialCategory, RegExp[]> = {
  internship: [/实习/, /intern/i, /暑期/, /日常实习/, /公司/, /集团/],
  project: [/项目/, /系统/, /平台/, /开发/, /project/i, /产品/, /设计/],
  competition: [/竞赛/, /比赛/, /ACM/, /ICPC/, /黑客松/, /奖/, /建模/, /Challenge/i],
  research: [/科研/, /论文/, /研究/, /实验室/, /research/i, /发表/],
  campus: [
    /学生会/, /社团/, /协会/, /部长/, /主席/, /干事/, /社长/, /队长/, /书记/, /委员/,
    /校园/, /志愿者/, /班[长委]/, /团支/, /任职/, /学生工作/, /组织/,
  ],
};

export interface ParsedExperience {
  title: string;
  category: MaterialCategory;
  dateRange: string;
  description: string;
  highlights: string[];
}

export interface ResumeContact {
  name?: string;
  phone?: string;
  email?: string;
}

export interface ResumeExtractResult {
  keywords: string[];
  skills: string[];
  tags: string[];
  experiences: ParsedExperience[];
  summary: string;
  contact?: ResumeContact;
}

function unique(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

/** 规范化 PDF/Word 提取文本 */
export function normalizeResumeText(text: string): string {
  let normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/\t+/g, ' ')
    .replace(/[ \u00a0]{2,}/g, ' ')
    .replace(/--\s*\d+\s+of\s+\d+\s+--/gi, '')
    .replace(/●\s*/g, '\n● ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // PDF 常把「日期」与「公司/岗位」拆成两行，合并为一行便于识别（跳过下一行是章节标题的情况）
  normalized = normalized.replace(
    /^(\d{4}[./]\d{1,2}\s*[-–—~至]+\s*(?:\d{4}[./]?\d{0,2}|至今|现在|present))\s*\n+([^\n●][^\n]+)/gim,
    (match, line1, line2) => {
      if (SECTION_HEADER_LINE_RE.test(line2.trim())) return match;
      return `${line1} ${line2.trim()}`;
    }
  );

  // 日期范围被拆行：2024.03-\n至今 项目名
  normalized = normalized.replace(
    /(\d{4}[./]\d{1,2})\s*[-–—~]+\s*\n\s*(至今|现在)(\s+[^\n]+)?/gi,
    (_, start, end, rest) => `${start} - ${end}${rest || ''}`
  );

  // 日期行后紧跟的短标题行合并（跳过章节标题）
  normalized = normalized.replace(
    /^(\d{4}[./]\d{1,2}\s*[-–—~]+\s*(?:\d{4}[./]?\d{0,2}|至今|现在)\s+[^\n]+)\n+([^\n●\d][^\n]{1,80})$/gim,
    (match, line1, line2) => {
      if (SECTION_HEADER_LINE_RE.test(line2.trim())) return match;
      return `${line1} ${line2.trim()}`;
    }
  );

  // 中文序号标题合并：一、教育背景 → 教育背景
  normalized = normalized.replace(
    /^[\s]*[一二三四五六七八九十\d]+[、.．)\）]\s*(教育背景|实习经历|工作经历|项目经历|校园经历|学生工作|学校任职|荣获奖项|荣誉奖项|竞赛经历|科研经历|技能特长|专业技能|个人简介)/gm,
    '$1'
  );

  // Markdown / 方括号标题
  normalized = normalized.replace(
    /^#{1,4}\s*(教育背景|实习经历|工作经历|项目经历|校园经历|学生工作|学校任职|荣获奖项|荣誉奖项|竞赛经历|科研经历|技能特长|专业技能)/gm,
    '$1'
  );
  normalized = normalized.replace(
    /^[【\[]?(教育背景|实习经历|工作经历|项目经历|校园经历|学生工作|学校任职|荣获奖项|荣誉奖项)[】\]]?\s*[:：]?\s*$/gm,
    '$1'
  );

  return normalized;
}

function sectionHeaderRegex(label: string): RegExp {
  const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(
    `^[\\s#●\\-*]*(?:\\[|【)?\\s*${esc}\\s*(?:\\]|】)?\\s*[:：]?\\s*$`,
    'im'
  );
}

export function extractSkills(text: string): string[] {
  const found: string[] = [];
  for (const pattern of SKILL_PATTERNS) {
    const re = new RegExp(pattern, 'gi');
    const matches = text.match(re);
    if (matches) found.push(...matches.map((m) => m.trim()));
  }
  return unique(found);
}

export function extractKeywords(text: string): string[] {
  const skills = extractSkills(text);
  const cnWords = text.match(/[\u4e00-\u9fa5]{2,8}/g) || [];
  const stop = new Set([
    '负责', '参与', '完成', '实现', '优化', '提升', '开发', '设计', '工作', '项目',
    '经历', '教育', '背景', '技能', '特长', '个人', '简介', '公司', '有限公司',
  ]);
  const freq = new Map<string, number>();
  for (const w of cnWords) {
    if (stop.has(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  const topCn = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
  return unique([...skills, ...topCn]).slice(0, 15);
}

function extractContact(text: string): ResumeContact {
  const head = text.split('\n').slice(0, 6).join('\n');
  const firstLine = text.split('\n')[0]?.trim() || '';
  const name = /^[\u4e00-\u9fa5]{2,5}$/.test(firstLine) ? firstLine : undefined;
  const phoneRaw = head.match(/(?:\+?86[-\s]?)?1[3-9]\d[-\s]?\d{4}[-\s]?\d{4}/)?.[0];
  const phone = phoneRaw ? phoneRaw.replace(/\D/g, '').slice(-11) : undefined;
  const email = head.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0];
  return { name, phone, email };
}

function splitSections(text: string): Record<string, string> {
  type Marker = { key: string; index: number; len: number };
  const markers: Marker[] = [];

  for (const def of SECTION_DEFS) {
    for (const label of def.labels) {
      const re = sectionHeaderRegex(label);
      let match: RegExpExecArray | null;
      const flags = re.flags.includes('g') ? re : new RegExp(re.source, re.flags + 'g');
      while ((match = flags.exec(text)) !== null) {
        markers.push({ key: def.key, index: match.index, len: match[0].length });
      }
    }
  }

  markers.sort((a, b) => a.index - b.index);

  const deduped: Marker[] = [];
  for (const m of markers) {
    const overlap = deduped.find((d) => Math.abs(d.index - m.index) <= 1);
    if (!overlap) deduped.push(m);
  }

  const sections: Record<string, string> = {};
  for (let i = 0; i < deduped.length; i++) {
    const start = deduped[i].index + deduped[i].len;
    const end = i + 1 < deduped.length ? deduped[i + 1].index : text.length;
    const body = text.slice(start, end).trim();
    const key = deduped[i].key;
    sections[key] = sections[key] ? `${sections[key]}\n${body}` : body;
  }

  return sections;
}

function stripNestedSectionHeaders(body: string): string {
  const nested = body.search(
    /\n(?:教育背景|实习经历|工作经历|项目经历|校园经历|学生工作|学校任职|荣获奖项|荣誉奖项|竞赛经历|科研经历|技能特长|专业技能|个人简介)\s*$/im
  );
  if (nested > 0) return body.slice(0, nested).trim();
  return body.trim();
}

function getSectionBody(sections: Record<string, string>, key: string): string {
  const raw = sections[key];
  return raw ? stripNestedSectionHeaders(raw) : '';
}

function splitOrgRole(rest: string): { org: string; role: string } {
  const cleaned = rest.replace(/[（(].*?[）)]/g, '').trim();

  // 校园组织：XX大学学生会 · 宣传部部长
  const campusMatch = cleaned.match(
    /^(.+?(?:学生会|社团|协会|俱乐部|班级|团支部|党支|科协|媒体中心|青协|就协|志愿者|Student Union|Club))[\s·|｜\-—]+(.+)$/
  );
  if (campusMatch) {
    return { org: campusMatch[1].trim(), role: campusMatch[2].trim() };
  }

  const m = cleaned.match(
    /^(.+?(?:公司|银行|集团|研究所|大学|学院|有限公司|股份|科技|信息|服务|互联网|Inc\.?|Ltd\.?|Corp\.?))[\s·|｜\-—]+(.+)$/
  );
  if (m) return { org: m[1].trim(), role: m[2].trim() };

  // 角色在后：XX公司 产品经理
  const m2 = cleaned.match(
    /^(.+?(?:公司|银行|集团|研究所|大学|学院|有限公司|科技|信息))\s+(.+)$/
  );
  if (m2) return { org: m2[1].trim(), role: m2[2].trim() };

  const parts = cleaned.split(/\s{2,}|[|｜·•]\s*/).filter(Boolean);
  if (parts.length >= 2) {
    return { org: parts[0], role: parts.slice(1).join(' ') };
  }
  return { org: cleaned, role: '' };
}

function normalizeDateRange(start: string, end: string): string {
  const s = start.replace(/[年月]/g, '.').replace(/\.+/g, '.').replace(/\.$/, '');
  const e = /至今|现在|present|今/i.test(end) ? '至今' : end.replace(/[年月]/g, '.').replace(/\.+/g, '.').replace(/\.$/, '');
  return `${s} - ${e}`;
}

function tryParseEntryLine(line: string): {
  dateRange: string;
  title: string;
  rest: string;
} | null {
  let m = line.match(ENTRY_HEADER_RE);
  if (m) {
    const dateRange = normalizeDateRange(m[1], m[2]);
    const rest = (m[3] || '').trim();
    const { org, role } = splitOrgRole(rest);
    return { dateRange, title: buildTitle(org, role, rest), rest: rest || line };
  }

  m = line.match(ENTRY_DATE_SUFFIX_RE);
  if (m) {
    const dateRange = normalizeDateRange(m[2], m[3]);
    const rest = m[1].trim();
    const { org, role } = splitOrgRole(rest);
    return { dateRange, title: buildTitle(org, role, rest), rest };
  }

  return null;
}

function buildTitle(org: string, role: string, fallback: string): string {
  if (org && role) return `${org} · ${role}`.slice(0, 80);
  return (org || role || fallback).slice(0, 80);
}

function extractHighlights(block: string): string[] {
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
  const bullets = lines
    .filter(
      (l) =>
        /^[-•·●]/.test(l) ||
        /^\d+[.)）]\s/.test(l) ||
        /^(业务|数据|项目|工作|个人|Agent|前端|后端|荣誉|负责|参与|组织|策划|主导)/.test(l)
    )
    .map((l) => l.replace(/^[-•·●]\s*/, '').replace(/^\d+[.)）]\s*/, '').trim())
    .filter((l) => l.length > 6);
  if (bullets.length > 0) return bullets.slice(0, 6);
  const sentences = block.split(/[。；;]/).map((s) => s.trim()).filter((s) => s.length > 10);
  return sentences.slice(0, 3);
}

function guessAwardCategory(text: string): MaterialCategory {
  if (/竞赛|比赛|ACM|ICPC|建模|黑客松|Challenge|Contest/i.test(text)) return 'competition';
  if (/学生会|社团|协会|部长|主席|干事|社长|任职|志愿者|Campus/i.test(text)) return 'campus';
  if (/奖学金|优秀|标兵|干部|荣誉|三好|毕业生/i.test(text)) return 'campus';
  return 'competition';
}

function extractAwardTitle(text: string): string {
  const cleaned = text.replace(/^获得|^荣获|^授予|^被评为/, '').trim();
  // 国家一等奖 / 全国XX竞赛 金奖
  const prizeMatch = cleaned.match(
    /(.+?(?:一等奖|二等奖|三等奖|金奖|银奖|铜奖|优秀奖|特等奖|First Prize|Award|Scholarship|奖学金|称号|荣誉))/
  );
  if (prizeMatch) return prizeMatch[1].slice(0, 80);
  const parts = cleaned.split(/[,，;；|｜]/).filter(Boolean);
  if (parts.length >= 2) return parts.slice(0, 2).join(' · ').slice(0, 80);
  return cleaned.slice(0, 80) || '荣誉奖项';
}

function parseSectionEntries(
  sectionText: string,
  category: MaterialCategory
): ParsedExperience[] {
  const lines = sectionText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const entries: ParsedExperience[] = [];
  let current: {
    dateRange: string;
    title: string;
    lines: string[];
  } | null = null;

  const flush = () => {
    if (!current) return;
    const description = current.lines.join('\n').trim();
    entries.push({
      title: current.title,
      category,
      dateRange: current.dateRange,
      description: description.slice(0, 1200),
      highlights: extractHighlights(description),
    });
    current = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 仅日期行，标题在下一行
    const dateOnly = line.match(DATE_ONLY_LINE_RE);
    if (dateOnly && i + 1 < lines.length && !/^[-•·●]/.test(lines[i + 1])) {
      flush();
      const dateRange = normalizeDateRange(dateOnly[1], dateOnly[2]);
      const nextLine = lines[++i];
      const parsed = tryParseEntryLine(`${dateRange.replace(/\s+/g, '')} ${nextLine}`) ?? {
        dateRange,
        title: nextLine.slice(0, 80),
        rest: nextLine,
      };
      current = {
        dateRange: parsed.dateRange || dateRange,
        title: parsed.title,
        lines: [nextLine],
      };
      continue;
    }

    const parsed = tryParseEntryLine(line);
    if (parsed) {
      flush();
      current = {
        dateRange: parsed.dateRange,
        title: parsed.title,
        lines: [parsed.rest || line],
      };
    } else if (category === 'competition') {
      const awardM = line.match(AWARD_DATE_PREFIX_RE);
      if (awardM) {
        flush();
        const dateRange = awardM[1].replace(/年/g, '.').replace(/月/g, '.');
        const rest = awardM[2].trim();
        current = {
          dateRange,
          title: extractAwardTitle(rest),
          lines: [rest],
        };
      } else if (current) {
        current.lines.push(line);
      } else if (AWARD_KEYWORDS.test(line)) {
        flush();
        current = {
          dateRange: extractDateRange(line),
          title: extractAwardTitle(line),
          lines: [line],
        };
      }
    } else if (current) {
      current.lines.push(line);
    } else if (
      line.length >= 4 &&
      !/^(职责|工作内容|项目描述|主要工作)/.test(line) &&
      (CAMPUS_ORG_KEYWORDS.test(line) || category === 'campus' || category === 'internship')
    ) {
      // 无日期标题行作为新条目（常见于校园任职）
      flush();
      const { org, role } = splitOrgRole(line);
      current = {
        dateRange: '',
        title: buildTitle(org, role, line),
        lines: [],
      };
    }
  }
  flush();

  if (entries.length === 0) {
    return parseListEntries(sectionText, category);
  }

  return entries;
}

/** 解析无日期头的列表型条目（奖项、部分校园经历） */
function parseListEntries(sectionText: string, category: MaterialCategory): ParsedExperience[] {
  const chunks = sectionText
    .split(/\n(?=[-•·●]|\d+[.)）]\s)/)
    .map((c) => c.trim())
    .filter((c) => c.length > 4);

  const lines =
    chunks.length > 1
      ? chunks
      : sectionText.split('\n').map((l) => l.trim()).filter((l) => l.length > 4);

  const entries: ParsedExperience[] = [];

  for (const raw of lines) {
    const line = raw.replace(/^[-•·●]\s*/, '').replace(/^\d+[.)）]\s*/, '').trim();
    if (line.length < 4) continue;
    if (/^(荣获奖项|荣誉奖项|校园经历|学生工作)/.test(line) && line.length < 15) continue;

    const parsed = tryParseEntryLine(line);
    if (parsed) {
      entries.push({
        title: parsed.title,
        category,
        dateRange: parsed.dateRange,
        description: parsed.rest.slice(0, 800),
        highlights: extractHighlights(parsed.rest),
      });
      continue;
    }

    const awardM = line.match(AWARD_DATE_PREFIX_RE);
    if (awardM && !ENTRY_HEADER_RE.test(line)) {
      const dateRange = awardM[1].replace(/年/g, '.').replace(/月/g, '.');
      const rest = awardM[2].trim();
      entries.push({
        title: extractAwardTitle(rest),
        category: guessAwardCategory(rest),
        dateRange,
        description: rest.slice(0, 600),
        highlights: extractHighlights(rest),
      });
      continue;
    }

    if (AWARD_KEYWORDS.test(line) || category === 'competition') {
      entries.push({
        title: extractAwardTitle(line),
        category: guessAwardCategory(line),
        dateRange: extractDateRange(line),
        description: line.slice(0, 600),
        highlights: [line],
      });
      continue;
    }

    if (CAMPUS_ORG_KEYWORDS.test(line) || category === 'campus') {
      const { org, role } = splitOrgRole(line);
      entries.push({
        title: buildTitle(org, role, line),
        category: 'campus',
        dateRange: extractDateRange(line),
        description: line.slice(0, 800),
        highlights: extractHighlights(line),
      });
      continue;
    }

    // 跳过纯技能行
    if (/^(Python|Java|JavaScript|SQL|技能)/i.test(line) && line.length < 80) continue;
  }

  return entries;
}

function parseAwardsSection(sectionText: string): ParsedExperience[] {
  const entries = parseSectionEntries(sectionText, 'competition');

  if (entries.length === 0 && sectionText.trim().length > 10) {
    const fallback = sectionText
      .split(/[,，;；\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 4 && AWARD_KEYWORDS.test(s));
    for (const s of fallback) {
      entries.push({
        title: extractAwardTitle(s),
        category: guessAwardCategory(s),
        dateRange: extractDateRange(s),
        description: s,
        highlights: [s],
      });
    }
  }

  return entries.filter(
    (e) =>
      e.title.length > 2 &&
      !/^\d+$/.test(e.title) &&
      !/^\d{1,2}\s/.test(e.title) &&
      AWARD_KEYWORDS.test(e.title + e.description)
  );
}

function parseCampusSection(sectionText: string): ParsedExperience[] {
  const entries = parseSectionEntries(sectionText, 'campus');
  return entries.filter(
    (e) =>
      !/专业技能|Python、|技能特长/.test(e.title) &&
      (CAMPUS_ORG_KEYWORDS.test(e.title + e.description) || /大学|学院|本科|硕士|博士|Education/i.test(e.title))
  );
}

function parseEducationSection(sectionText: string): ParsedExperience[] {
  const lines = sectionText.split('\n').map((l) => l.trim()).filter(Boolean);
  const eduLine =
    lines.find((l) => new RegExp(`${DATE_PART}\\s*[-–—~]`).test(l)) || lines[0] || '';

  const m = eduLine.match(
    new RegExp(`^(${DATE_PART})\\s*[-–—~至到]+\\s*(${DATE_END})\\s*(.+)$`, 'i')
  );

  let title = '教育经历';
  let dateRange = '';
  if (m) {
    dateRange = normalizeDateRange(m[1], m[2]);
    let rest = m[3].trim().replace(new RegExp(`\\s+(?:${SECTION_HEADER_NAMES})\\s*$`, 'i'), '');
    const parts = rest.split(/\s{2,}|[|｜·•]\s*/).filter(Boolean);
    if (parts.length >= 2) {
      title = `${parts[0]} · ${parts.slice(1).join(' ')}`.slice(0, 80);
    } else {
      title = rest.slice(0, 80);
    }
  }

  const description = lines.join('\n').trim();
  return [
    {
      title,
      category: 'campus',
      dateRange,
      description: description.slice(0, 600),
      highlights: extractHighlights(description),
    },
  ];
}

function guessCategory(block: string): MaterialCategory {
  if (AWARD_KEYWORDS.test(block) && !/项目|开发|系统/.test(block)) {
    return guessAwardCategory(block);
  }
  if (CAMPUS_ORG_KEYWORDS.test(block)) return 'campus';
  for (const [cat, patterns] of Object.entries(CATEGORY_HINTS) as [MaterialCategory, RegExp[]][]) {
    if (patterns.some((p) => p.test(block))) return cat;
  }
  return 'project';
}

function extractDateRange(block: string): string {
  const range = block.match(
    new RegExp(`(${DATE_PART})\\s*[-–—~至到]+\\s*(${DATE_END})`, 'i')
  );
  if (range) return normalizeDateRange(range[1], range[2]);
  const yearOnly = block.match(/(\d{4})\s*年/);
  if (yearOnly) return yearOnly[1];
  return '';
}

function extractTitle(block: string): string {
  const firstLine = block.split('\n').map((l) => l.trim()).find((l) => l.length > 2) || '';
  return firstLine.replace(/^[-•·●\d+.)]\s*/, '').replace(/\d{4}.*$/, '').trim().slice(0, 60) || '未命名经历';
}

function splitExperiencesLegacy(text: string): string[] {
  const sectionSplit = text.split(
    /(?=(?:实习|项目|工作|竞赛|科研|校园|在校|学生工作|学校任职|社团|荣获奖项|荣誉奖项|获奖|education|experience|project|internship|awards|honors|leadership)[^\n]{0,24}\n)/i
  );
  if (sectionSplit.length > 1) {
    return sectionSplit.map((s) => s.trim()).filter((s) => s.length > 20);
  }
  const blocks = text.split(/\n{2,}/).filter((b) => b.trim().length > 30);
  return blocks.length > 0 ? blocks : [text];
}

function parseStructuredResume(normalized: string): ParsedExperience[] {
  const sections = splitSections(normalized);
  const experiences: ParsedExperience[] = [];

  const edu = getSectionBody(sections, 'education');
  if (edu) experiences.push(...parseEducationSection(edu));

  const intern = getSectionBody(sections, 'internship');
  if (intern) experiences.push(...parseSectionEntries(intern, 'internship'));

  const work = getSectionBody(sections, 'work');
  if (work) experiences.push(...parseSectionEntries(work, 'internship'));

  const project = getSectionBody(sections, 'project');
  if (project) experiences.push(...parseSectionEntries(project, 'project'));

  const campus = getSectionBody(sections, 'campus');
  if (campus) experiences.push(...parseCampusSection(campus));

  const awards = getSectionBody(sections, 'awards');
  if (awards) experiences.push(...parseAwardsSection(awards));

  const competition = getSectionBody(sections, 'competition');
  if (competition) experiences.push(...parseSectionEntries(competition, 'competition'));

  const research = getSectionBody(sections, 'research');
  if (research) experiences.push(...parseSectionEntries(research, 'research'));

  return experiences;
}

function scanOrphanSections(normalized: string, existing: ParsedExperience[]): ParsedExperience[] {
  const found = [...existing];
  const hasAwards = existing.some((e) => AWARD_KEYWORDS.test(e.title + e.description));
  const hasCampus = existing.some(
    (e) =>
      e.category === 'campus' &&
      CAMPUS_ORG_KEYWORDS.test(e.title) &&
      !/^\d{1,2}\s/.test(e.title)
  );

  if (!hasAwards) {
    const awardBlock = normalized.match(
      /(?:荣获奖项|荣誉奖项|获奖情况|所获荣誉|Awards|Honors)[\s\S]{0,800}?(?=(?:实习|项目|工作|校园|技能|教育|$))/i
    );
    if (awardBlock) {
      const body = awardBlock[0].replace(/^(?:荣获奖项|荣誉奖项|获奖情况|所获荣誉|Awards|Honors)\s*/i, '');
      found.push(...parseAwardsSection(body));
    }
  }

  if (!hasCampus) {
    const campusBlock = normalized.match(
      /(?:校园经历|学生工作|学校任职|社团活动|Campus Activities)[\s\S]{0,1200}?(?=(?:实习|项目|工作|荣誉|技能|教育|$))/i
    );
    if (campusBlock) {
      const body = campusBlock[0].replace(/^(?:校园经历|学生工作|学校任职|社团活动|Campus Activities)\s*/i, '');
      found.push(...parseCampusSection(body));
    }
  }

  return found;
}

function parseResumeContentLegacy(normalized: string): ParsedExperience[] {
  const blocks = splitExperiencesLegacy(normalized);
  const entries: ParsedExperience[] = [];

  for (const block of blocks.slice(0, 12)) {
    const header = block.split('\n')[0] || '';
    if (/荣获奖项|荣誉奖项|获奖|Awards|Honors/i.test(header)) {
      entries.push(...parseAwardsSection(block.replace(/^[^\n]+\n/, '')));
      continue;
    }
    if (/校园|学生工作|学校任职|社团|Campus|Leadership/i.test(header)) {
      entries.push(...parseCampusSection(block.replace(/^[^\n]+\n/, '')));
      continue;
    }
    if (/教育背景|Education/i.test(header)) {
      entries.push(...parseEducationSection(block.replace(/^[^\n]+\n/, '')));
      continue;
    }

    const cat = guessCategory(block);
    const sectionEntries = parseSectionEntries(block, cat);
    if (sectionEntries.length > 0) {
      entries.push(...sectionEntries);
    } else {
      entries.push({
        title: extractTitle(block),
        category: cat,
        dateRange: extractDateRange(block),
        description: block.replace(/\n+/g, '\n').trim().slice(0, 800),
        highlights: extractHighlights(block),
      });
    }
  }

  return entries;
}

function buildSummary(contact: ResumeContact, experiences: ParsedExperience[], text: string): string {
  if (contact.name) {
    const roles = experiences
      .filter((e) => e.category !== 'campus')
      .slice(0, 2)
      .map((e) => e.title)
      .join('；');
    if (roles) return `${contact.name} — ${roles}`;
    return contact.name;
  }
  return text.slice(0, 200);
}

export function parseResumeContent(text: string): ResumeExtractResult {
  const normalized = normalizeResumeText(text);
  if (!normalized) {
    return { keywords: [], skills: [], tags: [], experiences: [], summary: '' };
  }

  const contact = extractContact(normalized);
  const sections = splitSections(normalized);
  const skillsText = [sections.skills, sections.skillsAlt, normalized].filter(Boolean).join('\n');

  let experiences = parseStructuredResume(normalized);
  experiences = scanOrphanSections(normalized, experiences);

  if (experiences.length === 0) {
    experiences = parseResumeContentLegacy(normalized);
  }

  // 去重（标题+日期）
  const seen = new Set<string>();
  experiences = experiences.filter((e) => {
    const key = `${e.title}|${e.dateRange}|${e.category}`;
    if (seen.has(key)) return false;
    seen.add(key);
    if (e.title.length <= 2) return false;
    if (/^\d+$/.test(e.title.trim())) return false;
    if (/^\d{1,2}\s/.test(e.title.trim())) return false;
    if (/专业技能|技能特长|Python、SQL/.test(e.title)) return false;
    if (new RegExp(`^(?:${SECTION_HEADER_NAMES})`, 'i').test(e.title)) return false;
    if (e.category === 'competition' && !AWARD_KEYWORDS.test(e.title + e.description)) return false;
    if (
      e.category === 'campus' &&
      !CAMPUS_ORG_KEYWORDS.test(e.title + e.description) &&
      !/大学|学院|本科|硕士|博士/.test(e.title)
    ) {
      return false;
    }
    return e.description.length > 3 || e.highlights.length > 0;
  });

  const skills = extractSkills(skillsText);
  const keywords = extractKeywords(normalized);

  return {
    keywords,
    skills,
    tags: keywords.slice(0, 8),
    experiences: experiences.slice(0, 20),
    summary: buildSummary(contact, experiences, normalized),
    contact,
  };
}

export async function readResumeFile(file: File): Promise<string> {
  const result = await parseResumeFile(file);
  return result.text;
}

/** 上传简历并提取结构化信息（支持 PDF / Word / 文本） */
export async function parseResumeFile(
  file: File
): Promise<ResumeExtractResult & { text: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (['txt', 'md', 'csv'].includes(ext)) {
    const text = normalizeResumeText(await file.text());
    if (!text || text.replace(/\s/g, '').length < 20) {
      throw new Error('简历内容过短，请上传包含更多信息的文件');
    }
    return { text, ...parseResumeContent(text) };
  }

  if (['pdf', 'doc', 'docx'].includes(ext)) {
    const formData = new FormData();
    formData.append('file', file);
    const json = await apiFetchFormData<ResumeExtractResult & { text: string }>(
      '/api/ai/parse-resume-file',
      formData
    );
    if (!json.success) {
      throw new Error(json.error || '简历解析失败');
    }
    return json.data as ResumeExtractResult & { text: string };
  }

  throw new Error('不支持的格式，请上传 PDF、Word（.doc/.docx）或 .txt / .md 文件');
}
