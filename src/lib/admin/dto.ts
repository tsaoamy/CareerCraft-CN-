// ==========================================
// DTO (Data Transfer Object) 层
// 严格过滤敏感字段，白名单模式输出
// ==========================================

import type {
  AdminUser,
  DashboardStats,
  ResumeRecord,
  AIErrorLog,
  AdminLog,
} from "@/types/admin";
import { FORBIDDEN_FIELDS, ADMIN_WHITELIST_FIELDS } from "@/types/api";

/**
 * 通用字段过滤器 — 移除所有 forbidden 字段
 */
export function sanitizeOutput<T extends Record<string, unknown>>(
  obj: T,
  isAdmin: boolean
): Partial<T> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    // 禁止字段一律跳过
    if (FORBIDDEN_FIELDS.includes(key as (typeof FORBIDDEN_FIELDS)[number])) {
      continue;
    }
    // 非 admin 跳过管理白名单字段
    if (!isAdmin && ADMIN_WHITELIST_FIELDS.includes(key as (typeof ADMIN_WHITELIST_FIELDS)[number])) {
      continue;
    }
    result[key] = value;
  }

  return result as Partial<T>;
}

/**
 * Admin 用户 DTO — 仅返回安全字段
 */
export function toAdminUserDTO(user: AdminUser): AdminUser {
  return sanitizeOutput(user as unknown as Record<string, unknown>, true) as unknown as AdminUser;
}

/**
 * Public 用户 DTO — 最小暴露
 */
export function toPublicUserDTO(user: AdminUser) {
  return {
    name: user.name,
    avatar: user.avatar,
  };
}

/**
 * 仪表盘统计 DTO — 所有字段都安全可暴露给管理端
 */
export function toDashboardStatsDTO(stats: DashboardStats): DashboardStats {
  return stats;
}

/**
 * 简历记录 DTO
 */
export function toResumeRecordDTO(record: ResumeRecord): ResumeRecord {
  return sanitizeOutput(record as unknown as Record<string, unknown>, true) as unknown as ResumeRecord;
}

/**
 * AI 错误日志 DTO
 */
export function toAIErrorLogDTO(log: AIErrorLog): AIErrorLog {
  return sanitizeOutput(log as unknown as Record<string, unknown>, true) as unknown as AIErrorLog;
}

/**
 * 管理员操作日志 DTO
 */
export function toAdminLogDTO(log: AdminLog): AdminLog {
  return sanitizeOutput(log as unknown as Record<string, unknown>, true) as unknown as AdminLog;
}
