import type { Material } from '@/types/material';
import { computeMaterialMatch, extractKeywordsFromText } from './match-engine';

const SKILL_CATEGORIES: Record<string, string[]> = {
  '前端': ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Webpack', 'Vite'],
  '后端': ['Node.js', 'Java', 'Python', 'Go', 'Django', 'Spring', 'Rust', '微服务', 'REST API', 'GraphQL'],
  '数据': ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', '数据分析', '数据挖掘', 'Tableau', 'Power BI', 'SPSS'],
  'AI/ML': ['Python', 'PyTorch', 'TensorFlow', '机器学习', '深度学习', 'NLP', '计算机视觉', '数据挖掘'],
  '产品': ['产品设计', '用户研究', 'PRD', '竞品分析', '需求管理', 'A/B测试', '用户体验', '用户增长', '增长黑客'],
  '运营': ['内容运营', '社群运营', '新媒体运营', 'SEO', 'SEM', '品牌营销', '用户增长', '数据分析'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'DevOps', 'Linux', 'Git', '监控'],
  '管理': ['项目管理', 'Scrum', '敏捷开发', '团队管理', '领导力', '沟通能力', '团队协作'],
};

export interface JDAnalysisResult {
  keywords: string[];
  skills: string[];
  atsKeywords: string[];
  portrait: {
    title: string;
    level: string;
    industry: string;
  };
  matchScore: number;
  gaps: string[];
  matchedMaterials: Material[];
}

function extractKeywords(text: string): string[] {
  return extractKeywordsFromText(text);
}

function detectRole(jd: string): { title: string; level: string; industry: string } {
  const roles: { pattern: RegExp; title: string }[] = [
    { pattern: /产品(经理|总监|负责人|助理|实习生)/, title: '产品经理' },
    { pattern: /(前端|web\s*前端|h5).*(工程师|开发)/, title: '前端工程师' },
    { pattern: /(后端|服务端|java|go).*(工程师|开发)/, title: '后端工程师' },
    { pattern: /(全栈|full.?stack).*(工程师|开发)/, title: '全栈工程师' },
    { pattern: /(算法|AI|人工智能|机器学习).*(工程师)/, title: '算法工程师' },
    { pattern: /(数据\s*分析师|数据分析|BA)/, title: '数据分析师' },
    { pattern: /(运营|新媒体|社群).*(经理|专员|实习生)/, title: '运营经理' },
    { pattern: /(设计|UI|UX).*(师|经理)/, title: 'UI/UX设计师' },
  ];

  for (const role of roles) {
    if (role.pattern.test(jd)) {
      return { title: role.title, level: detectLevel(jd), industry: detectIndustry(jd) };
    }
  }
  return { title: '通用岗位', level: detectLevel(jd), industry: detectIndustry(jd) };
}

function detectLevel(jd: string): string {
  if (/高级|资深|senior|staff|专家|架构师|leader|负责人|总监/i.test(jd)) return '高级';
  if (/中级|3-5|3-5年|三年/i.test(jd)) return '中级';
  if (/初级|应届|实习|实习|助理|0-1年|entry/i.test(jd)) return '初级';
  return '中高级';
}

function detectIndustry(jd: string): string {
  if (/AI|人工智能|大模型|LLM|深度学习|智能/i.test(jd)) return 'AI/人工智能';
  if (/游戏|电竞/i.test(jd)) return '游戏';
  if (/金融|银行|证券|保险|风控/i.test(jd)) return '金融科技';
  if (/电商|零售/i.test(jd)) return '电商/零售';
  if (/教育|在线教育/i.test(jd)) return '在线教育';
  if (/医疗|健康/i.test(jd)) return '医疗健康';
  if (/汽车|自动驾驶|车联网/i.test(jd)) return '汽车/出行';
  return '互联网/科技';
}

function calculateMatch(materials: Material[], requiredSkills: string[]): {
  score: number;
  gaps: string[];
  matched: Material[];
} {
  const result = computeMaterialMatch(materials, requiredSkills);
  return {
    score: result.matchScore,
    gaps: result.missingKeywords,
    matched: result.matchedMaterials,
  };
}

export function analyzeJD(jd: string, materials: Material[]): JDAnalysisResult {
  const keywords = extractKeywords(jd);
  const skills = keywords.filter(k => 
    !['沟通能力', '团队协作', '领导力', '问题解决', '批判性思维', '时间管理', '演讲能力'].includes(k)
  );
  const softSkills = keywords.filter(k =>
    ['沟通能力', '团队协作', '领导力', '问题解决', '批判性思维', '时间管理', '演讲能力'].includes(k)
  );
  const atsKeywords = [...skills.slice(0, 5), ...softSkills.slice(0, 2)].slice(0, 7);
  const portrait = detectRole(jd);
  const match = calculateMatch(materials, skills);

  return {
    keywords: [...new Set(keywords)],
    skills: [...new Set(skills)],
    atsKeywords: [...new Set(atsKeywords)],
    portrait,
    matchScore: match.score,
    gaps: match.gaps,
    matchedMaterials: match.matched,
  };
}

export function generateResume(
  materials: Material[],
  jobTitle: string,
  jdKeywords: string[]
): string {
  // Filter materials relevant to the job
  const relevantMaterials = materials.filter(m => {
    const matSkills = m.skills.map(s => s.toLowerCase());
    return jdKeywords.some(k => matSkills.includes(k.toLowerCase()));
  });

  const materialCount = relevantMaterials.length > 0 ? relevantMaterials.length : materials.length;
  const useMaterials = relevantMaterials.length > 0 ? relevantMaterials.slice(0, 5) : materials.slice(0, 5);

  let resume = `# ${jobTitle} - 个人简历\n\n`;

  // Skills section
  const allSkills = new Set<string>();
  useMaterials.forEach(m => m.skills.forEach(s => allSkills.add(s)));
  const skillList = [...allSkills].filter(s =>
    jdKeywords.some(k => k.toLowerCase() === s.toLowerCase())
  );
  const otherSkills = [...allSkills].filter(s =>
    !jdKeywords.some(k => k.toLowerCase() === s.toLowerCase())
  );

  resume += `## 专业技能\n\n`;
  resume += `**核心技能：** ${skillList.join('、')}\n\n`;
  if (otherSkills.length > 0) {
    resume += `**其他技能：** ${otherSkills.join('、')}\n\n`;
  }

  // Experience section
  resume += `## 相关经历\n\n`;
  useMaterials.forEach((m, i) => {
    resume += `### ${i + 1}. ${m.title}\n\n`;
    resume += `**背景：** ${m.star.situation}\n\n`;
    resume += `**目标：** ${m.star.task}\n\n`;
    resume += `**行动：** ${m.star.action}\n\n`;
    resume += `**成果：** ${m.star.result}\n\n`;
    if (m.highlights.length > 0) {
      resume += `**亮点：**\n${m.highlights.map(h => `- ${h}`).join('\n')}\n\n`;
    }
  });

  // Summary
  resume += `## 自我评价\n\n`;
  resume += `具备${jobTitle}所需的核心能力，有 ${materialCount} 段相关经历。`;
  resume += `技能覆盖 ${skillList.length} 项 JD 关键要求，`;
  resume += `实践经历丰富，能够快速胜任岗位需求。`;

  return resume;
}

export function generateInterviewQuestions(
  materials: Material[],
  jobTitle: string
): { question: string; category: string; reference?: string }[] {
  const questions: { question: string; category: string; reference?: string }[] = [];

  // Self-intro
  questions.push({
    question: `请做一个简短的自我介绍，重点突出与${jobTitle}相关的经历`,
    category: '自我介绍',
  });

  // STAR-based questions from materials
  materials.slice(0, 4).forEach(m => {
    questions.push({
      question: `在"${m.title}"中，你提到${m.star.situation.slice(0, 30)}...，请详细说说你是如何应对的？`,
      category: '项目深挖',
      reference: m.title,
    });
    questions.push({
      question: `在"${m.title}"中，最大的挑战是什么？如果重新来过，你会怎么做？`,
      category: '项目深挖',
      reference: m.title,
    });
  });

  // Behavioral questions
  questions.push({
    question: '请描述一次你在团队中遇到分歧，你是如何解决的？',
    category: '行为面试',
  });
  questions.push({
    question: '你如何看待压力？请举例说明你是如何应对高压环境的？',
    category: '行为面试',
  });
  questions.push({
    question: `你对${jobTitle}这个岗位的理解是什么？为什么觉得自己适合？`,
    category: '岗位理解',
  });
  questions.push({
    question: '你未来 3-5 年的职业规划是什么？',
    category: '职业规划',
  });

  return questions;
}

export function evaluateAnswer(
  question: string,
  answer: string,
  _materials: Material[]
): { score: number; feedback: string; improvement: string } {
  const wordCount = answer.length;
  const hasSpecifics = /\d+|%|[A-Z][a-z]+/.test(answer);
  const hasStructure = /首先|其次|最后|第一|第二|第三|因为|所以|因此|result|结果/.test(answer);
  const hasStar = /背景|situation|任务|task|行动|action|结果|result|我做了|我负责|我主导|我推动/.test(answer);
  const avoidsVagueness = !/大概|可能|好像|应该|也许|差不多/.test(answer);

  let score = 30; // base

  if (wordCount > 200) score += 15;
  else if (wordCount > 100) score += 10;
  else if (wordCount > 50) score += 5;

  if (hasSpecifics) score += 15;
  if (hasStructure) score += 15;
  if (hasStar) score += 15;
  if (avoidsVagueness) score += 10;

  score = Math.min(score, 100);

  let feedback = '';
  let improvement = '';

  if (score >= 85) {
    feedback = '回答非常出色！结构清晰，有具体数据支撑，STAR 法则运用得当。';
    improvement = '继续保持！可以再增加一些量化成果和行业洞察。';
  } else if (score >= 70) {
    feedback = '回答不错，整体思路清晰，但还可以更有深度。';
    improvement = '建议：1) 增加具体的数字和成果；2) 使用STAR法则组织回答；3) 减少模糊表述。';
  } else if (score >= 50) {
    feedback = '回答基本合格，但缺少亮点和深度。';
    improvement = '建议：1) 补充具体数据和案例；2) 按STAR结构组织回答；3) 避免泛泛而谈。';
  } else {
    feedback = '回答需要大幅改进，内容过于简短或模糊。';
    improvement = '建议：1) 展开回答至少100字；2) 引用具体经历和成果；3) 使用"我负责/我主导/我推动"等主动句式。';
  }

  return { score, feedback, improvement };
}
