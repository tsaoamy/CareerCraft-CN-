// ==========================================
// Interview Engine — 面试引擎（AI 模拟评分）
// ==========================================

import type {
  InterviewAnswer,
  InterviewCategory,
  InterviewQuestion,
  InterviewResult,
  InterviewSession,
} from '@/types/interview';
import { runCodeTests, scoreCodeTests } from '@/lib/interview-code-runner';

/** 各题型最低有效字数（低于此视为未完成） */
const CATEGORY_MIN_LENGTH: Record<InterviewCategory, number> = {
  自我介绍: 60,
  项目追问: 80,
  行为面试: 100,
  技术面试: 50,
  情景问答: 80,
  案例分析: 100,
  职业规划: 60,
  压力面试: 50,
  团队协作: 80,
  通用问答: 50,
  'AI 应用': 80,
};

/** 各题型理想字数（达到可拿较高分） */
const CATEGORY_IDEAL_LENGTH: Record<InterviewCategory, number> = {
  自我介绍: 150,
  项目追问: 180,
  行为面试: 200,
  技术面试: 120,
  情景问答: 150,
  案例分析: 200,
  职业规划: 120,
  压力面试: 100,
  团队协作: 150,
  通用问答: 100,
  'AI 应用': 150,
};

interface AnswerAnalysis {
  wordCount: number;
  isEmpty: boolean;
  isTrivial: boolean;
  isGibberish: boolean;
  requiresEnglish: boolean;
  englishRatio: number;
  focusCoverage: number;
  referenceCoverage: number;
  hasNumbers: boolean;
  hasSTAR: boolean;
  hasStructure: boolean;
  hasExample: boolean;
  hasReflection: boolean;
  hasVague: boolean;
  missingFocus: string[];
  missingReferences: string[];
}

function requiresEnglish(question: InterviewQuestion): boolean {
  return (
    question.language === 'en' ||
    /请用英语|用英文|in english|answer in english/i.test(question.question)
  );
}

function calcEnglishRatio(content: string): number {
  const enChars = (content.match(/[a-zA-Z]/g) || []).length;
  const total = content.replace(/\s/g, '').length;
  return total === 0 ? 0 : enChars / total;
}

/** 从考察要点 / 参考要点提取可匹配关键词 */
function extractKeywords(text: string): string[] {
  return text
    .replace(/[（()）\[\]【】]/g, ' ')
    .split(/[、，,；;/\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);
}

function matchKeyword(content: string, keyword: string): boolean {
  const lower = content.toLowerCase();
  const kw = keyword.toLowerCase();
  if (lower.includes(kw)) return true;
  // 英文词根近似：取前 4 字符
  if (/^[a-z]/i.test(kw) && kw.length >= 4) {
    return lower.includes(kw.slice(0, 4));
  }
  return false;
}

function analyzeAnswer(question: InterviewQuestion, content: string): AnswerAnalysis {
  const trimmed = content.trim();
  const wordCount = trimmed.length;
  const requiresEn = requiresEnglish(question);

  const isEmpty = wordCount === 0;
  const isTrivial = wordCount > 0 && wordCount <= 8;
  const isGibberish =
    wordCount > 0 &&
    (/^(.)\1{2,}$/.test(trimmed) ||
      /^[a-zA-Z]$/.test(trimmed) ||
      /^[\d\s]+$/.test(trimmed) ||
      /^[嗯啊哦呃]+$/.test(trimmed));

  const focusKeywords = question.focusPoints.flatMap(extractKeywords);
  const matchedFocus = focusKeywords.filter((kw) => matchKeyword(trimmed, kw));
  const missingFocus = question.focusPoints.filter((fp) => {
    const kws = extractKeywords(fp);
    return kws.length > 0 && !kws.some((kw) => matchKeyword(trimmed, kw));
  });

  const refKeywords = question.referencePoints.flatMap(extractKeywords);
  const matchedRef = refKeywords.filter((kw) => matchKeyword(trimmed, kw));
  const missingReferences = question.referencePoints.filter((ref) => {
    const kws = extractKeywords(ref);
    return kws.length > 0 && !kws.some((kw) => matchKeyword(trimmed, kw));
  });

  const focusCoverage =
    focusKeywords.length === 0 ? 0.5 : matchedFocus.length / focusKeywords.length;
  const referenceCoverage =
    refKeywords.length === 0 ? 0 : matchedRef.length / refKeywords.length;

  return {
    wordCount,
    isEmpty,
    isTrivial,
    isGibberish,
    requiresEnglish: requiresEn,
    englishRatio: calcEnglishRatio(trimmed),
    focusCoverage,
    referenceCoverage,
    missingFocus,
    missingReferences,
    hasNumbers: /\d+[%％]?|\d+\.\d+/.test(trimmed),
    hasSTAR: /当时|之前|面临|遇到|挑战|目标|任务|我的角色|我负责|我推动|我设计|我实现|结果|最终|提升|降低|增长|完成|situation|task|action|result/i.test(
      trimmed
    ),
    hasStructure: /第[一二三四五1-5]|首先|其次|再次|最后|综上|总结|另外|此外|因此|所以|first|second|finally|in conclusion/i.test(
      trimmed
    ),
    hasExample: /比如|例如|举例|具体|项目中|团队|客户|用户|上线|发布|交付|for example|such as|specifically/i.test(
      trimmed
    ),
    hasReflection: /反思|总结|学习|教训|改进|优化|复盘|经验|成长|learned|improved|retrospect/i.test(
      trimmed
    ),
    hasVague: /大概|可能|应该|好像|差不多|还行|一般般|maybe|probably|sort of/i.test(trimmed),
  };
}

/** 无效 / 敷衍回答 → 严格低分 */
function scoreInvalidAnswer(analysis: AnswerAnalysis): number {
  if (analysis.isEmpty) return 0;
  if (analysis.isGibberish) return 5;
  if (analysis.isTrivial) return 8;
  return 12;
}

/** 按题型与内容质量综合打分 */
function scoreValidAnswer(question: InterviewQuestion, analysis: AnswerAnalysis): number {
  const minLen = CATEGORY_MIN_LENGTH[question.category];
  const idealLen = CATEGORY_IDEAL_LENGTH[question.category];

  // 1. 篇幅 adequacy (0–30)
  let lengthScore = 0;
  if (analysis.wordCount >= idealLen) lengthScore = 30;
  else if (analysis.wordCount >= minLen) {
    lengthScore = 15 + Math.round(((analysis.wordCount - minLen) / (idealLen - minLen)) * 15);
  } else {
    lengthScore = Math.round((analysis.wordCount / minLen) * 14);
  }

  // 2. 考察要点覆盖 (0–25)
  const focusScore = Math.round(analysis.focusCoverage * 25);

  // 3. 参考要点覆盖 (0–15)
  const refScore = Math.round(analysis.referenceCoverage * 15);

  // 4. 质量信号 (0–20)
  let qualityScore = 0;
  if (analysis.hasExample) qualityScore += 5;
  if (analysis.hasNumbers) qualityScore += 5;
  if (analysis.hasStructure) qualityScore += 4;
  if (analysis.hasReflection) qualityScore += 3;
  if (analysis.hasVague) qualityScore -= 4;

  // 行为/情景/项目类额外看 STAR
  const needsSTAR = ['行为面试', '情景问答', '项目追问', '团队协作', '案例分析'].includes(
    question.category
  );
  if (needsSTAR) {
    if (analysis.hasSTAR) qualityScore += 5;
    else qualityScore -= 3;
  } else if (analysis.hasSTAR) {
    qualityScore += 2;
  }

  qualityScore = Math.max(0, Math.min(20, qualityScore));

  // 5. 语言匹配 (0–10)
  let langScore = 10;
  if (analysis.requiresEnglish) {
    if (analysis.englishRatio >= 0.7) langScore = 10;
    else if (analysis.englishRatio >= 0.4) langScore = 6;
    else if (analysis.englishRatio >= 0.15) langScore = 3;
    else langScore = 0;
  }

  const raw = lengthScore + focusScore + refScore + qualityScore + langScore;

  // 篇幅严重不足时封顶
  if (analysis.wordCount < minLen * 0.4) {
    return Math.min(raw, 35);
  }
  if (analysis.wordCount < minLen * 0.7) {
    return Math.min(raw, 50);
  }

  return Math.min(98, Math.max(18, raw));
}

/** 模拟 AI 评分 */
export function evaluateAnswer(
  question: InterviewQuestion,
  answer: string,
  selectedOptionIds?: string[]
): InterviewAnswer {
  const format = question.format ?? 'essay';

  if (format === 'single_choice' || format === 'multi_choice') {
    return evaluateChoiceAnswer(question, selectedOptionIds ?? [], format);
  }

  if (format === 'code' && question.codeConfig) {
    return evaluateCodeAnswer(question, answer);
  }

  const content = answer.trim();
  const analysis = analyzeAnswer(question, content);

  let score: number;
  if (analysis.isEmpty || analysis.isTrivial || analysis.isGibberish) {
    score = scoreInvalidAnswer(analysis);
  } else {
    score = scoreValidAnswer(question, analysis);
  }

  const { feedback, improvement } = generateFeedback(question, analysis, score);

  return {
    questionId: question.id,
    content,
    duration: 0,
    score,
    feedback,
    improvement,
    explanation: question.explanation,
  };
}

function evaluateChoiceAnswer(
  question: InterviewQuestion,
  selected: string[],
  format: 'single_choice' | 'multi_choice'
): InterviewAnswer {
  const correct = question.correctOptionIds ?? [];
  const selectedSet = new Set(selected);
  const correctSet = new Set(correct);

  let score = 0;
  let isCorrect = false;
  let feedback = '';
  let improvement = '';

  if (selected.length === 0) {
    feedback = '未选择任何选项，无法得分。';
    improvement = '请仔细阅读题干后选择最合适的答案。';
  } else if (format === 'single_choice') {
    isCorrect = selected.length === 1 && correct.includes(selected[0]);
    score = isCorrect ? 100 : 10;
    feedback = isCorrect
      ? '回答正确！'
      : `回答错误。正确选项为：${correct.map((id) => question.options?.find((o) => o.id === id)?.label).join('、')}`;
    improvement = isCorrect ? '概念掌握扎实，可继续深入相关实践。' : (question.explanation ?? '请复习相关知识点。');
  } else {
    const hits = correct.filter((id) => selectedSet.has(id)).length;
    const wrong = selected.filter((id) => !correctSet.has(id)).length;
    isCorrect = hits === correct.length && wrong === 0;
    if (isCorrect) score = 100;
    else if (wrong > 0) score = Math.max(10, Math.round((hits / correct.length) * 50));
    else score = Math.round((hits / correct.length) * 85);

    feedback = isCorrect
      ? '全部选对，回答正确！'
      : `选对 ${hits}/${correct.length} 项${wrong > 0 ? `，误选 ${wrong} 项` : ''}。`;
    improvement = question.explanation ?? '请参考讲解理解每个选项的正误原因。';
  }

  return {
    questionId: question.id,
    content: selected.join(','),
    selectedOptionIds: selected,
    duration: 0,
    score,
    feedback,
    improvement,
    explanation: question.explanation,
    isCorrect,
  };
}

function evaluateCodeAnswer(question: InterviewQuestion, code: string): InterviewAnswer {
  const content = code.trim();
  if (!content || content.length < 10) {
    return {
      questionId: question.id,
      content,
      duration: 0,
      score: 5,
      feedback: '代码过短或未提交，无法通过测试。',
      improvement: question.codeConfig?.hint ?? '请完成函数实现后点击「运行测试」。',
      explanation: question.explanation,
      isCorrect: false,
      codeTestResults: [],
    };
  }

  const results = runCodeTests(content, question.codeConfig!);
  const score = scoreCodeTests(results);
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  const allPassed = passed === total && total > 0;

  return {
    questionId: question.id,
    content,
    duration: 0,
    score,
    feedback: allPassed
      ? `全部 ${total} 个测试用例通过！`
      : `通过 ${passed}/${total} 个测试用例。`,
    improvement: allPassed
      ? '代码逻辑正确，可进一步优化复杂度或边界处理。'
      : (question.explanation ?? '请对照失败用例检查边界条件与算法逻辑。'),
    explanation: question.explanation,
    isCorrect: allPassed,
    codeTestResults: results,
  };
}

function generateFeedback(
  question: InterviewQuestion,
  analysis: AnswerAnalysis,
  score: number
): { feedback: string; improvement: string } {
  const points: string[] = [];
  const improvements: string[] = [];

  // ── 无效回答：直接点明问题 ──
  if (analysis.isEmpty) {
    return {
      feedback: `本题「${question.category}」尚未作答，无法评估你的 ${question.focusPoints.slice(0, 2).join('、')} 等能力。`,
      improvement: buildCategoryImprovements(question, analysis, true).join(' '),
    };
  }

  if (analysis.isGibberish || analysis.isTrivial) {
    return {
      feedback: `回答过短（${analysis.wordCount} 字），未达到「${question.category}」题目的基本作答要求，无法判断你是否具备相关能力。`,
      improvement: buildCategoryImprovements(question, analysis, true).join(' '),
    };
  }

  // ── 有效回答：按实际表现反馈 ──
  const minLen = CATEGORY_MIN_LENGTH[question.category];
  if (analysis.wordCount >= CATEGORY_IDEAL_LENGTH[question.category]) {
    points.push('回答篇幅充分，有足够空间展开论述。');
  } else if (analysis.wordCount >= minLen) {
    points.push('回答长度基本达标，但仍有深化空间。');
  } else {
    points.push(`回答偏短（${analysis.wordCount} 字，建议至少 ${minLen} 字），内容展开不足。`);
    improvements.push(
      `「${question.category}」类题目建议回答 ${Math.ceil(minLen / 2)}–${Math.ceil(CATEGORY_IDEAL_LENGTH[question.category] / 2)} 分钟（约 ${minLen}–${CATEGORY_IDEAL_LENGTH[question.category]} 字）。`
    );
  }

  if (analysis.focusCoverage >= 0.6) {
    points.push(`较好地回应了考察要点：${question.focusPoints.slice(0, 3).join('、')}。`);
  } else if (analysis.missingFocus.length > 0) {
    improvements.push(
      `本题重点考察「${analysis.missingFocus.slice(0, 3).join('」「')}」，你的回答中尚未体现这些方面。`
    );
  }

  if (analysis.requiresEnglish) {
    if (analysis.englishRatio >= 0.6) {
      points.push('英语表达占比合理，符合题目语言要求。');
    } else {
      improvements.push(
        '题目要求用英语回答，请使用完整英文句子，涵盖 background → strengths → role fit 等结构。'
      );
    }
  }

  if (['行为面试', '情景问答', '项目追问', '团队协作'].includes(question.category)) {
    if (analysis.hasSTAR) points.push('回答具备 STAR 结构（情境-任务-行动-结果），逻辑较清晰。');
    else
      improvements.push(
        '请用 STAR 法则组织：先交代 Situation/Task，再详述你的 Action，最后用数据说明 Result。'
      );
  }

  if (analysis.hasNumbers) points.push('包含量化数据，增强了说服力。');
  else if (['行为面试', '项目追问', '技术面试', '案例分析'].includes(question.category)) {
    improvements.push('补充 1–2 个具体数字（如提升百分比、用户量、耗时缩短等）来支撑观点。');
  }

  if (analysis.hasStructure) points.push('回答层次清晰，过渡自然。');
  else if (analysis.wordCount >= minLen) {
    improvements.push('使用「首先…其次…最后」或 First/Second/Finally 等结构词，让面试官更易跟随。');
  }

  if (analysis.hasVague) {
    improvements.push('减少「大概、可能、好像」等模糊表述，改用具体事实和案例。');
  }

  // 按题型补充专属建议
  const categoryTips = buildCategoryImprovements(question, analysis, false);
  for (const tip of categoryTips) {
    if (!improvements.some((i) => i.includes(tip.slice(0, 12)))) {
      improvements.push(tip);
    }
  }

  // 参考答案要点缺口
  if (analysis.missingReferences.length > 0 && score < 75) {
    const refHint = analysis.missingReferences
      .slice(0, 2)
      .map((r) => (r.length > 36 ? r.slice(0, 36) + '…' : r))
      .join('；');
    improvements.push(`可参考以下要点补全回答：${refHint}。`);
  }

  // 总结性反馈
  if (score >= 85) points.push('整体表现优秀，内容与题目高度契合。');
  else if (score >= 70) points.push('整体表现良好，主要结构已具备。');
  else if (score >= 50) points.push('完成了基本作答，但离合格线仍有差距。');
  else points.push('回答与题目要求差距较大，需要重新组织内容。');

  return {
    feedback: points.slice(0, 4).join(' '),
    improvement:
      improvements.slice(0, 4).join(' ') ||
      '当前回答质量较好，可在表达流畅度和细节深度上继续打磨。',
  };
}

/** 按题型生成针对性改进建议 */
function buildCategoryImprovements(
  question: InterviewQuestion,
  analysis: AnswerAnalysis,
  isInvalid: boolean
): string[] {
  const tips: string[] = [];
  const qPreview =
    question.question.length > 40 ? question.question.slice(0, 40) + '…' : question.question;

  switch (question.category) {
    case '自我介绍':
      if (isInvalid || analysis.wordCount < CATEGORY_MIN_LENGTH.自我介绍) {
        tips.push(
          analysis.requiresEnglish
            ? `针对「${qPreview}」，请用 1–2 分钟英文自我介绍：Who you are → Key experience → Core strengths → Why this role.`
            : `针对「${qPreview}」，建议结构：当前身份/背景 → 2–3 个核心亮点（项目/成果）→ 与目标岗位的匹配点 → 求职动机。`
        );
      }
      if (analysis.missingFocus.some((f) => /亮点|突出|简洁/i.test(f))) {
        tips.push('突出 1–2 个最有竞争力的经历或成果，避免流水账式罗列。');
      }
      break;

    case '行为面试':
      tips.push(
        isInvalid
          ? `本题「${qPreview}」需要举一个真实经历，完整描述背景、你的角色、具体行动和量化结果。`
          : '行为题务必用第一人称描述「我做了什么」，而非「我们团队做了」。'
      );
      break;

    case '情景问答':
      tips.push(
        isInvalid
          ? `情景题「${qPreview}」需给出：①如何分析局面 ②你的决策逻辑 ③具体行动步骤 ④预期结果与风险预案。`
          : '说明「为什么这样选」比罗列方案更重要，体现决策思路。'
      );
      break;

    case '技术面试':
      tips.push(
        isInvalid
          ? `技术题「${qPreview}」需涵盖：核心概念解释 → 原理/架构 → 实践经验或案例 → 权衡与边界。`
          : '先给出结论或定义，再展开原理，最后结合项目经验佐证。'
      );
      break;

    case '项目追问':
      tips.push(
        isInvalid
          ? `项目题「${qPreview}」需说明：项目背景、你的职责、技术/方案选型、难点与解决、最终成果。`
          : '明确你在项目中的个人贡献，避免只描述团队整体工作。'
      );
      break;

    case '案例分析':
      tips.push(
        isInvalid
          ? `案例题「${qPreview}」建议框架：明确问题 → 拆解关键因素 → 提出 2–3 个方案并对比 → 给出推荐与理由。`
          : '展示结构化分析能力，每个结论都要有依据。'
      );
      break;

    case '职业规划':
      tips.push(
        isInvalid
          ? `规划题需结合目标岗位，说明短期（1–2 年）能力目标与长期（3–5 年）发展方向，体现与公司的契合。`
          : '规划要具体可执行，避免空泛的「想学习成长」。'
      );
      break;

    case '压力面试':
      tips.push(
        isInvalid
          ? `压力题「${qPreview}」需保持冷静：承认问题存在 → 分析原因 → 说明已采取的改进 → 展现成长心态。`
          : '不要防御性反驳，用事实和改进行动回应质疑。'
      );
      break;

    case '团队协作':
      tips.push(
        isInvalid
          ? `协作题「${qPreview}」需描述：团队目标、分歧/困难点、你的沟通与协调方式、最终共识与结果。`
          : '体现 empathy 和以目标为导向，而非强调谁对谁错。'
      );
      break;

    default:
      if (isInvalid) {
        tips.push(
          `请围绕「${question.focusPoints.slice(0, 2).join('、') || question.category}」认真展开，结合具体事例作答。`
        );
      }
  }

  return tips;
}

/** 汇总面试结果 */
export function calculateResult(session: InterviewSession): InterviewResult {
  const answers = Object.values(session.answers);
  const answeredCount = answers.length;
  const totalScore =
    answeredCount > 0
      ? Math.round(answers.reduce((sum, a) => sum + a.score, 0) / answeredCount)
      : 0;

  const categoryScores: Record<string, { score: number; count: number }> = {};
  for (const q of session.questions) {
    const a = session.answers[q.id];
    if (!a) continue;
    if (!categoryScores[q.category]) categoryScores[q.category] = { score: 0, count: 0 };
    categoryScores[q.category].score += a.score;
    categoryScores[q.category].count++;
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (totalScore >= 80) strengths.push('整体面试表现优秀，具备良好的沟通和表达能力。');
  else if (totalScore < 55) weaknesses.push('整体表现未达合格线，建议系统练习各题型。');
  else if (totalScore < 65) weaknesses.push('整体表现有待提升，建议增加练习频次。');

  const avgWordCount =
    answeredCount > 0 ? answers.reduce((s, a) => s + a.content.length, 0) / answeredCount : 0;
  if (avgWordCount > 120) strengths.push('回答内容充实，展现了深度的思考能力。');
  else if (avgWordCount < 40) weaknesses.push('回答普遍偏短，建议展开论述以充分展示能力。');

  const highScoreCount = answers.filter((a) => a.score >= 80).length;
  const lowScoreCount = answers.filter((a) => a.score < 40).length;

  if (highScoreCount >= answeredCount * 0.7 && answeredCount > 0)
    strengths.push('大部分题目得分较高，面试技巧扎实。');
  if (lowScoreCount >= answeredCount * 0.3 && answeredCount > 0)
    weaknesses.push('多道题回答质量不足，建议逐题对照参考答案要点复盘。');
  else if (highScoreCount <= answeredCount * 0.3 && answeredCount > 0)
    weaknesses.push('高分题占比较低，建议针对性提升薄弱题型。');

  const hasDataPoints = answers.filter((a) => /\d+/.test(a.content)).length;
  if (hasDataPoints >= answeredCount * 0.5 && answeredCount > 0)
    strengths.push('善于用数据和事实支撑观点，说服力强。');
  else if (answeredCount > 0) weaknesses.push('建议多用数据量化成果，提升回答的说服力。');

  return {
    sessionId: session.id,
    jobTitle: session.jobTitle,
    totalScore,
    totalQuestions: session.questions.length,
    answeredQuestions: answeredCount,
    categoryScores,
    strengths:
      strengths.length > 0 ? strengths : ['完成了全部题目的回答，展现了良好的完成度。'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['没有明显的弱项，继续保持。'],
    overallFeedback:
      totalScore >= 85
        ? `你的整体表现非常优秀！在 ${session.jobTitle} 方向的面试中展现了扎实的功底和清晰的表达。建议在保持优势的同时，持续关注行业趋势和前沿技术。`
        : totalScore >= 70
          ? `你的整体表现良好，在 ${session.jobTitle} 方向的面试中展现了不错的潜力。建议重点提升回答的深度和结构化程度，多加练习。`
          : totalScore >= 50
            ? `面试表现处于及格线附近。建议对照每道题的「参考答案要点」逐题复盘，重点加强 ${session.questions[0]?.category ?? '核心题型'} 的结构化表达。`
            : `面试表现未达预期，多道题回答过于简略或与题目要求不符。建议先熟悉各题型的作答框架，再进行模拟练习。`,
    duration: Math.floor(Math.random() * 600) + 300,
  };
}
