// ==========================================
// Interview — 面试类型定义
// ==========================================

/** 面试题型类别 */
export type InterviewCategory =
  | "自我介绍"
  | "项目追问"
  | "行为面试"
  | "技术面试"
  | "情景问答"
  | "案例分析"
  | "职业规划"
  | "压力面试"
  | "团队协作"
  | "通用问答";

/** 目标岗位类型（用于选题定向） */
export type JobCategory =
  | "前端开发"
  | "后端开发"
  | "算法工程师"
  | "产品经理"
  | "运营"
  | "数据分析"
  | "UI/UX 设计师"
  | "项目管理"
  | "通用";

/** 单道面试题目 */
export interface InterviewQuestion {
  id: string;
  /** 题目正文 */
  question: string;
  /** 题型分类 */
  category: InterviewCategory;
  /** 适用岗位，空=所有 */
  jobs: JobCategory[];
  /** 难度: 1-5 */
  difficulty: number;
  /** 考察要点（提示面试官/用户关注什么） */
  focusPoints: string[];
  /** 参考答案要点 */
  referencePoints: string[];
  /** 建议回答时长（秒） */
  suggestedDuration: number;
}

/** 单道题目的回答 */
export interface InterviewAnswer {
  questionId: string;
  /** 用户文字回答 */
  content: string;
  /** 答题耗时（秒） */
  duration: number;
  /** AI 评分 0-100 */
  score: number;
  /** AI 反馈 */
  feedback: string;
  /** 改进建议 */
  improvement: string;
}

/** 面试会话状态 */
export type InterviewStatus = "selecting" | "ready" | "in-progress" | "review" | "finished";

/** 一次面试会话 */
export interface InterviewSession {
  id: string;
  jobTitle: string;
  jobCategory: JobCategory;
  /** 本次面试的题目列表 */
  questions: InterviewQuestion[];
  /** 答题记录 */
  answers: Record<string, InterviewAnswer>;
  currentIndex: number;
  status: InterviewStatus;
  /** 开始时间 */
  startedAt: string;
  /** 结束时间 */
  finishedAt?: string;
}

/** 面试结果汇总 */
export interface InterviewResult {
  sessionId: string;
  jobTitle: string;
  totalScore: number;
  totalQuestions: number;
  answeredQuestions: number;
  categoryScores: Record<string, { score: number; count: number }>;
  strengths: string[];
  weaknesses: string[];
  overallFeedback: string;
  duration: number;
}

/** 快速面试模式 */
export interface InterviewQuickMode {
  id: string;
  label: string;
  jobCategory: JobCategory;
  questionCount: number;
  categories: InterviewCategory[];
  icon: string;
}
