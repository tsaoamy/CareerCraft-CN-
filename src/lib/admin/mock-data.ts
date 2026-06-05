// ==========================================
// Mock Data Service — 模拟后端数据层
// 生产环境替换为真实 API 调用
// 所有数据经过 DTO 过滤
// ==========================================

import type {
  AdminUser,
  DashboardStats,
  DashboardTrends,
  UserBehaviorData,
  ResumeRecord,
  AIMonitorStats,
  AIErrorLog,
  AIHourlyCall,
  AdminLog,
  PaginationParams,
  PaginatedResponse,
  TrendDataPoint,
} from "@/types/admin";
import { sanitizeOutput } from "./dto";
import { OFFICIAL_EMAIL } from "@/lib/site-config";

// ──── 随机工具 ────
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const daysAgo = (d: number) => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString().split("T")[0];
};

const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)];

// ──── Mock 管理员 ────
export const MOCK_ADMIN: AdminUser = {
  id: "admin-001",
  name: "CareerCraft Admin",
  email: OFFICIAL_EMAIL,
  role: "super_admin",
  avatar: "",
  status: "active",
  lastLoginAt: new Date().toISOString(),
  createdAt: "2025-01-01T00:00:00Z",
};

// ──── Mock 用户列表 ────
const mockUsers: AdminUser[] = Array.from({ length: 128 }, (_, i) => ({
  id: `user-${String(i + 1).padStart(4, "0")}`,
  name: pick([
    "张明", "李华", "王芳", "陈伟", "刘洋", "杨静", "赵磊", "周婷",
    "吴峰", "孙悦", "黄超", "林洁", "马强", "朱慧", "胡俊", "郑晓",
    "钱程", "梁妍", "宋涛", "唐琳",
  ]),
  email: `user${i + 1}@example.com`,
  role: "user" as const,
  avatar: "",
  status: pick(["active", "active", "active", "active", "suspended", "pending"]),
  lastLoginAt: new Date(Date.now() - rand(0, 30 * 24 * 60 * 60 * 1000)).toISOString(),
  createdAt: new Date(Date.now() - rand(1, 365) * 24 * 60 * 60 * 1000).toISOString(),
}));

// ──── Dashboard 统计数据 ────
export function getDashboardStats(): DashboardStats {
  const totalResumes = rand(1200, 1800);
  const totalAnalyses = rand(3500, 5000);
  return {
    totalUsers: 128,
    newUsersToday: rand(3, 15),
    totalPV: totalAnalyses * 3 + rand(500, 2000),
    totalUV: rand(800, 1200),
    resumesGenerated: totalResumes,
    aiAnalysisCount: totalAnalyses,
    avgDuration: rand(3, 7),
    conversionRate: rand(12, 28),
  };
}

// ──── 趋势数据 ────
export function getDashboardTrends(days = 7): DashboardTrends {
  const generateTrend = (base: number, variance: number): TrendDataPoint[] =>
    Array.from({ length: days }, (_, i) => ({
      date: daysAgo(days - 1 - i),
      value: base + rand(-variance, variance),
    }));

  return {
    users: generateTrend(8, 5),
    pv: generateTrend(420, 180),
    uv: generateTrend(110, 40),
    resumes: generateTrend(45, 20),
    aiCalls: generateTrend(130, 50),
  };
}

// ──── 用户行为数据 ────
export function getUserBehaviorData(): UserBehaviorData {
  return {
    nodes: [
      { id: "home", label: "首页", count: 1280, percentage: 100 },
      { id: "jd-analyzer", label: "JD解析", count: 860, percentage: 67 },
      { id: "resume-upload", label: "上传简历", count: 720, percentage: 56 },
      { id: "ai-analyze", label: "AI分析", count: 640, percentage: 50 },
      { id: "resume-output", label: "生成简历", count: 480, percentage: 38 },
      { id: "export", label: "导出PDF", count: 320, percentage: 25 },
      { id: "interview", label: "AI面试", count: 280, percentage: 22 },
      { id: "drop-off", label: "流失", count: 400, percentage: 31 },
    ],
    links: [
      { source: "home", target: "jd-analyzer", value: 860 },
      { source: "home", target: "drop-off", value: 420 },
      { source: "jd-analyzer", target: "resume-upload", value: 720 },
      { source: "jd-analyzer", target: "drop-off", value: 140 },
      { source: "resume-upload", target: "ai-analyze", value: 640 },
      { source: "resume-upload", target: "drop-off", value: 80 },
      { source: "ai-analyze", target: "resume-output", value: 480 },
      { source: "ai-analyze", target: "drop-off", value: 160 },
      { source: "resume-output", target: "export", value: 320 },
      { source: "resume-output", target: "drop-off", value: 160 },
      { source: "interview", target: "resume-output", value: 120 },
    ],
    pageDurations: [
      { page: "首页", avgDuration: 45 },
      { page: "JD解析", avgDuration: 120 },
      { page: "简历定制", avgDuration: 180 },
      { page: "AI面试", avgDuration: 300 },
      { page: "素材库", avgDuration: 90 },
    ],
    clickHeatmap: [
      { area: "Hero CTA按钮", clicks: 856 },
      { area: "导航栏-上传简历", clicks: 620 },
      { area: "功能区-AI简历", clicks: 580 },
      { area: "功能区-JD分析", clicks: 440 },
      { area: "导航栏-面试官", clicks: 380 },
    ],
    bounceRate: 32.5,
    featureUsage: [
      { feature: "JD智能解析", count: 860 },
      { feature: "AI简历生成", count: 720 },
      { feature: "模擬面试", count: 280 },
      { feature: "素材管理", count: 450 },
    ],
  };
}

// ──── 简历记录 ────
export function getResumeRecords(
  params: PaginationParams
): PaginatedResponse<ResumeRecord> {
  let records: ResumeRecord[] = Array.from({ length: 86 }, (_, i) => {
    const user = pick(mockUsers);
    return {
      id: `resume-${String(i + 1).padStart(4, "0")}`,
      fileName: `resume_v${rand(1, 5)}.pdf`,
      userName: user.name,
      type: (i % 2 === 0 ? 'original' : 'optimized') as 'original' | 'optimized',
      score: rand(55, 98),
      generatedAt: new Date(
        Date.now() - rand(0, 60) * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  });

  // 搜索过滤
  if (params.search) {
    const s = params.search.toLowerCase();
    records = records.filter(
      (r) =>
        r.userName.toLowerCase().includes(s) ||
        r.fileName.toLowerCase().includes(s)
    );
  }

  // 排序
  if (params.sortBy) {
    const key = params.sortBy as keyof ResumeRecord;
    records.sort((a, b) => {
      const va = a[key], vb = b[key];
      const cmp = typeof va === "number" ? (va as number) - (vb as number) : String(va).localeCompare(String(vb));
      return params.sortOrder === "desc" ? -cmp : cmp;
    });
  }

  const total = records.length;
  const start = (params.page - 1) * params.pageSize;
  const pageData = records.slice(start, start + params.pageSize);

  return {
    data: pageData,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(total / params.pageSize),
  };
}

// ──── AI 监控 ────
export function getAIMonitorStats(): AIMonitorStats {
  return {
    totalCalls: rand(8000, 12000),
    tokenConsumed: rand(2000000, 5000000),
    successRate: rand(95, 99.5),
    avgResponseTime: rand(800, 2500),
    errorCount: rand(20, 80),
    costEstimate: rand(50, 200),
  };
}

export function getAIErrorLogs(
  params: PaginationParams
): PaginatedResponse<AIErrorLog> {
  const errorCodes = [
    { code: "RATE_LIMIT", msg: "请求频率超限" },
    { code: "TOKEN_EXCEEDED", msg: "Token超出限制" },
    { code: "TIMEOUT", msg: "请求超时" },
    { code: "MODEL_OVERLOADED", msg: "模型过载" },
    { code: "INVALID_INPUT", msg: "输入格式错误" },
    { code: "AUTH_ERROR", msg: "认证失败" },
  ];

  const logs: AIErrorLog[] = Array.from({ length: 45 }, (_, i) => {
    const err = pick(errorCodes);
    return {
      id: `err-${String(i + 1).padStart(4, "0")}`,
      timestamp: new Date(
        Date.now() - rand(0, 7) * 24 * 60 * 60 * 1000
      ).toISOString(),
      endpoint: pick(["/api/ai/generate-resume", "/api/ai/analyze-jd", "/api/ai/interview"]),
      errorCode: err.code,
      errorMessage: err.msg,
      userId: pick(mockUsers).id,
      retryCount: rand(0, 5),
    };
  });

  const total = logs.length;
  const start = (params.page - 1) * params.pageSize;
  return {
    data: logs.slice(start, start + params.pageSize),
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(total / params.pageSize),
  };
}

export function getAIHourlyCalls(): AIHourlyCall[] {
  return Array.from({ length: 24 }, (_, hour) => ({
    hour: `${String(hour).padStart(2, "0")}:00`,
    calls: rand(10, 200),
    tokens: rand(5000, 80000),
    errors: rand(0, 5),
  }));
}

// ──── 用户管理 ────
export function getAdminUsers(
  params: PaginationParams
): PaginatedResponse<AdminUser> {
  let filtered = [...mockUsers];

  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s)
    );
  }

  if (params.status && params.status !== "all") {
    filtered = filtered.filter((u) => u.status === params.status);
  }

  const total = filtered.length;
  const start = (params.page - 1) * params.pageSize;
  return {
    data: filtered.slice(start, start + params.pageSize),
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(total / params.pageSize),
  };
}

// ──── 管理日志 ────
export function getAdminLogs(
  params: PaginationParams
): PaginatedResponse<AdminLog> {
  const actions = [
    "查看仪表盘",
    "导出用户数据",
    "删除简历记录",
    "修改用户状态",
    "查看AI监控",
    "导出CSV报告",
  ];
  const targets = ["用户管理", "简历库", "AI监控", "数据分析"];

  const logs: AdminLog[] = Array.from({ length: 60 }, (_, i) => ({
    id: `log-${String(i + 1).padStart(4, "0")}`,
    adminId: "admin-001",
    adminName: "CareerCraft Admin",
    action: pick(actions),
    target: pick(targets),
    details: `操作详情 #${i + 1}`,
    ip: `192.168.1.${rand(1, 255)}`,
    timestamp: new Date(
      Date.now() - rand(0, 30) * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));

  const total = logs.length;
  const start = (params.page - 1) * params.pageSize;
  return {
    data: logs.slice(start, start + params.pageSize),
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(total / params.pageSize),
  };
}
