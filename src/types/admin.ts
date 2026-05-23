// ==========================================
// Admin Dashboard TypeScript 类型定义
// 严格 DTO 设计：前端暴露字段白名单
// ==========================================

// ──── Admin 用户角色 ────
export type UserRole = "user" | "admin" | "super_admin";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: "active" | "suspended" | "pending";
  lastLoginAt: string;
  createdAt: string;
}

// ──── 仪表盘统计 ────
export interface DashboardStats {
  totalUsers: number;
  newUsersToday: number;
  totalPV: number;
  totalUV: number;
  resumesGenerated: number;
  aiAnalysisCount: number;
  avgDuration: number; // 分钟
  conversionRate: number; // 百分比
}

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface DashboardTrends {
  users: TrendDataPoint[];
  pv: TrendDataPoint[];
  uv: TrendDataPoint[];
  resumes: TrendDataPoint[];
  aiCalls: TrendDataPoint[];
}

// ──── 用户行为分析 ────
export interface UserBehaviorNode {
  id: string;
  label: string;
  count: number;
  percentage: number;
}

export interface UserFlowLink {
  source: string;
  target: string;
  value: number;
}

export interface UserBehaviorData {
  nodes: UserBehaviorNode[];
  links: UserFlowLink[];
  pageDurations: { page: string; avgDuration: number }[];
  clickHeatmap: { area: string; clicks: number }[];
  bounceRate: number;
  featureUsage: { feature: string; count: number }[];
}

// ──── 用户列表记录 ────
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  resumes: number;
  lastActive: string;
  joinedAt: string;
}

// ──── 简历管理 ────
export interface ResumeRecord {
  id: string;
  fileName: string;
  userName: string;
  type: 'original' | 'optimized';
  score: number;
  generatedAt: string;
}

// ──── AI 调用监控 ────
export interface AIErrorLogEntry {
  id: string;
  timestamp: string;
  type: 'timeout' | 'rate_limit' | 'server_error';
  message: string;
  model: string;
  endpoint: string;
}

export interface AIUsageStats {
  totalCalls: number;
  totalTokens: number;
  successRate: number;
  avgResponseTime: number; // ms
  errorLogs: AIErrorLogEntry[];
}

export interface AIHourlyCall {
  hour: string;
  calls: number;
  tokens: number;
  errors: number;
}

// ──── AI 监控（Admin 面板） ────
export interface AIMonitorStats {
  totalCalls: number;
  tokenConsumed: number;
  successRate: number;
  avgResponseTime: number;
  errorCount: number;
  costEstimate: number;
}

export interface AIErrorLog {
  id: string;
  timestamp: string;
  endpoint: string;
  errorCode: string;
  errorMessage: string;
  userId: string;
  retryCount: number;
}

// ──── 分页 ────
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ──── 管理日志 ────
export interface AdminLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  ip: string;
  timestamp: string;
}
