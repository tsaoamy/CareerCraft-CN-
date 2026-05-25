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
} from './prompts';
import type {
  ChatRequest,
  ChatResponse,
  ReviewResult,
  EnhancementResult,
  MatchResult,
} from './types';

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

  // 默认对话回复
  return mockGeneralChat(lastMessage);
}

function mockGeneralChat(message: string): ChatResponse {
  const responses = [
    `很好的问题！让我帮你分析一下。

**为什么这很重要：**
很多求职者忽略了这个方面，但 HR 其实很关注这一点，因为这关系到你能否快速融入团队。

**我的建议：**
1. 先梳理你的核心经历，找到最能体现相关能力的部分
2. 用具体的数据和案例来支撑，而不是泛泛而谈
3. 关注"你做了什么"和"你带来了什么结果"

💡 **思考一下：** 在你最近的经历中，有没有一个可以很好体现这个能力的案例？不妨先自己试着描述一下，然后我可以帮你优化表达。`,
    `这是一个非常好的问题！说明你已经在深入思考自己的职业发展了。

**我的理解是：** 你关心的核心其实是——如何在有限的篇幅内最大化展示自己的价值。

**给你一个思路：**
- 先确定目标岗位最看重什么（看 JD 中的前 3 条要求）
- 把你的经历按"与岗位的关联度"排序
- 关联度最高的放前面，用最多的篇幅

🤔 **想请你思考一下：** 你觉得自己的经历中，哪一段最能打动目标岗位的面试官？为什么？`,
  ];

  return {
    success: true,
    message: responses[Math.floor(Math.random() * responses.length)],
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
  const result: MatchResult = {
    matchScore: 68,
    skillAnalysis: {
      matched: ['团队协作', '沟通能力', '办公软件使用'],
      partial: ['数据分析（有基础但需加强）', '项目管理（有实践经验但不够系统）'],
      missing: ['SQL 进阶查询', '数据可视化工具（如 Tableau）', 'A/B 测试方法论'],
    },
    keywordMatch: {
      coverage: 62,
      matched: ['用户增长', '数据分析', '产品运营', '跨部门协作'],
      missing: ['SQL', 'Tableau', 'A/B 测试', '用户画像', '留存优化'],
    },
    competitiveness: {
      level: '中',
      strengths: ['实战经验丰富，有完整的项目闭环经验', '跨部门协作能力强，说明沟通和推动力好', '对数据敏感，能用数据指导决策'],
      weaknesses: ['部分硬技能（如 SQL 进阶、数据工具）有待提升', '缺少大厂或知名公司背景', '简历中缺少系统性的方法论总结'],
      suggestion: '建议在简历中补充系统性的方法论表述（如"通过 XX 方法论指导了 YY 项目"），同时尽快补齐关键硬技能。',
    },
    missingSkills: [
      { skill: 'SQL 进阶', importance: 'high', suggestion: '建议学习窗口函数、复杂查询、性能优化，可以通过牛客网或 LeetCode 练习。预计 2-3 周可掌握。' },
      { skill: '数据可视化', importance: 'medium', suggestion: '学习 Tableau 或 Power BI 基础，做一个个人 Dashboard 项目即可满足简历需求。预计 1-2 周。' },
      { skill: 'A/B 测试', importance: 'medium', suggestion: '学习《A/B 测试实战》或相关在线课程，了解实验设计、样本量计算、统计显著性等概念。预计 1 周。' },
    ],
    suggestedAdditions: [
      '在项目经历中补充数据分析相关的具体操作（用了什么工具、分析了什么数据、得出了什么结论）',
      '添加一个"核心方法论"或"专业技能"板块，系统展示你的方法论框架',
      '如果有数据相关的个人项目或学习记录，建议补充',
    ],
    hrTopQuestions: [
      '你简历里提到"通过数据分析发现了用户增长的机会"，能具体说说你分析了什么数据、用了什么工具、最终带来了什么结果吗？',
      '看你的经历偏产品运营，但这个岗位需要较强的 SQL 能力，你目前的 SQL 水平如何？有相关项目经验吗？',
      '你之前主要做 C 端产品运营，我们这边偏 B 端数据分析，你怎么看待这个转型？你觉得自己最大的挑战是什么？',
    ],
  };

  return {
    success: true,
    message: `岗位匹配分析完成，匹配度：${result.matchScore}%。以下是详细分析。`,
    data: result,
  };
}

/**
 * 智能路由：根据环境判断使用真实 API 还是模拟数据
 */
export async function smartChat(request: ChatRequest): Promise<ChatResponse> {
  // 如果配置了 API Key，使用真实 API；否则使用模拟数据
  if (AI_CONFIG.apiKey && AI_CONFIG.apiKey !== 'sk-your-api-key-here') {
    return chat(request);
  }
  return mockChat(request);
}
