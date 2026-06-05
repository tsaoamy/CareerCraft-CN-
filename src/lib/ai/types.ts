/**
 * AI 职业顾问 - 类型定义
 */

// ==========================================
// 消息类型
// ==========================================

export type CopilotRole = 'user' | 'assistant' | 'system';

export interface CopilotMessage {
  id: string;
  role: CopilotRole;
  content: string;
  timestamp: number;
  /** 是否为结构化数据（如评测报告） */
  structured?: boolean;
  /** 结构化数据 */
  data?: ReviewResult | EnhancementResult | MatchResult | null;
  /** 回复来源 */
  source?: 'ai' | 'offline';
  /** 加载中占位 */
  pending?: boolean;
}

export interface ChatRequest {
  messages: { role: string; content: string }[];
  context?: {
    resumeContent?: string;
    targetPosition?: string;
    jobDescription?: string;
    projectExperience?: string;
    company?: string;
    jdKeywords?: string[];
  };
  mode?: 'chat' | 'review' | 'enhance' | 'match' | 'generate-resume';
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  data?: ReviewResult | EnhancementResult | MatchResult | TailoredResumeResult | null;
  error?: string;
  meta?: { source: 'ai' | 'offline' };
}

// ==========================================
// 岗位定制简历结果
// ==========================================

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

// ==========================================
// 简历评测结果
// ==========================================

export interface ReviewResult {
  overallScore: number;           // 0-100
  highlights: ReviewItem[];       // 亮点
  risks: ReviewItem[];             // 风险点
  hrReadability: HrReadability;    // HR 阅读体验
  suggestions: ReviewSuggestion[]; // 修改建议
  summary: string;                 // 总评
}

export interface ReviewItem {
  title: string;
  description: string;
  severity?: 'high' | 'medium' | 'low';
}

export interface HrReadability {
  score: number;          // 0-100
  firstImpression: string; // 第一印象
  scanTime: string;        // 快速浏览体验
  layoutFeedback: string;  // 排版反馈
}

export interface ReviewSuggestion {
  category: '量化' | '关键词' | '逻辑' | '可读性' | '匹配度';
  original?: string;
  suggestion: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

// ==========================================
// 项目经历增强结果
// ==========================================

export interface EnhancementResult {
  projectGoal: string;        // 项目目标分析
  personalContribution: string; // 个人贡献
  dataMetrics: string[];       // 数据成果
  techHighlights: string[];    // 技术亮点
  businessValue: string;       // 业务价值
  starFramework: StarFramework; // STAR 拆解
  hiddenGems: string[];        // 隐藏亮点
  coachQuestions: string[];    // 教练式提问
}

export interface StarFramework {
  situation: string;   // 情境
  task: string;        // 任务
  action: string;      // 行动
  result: string;      // 结果
}

// ==========================================
// 岗位匹配结果
// ==========================================

export interface MatchResult {
  matchScore: number;          // 0-100
  skillAnalysis: SkillAnalysis;
  keywordMatch: KeywordMatch;
  competitiveness: Competitiveness;
  missingSkills: SkillGap[];  // 缺失/需补充技能
  suggestedAdditions: string[];
  hrTopQuestions: string[];   // HR 最可能问的 3 个问题
}

export interface SkillAnalysis {
  matched: string[];    // 匹配技能
  partial: string[];    // 部分匹配
  missing: string[];    // 缺失技能
}

export interface KeywordMatch {
  coverage: number;     // 关键词覆盖率 0-100
  matched: string[];    // 已覆盖关键词
  missing: string[];    // 未覆盖关键词
}

export interface Competitiveness {
  level: '高' | '中' | '低';
  strengths: string[];
  weaknesses: string[];
  suggestion: string;
}

export interface SkillGap {
  skill: string;
  importance: 'high' | 'medium' | 'low';
  suggestion: string;
  learningPath?: string;
}

// ==========================================
// 后台分析数据
// ==========================================

export interface AIHeatmapData {
  questions: HeatmapQuestion[];
  totalQuestions: number;
  period: string;
}

export interface HeatmapQuestion {
  category: string;          // 问题分类：简历/求职/面试/职业规划
  question: string;          // 问题内容
  count: number;             // 提问次数
  trend: 'up' | 'down' | 'stable';
  percentage: number;        // 占比
}

export interface UserGrowthData {
  userId: string;
  username: string;
  stages: GrowthStage[];
}

export interface GrowthStage {
  stage: string;             // 阶段名
  timestamp: string;         // 时间
  action: string;            // 行为描述
  aiInteractions: number;    // AI 交互次数
  resumeVersion: number;     // 简历版本号
}

export interface KnowledgeRecommendation {
  id: string;
  topic: string;             // 主题
  questionCount: number;     // 提问次数
  trend: 'up' | 'down' | 'stable';
  suggestedContent: {
    tutorial?: string;
    example?: string;
    video?: string;
  };
}
