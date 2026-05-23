// ==========================================
// Admin 数据服务 — 模拟后端 API
// 生产环境替换为真实 API 调用
// ==========================================

import type {
  DashboardStats,
  TrendDataPoint,
  UserRecord,
  ResumeRecord,
  AIUsageStats,
  UserBehaviorData,
  PaginationParams,
} from '@/types/admin';
import {
  getDashboardStats,
  getDashboardTrends,
  getUserBehaviorData,
  getResumeRecords,
  getAIMonitorStats,
  getAIErrorLogs,
  getAIHourlyCalls,
  getAdminUsers,
  getAdminLogs,
} from './mock-data';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// ──── Dashboard ────
export const adminDataService = {
  // 获取仪表盘统计数据
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(400);
    return {
      totalUsers: 2847,
      newUsersToday: 156,
      totalPV: 12684,
      totalUV: 4521,
      resumesGenerated: 1892,
      aiAnalysisCount: 5673,
      avgDuration: 3.5,
      conversionRate: 18.7,
    };
  },

  // 获取趋势数据
  async getTrendData(period: '7d' | '30d'): Promise<TrendDataPoint[]> {
    await delay(300);
    const days = period === '7d' ? 7 : 30;
    const data: TrendDataPoint[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      data.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        value: Math.floor(800 + Math.random() * 1400),
      });
    }
    return data;
  },

  // ──── Users ────
  async getUsers(): Promise<UserRecord[]> {
    await delay(500);
    return [
      { id: '1', name: '张三', email: 'zhangsan@example.com', status: 'active', resumes: 5, lastActive: '2 分钟前', joinedAt: '2025-01-15' },
      { id: '2', name: '李四', email: 'lisi@example.com', status: 'active', resumes: 3, lastActive: '15 分钟前', joinedAt: '2025-02-20' },
      { id: '3', name: '王五', email: 'wangwu@example.com', status: 'inactive', resumes: 1, lastActive: '3 天前', joinedAt: '2025-03-10' },
      { id: '4', name: '赵六', email: 'zhaoliu@example.com', status: 'active', resumes: 7, lastActive: '1 小时前', joinedAt: '2024-11-05' },
      { id: '5', name: '孙七', email: 'sunqi@example.com', status: 'active', resumes: 2, lastActive: '42 分钟前', joinedAt: '2025-04-01' },
      { id: '6', name: '周八', email: 'zhouba@example.com', status: 'inactive', resumes: 0, lastActive: '7 天前', joinedAt: '2025-04-28' },
      { id: '7', name: '吴九', email: 'wujiu@example.com', status: 'active', resumes: 4, lastActive: '5 分钟前', joinedAt: '2025-05-03' },
      { id: '8', name: '郑十', email: 'zhengshi@example.com', status: 'active', resumes: 6, lastActive: '30 分钟前', joinedAt: '2024-12-18' },
    ];
  },

  // ──── Resumes ────
  async getResumes(): Promise<ResumeRecord[]> {
    await delay(500);
    return [
      { id: 'r1', fileName: '张三_产品经理_2025.pdf', userName: '张三', type: 'original', score: 72, generatedAt: '2025-05-23 10:30' },
      { id: 'r2', fileName: '张三_产品经理_优化版.pdf', userName: '张三', type: 'optimized', score: 91, generatedAt: '2025-05-23 10:45' },
      { id: 'r3', fileName: '李四_前端开发_2025.pdf', userName: '李四', type: 'original', score: 65, generatedAt: '2025-05-22 14:20' },
      { id: 'r4', fileName: '李四_前端开发_优化版.pdf', userName: '李四', type: 'optimized', score: 88, generatedAt: '2025-05-22 14:35' },
      { id: 'r5', fileName: '王五_数据分析_2025.pdf', userName: '王五', type: 'original', score: 58, generatedAt: '2025-05-21 09:15' },
      { id: 'r6', fileName: '赵六_后端开发_2025.pdf', userName: '赵六', type: 'original', score: 80, generatedAt: '2025-05-20 16:00' },
      { id: 'r7', fileName: '赵六_后端开发_优化版.pdf', userName: '赵六', type: 'optimized', score: 93, generatedAt: '2025-05-20 16:20' },
      { id: 'r8', fileName: '吴九_UI设计师_2025.pdf', userName: '吴九', type: 'original', score: 85, generatedAt: '2025-05-19 11:00' },
    ];
  },

  // ──── AI Monitor ────
  async getAIUsage(): Promise<AIUsageStats> {
    await delay(400);
    return {
      totalCalls: 12450,
      totalTokens: 3847200,
      successRate: 98.3,
      avgResponseTime: 320,
      errorLogs: [
        { id: 'e1', timestamp: '13:42:18', type: 'timeout', message: '请求超时（30s）', model: 'gpt-4o', endpoint: '/v1/chat/completions' },
        { id: 'e2', timestamp: '12:15:33', type: 'rate_limit', message: '达到速率限制', model: 'deepseek-v3.2', endpoint: '/v1/chat/completions' },
        { id: 'e3', timestamp: '11:08:52', type: 'server_error', message: '服务端错误 500', model: 'hunyuan-2.0', endpoint: '/v1/chat/completions' },
        { id: 'e4', timestamp: '09:45:10', type: 'timeout', message: '请求超时（25s）', model: 'gpt-4o', endpoint: '/v1/chat/completions' },
      ],
    };
  },

  // ──── User Behavior ────
  async getUserBehavior(): Promise<UserBehaviorData> {
    await delay(500);
    return {
      nodes: [
        { id: 'home', label: '首页', count: 2847, percentage: 100 },
        { id: 'upload', label: '上传简历', count: 1823, percentage: 64 },
        { id: 'analysis', label: 'AI分析', count: 1256, percentage: 44 },
        { id: 'optimize', label: '生成优化', count: 892, percentage: 31 },
        { id: 'export', label: '导出PDF', count: 534, percentage: 19 },
      ],
      links: [
        { source: 'home', target: 'upload', value: 1823 },
        { source: 'upload', target: 'analysis', value: 1256 },
        { source: 'analysis', target: 'optimize', value: 892 },
        { source: 'optimize', target: 'export', value: 534 },
      ],
      pageDurations: [
        { page: '简历定制', avgDuration: 272 },
        { page: 'JD分析器', avgDuration: 198 },
        { page: 'AI面试官', avgDuration: 175 },
        { page: '素材库', avgDuration: 130 },
        { page: 'Dashboard', avgDuration: 105 },
      ],
      clickHeatmap: [
        { area: '上传简历按钮', clicks: 2450 },
        { area: 'AI分析按钮', clicks: 1890 },
        { area: '导出按钮', clicks: 1230 },
      ],
      bounceRate: 32.5,
      featureUsage: [
        { feature: '简历优化', count: 1892 },
        { feature: 'AI分析', count: 1567 },
        { feature: '模拟面试', count: 892 },
        { feature: '素材库', count: 642 },
        { feature: '导出PDF', count: 534 },
      ],
    };
  },
};

export default adminDataService;

// ==========================================
// Flat function exports（供 hooks 使用）
// ==========================================

export async function adminGetDashboardStats(_role?: string) {
  return { data: getDashboardStats() };
}

export async function adminGetDashboardTrends(_role?: string, days = 7) {
  return { data: getDashboardTrends(days) };
}

export async function adminGetUserBehavior(_role?: string) {
  return { data: getUserBehaviorData() };
}

export async function adminGetResumeRecords(params: PaginationParams, _role?: string) {
  return { data: getResumeRecords(params) };
}

export async function adminGetAIMonitorStats(_role?: string) {
  return { data: getAIMonitorStats() };
}

export async function adminGetAIHourlyCalls(_role?: string) {
  return { data: getAIHourlyCalls() };
}

export async function adminGetAIErrorLogs(params: PaginationParams, _role?: string) {
  return { data: getAIErrorLogs(params) };
}

export async function adminGetUsers(params: PaginationParams, _role?: string) {
  return { data: getAdminUsers(params) };
}

export async function adminGetLogs(params: PaginationParams, _role?: string) {
  return { data: getAdminLogs(params) };
}
