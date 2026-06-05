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
  | "通用问答"
  | "AI 应用";

/** 答题形式 */
export type QuestionFormat = "essay" | "single_choice" | "multi_choice" | "code";

/** 选择题选项 */
export interface ChoiceOption {
  id: string;
  label: string;
}

/** 代码题测试用例 */
export interface CodeTestCase {
  invoke: string;
  expected: string;
  description?: string;
}

/** 代码题配置 */
export interface CodeConfig {
  language: "javascript" | "python";
  starterCode: string;
  testCases: CodeTestCase[];
  hint?: string;
}

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
  question: string;
  category: InterviewCategory;
  format?: QuestionFormat;
  jobs: JobCategory[];
  difficulty: number;
  focusPoints: string[];
  referencePoints: string[];
  suggestedDuration: number;
  language?: "zh" | "en";
  options?: ChoiceOption[];
  correctOptionIds?: string[];
  explanation?: string;
  sampleAnswer?: string;
  codeConfig?: CodeConfig;
}

export interface CodeTestResult {
  description?: string;
  passed: boolean;
  expected: string;
  actual: string;
}

/** 单道题目的回答 */
export interface InterviewAnswer {
  questionId: string;
  content: string;
  selectedOptionIds?: string[];
  codeTestResults?: CodeTestResult[];
  duration: number;
  score: number;
  feedback: string;
  improvement: string;
  explanation?: string;
  isCorrect?: boolean;
}

/** 面试会话状态 */
export type InterviewStatus = "selecting" | "ready" | "in-progress" | "review" | "finished";

/** 一次面试会话 */
export interface InterviewSession {
  id: string;
  jobTitle: string;
  jobCategory: JobCategory;
  questions: InterviewQuestion[];
  answers: Record<string, InterviewAnswer>;
  currentIndex: number;
  status: InterviewStatus;
  startedAt: string;
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

/** 答题提交载荷 */
export interface AnswerSubmitPayload {
  content: string;
  selectedOptionIds?: string[];
}
