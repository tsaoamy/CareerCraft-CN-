// ==========================================
// Interview Engine — 面试引擎（AI 模拟评分）
// ==========================================

import type { InterviewAnswer, InterviewQuestion, InterviewResult, InterviewSession } from "@/types/interview";

/** 模拟 AI 评分 */
export function evaluateAnswer(question: InterviewQuestion, answer: string): InterviewAnswer {
  // 基于回答质量的模拟评分算法
  let baseScore = 50;

  const content = answer.trim();

  // 字数评分：回答越长越可能内容充实
  const wordCount = content.length;
  if (wordCount > 200) baseScore += 20;
  else if (wordCount > 100) baseScore += 14;
  else if (wordCount > 50) baseScore += 8;
  else if (wordCount > 20) baseScore += 3;

  // 包含具体数字/数据
  const hasNumbers = /\d+/.test(content);
  if (hasNumbers) baseScore += 8;

  // 结构标志（用了「第一」「首先」「最后」「综上所述」等）
  const hasStructure = /第[一二三四五]|首先|其次|最后|综上|总结|另外|此外|并且|然而|因此|所以/.test(content);
  if (hasStructure) baseScore += 6;

  // STAR 法则迹象
  const hasSTAR = /当时|之前|面临|遇到|挑战|目标|任务|我的角色|我做|我的方案|推动|落地|结果|最终|数据|提升|降低|增长|减少|完成/.test(content);
  if (hasSTAR) baseScore += 8;

  // 具体事例
  const hasExample = /比如|例如|举例|具体|项目中|团队|客户|用户|上线|发布了|完成|交付/.test(content);
  if (hasExample) baseScore += 5;

  // 思考深度
  const hasReflection = /反思|总结|学习|教训|改进|优化|复盘|经验|成长|变化/.test(content);
  if (hasReflection) baseScore += 5;

  // 缺陷惩罚
  const hasVague = /大概|可能|应该|好像|差不多|还行|一般般/.test(content);
  if (hasVague) baseScore -= 5;

  const tooShort = wordCount < 15;
  if (tooShort) baseScore = Math.min(baseScore, 40);

  // 最终分数钳制
  const score = Math.min(98, Math.max(15, baseScore));

  // 生成反馈
  const { feedback, improvement } = generateFeedback(score, question, content, wordCount, hasNumbers, hasSTAR, hasStructure, hasReflection);

  return {
    questionId: question.id,
    content,
    duration: 0,
    score,
    feedback,
    improvement,
  };
}

function generateFeedback(
  score: number, _q: InterviewQuestion, content: string,
  wordCount: number, hasNumbers: boolean, hasSTAR: boolean,
  hasStructure: boolean, hasReflection: boolean,
) {
  const points: string[] = [];
  const improvements: string[] = [];

  if (wordCount > 150) points.push("回答长度充实，展现了丰富的思考。");
  else if (wordCount > 60) points.push("回答长度适中。");
  else if (wordCount > 25) points.push("回答较为简洁。");
  else improvements.push("建议充实回答内容，面试中简答题也需要适当展开。");

  if (hasNumbers) points.push("你的回答中包含了具体的数据支撑，增强了说服力。");
  else improvements.push("建议加入具体的数据或量化成果，让回答更有说服力。");

  if (hasSTAR) points.push("回答体现了 STAR 法则的结构，逻辑清晰。");
  else improvements.push("建议使用 STAR 法则（情境-任务-行动-结果）组织回答，增强逻辑性。");

  if (hasStructure) points.push("回答结构清晰，有层次感。");
  else improvements.push("建议使用「首先…其次…最后」等过渡词，让回答更有条理。");

  if (hasReflection) points.push("展现了良好的复盘和反思能力。");
  else improvements.push("可以加入一些对你所做事情的反思，展现成长意识。");

  if (score >= 85) {
    points.push("整体表现非常出色！");
  } else if (score >= 70) {
    points.push("整体表现良好，继续打磨会更上一层楼。");
  } else {
    points.push("还有不少提升空间，多加练习。");
  }

  return {
    feedback: points.join(" "),
    improvement: improvements.join(" ") || "继续保持当前水平，在细节上精益求精。",
  };
}

/** 汇总面试结果 */
export function calculateResult(session: InterviewSession): InterviewResult {
  const answers = Object.values(session.answers);
  const answeredCount = answers.length;
  const totalScore = answeredCount > 0
    ? Math.round(answers.reduce((sum, a) => sum + a.score, 0) / answeredCount)
    : 0;

  // 按类别统计
  const categoryScores: Record<string, { score: number; count: number }> = {};
  for (const q of session.questions) {
    const a = session.answers[q.id];
    if (!a) continue;
    if (!categoryScores[q.category]) categoryScores[q.category] = { score: 0, count: 0 };
    categoryScores[q.category].score += a.score;
    categoryScores[q.category].count++;
  }

  // 强弱项
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (totalScore >= 80) strengths.push("整体面试表现优秀，具备良好的沟通和表达能力。");
  else if (totalScore < 65) weaknesses.push("整体表现有待提升，建议增加练习频次。");

  const avgWordCount = answeredCount > 0 ? answers.reduce((s, a) => s + a.content.length, 0) / answeredCount : 0;
  if (avgWordCount > 120) strengths.push("回答内容充实，展现了深度的思考能力。");
  else if (avgWordCount < 40) weaknesses.push("回答普遍偏短，建议展开论述以充分展示能力。");

  const highScoreCount = answers.filter((a) => a.score >= 80).length;
  if (highScoreCount >= answeredCount * 0.7) strengths.push("大部分题目得分较高，面试技巧扎实。");
  if (highScoreCount <= answeredCount * 0.3) weaknesses.push("高分题占比较低，建议针对性提升薄弱题型。");

  const hasDataPoints = answers.filter((a) => /\d+/.test(a.content)).length;
  if (hasDataPoints >= answeredCount * 0.5) strengths.push("善于用数据和事实支撑观点，说服力强。");
  else weaknesses.push("建议多用数据量化成果，提升回答的说服力。");

  return {
    sessionId: session.id,
    jobTitle: session.jobTitle,
    totalScore,
    totalQuestions: session.questions.length,
    answeredQuestions: answeredCount,
    categoryScores,
    strengths: strengths.length > 0 ? strengths : ["完成了全部题目的回答，展现了良好的完成度。"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["没有明显的弱项，继续保持。"],
    overallFeedback: totalScore >= 85
      ? `你的整体表现非常优秀！在 ${session.jobTitle} 方向的面试中展现了扎实的功底和清晰的表达。建议在保持优势的同时，持续关注行业趋势和前沿技术。`
      : totalScore >= 70
        ? `你的整体表现良好，在 ${session.jobTitle} 方向的面试中展现了不错的潜力。建议重点提升回答的深度和结构化程度，多加练习。`
        : `面试表现还有提升空间。建议多进行模拟练习，重点加强 STAR 法则的应用和具体案例的准备。每一次练习都是进步！`,
    duration: Math.floor(Math.random() * 600) + 300,
  };
}
