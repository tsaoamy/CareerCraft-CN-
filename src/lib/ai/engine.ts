/**
 * AI 职业顾问 - API 调用引擎
 * 
 * 支持 OpenAI 兼容的 API（GPT-4, DeepSeek, 等）
 * 包含重试、超时、错误处理
 */

import {
  buildSystemMessage,
  buildReviewMessages,
  buildEnhanceMessages,
  buildMatchMessages,
  buildGenerateResumeMessages,
} from './prompts';
import type {
  ChatRequest,
  ChatResponse,
  ReviewResult,
  EnhancementResult,
  MatchResult,
  TailoredResumeResult,
} from './types';
import { generateTailoredResumeLocal } from '@/lib/tailored-resume';
import { getOfflineChatResponse } from '@/lib/ai/offline-chat';
import { computeJdResumeMatch } from '@/lib/match-engine';

// 配置
const AI_CONFIG = {
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  apiKey: process.env.OPENAI_API_KEY || '',
  model: process.env.AI_MODEL || 'gpt-4o-mini',
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4096', 10),
  timeout: 60000,
  maxRetries: 2,
};

/**
 * 调用 AI API（核心函数）
 */
async function callAI(
  messages: { role: string; content: string }[],
  options?: { temperature?: number; maxTokens?: number; jsonMode?: boolean }
): Promise<string> {
  const { temperature = 0.7, maxTokens = AI_CONFIG.maxTokens, jsonMode = false } = options || {};

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= AI_CONFIG.maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.timeout);

      const body: Record<string, unknown> = {
        model: AI_CONFIG.model,
        messages,
        temperature,
        max_tokens: maxTokens,
      };

      if (jsonMode) {
        body.response_format = { type: 'json_object' };
      }

      const response = await fetch(`${AI_CONFIG.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AI_CONFIG.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API 错误 (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('AI 返回内容为空');
      }

      return content;
    } catch (error: any) {
      lastError = error;
      if (error.name === 'AbortError') {
        lastError = new Error('AI 响应超时，请稍后重试');
      }
      // 最后一次尝试不再等待
      if (attempt < AI_CONFIG.maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('AI 调用失败');
}

/**
 * 解析 JSON 响应（处理各种格式异常）
 */
function parseJSONResponse(raw: string): Record<string, unknown> {
  // 尝试直接解析
  try {
    return JSON.parse(raw);
  } catch {
    // 尝试提取 ```json ... ``` 中的内容
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {
        // 继续尝试
      }
    }
    // 尝试找到第一个 { 和最后一个 }
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(raw.slice(firstBrace, lastBrace + 1));
      } catch {
        // 失败
      }
    }
    throw new Error('无法解析 AI 返回的 JSON 格式');
  }
}

// ==========================================
// 公开 API
// ==========================================

/**
 * 通用对话
 */
export async function chat(request: ChatRequest): Promise<ChatResponse> {
  try {
    const messages = [buildSystemMessage(), ...request.messages as { role: 'system' | 'user' | 'assistant'; content: string }[]];
    const content = await callAI(messages);
    return { success: true, message: content };
  } catch (error: any) {
    return { success: false, error: error.message || '对话失败' };
  }
}

/**
 * 简历评测
 */
export async function reviewResume(resumeContent: string): Promise<ChatResponse> {
  try {
    const messages = buildReviewMessages(resumeContent);
    const raw = await callAI(messages, { temperature: 0.3, jsonMode: true });
    const data = parseJSONResponse(raw) as unknown as ReviewResult;
    return {
      success: true,
      message: `简历评测完成，综合评分：${data.overallScore} 分`,
      data,
    };
  } catch (error: any) {
    return { success: false, error: error.message || '评测失败' };
  }
}

/**
 * 项目经历增强
 */
export async function enhanceProject(projectDescription: string): Promise<ChatResponse> {
  try {
    const messages = buildEnhanceMessages(projectDescription);
    const raw = await callAI(messages, { temperature: 0.5, jsonMode: true });
    const data = parseJSONResponse(raw) as unknown as EnhancementResult;
    return {
      success: true,
      message: '项目经历分析完成！以下是我为你挖掘的亮点。',
      data,
    };
  } catch (error: any) {
    return { success: false, error: error.message || '增强分析失败' };
  }
}

/**
 * 岗位定制简历生成
 */
export async function generateTailoredResume(
  resumeContent: string,
  jobTitle: string,
  jdText: string,
  options?: { company?: string; jdKeywords?: string[] }
): Promise<ChatResponse> {
  const jdKeywords = options?.jdKeywords ?? [];
  const company = options?.company;

  try {
    const messages = buildGenerateResumeMessages(
      resumeContent,
      jobTitle,
      company,
      jdText,
      jdKeywords
    );
    const raw = await callAI(messages, { temperature: 0.4, maxTokens: 6000, jsonMode: true });
    const data = parseJSONResponse(raw) as unknown as TailoredResumeResult;

    if (!data.fullText && data.summary) {
      data.fullText = buildFullTextFromResult(data);
    }

    return {
      success: true,
      message: `定制简历已生成，关键词覆盖率约 ${data.keywordCoverage}%`,
      data,
    };
  } catch (error: any) {
    return { success: false, error: error.message || '简历生成失败' };
  }
}

function buildFullTextFromResult(r: TailoredResumeResult): string {
  let text = `# 定制简历 — ${r.targetTitle}\n\n`;
  if (r.targetCompany) text += `**目标公司：** ${r.targetCompany}\n\n`;
  text += `## 个人摘要\n\n${r.summary}\n\n`;
  text += `## 核心技能\n\n**与岗位匹配：** ${r.skills.core.join(' · ')}\n\n`;
  if (r.skills.other?.length) text += `**其他技能：** ${r.skills.other.join(' · ')}\n\n`;
  text += `## 工作 / 项目经历\n\n`;
  for (const exp of r.experiences) {
    text += `### ${exp.title}`;
    if (exp.organization) text += ` · ${exp.organization}`;
    if (exp.period) text += `\n*${exp.period}*`;
    text += '\n\n';
    for (const h of exp.highlights) text += `- ${h}\n`;
    text += '\n';
  }
  if (r.education) text += `## 教育背景\n\n${r.education}\n\n`;
  return text.trim();
}

/**
 * 岗位匹配
 */
export async function matchPosition(resumeContent: string, jdContent: string): Promise<ChatResponse> {
  try {
    const messages = buildMatchMessages(resumeContent, jdContent);
    const raw = await callAI(messages, { temperature: 0.3, jsonMode: true });
    const data = parseJSONResponse(raw) as unknown as MatchResult;
    return {
      success: true,
      message: `岗位匹配分析完成，匹配度：${data.matchScore}%`,
      data,
    };
  } catch (error: any) {
    return { success: false, error: error.message || '匹配分析失败' };
  }
}

/**
 * 模拟回复（当 AI API 不可用时）
 */
export async function mockChat(request: ChatRequest): Promise<ChatResponse> {
  const lastMessage = request.messages[request.messages.length - 1]?.content || '';

  // 检测是否为评测请求
  if (request.mode === 'review' && request.context?.resumeContent) {
    return mockReview(request.context.resumeContent);
  }

  // 检测是否为增强请求
  if (request.mode === 'enhance' && request.context?.projectExperience) {
    return mockEnhance(request.context.projectExperience);
  }

  // 检测是否为匹配请求
  if (request.mode === 'match' && request.context?.resumeContent && request.context?.jobDescription) {
    return mockMatch(request.context.resumeContent, request.context.jobDescription);
  }

  // 检测是否为定制简历生成
  if (request.mode === 'generate-resume' && request.context?.resumeContent && request.context?.targetPosition) {
    return mockGenerateResume(
      request.context.resumeContent,
      request.context.targetPosition,
      request.context.jobDescription || '',
      request.context.company,
      request.context.jdKeywords
    );
  }

  // 默认对话回复
  return mockGeneralChat(lastMessage);
}

function mockGeneralChat(message: string): ChatResponse {
  return {
    success: true,
    message: getOfflineChatResponse(message),
    meta: { source: 'offline' as const },
  };
}

function mockReview(resumeContent: string): ChatResponse {
  const result: ReviewResult = {
    overallScore: 78,
    highlights: [
      { title: '项目经历结构清晰', description: '项目经历的时间线和职责描述较为清晰，HR 能快速了解你的经历背景。', severity: 'high' },
      { title: '技术关键词覆盖较全', description: '简历中包含了行业主流技术关键词，有利于通过 ATS 初筛。', severity: 'high' },
      { title: '教育背景匹配', description: '学历和专业与岗位方向一致。', severity: 'medium' },
    ],
    risks: [
      { title: '缺少量化成果', description: '项目中缺少具体的数据指标（如提升了 X%，服务了 Y 用户），这会降低说服力。建议补充可量化的成果数据。', severity: 'high' },
      { title: '自我评价过于模板化', description: '自我评价使用了较多通用套话，没有体现个人特色。建议用具体案例替代形容词。', severity: 'medium' },
      { title: '技能描述不够精准', description: '"熟悉 XX"这类表述过于模糊，建议改为"使用 XX 完成了 YY 项目，取得了 ZZ 成果"。', severity: 'medium' },
      { title: '缺少个人项目或开源贡献', description: '如果有个人项目或技术博客，建议补充，这能体现你的技术热情和学习能力。', severity: 'low' },
    ],
    hrReadability: {
      score: 72,
      firstImpression: '整体排版清晰，但关键信息（如量化成果）不够突出，HR 快速浏览时可能错过重点。',
      scanTime: '6 秒内可以扫完基本信息，但要理解项目细节需要更多时间。建议用加粗或分段突出关键成果。',
      layoutFeedback: '整体排版规范，建议在每段经历的开头用一句话总结核心成果，方便 HR 快速抓取重点。',
    },
    suggestions: [
      { category: '量化', original: '', suggestion: '为每个项目添加至少 1-2 个量化指标（提升 X%、服务 Y 用户、节省 Z 时间等）', reason: '量化成果是 HR 判断候选人能力的最重要依据，数据比形容词更有说服力。', priority: 'high' },
      { category: '关键词', original: '', suggestion: '仔细阅读目标 JD，确保简历中覆盖了 JD 中提到的关键技能词', reason: '很多公司使用 ATS 系统筛选简历，关键词匹配度直接影响是否能进入人工筛选。', priority: 'high' },
      { category: '逻辑', original: '', suggestion: '使用 STAR 法则重新组织项目描述，突出"做了什么→怎么做的→取得了什么结果"的逻辑链', reason: 'STAR 法则是最被 HR 认可的简历表达方式，能让你的经历更有说服力。', priority: 'medium' },
      { category: '可读性', original: '', suggestion: '在每段经历的标题中加入角色关键词（如"核心开发""项目负责人"），帮助 HR 快速定位', reason: 'HR 平均 6-10 秒浏览一份简历，清晰的角色标签能大大提高通过率。', priority: 'medium' },
    ],
    summary: '整体结构良好，技术关键词覆盖到位，但缺少量化成果和 STAR 法则的表达逻辑，修改后可提升 10-15 分。',
  };

  return {
    success: true,
    message: `简历评测完成，综合评分：${result.overallScore} 分。\n\n${result.summary}`,
    data: result,
  };
}

function mockEnhance(projectDescription: string): ChatResponse {
  const result: EnhancementResult = {
    projectGoal: '该项目旨在解决 XX 业务场景下的效率问题，通过技术手段优化核心流程，提升用户体验和业务指标。',
    personalContribution: '你在这个项目中承担了核心开发/负责人的角色，主导了关键模块的设计和实现，协调了跨团队协作。',
    dataMetrics: [
      '系统性能提升了约 30%-50%（如响应时间从 500ms 降至 200ms）',
      '服务了日均 X 万活跃用户，系统可用性达到 99.9%',
      '项目上线后，相关业务指标提升了 X%',
    ],
    techHighlights: [
      '参与/主导了项目技术选型和架构设计',
      '解决了关键的技术难题（如高并发、数据一致性等）',
      '引入了新的技术方案或工具，提升了团队效率',
    ],
    businessValue: '通过技术优化，直接带来了用户体验的提升和业务指标的增长，为团队后续项目提供了可复用的技术方案。',
    starFramework: {
      situation: '在业务快速增长阶段，现有系统面临性能和可扩展性的瓶颈，需要升级技术架构。',
      task: '作为核心开发，负责重新设计 XX 模块的技术方案，确保系统在高并发场景下的稳定性和性能。',
      action: '我主导设计了新的架构方案，引入了 XX 技术栈，通过分库分表/缓存策略/异步处理等方式优化了核心链路。在 2 个月内完成了开发和上线，并建立了完善的监控和告警体系。',
      result: '系统性能提升了 40%，支撑了日均 X 万用户的访问，全年系统可用性 99.9%，项目获得了部门年度最佳技术项目奖。',
    },
    hiddenGems: [
      '你在项目中展现的跨团队协调能力非常宝贵，这在简历中没有被充分体现。',
      '项目上线后的稳定性维护和迭代优化经验，说明了你的工程质量意识和持续改进能力。',
      '如果项目中用到了新技术或解决了创新性问题，这是一个很有价值的亮点。',
    ],
    coachQuestions: [
      '在你看来，这个项目中你最大的收获是什么？不是技术上的，而是思维方式或解决问题能力上的？',
      '如果让你重新做一次，你会怎么做？有没有现在回头看觉得可以做得更好的地方？',
      '这段经历中体现的核心能力，跟你目标岗位的要求有什么关联？',
    ],
  };

  return {
    success: true,
    message: '项目经历分析完成！以下是我为你挖掘的亮点和价值。',
    data: result,
  };
}

function mockMatch(resumeContent: string, jdContent: string): ChatResponse {
  const breakdown = computeJdResumeMatch(resumeContent, jdContent);
  const { matchScore, keywordCoverage, matchedKeywords, missingKeywords, skillGaps } = breakdown;

  const partial = skillGaps
    .filter((g) => g.current_level > 0 && g.current_level < g.required_level - 1)
    .map((g) => `${g.skill}（基础具备，建议深化）`);

  const level: '高' | '中' | '低' = matchScore >= 75 ? '高' : matchScore >= 50 ? '中' : '低';

  const result: MatchResult = {
    matchScore,
    skillAnalysis: {
      matched: matchedKeywords.slice(0, 8),
      partial: partial.slice(0, 4),
      missing: missingKeywords.slice(0, 6),
    },
    keywordMatch: {
      coverage: keywordCoverage,
      matched: matchedKeywords,
      missing: missingKeywords,
    },
    competitiveness: {
      level,
      strengths: matchedKeywords.length > 0
        ? [`已覆盖 ${matchedKeywords.length} 项 JD 核心技能/关键词`, '简历内容与岗位描述有可验证的重叠']
        : ['建议补充与 JD 对齐的项目与技能描述'],
      weaknesses: missingKeywords.length > 0
        ? missingKeywords.slice(0, 3).map((s) => `尚未体现：${s}`)
        : ['可进一步量化项目成果'],
      suggestion: missingKeywords.length > 0
        ? `建议优先补齐：${missingKeywords.slice(0, 3).join('、')}`
        : '核心匹配较好，可突出领导力与跨团队协作案例',
    },
    missingSkills: missingKeywords.slice(0, 5).map((skill, i) => ({
      skill,
      importance: (i < 2 ? 'high' : i < 4 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
      suggestion: `在简历中补充与「${skill}」相关的项目或课程经历`,
    })),
    suggestedAdditions: [
      '在项目经历中用 STAR 法则补充可量化成果',
      '将 JD 高频关键词自然嵌入经历描述',
      missingKeywords.length > 0 ? `重点补充：${missingKeywords.slice(0, 2).join('、')}` : '可增加与岗位业务场景相关的总结句',
    ],
    hrTopQuestions: [
      `你简历中与岗位相关的${matchedKeywords[0] ?? '核心技能'}经验，能举一个具体案例吗？`,
      missingKeywords[0] ? `JD 要求${missingKeywords[0]}，你目前的学习或实践经验如何？` : '你认为自己与这个岗位最匹配的一点是什么？',
      '请描述一次你解决复杂问题并带来可量化结果的经历',
    ],
  };

  return {
    success: true,
    message: `岗位匹配分析完成，匹配度：${result.matchScore}%`,
    data: result,
  };
}

function mockGenerateResume(
  resumeContent: string,
  jobTitle: string,
  jdText: string,
  company?: string,
  jdKeywords?: string[]
): ChatResponse {
  const result = generateTailoredResumeLocal({
    resumeContent,
    jobTitle,
    company,
    jdText,
    jdKeywords: jdKeywords ?? [],
  });

  return {
    success: true,
    message: `定制简历已生成（智能重组模式），关键词覆盖率约 ${result.keywordCoverage}%`,
    data: result,
  };
}

/**
 * 智能路由：根据环境判断使用真实 API 还是模拟数据
 */
export async function smartChat(request: ChatRequest): Promise<ChatResponse> {
  const hasKey = AI_CONFIG.apiKey && AI_CONFIG.apiKey !== 'sk-your-api-key-here';

  if (hasKey) {
    const result = await chat(request);
    if (result.success) {
      return { ...result, meta: { source: 'ai' as const } };
    }
  }

  const mockResult = await mockChat(request);
  return { ...mockResult, meta: { source: 'offline' as const } };
}
